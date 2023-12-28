import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ApplicationStatus from "../../../components/list/ApplicationStatus";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export const SameScheme = () => {
    const [ssinDetails, setSsinDetails] = useState([]);
    const [searchHistory, setSearchHistory] = useState(new Map());
    const [buttonShowLoading, setButtonShowLoading] = useState(false);
    const [cancelButton, setCancelButton] = useState(true);
    const [length, setLength] = useState(0);
    const [unapproved, setUnapproved] = useState(false);
    const [newLoading, setNewLoading] = useState(false);
    const [checkedSsin, setCheckedSsin] = useState(false);
    const navigate = useNavigate();

    const [form, validator] = useValidate({
        radiostacked: { value: "ssin", validate: "" },
        ssin_reg: { value: "", validate: "required" },
    });

    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const clearHandler = () => {
        setButtonShowLoading(false);
        setSsinDetails({ data: null, error: null, loading: false });
        validator.setState((state) => {
            state.ssin_reg.value = "";
            state.ssin_reg.error = null;
            return { ...state };
        });
        setCancelButton(true);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "ssin_reg":
                    if (value) {
                        setCancelButton(false);
                    }
                    break;
                case "radiostacked":
                    clearHandler();
                    break;
            }
        });
    };

    const mergeData = () => {
        setNewLoading(true);
        const myKeys = [...searchHistory.keys()];
        const myValues = [...searchHistory.values()];
        const backlog_type_array = [myValues[0].backlog, myValues[1].backlog];
        const ndf_type_array = [myValues[0].ndf, myValues[1].ndf];

        if (myKeys.length > 2) {
            toast.error("MERGING OF MORE THAN TWO APPLICATIONS IS NOT ALLOWED");
            setNewLoading(false);
        } else if (myKeys.length < 2) {
            toast.error("MERGING OF LESS THAN TWO APPLICATIONS IS NOT ALLOWED");
            setNewLoading(false);
        } else if (backlog_type_array[0] == true && backlog_type_array[1] == true) {
            toast.error("ONE OF THE APPLICATION SHOULD BE OF APPROVED STATUS");
            setNewLoading(false);
        } else if ((backlog_type_array[0] == true && ndf_type_array[1] == 1) || (ndf_type_array[0] == 1 && backlog_type_array[1] == true)) {
            toast.error("ONE OF THE APPLICATION SHOULD BE OF APPROVED STATUS");
            setNewLoading(false);
        } else if (checkedSsin == false) {
            toast.error("Please Choose / Tick one of them");
            setNewLoading(false);
        } else {
            mutate(
                { url: "/merging-same-scheme", body: { keys: myKeys, values: myValues, checkedSsin } },
                {
                    onSuccess(data, variables, context) {
                        if (data.status == 200) {
                            setNewLoading(false);
                            setSearchHistory(new Map());
                            toast.success(data.message);
                            navigate("/tagging/merged-list");
                        }
                    },
                    onError(error, variables, context) {
                        setNewLoading(false);
                        setSearchHistory(new Map());
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };

    const generateTable = (data = []) => {
        //console.log(application_map.size);
        const application_map = new Map(searchHistory);

        if (application_map.size >= 2) {
            toast.error("MERGING OF MORE THAN TWO APPLICATIONS IS NOT ALLOWED");
        } else {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const id = String(item.backlog ? "B-" + item.application_id : item.application_id);
                if (item.backlog) setUnapproved(item.backlog);
                if (!item.backlog && item.status != "A" && item.status != "OA" && item.status != "DA" && item.status != "SA") setUnapproved(item.backlog);
                if (application_map.has(id)) {
                    toast.error("Beneficiary is already in the list");
                    break;
                }

                application_map.set(id, {
                    id: id,
                    backlog: item.backlog,
                    application_id: item.application_id,
                    ssin_no: item.ssin_no,
                    registration_no: item.registration_no,
                    approved: !unapproved,
                    status: item.status,
                    name: item.name,
                    aadhaar: item.aadhar,
                    dob: item.dob,
                    display_dob: item.display_dob,
                    worker_type:
                        item.cat_worker_type?.trim() === "Others" || item.cat_worker_type?.trim() === "ow"
                            ? "Other Worker"
                            : item.cat_worker_type?.trim() === "ConstructionWorker" || item.cat_worker_type?.trim() === "cw"
                            ? "Construction Worker"
                            : item.cat_worker_type?.trim() === "TransportWorker" || item.cat_worker_type?.trim() === "tw"
                            ? "Transport Worker"
                            : "",
                    registration_date: item.registration_date,
                    display_registration_date: item.display_registration_date,
                    enc_application_id: item.enc_application_id,
                });

                setSearchHistory(application_map);

                setLength(length + 1);
            }
        }
    };

    const checkData = async () => {
        try {
            setButtonShowLoading(true);
            if (form.ssin_reg.value == "") {
                throw Error("ENTER SSIN/REGISTRATION NO");
            }
            const a = await fetcher("/get-search-ben-details?ssin_reg_no=" + form.ssin_reg.value + "&type=" + form.radiostacked.value);
            setButtonShowLoading(false);
            generateTable(a);

            validator.setState((state) => {
                state.ssin_reg.value = "";
                state.ssin_reg.error = null;
                return { ...state };
            });
            setCancelButton(true);
        } catch (error) {
            setButtonShowLoading(false);
            validator.setError({ ssin_reg: [error.message] });
            setSsinDetails({ data: null, loading: false });
        }
    };

    const cancelData = (e, id) => {
        const application_map = new Map(searchHistory);
        console.log(application_map);
        e.preventDefault();
        application_map.delete(id);
        setSearchHistory(application_map);
        setLength(length - 1);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Same Scheme Tagging", url: "" }));
    }, []);

    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return <p>aa</p>;
};

export default SameScheme;
