import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import Pagination from "../../../components/Pagination";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import DistrictSelect from "../../../components/select/DistrictSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import { useValidate } from "../../../hooks";
import { downloadFile, fetcher, searchParamsToObject } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const SummaryReport = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const user = useSelector((state) => state.user.user);
    const [form, validator] = useValidate(
        {
            regType: { value: "", validate: "" },
            gender: { value: "", validate: "" },
            district: { value: user.role != "SUPER ADMIN" ? user.district : "", validate: "required" },
            subdivision: { value: user.role != "SUPER ADMIN" ? user.subDivision : "", validate: "" },
            block: { value: "", validate: "" },
            dateFrom: { value: "", validate: "required" },
            dateTo: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { data, isFetching, error } = useQuery(["get-summary-report", searchParams.toString()], () => fetcher("/get-summary-report?" + searchParams.toString()), { enabled: searchParams.toString() ? true : false });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        setSearchParams(formData);
    };

    const tableHeader = {
        backgroundColor: "cadetblue",
        fontFamily: "monospace",
        color: "#fff",
    };

    const tableSubHeader = {
        backgroundColor: "#0fd593ba",
        color: "#010101",
        fontFamily: "monospace",
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const clearHandler = () => {
        setSearchParams("");
        validator.setState((state) => {
            state.regType.value = "";
            state.gender.value = "";
            state.block.value = "";
            state.dateFrom.value = "";
            state.dateTo.value = "";
            return { ...state };
        });
    };

    const [loading, setLoading] = useState(false);
    const downloadReport = async () => {
        try {
            setLoading(true);
            await downloadFile("/download-summary-report?" + searchParams.toString(), "Count Wise Report.xlsx");
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Summary Report", url: "" }));
    }, []);

    const cardHeader = {
        background: "rgb(4 66 143 / 86%)",
        color: "#fff",
    };
    return (
        <>
            <div className="card datatable-box mb-4">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="regType">
                                    Registration Type {form.regType.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    className={`form-select ${form.regType.error && "is-invalid"}`}
                                    id="regType"
                                    name="regType"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.regType.value}
                                    required={form.regType.required}
                                >
                                    <option value="">-Select-</option>
                                    <option value="NEW">BMSSY (New)</option>
                                    <option value="OLD">BMSSY (Old)</option>
                                    <option value="SSY">SSY</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    {form.regType.error}
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="gender">
                                    Gender {form.gender.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    className={`form-select ${form.gender.error && "is-invalid"}`}
                                    id="gender"
                                    name="gender"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.gender.value}
                                    required={form.gender.required}
                                >
                                    <option value="">-Select-</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    {form.gender.error}
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="district">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    option_all="true"
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                    disabled={user.role != "SUPER ADMIN"}
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
                                    option_all="true"
                                    onChange={(e) => {
                                        handleChange({ name: "subdivision", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                    disabled={user.role != "SUPER ADMIN"}
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
                                    option_all="true"
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subdivision.value}
                                />
                                <div className="invalid-feedback">Please select B/M/C</div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="dateFrom">
                                    Date From {form.dateFrom.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="dateFrom"
                                    name="dateFrom"
                                    className={`form-control ${form.dateFrom.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.dateFrom.value}
                                    required={form.dateFrom.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.dateFrom.error}
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="dateTo">
                                    Date To {form.dateTo.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="dateTo"
                                    name="dateTo"
                                    className={`form-control ${form.dateTo.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.dateTo.value}
                                    required={form.dateTo.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.dateTo.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Search
                            </button>
                            <button className="btn btn-primary btn-sm" type="button" onClick={clearHandler}>
                                <span className="" role="status" aria-hidden="true"></span>Clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {error && <ErrorAlert error={error} />}

            {searchParams.toString() && data && (
                <div className="card mb-4">
                    <div className="card-header py-2" style={cardHeader}>
                        <div className="row">
                            <div className="col-md-6">
                                <h6 style={{ marginTop: "6px" }}>Summary Report Search Result</h6>
                            </div>
                            <div className="col-md-6">
                                <div className="d-md-flex justify-content-md-end">
                                    <button className="btn btn-warning" type="button" onClick={() => downloadReport()} disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-download"></i>} Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {isFetching && <LoadingSpinner />}
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover">
                                <thead>
                                    <tr className="text-center" style={tableHeader}>
                                        <th rowSpan="2" valign="middle">
                                            SL No
                                        </th>
                                        <th rowSpan="2" valign="middle">
                                            District
                                        </th>
                                        {data?.data[0].count === 2 && (
                                            <th rowSpan="2" valign="middle">
                                                Subdivision
                                            </th>
                                        )}
                                        {data?.data[0].count === 3 && (
                                            <th rowSpan="2" valign="middle">
                                                Block
                                            </th>
                                        )}
                                        {data?.data[0].count === 4 && (
                                            <th rowSpan="2" valign="middle">
                                                GP/WARD
                                            </th>
                                        )}
                                        <th colSpan="3" valign="middle">
                                            Approved
                                        </th>
                                        <th colSpan="3" valign="middle">
                                            Pending
                                        </th>
                                        <th colSpan="3" valign="middle">
                                            Back for Correction
                                        </th>
                                        <th colSpan="3" valign="middle">
                                            Rejected
                                        </th>
                                    </tr>
                                    <tr className="text-center" style={tableSubHeader}>
                                        <th>O</th>
                                        <th>C</th>
                                        <th>T</th>
                                        <th>O</th>
                                        <th>C</th>
                                        <th>T</th>
                                        <th>O</th>
                                        <th>C</th>
                                        <th>T</th>
                                        <th>O</th>
                                        <th>C</th>
                                        <th>T</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <tr key={index} className="text-center" style={{ fontFamily: "monospace" }}>
                                                <td>{data?.from + index}</td>
                                                <td>{item.district_name}</td>
                                                {item.count === 2 && <td>{item.subdivision_name}</td>}
                                                {item.count === 3 && <td>{item.block_mun_name}</td>}
                                                {item.count === 4 && <td>{item.gp_ward_name}</td>}
                                                <td style={{ color: "#25bb06" }}>{item.owApproved}</td>
                                                <td style={{ color: "#25bb06" }}>{item.cwApproved}</td>
                                                <td style={{ color: "#25bb06" }}>{item.twApproved}</td>
                                                <td style={{ color: "rgb(11 18 206)" }}>{item.owPending}</td>
                                                <td style={{ color: "rgb(11 18 206)" }}>{item.cwPending}</td>
                                                <td style={{ color: "rgb(11 18 206)" }}>{item.twPending}</td>
                                                <td style={{ color: "#0aafd1" }}>{item.owCorrection}</td>
                                                <td style={{ color: "#0aafd1" }}>{item.cwCorrection}</td>
                                                <td style={{ color: "#0aafd1" }}>{item.twCorrection}</td>
                                                <td style={{ color: "#fa0404" }}>{item.owReject}</td>
                                                <td style={{ color: "#fa0404" }}>{item.cwReject}</td>
                                                <td style={{ color: "#fa0404" }}>{item.twReject}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr style={{ fontFamily: "monospace", backgroundColor: "#949daf" }}>
                                        <th colSpan="3" valign="middle" className="text-center">
                                            Total
                                        </th>

                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.owApproved)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.cwApproved)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.twApproved)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.owPending)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.cwPending)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.twPending)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.owCorrection)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.cwCorrection)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.twCorrection)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.owReject)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.cwReject)), 0)}</th>
                                        <th className="text-center">{data?.data?.reduce((total, currentValue) => (total = total + parseInt(currentValue.twReject)), 0)}</th>
                                    </tr>
                                </tfoot>
                            </table>
                            <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryReport;
