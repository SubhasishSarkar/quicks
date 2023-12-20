import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, searchParamsToObject, updater } from "../../../utils";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { useState } from "react";
import { CheckBox } from "../../../components/form/checkBox";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import CommissionGovGrantCheckInspector from "./CommissionGovGrantCheckInspector";

const workerTypeShort = ["ow", "cw", "tw"];
const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const statusTypes = { S: "Pending", V: "Pending at ALC", F: "Pending at Board", C: "Pending at CF&CAO", A: "Approved by CF&CAO", M: "Fund Released by Board", 1: "Fund Released" };

const CommissionGovGrantInspectorForm = ({ workerType }) => {
    let total_amount = 0;
    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const [checkboxSelect, setCheckboxSelect] = useState([]);
    const [checkboxSelectNum, setCheckboxSelectNum] = useState(false);
    const [checkVerify, setCheckVerify] = useState(0);
    const queryClient = useQueryClient();
    const [form, validator] = useValidate({
        lwfc_code: { value: "", validate: "" },
        month_year: { value: "", validate: "" },
        status: { value: "S", validate: "" },
        workerType: { value: workerTypeShort[workerType], validate: "" },
    });

    const { isLoading, error, data, isFetching } = useQuery(["commission-gov-grant-inspector", workerType, searchParams], () => fetcher(`/commission-gov-grant-inspector?${searchParams}`));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;

        const data = validator.generalize();

        const params = new URLSearchParams(data);
        setSearchParams(params.toString());
        setCheckboxSelect([]);
    };

    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleCheckSubmit = (e) => {
        e.preventDefault();
        mutate(
            { url: `/commission-gov-grant-post`, body: { checkboxSelect: checkboxSelect, worker_type: workerTypeShort[workerType] } },
            {
                onSuccess(data) {
                    setCheckboxSelect([]);
                    setCheckboxSelectNum(false);
                    toast.success(data.message);
                    setSearchParams(`workerType=${workerTypeShort[workerType]}`);
                    validator.reset();
                    queryClient.invalidateQueries(["commission-gov-grant-inspector", workerType]);
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleVerify = (id) => {
        setCheckVerify(id);
    };

    const handleBack = () => {
        setSearchParams(`workerType=${workerTypeShort[workerType]}`);
        queryClient.invalidateQueries(["commission-gov-grant-inspector", workerType, searchParams]);
        setCheckVerify(0);
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {checkVerify != 0 && <CommissionGovGrantCheckInspector checkVerify={checkVerify} handleBack={handleBack} />}
            {checkVerify == 0 && (
                <>
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <form noValidate onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-4">
                                    <div className="form-group">
                                        <label className="form-control-label" htmlFor="month_year">
                                            Month Year
                                        </label>

                                        <select
                                            className={`form-select ${form.month_year.error && "is-invalid"}`}
                                            id="month_year"
                                            name="month_year"
                                            onChange={(e) => {
                                                handleChange(e.currentTarget);
                                            }}
                                            value={form.month_year.value ? form.month_year.value : data.min_date_month}
                                            required={form.month_year.required}
                                        >
                                            {data?.month_year?.map((item, key) => {
                                                return (
                                                    <option value={item.month + "-" + item.year} key={key}>
                                                        {monthFull[item.month - 1]}-{item.year}
                                                    </option>
                                                );
                                            })}
                                            <option value="0">-ALL-</option>
                                        </select>

                                        <div id="Feedback" className="invalid-feedback">
                                            {form.month_year.error}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <div className="form-group">
                                        <label className="form-control-label" htmlFor="status">
                                            Status
                                        </label>
                                        <select className={`form-select ${form.status.error && "is-invalid"}`} id="status" name="status" onChange={(e) => handleChange(e.currentTarget)} value={form.status.value}>
                                            <option value="S" key="1">
                                                Pending
                                            </option>
                                            <option value="V" key="2">
                                                Pending at ALC
                                            </option>
                                            <option value="F" key="3">
                                                Pending at Board
                                            </option>
                                            <option value="C" key="4">
                                                Pending at CF&CAO
                                            </option>
                                            <option value="A" key="5">
                                                Approved by CF&CAO
                                            </option>
                                            <option value="M" key="6">
                                                Fund Released by Board
                                            </option>
                                            <option value="1" key="7">
                                                Fund Released
                                            </option>
                                        </select>
                                    </div>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.status.error}
                                    </div>
                                </div>

                                <div className="col-md-1">
                                    <div className="d-grid mt-4 d-md-flex">
                                        <button type="submit" className="btn btn-sm btn-primary mt-2" disabled={isLoading || isFetching}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                    {(isLoading || isFetching) && <LoadingSpinner />}
                    {data && (
                        <>
                            <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                                <CheckBox.Group onChange={(val) => setCheckboxSelect(val)} value={checkboxSelect}>
                                    <table className="table table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th>
                                                    {data.sel_status == "S" && (
                                                        <input
                                                            type="checkbox"
                                                            checked={checkboxSelectNum}
                                                            className="form_check"
                                                            onChange={(e) => {
                                                                if (e.currentTarget.checked) {
                                                                    setCheckboxSelect(data?.data_Set?.data?.map((item) => item.id));
                                                                    setCheckboxSelectNum(true);
                                                                } else {
                                                                    setCheckboxSelectNum(false);
                                                                    setCheckboxSelect([]);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    {data.sel_status != "S" && "SNO"}
                                                </th>
                                                <th>Claim ID</th>
                                                <th>Month-Year</th>
                                                <th>ARN</th>
                                                <th>Name</th>
                                                <th>No. of entry in portal</th>
                                                <th>No. of entry in passbook</th>
                                                <th>Total Amount</th>
                                                <th>Forwarded On</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.data_Set?.data?.map((item, index) => {
                                                return (
                                                    <tr key={index} data-enc-id={item.enc_application_id}>
                                                        <td style={wrapStyle}>
                                                            {data.sel_status == "S" && <CheckBox value={item.id} />}
                                                            {data.sel_status != "S" && data?.data_Set?.from + index}
                                                        </td>
                                                        <td style={wrapStyle}>{item.id}</td>
                                                        <td style={wrapStyle}>
                                                            {monthFull[item.month - 1]}-{item.year}
                                                        </td>
                                                        <td style={wrapStyle}>{item.arn}</td>
                                                        <td style={wrapStyle}>{item.fullname}</td>
                                                        <td>{item.added_count}</td>
                                                        <td style={wrapStyle}>
                                                            {data.sel_status == "S" && (
                                                                <button className="btn btn-sm btn-success " onClick={() => handleVerify(item.id)}>
                                                                    {item.collected_count}
                                                                </button>
                                                            )}
                                                            {data.sel_status != "S" && item.collected_count}
                                                        </td>
                                                        <td style={wrapStyle}>{item.net_amt}</td>
                                                        <td style={wrapStyle}>{data.sel_status == "V" ? item.vdate : item.fdate}</td>
                                                        <td style={wrapStyle}>{statusTypes[data.sel_status]}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </CheckBox.Group>
                            </div>
                            {data?.data_Set?.links && (
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="d-inline-flex mb-3 px-2 py-1 fw-semibold text-secondary bg-opacity-20 ">
                                        Showing {data?.data_Set?.from} to {data?.data_Set?.to} of {data?.data_Set?.total_records} Entries
                                    </small>
                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                        <nav>
                                            <ul className="pagination pagination-sm mb-0">
                                                {data?.data_Set?.links?.map((item, index) => (
                                                    <li className={`page-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`} key={index}>
                                                        <a
                                                            href={item.query}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSearchParams(item.query.split("?")[1]);
                                                            }}
                                                            className="page-link"
                                                        >
                                                            {item.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <select
                                            className="form-select form-select-sm"
                                            value={searchParamsToObject(new URLSearchParams(searchParams)).limit}
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                const params = new URLSearchParams(searchParams);
                                                params.set("limit", value);
                                                e.preventDefault();
                                                setSearchParams(params.toString());
                                            }}
                                        >
                                            <option value="15">15</option>
                                            <option value="30">30</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {checkboxSelect && checkboxSelect.length > 0 && (
                        <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SNO</th>
                                        <th>Claim ID</th>
                                        <th>Month-Year</th>
                                        <th>ARN</th>
                                        <th>Name</th>
                                        <th>LWFC</th>
                                        <th>No. of entry in portal</th>
                                        <th>No. of entry in passbook</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data_Set?.data
                                        ?.filter((val) => checkboxSelect.includes(val.id))
                                        ?.map((item, index) => {
                                            total_amount = total_amount + item.net_amt;
                                            return (
                                                <tr key={index} data-enc-id={item.enc_application_id}>
                                                    <td style={wrapStyle}>{index + 1}</td>
                                                    <td style={wrapStyle}>{item.id}</td>
                                                    <td style={wrapStyle}>
                                                        {monthFull[item.month - 1]}-{item.year}
                                                    </td>
                                                    <td style={wrapStyle}>{item.arn}</td>
                                                    <td style={wrapStyle}>{item.fullname}</td>
                                                    <td style={wrapStyle}>{item.block_mun_name}</td>
                                                    <td style={wrapStyle}>{item.added_count}</td>
                                                    <td style={wrapStyle}>{item.collected_count}</td>
                                                    <td style={wrapStyle}>{item.net_amt}</td>
                                                </tr>
                                            );
                                        })}

                                    <tr>
                                        <td colSpan="8" align="right">
                                            TOTAL
                                        </td>

                                        <td>{total_amount.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {data.btn_show == 1 && (
                                <button type="submit" className="btn btn-sm btn-success mt-2" onClick={(evt) => handleCheckSubmit(evt)}>
                                    SUBMIT
                                </button>
                            )}
                        </div>
                    )}

                    <br />
                    <br />
                    <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                        <span className="badge text-bg-danger">NOTE:</span>
                        <ul>
                            <li>
                                Click on the number displayed in the column
                                <b>
                                    <i> No. Of Entry In Passbook </i>
                                </b>
                                for verification
                            </li>
                            <li>Check and forward claims of CA/SLO/DEO to RLO for approval after verification</li>
                        </ul>
                    </h6>
                </>
            )}
        </>
    );
};

export default CommissionGovGrantInspectorForm;
