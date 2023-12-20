import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";

import { useValidate } from "../../../hooks";
import WorkerTypeSelectForm from "../../../features/registration/WorkerTypeSelectForm";
import RegistrationForm from "../../../features/registrationV2/RegistrationForm";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import moment from "moment";

const CAFRegistration = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const edistrict_registration_date = searchParams.get("edistrict_registration_date");
    const { isLoading, data, error } = useQuery(["check-status-from-master", application_id], () => fetcher(`/check-status-from-master/${application_id}`), {
        staleTime: Infinity,
        cacheTime: 0,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retryOnMount: false,
        retry: false,
        enabled: application_id ? true : false,
    });

    const [next, setNext] = useState(application_id ? true : false);
    const [form, validator] = useValidate({
        cat_worker_type: { value: "", validate: "required" },
        sub_cat_name: { value: "", validate: "" },
        worker_type: { value: "", validate: "required" },
        other_worker_name: { value: "", validate: "" },
        edistrict_registration_no: { value: "", validate: edistrict_registration_date ? "required" : "" },
        edistrict_registration_date: { value: edistrict_registration_date, validate: edistrict_registration_date ? "required" : "" },
    });

    const onChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "cat_worker_type":
                    setState((state) => {
                        state.edistrict_registration_no.value = "";
                        if (value === "ow") {
                            state.sub_cat_name.required = true;
                            state.sub_cat_name.validate = "required";
                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        } else {
                            state.sub_cat_name.required = false;
                            state.sub_cat_name.validate = "";
                            state.sub_cat_name.value = "";
                            state.sub_cat_name.error = null;

                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        }
                        state.other_worker_name.required = false;
                        state.other_worker_name.validate = "";
                        state.other_worker_name.value = "";
                        state.other_worker_name.error = null;
                        return { ...state };
                    });
                    break;
                case "worker_type":
                    setState((state) => {
                        if (value == 11 || value == 7) {
                            state.other_worker_name.required = true;
                            state.other_worker_name.validate = "required";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        } else {
                            state.other_worker_name.required = false;
                            state.other_worker_name.validate = "";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "edistrict_registration_no":
                    setState((state) => {
                        if (value) {
                            let regNoStr = value.toUpperCase();
                            let result;
                            if (state.cat_worker_type.value === "tw") {
                                result = regNoStr.startsWith("TN");
                            } else if (state.cat_worker_type.value === "cw") {
                                result = regNoStr.startsWith("CN");
                            }
                            if (result === false) {
                                state.edistrict_registration_no.error = "Registration no. is not valid respect of worker type";
                            }
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };
    const handleContinue = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        setNext(true);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        if (searchParams.has("edistrict_registration_date")) {
            const maxDate = moment().format("2023-11-31");
            const minDate = moment().format("2017-04-01");

            if (edistrict_registration_date) {
                if (moment(edistrict_registration_date).isBefore(minDate, "day") || moment(edistrict_registration_date).isAfter(maxDate, "day")) {
                    navigate("/caf");
                }
            } else {
                navigate("/caf");
            }
        }
    }, [edistrict_registration_date]);
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Registration/CAF Update", url: "" }));
    }, []);
    if (next) {
        if (application_id) {
            if (isLoading) return <p>loading...</p>;
            if (error) return <p>{error.message}</p>;
            if (data.status === "I") return <Navigate to={`/caf/form1upload/${application_id}`} replace={true} />;
            if (data.status === "S") return <Navigate to="/my-application-list" replace={true} />;
        }
        return <RegistrationForm data={validator.generalize()} />;
    } else return <WorkerTypeSelectForm handleContinue={handleContinue} form={form} onChange={onChange} />;
};

export default CAFRegistration;
