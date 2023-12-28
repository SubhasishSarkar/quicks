import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";
import { toast } from "react-toastify";
import SchemeSelect from "../../../components/select/SchemeSelect";
import ApplicationStatus from "../../../components/list/ApplicationStatus";
import { useMutation } from "@tanstack/react-query";
import TwoSchemeDocUpload from "../../../features/tagging/TwoSchemeDocUpload";
import { Link } from "react-router-dom";
import moment from "moment";

export const TwoScheme = () => {
    const [ssinDetails, setSsinDetails] = useState([]);
    const [searchHistory, setSearchHistory] = useState(new Map());
    const [buttonShowLoading, setButtonShowLoading] = useState(false);
    const [cancelButton, setCancelButton] = useState(true);
    const [phase1, setPhase1] = useState(true);
    const [phase2, setPhase2] = useState(false);
    const [length, setLength] = useState(0);
    const [unapproved, setUnapproved] = useState(false);
    const [aadharArray, setAadharArray] = useState([]);
    const [newLoading, setNewLoading] = useState(false);
    const [mergeDet, setMergeDet] = useState(0);
    const [checkAppId, setCheckAppId] = useState([]);
    const [checkFileUpload, setCheckFileUpload] = useState({});

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
        setAadharArray([]);
        setCheckFileUpload({});
        const scheme_type_array = [myValues[0].scheme, myValues[1].scheme];
        const status_type_array = [myValues[0].status, myValues[1].status];
        const backlog_type_array = [myValues[0].backlog, myValues[1].backlog];
        const regdate_type_array = [myValues[0].registration_date, myValues[1].registration_date];
        const ndf_type_array = [myValues[0].ndf, myValues[1].ndf];

        if (myKeys.length > 2) {
            toast.error("MERGING OF MORE THAN TWO APPLICATIONS IS NOT ALLOWED");
            setNewLoading(false);
        } else if (myKeys.length < 2) {
            toast.error("MERGING OF LESS THAN TWO APPLICATIONS IS NOT ALLOWED");
            setNewLoading(false);
        } else if (backlog_type_array[0] == true && backlog_type_array[1] == true) {
            toast.error("MERGING OF MORE THAN ONE UNAPPROVED APPLICATION IS NOT APPLICABLE");
            setNewLoading(false);
        } else if (moment(regdate_type_array[0]) > moment("2020-03-31") && moment(regdate_type_array[1]) > moment("2020-03-31")) {
            toast.error("BOTH SSINs HAVE REGISTRATION DATE AFTER 31st MARCH 2020");
            setNewLoading(false);
        } else if (status_type_array[0] == "OA" && status_type_array[1] == "OA") {
            toast.error("BOTH APPLICATIONS HAVE INVALID AADHAAR NUMBER");
            setNewLoading(false);
        } else if (status_type_array.includes("OA") == true && (ndf_type_array.includes(1) == true || backlog_type_array.includes(true) == true)) {
            toast.error("ONE OF THE APPLICATION SHOULD HAVE VALID AADHAAR NUMBER");
            setNewLoading(false);
        } else if ((backlog_type_array[0] == true && ndf_type_array[1] == 1) || (ndf_type_array[0] == 1 && backlog_type_array[1] == true)) {
            toast.error("ONE OF THE APPLICATION SHOULD BE OF APPROVED STATUS");
            setNewLoading(false);
        } else if (scheme_type_array[0] == "" || scheme_type_array[1] == "") {
            toast.error("PLEASE CHOOSE SCHEME");
            setNewLoading(false);
        } else if (myValues[0].scheme == myValues[1].scheme) {
            toast.error("PLEASE CHOOSE DIFFERENT SCHEME");
            setNewLoading(false);
        } else if (scheme_type_array.includes("SASPFUW") == false) {
            toast.error("ONE OF THE SCHEME SHOULD BE SASPFUW");
            setNewLoading(false);
        } else {
            if (status_type_array.includes("OA") == true) {
                if (status_type_array[1] == "OA") {
                    setAadharArray([myValues[0].aadhaar]);
                } else {
                    setAadharArray([myValues[1].aadhaar]);
                }
            } else {
                setAadharArray([myValues[0].aadhaar, myValues[1].aadhaar]);
            }

            mutate(
                { url: "/merging-two-scheme", body: { keys: myKeys, values: myValues } },
                {
                    onSuccess(data, variables, context) {
                        checkMergeData(data.rslt);
                        setCheckFileUpload({ aadhaar_file: data.aadhaar_file, dob_file: data.dob_file, reg_file: data.reg_file, one_unapproved: data.one_unapproved });
                        setNewLoading(false);
                    },
                    onError(error, variables, context) {
                        setPhase1(true);
                        setNewLoading(false);
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };

    const generateTable = (data = []) => {
        const application_map = new Map(searchHistory);

        if (application_map.size >= 2) {
            toast.error("MERGING OF MORE THAN TWO APPLICATIONS IS NOT ALLOWED");
        } else {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const id = String(item.backlog ? "B-" + item.application_id : item.ndf == 1 ? "N-" + item.registration_no : item.application_id);
                if (item.backlog) setUnapproved(item.backlog);
                if (!item.backlog && item.status != "A" && item.status != "OA" && item.status != "DA" && item.status != "SA") setUnapproved(item.backlog);
                if (item.ndf == 1) setUnapproved(true);
                if (application_map.has(id)) {
                    toast.error("BENEFICIARY IS ALREADY IN THE LIST");
                    break;
                }
                if (!item.registration_no && !unapproved && moment(item.registration_date) <= moment("2017-03-31")) {
                    toast.error("REGISTRATION NO. DOES NOT EXISTS FOR THIS SSIN");
                    break;
                }

                if (item.ndf == 1) {
                    application_map.set(id, {
                        id: id,
                        backlog: false,
                        ndf: 1,
                        application_id: "-",
                        ssin_no: "-",
                        registration_no: item.registration_no,
                        approved: !unapproved,
                        status: "-",
                        scheme: "",
                        name: item.name,
                        aadhaar: "-",
                        dob: "-",
                        display_dob: "-",
                        worker_type: "-",
                        registration_date: "-",
                        display_registration_date: "-",
                        enc_application_id: item.enc_application_id,
                    });
                } else {
                    application_map.set(id, {
                        id: id,
                        backlog: item.backlog,
                        ndf: 0,
                        application_id: item.application_id,
                        ssin_no: item.ssin_no,
                        registration_no: item.registration_no,
                        approved: !unapproved,
                        status: item.status,
                        scheme: "",
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
                }
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
            const a = await fetcher("/get-search-ben-details-two-scheme?ssin_reg_no=" + form.ssin_reg.value + "&type=" + form.radiostacked.value);
            if (a[0].ndf == 1) {
                if (!window.confirm("Do you want to merge those beneficiary?")) return;
            }

            generateTable(a);
            setButtonShowLoading(false);
            validator.setState((state) => {
                state.ssin_reg.value = "";
                state.ssin_reg.error = null;
                return { ...state };
            });
            setCancelButton(true);
        } catch (error) {
            setButtonShowLoading(false);
            setCancelButton(false);
            validator.setError({ ssin_reg: [error.message] });
            setSsinDetails({ data: null, loading: false });
        }
    };

    const cancelData = (e, id) => {
        const application_map = new Map(searchHistory);
        e.preventDefault();
        application_map.delete(id);
        setSearchHistory(application_map);
        setLength(length - 1);
    };

    const checkMergeData = async (rslt) => {
        try {
            const fetchDet = await fetcher("/fetch-two-scheme-merge-details?rslt=" + rslt);
            if (fetchDet.status == 200) {
                setMergeDet(fetchDet.data);
                setCheckAppId(fetchDet.idArray);
                setSearchHistory(new Map());
                setUnapproved(false);
                setLength(0);
                setPhase1(false);
                setPhase2(true);
            } else {
                throw Error("PROBLEM IN FETCHING DETAILS");
            }
        } catch (error) {
            validator.setError({ ssin_reg: [error.message] });
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Two Scheme Tagging", url: "" }));
    }, []);

    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return <p>aa</p>;
};

export default TwoScheme;
