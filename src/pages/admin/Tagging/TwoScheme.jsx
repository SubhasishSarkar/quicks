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

    return (
        <>
            {phase1 && (
                <div className="card datatable-box">
                    <form noValidate>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">
                                        Select Search Type
                                    </label>

                                    <div className="form-check ">
                                        <input
                                            type="radio"
                                            value="ssin"
                                            checked={form.radiostacked.value == "ssin" ? true : false}
                                            className={`form-check-input`}
                                            id="radiostacked_ssin"
                                            name="radiostacked"
                                            onChange={() => handleChange({ name: "radiostacked", value: "ssin" })}
                                        />
                                        <label className="form-check-label" htmlFor="radiostacked">
                                            SSIN
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            value="regno"
                                            type="radio"
                                            checked={form.radiostacked.value == "regno" ? true : false}
                                            className={`form-check-input `}
                                            id="radiostacked_reg"
                                            name="radiostacked"
                                            onChange={() => handleChange({ name: "radiostacked", value: "regno" })}
                                        />
                                        <label className="form-check-label" htmlFor="radiostacked">
                                            Registration No.
                                        </label>
                                        <div className="invalid-feedback">More example invalid feedback text</div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="exampleInputEmail1" className="form-label">
                                        Enter SSIN / Registration Number
                                    </label>

                                    <input placeholder="" className={`form-control ${form.ssin_reg.error && "is-invalid"}`} type="text" name="ssin_reg" id="ssin_reg" value={form.ssin_reg.value} onChange={(e) => handleChange(e.currentTarget)} />

                                    <label className="invalid-feedback" htmlFor="ssin_reg">
                                        {form.ssin_reg.error}
                                    </label>
                                    {ssinDetails.loading && (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="card-footer">
                        <div className="d-grid  d-md-flex justify-content-md gap-2">
                            <button className="btn btn-primary btn-sm btn-primary" onClick={checkData} disabled={buttonShowLoading}>
                                {buttonShowLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Search"}
                            </button>

                            <button className="btn btn-primary btn-sm btn-danger" onClick={clearHandler} disabled={cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <br />
            {length > 0 && phase1 && (
                <div className="card datatable-box">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover">
                                <thead>
                                    <tr className="table-active" align="center">
                                        <th scope="col">SL No.</th>
                                        <th scope="col">SSIN</th>
                                        <th scope="col">Registration No.</th>
                                        <th scope="col">Registration Date</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">DOB</th>
                                        <th scope="col">Aadhar</th>
                                        <th scope="col">Worker Type</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Remove</th>
                                        <th scope="col">Scheme</th>
                                        <th scope="col">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {length > 0 &&
                                        [...searchHistory.values()]?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={wrapStyle}>{index + 1}</td>
                                                    <td style={wrapStyle}>{item.ssin_no}</td>
                                                    <td style={wrapStyle}>{item.registration_no}</td>
                                                    <td style={wrapStyle}>{item.display_registration_date}</td>
                                                    <td style={wrapStyle}>{item.name}</td>
                                                    <td style={wrapStyle}>{item.display_dob}</td>
                                                    <td style={wrapStyle}>{item.aadhaar}</td>
                                                    <td style={wrapStyle}>{item.ndf === 1 ? "--" : item.worker_type}</td>
                                                    <td style={wrapStyle}>
                                                        <ApplicationStatus status={item.status} />
                                                    </td>
                                                    <td style={wrapStyle}>
                                                        <button className="btn btn-danger btn-sm" onClick={(e) => cancelData(e, item.id)}>
                                                            Remove
                                                        </button>
                                                    </td>
                                                    <td style={wrapStyle}>
                                                        <SchemeSelect id={item.id} item={item} searchHistory={searchHistory} />
                                                    </td>
                                                    <td style={wrapStyle}>
                                                        {item.backlog === false && item.ndf == 0 && (
                                                            <button type="button" className="btn btn-sm btn-primary " style={{ fontSize: 13, marginRight: "3px" }}>
                                                                <Link className="dropdown-item" target="_blank" to={`/beneficiary-details/${item?.enc_application_id}${item?.is_active === 1 ? "/bmssy" : "/ssy"}`} style={{ textDecoration: "none" }}>
                                                                    <i className="fa-solid fa-binoculars"></i> View
                                                                </Link>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {length == 2 && (
                        <div className="card-footer">
                            <div className="d-grid  d-md-flex justify-content-md gap-2">
                                <button className="btn btn-primary btn-sm" onClick={mergeData} disabled={newLoading}>
                                    {newLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span>
                                            <i className="fa-solid fa-circle-arrow-right"></i>Next step
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {phase2 && <TwoSchemeDocUpload mergedata={mergeDet} checkFileUpload={checkFileUpload} aadharArray={aadharArray} appId={checkAppId} setPhase1={setPhase1} setPhase2={setPhase2} />}
            {length > 0 && phase1 && (
                <>
                    <br />
                    <br />
                    <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                        <span className="badge text-bg-danger">NOTE:</span>
                        <ul>
                            <li>Change Of Date Of Birth Should Be Done In Terms of Memo No.106/EST/LC Dated: 07-02-23.</li>
                            <li>Check Aadhaar before merging, if found incorrect then first change Aadhaar through Change Request module.</li>
                            <li>Once Merging is done, no correction in particulars, whatsoever, will be entertained under any circumstances.</li>
                        </ul>
                    </h6>
                </>
            )}
            {phase2 && (
                <>
                    <br />
                    <br />
                    <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                        <span className="badge text-bg-danger">NOTE:</span>
                        <ul>
                            <li>Change Of Date Of Birth Should Be Done In Terms of Memo No.106/EST/LC Dated: 07-02-23.</li>
                            <li>Check Aadhaar before merging, if found incorrect then first change Aadhaar through Change Request module.</li>
                            <li>Once Merging is done, no correction in particulars, whatsoever, will be entertained under any circumstances.</li>
                        </ul>
                    </h6>
                </>
            )}
        </>
    );
};

export default TwoScheme;
