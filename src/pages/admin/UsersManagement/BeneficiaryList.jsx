import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import Pagination from "../../../components/Pagination";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import DistrictSelect from "../../../components/select/DistrictSelect";
import GPWardSelect from "../../../components/select/GPWardSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import { useValidate } from "../../../hooks";
import { fetcher, searchParamsToObject } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const BeneficiaryList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching, error } = useQuery(["beneficiary-details-list-for-admin", searchParams.toString()], () => fetcher(`/beneficiary-details-list-for-admin?${searchParams.toString()}`), { enabled: searchParams.toString() ? true : false });

    const [form, validator] = useValidate(
        {
            worker_type: { value: "", validate: "required" },
            status: { value: "", validate: "required" },
            collected_by: { value: "", validate: "" },
            added_by: { value: "", validate: "" },
            district: { value: "", validate: "required" },
            subdivision: { value: "", validate: "" },
            block: { value: "", validate: "" },
            gp_ward: { value: "", validate: "" },
            date_from: { value: "", validate: "required" },
            date_to: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const clearHandler = () => {
        setSearchParams("");
        validator.setState((state) => {
            state.worker_type.value = "";
            state.status.value = "";
            state.collected_by.value = "";
            state.added_by.value = "";
            state.district.value = "";
            state.subdivision.value = "";
            state.block.value = "";
            state.gp_ward.value = "";
            state.date_from.value = "";
            state.date_to.value = "";
            return { ...state };
        });
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        setSearchParams(formData);
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary List/Search", url: "" }));
    }, []);

    
    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            <div className="card datatable-box">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="worker_type">
                                        Worker Type {form.worker_type.required && <span className="text-danger">*</span>}
                                    </label>
                                    <select
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        id="worker_type"
                                        name="worker_type"
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.worker_type.value}
                                        required={form.worker_type.required}
                                    >
                                        <option value="">-Select-</option>
                                        <option value="ow">Others Worker</option>
                                        <option value="cw">Construction Worker</option>
                                        <option value="tw">Transport Worker</option>
                                    </select>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.worker_type.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="status">
                                        Status {form.status.required && <span className="text-danger">*</span>}
                                    </label>
                                    <select
                                        className={`form-select ${form.status.error && "is-invalid"}`}
                                        id="status"
                                        name="status"
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.status.value}
                                        required={form.status.required}
                                    >
                                        <option value="">-Select-</option>
                                        <option value="A">Approved</option>
                                        <option value="0">Submitted</option>
                                        <option value="B">Back for correction</option>
                                        <option value="R">Reject</option>
                                    </select>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.status.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="collected_by">
                                    Collected By {form.collected_by.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="collected_by"
                                    name="collected_by"
                                    className={`form-control ${form.collected_by.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.collected_by.value}
                                    required={form.collected_by.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.collected_by.error}
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="added_by">
                                    Added By {form.added_by.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="added_by"
                                    name="added_by"
                                    className={`form-control ${form.added_by.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.added_by.value}
                                    required={form.added_by.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.added_by.error}
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="district">
                                    District {form.worker_type.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="subdivision">
                                    Subdivision {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    value={form.subdivision.value}
                                    onChange={(e) => {
                                        handleChange({ name: "subdivision", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">Please select sub division</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="block">
                                    Block/Municipality/Corporation {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subdivision.value}
                                />
                                <div className="invalid-feedback">Please select B/M/C</div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="gp_ward" className="form-control-label">
                                    GP / Ward {form.gp_ward.required && <span className="text-danger">*</span>}
                                </label>
                                <GPWardSelect
                                    className={`form-select ${form.gp_ward.error && "is-invalid"}`}
                                    id="gp_ward"
                                    name="gp_ward"
                                    required={form.gp_ward.required}
                                    value={form.gp_ward.value}
                                    onChange={(e) => handleChange({ name: "gp_ward", value: e.currentTarget.value })}
                                    block={form.block.value}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="date_from">
                                    Date From {form.date_from.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="date_from"
                                    name="date_from"
                                    className={`form-control ${form.date_from.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.date_from.value}
                                    required={form.date_from.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.date_from.error}
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="date_to">
                                    Date To {form.date_to.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="date_to"
                                    name="date_to"
                                    className={`form-control ${form.date_to.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.date_to.value}
                                    required={form.date_to.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.date_to.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end gap-2">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Search
                            </button>
                            <button className="btn btn-warning btn-sm" type="button" onClick={clearHandler}>
                                <span className="" role="status" aria-hidden="true"></span>Clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card datatable-box">
                    <div className="card-header">
                        <h5 className="font-weight-bold">Beneficiary List</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover">
                                <thead>
                                    <tr className="table-active" align="center">
                                        <th>SL.No.</th>
                                        <th>Application Number</th>
                                        <th>SSIN</th>
                                        <th>Beneficiary Name</th>
                                        <th>Aadhaar</th>
                                        <th>Mobile</th>
                                        <th>Approved Date</th>
                                        <th>Submitted Date</th>
                                        <th>Current Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={wrapStyle}>{data?.from + index}</td>
                                                <td style={wrapStyle}>{item.application_id}</td>
                                                <td style={wrapStyle}>{item.ssin_no}</td>
                                                <td style={wrapStyle}>{item.name}</td>
                                                <td style={wrapStyle}>{item.aadhar}</td>
                                                <td style={wrapStyle}>{item.mobile}</td>
                                                <td style={wrapStyle}>{item.approval_date}</td>
                                                <td style={wrapStyle}>{item.last_modified_date}</td>
                                                {item.status === "A" ? (
                                                    <td style={{ color: "#009900" }}>
                                                        <b>Approved</b>{" "}
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.status === "S" ? (
                                                    <td  style={{ color: "#cccc00" }}>
                                                        <b>Pending</b>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.status === "B" ? (
                                                    <td style={{ color: "#ff0000" }}>
                                                        <b>Back For Correction</b>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.status === "R" ? (
                                                    <td style={{ color: "#ff0000" }}>
                                                        <b>Rejected</b>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.status === "0" ? (
                                                    <td style={{ color: "#ff0000" }}>
                                                        <b>Incomplete</b>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                <td style={wrapStyle}>
                                                    <div className="btn-group me-2 mb-2" role="group" aria-label="First group">
                                                        <button type="button" className="btn btn-sm btn-success">
                                                            <Link to={"/beneficiary-details/" + item.encAppId + "/" + (item.is_active === 1 ? "bmssy" : "ssy")}>View</Link>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BeneficiaryList;
