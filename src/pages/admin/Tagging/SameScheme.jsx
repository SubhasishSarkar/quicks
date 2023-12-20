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

    return (
        <>
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
                                        value="reg_no"
                                        type="radio"
                                        checked={form.radiostacked.value == "reg_no" ? true : false}
                                        className={`form-check-input `}
                                        id="radiostacked_reg"
                                        name="radiostacked"
                                        onChange={() => handleChange({ name: "radiostacked", value: "reg_no" })}
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

            <br />
            {length > 0 && (
                <div className="card datatable-box">
                    <div className="card-body">
                        <div style={{ overflow: "auto" }} className="table-container table-responsive">
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
                                        <th scope="col">Tick Approved SSIN</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Remove</th>
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
                                                    <td style={wrapStyle}>{item.dob}</td>
                                                    <td style={wrapStyle}>{item.aadhaar}</td>
                                                    <td style={wrapStyle}>{item.worker_type}</td>
                                                    <td style={wrapStyle}>
                                                        {item.backlog == false && (
                                                            <input
                                                                type="radio"
                                                                checked={checkedSsin == item.ssin_no ? true : false}
                                                                className={`form-check-input`}
                                                                id={"checkedRadioSSIN" + index}
                                                                name="checkedRadioSSIN"
                                                                onClick={() => setCheckedSsin(item.ssin_no)}
                                                            />
                                                        )}
                                                    </td>
                                                    <td style={wrapStyle}>
                                                        <ApplicationStatus status={item.status} />
                                                    </td>
                                                    <td style={wrapStyle}>
                                                        <button className="btn btn-danger btn-sm" onClick={(e) => cancelData(e, item.id)}>
                                                            Remove
                                                        </button>
                                                    </td>
                                                    <td style={wrapStyle}>
                                                        {" "}
                                                        <button type="button" className="btn btn-sm btn-primary " style={{ fontSize: 13, marginRight: "3px" }}>
                                                            <Link className="dropdown-item" target="_blank" to={`/beneficiary-details/${item?.enc_application_id}${item?.is_active === 1 ? "/bmssy" : "/ssy"}`} style={{ textDecoration: "none" }}>
                                                                <i className="fa-solid fa-binoculars"></i> View
                                                            </Link>
                                                        </button>
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
                                    {newLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <span> Merge </span>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default SameScheme;
