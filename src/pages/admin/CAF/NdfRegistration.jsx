import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";

import { useValidate } from "../../../hooks";
import NdfRegistrationForm from "../../../features/ndfRegistration/NdfRegistrationForm";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import WorkerTypeSelectNdfForm from "../../../features/ndfRegistration/WorkerTypeSelectNdfForm";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const NdfRegistration = () => {
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Registration / CAF Update", url: "" }));
    }, []);
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
    });
    const onChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "cat_worker_type":
                    setState((state) => {
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
            }
        });
    };
    const handleContinue = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        setNext(true);
    };
    if (next) {
        if (application_id) {
            if (isLoading) return <p>loading...</p>;
            if (error) return <p>{error.message}</p>;
            if (data.status === "I") return <Navigate to={`/caf/form1upload/${application_id}`} replace={true} />;
            if (data.status === "S") return <Navigate to="/my-application-list" replace={true} />;
        }
        return <NdfRegistrationForm data={validator.generalize()} />;
    } else return <WorkerTypeSelectNdfForm handleContinue={handleContinue} form={form} onChange={onChange} />;
};

export default NdfRegistration;
