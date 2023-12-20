import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, searchParamsToObject, updater } from "../../../utils";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useState } from "react";
import { CheckBox } from "../../../components/form/checkBox";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";

const workerTypeShort = ["ow", "cw", "tw"];
const statusTypes = { F: "Pending", C: "Pending at CF&CAO", A: "Approved by CF&CAO", M: "Fund Released by Board", 1: "Fund Released" };
const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CommissionEdistCeoForm = ({ workerType }) => {
    let total_amount = 0;
    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const [checkboxSelect, setCheckboxSelect] = useState([]);
    const [checkboxSelectNum, setCheckboxSelectNum] = useState(false);

    const queryClient = useQueryClient();

    const [form, validator] = useValidate({
        rlo_code: { value: "", validate: "" },
        month_year: { value: "", validate: "" },
        status: { value: "F", validate: "" },
        workerType: { value: workerTypeShort[workerType], validate: "" },
    });

    const { isLoading, error, data, isFetching } = useQuery(["commission-edist-board", workerType, searchParams], () => fetcher(`/commission-edist-board?${searchParams}`));

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
            { url: `/commission-edist-payment-post`, body: { checkboxSelect: checkboxSelect, worker_type: workerTypeShort[workerType] } },
            {
                onSuccess(data) {
                    setCheckboxSelect([]);
                    setCheckboxSelectNum(false);
                    toast.success(data.message);
                    setSearchParams(`workerType=${workerTypeShort[workerType]}`);
                    queryClient.invalidateQueries(["commission-edist-board", workerType]);
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
    };

    const handleChange = (evt) => {
        //setCheckboxSelect([]);
        validator.validOnChange(evt);
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isLoading && <LoadingSpinner />}
            {data && (
                <form noValidate onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="rlo_code">
                                    RLO List
                                </label>

                                <select
                                    className={`form-select ${form.rlo_code.error && "is-invalid"}`}
                                    id="rlo_code"
                                    name="rlo_code"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.rlo_code.value}
                                    required={form.rlo_code.required}
                                >
                                    <option value="">-ALL RLO-</option>
                                    {data?.sub_code_array?.map((item, key) => {
                                        return (
                                            <option value={item.rlo_code} key={key}>
                                                {item.subdivision_name}
                                            </option>
                                        );
                                    })}
                                </select>

                                <div id="Feedback" className="invalid-feedback">
                                    {form.rlo_code.error}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
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
                                    <option value="F" key="1">
                                        Pending
                                    </option>
                                    <option value="C" key="2">
                                        Pending at CF&CAO
                                    </option>
                                    <option value="A" key="3">
                                        Approved by CF&CAO
                                    </option>
                                    <option value="M" key="4">
                                        Fund released
                                    </option>
                                    <option value="1" key="5">
                                        Fund released by ALC
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
            {data && (
                <>
                    <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                        {isFetching && <LoadingOverlay />}
                        <CheckBox.Group onChange={(val) => setCheckboxSelect(val)} value={checkboxSelect}>
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>
                                            {data.sel_status == "F" && (
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
                                            {data.sel_status != "F" && "SNO"}
                                        </th>
                                        <th>Month-Year</th>
                                        <th>ARN</th>
                                        <th>Name</th>
                                        <th>RLO</th>
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
                                                    {data.sel_status == "F" && <CheckBox value={item.id} />}
                                                    {data.sel_status != "F" && index + 1}
                                                </td>
                                                <td style={wrapStyle}>
                                                    {monthFull[item.month - 1]}-{item.year}
                                                </td>
                                                <td style={wrapStyle}>{item.arn}</td>
                                                <td style={wrapStyle}>{item.fullname}</td>
                                                <td style={wrapStyle}>{item.subdivision_name}</td>
                                                <td style={wrapStyle}>{item.net_amt}</td>
                                                <td style={wrapStyle}>{item.fdate}</td>
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
                            <p>
                                Showing <b>{data?.data_Set?.from}</b> to <b>{data?.data_Set?.to}</b> of <b>{data?.data_Set?.total_records}</b> results
                            </p>
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
                                <th>Month-Year</th>
                                <th>ARN</th>
                                <th>Name</th>
                                <th>RLO</th>
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
                                            <td style={wrapStyle}>
                                                {monthFull[item.month - 1]}-{item.year}
                                            </td>
                                            <td style={wrapStyle}>{item.arn}</td>
                                            <td style={wrapStyle}>{item.fullname}</td>
                                            <td style={wrapStyle}>{item.subdivision_name}</td>
                                            <td style={wrapStyle}>{item.net_amt}</td>
                                        </tr>
                                    );
                                })}
                            <tr>
                                <td colSpan="5" align="right">
                                    TOTAL
                                </td>

                                <td>{total_amount}</td>
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
            <h6>NOTE : Check, approve and forward monthly performance report of CA/SLO/OSP to CF & CAO for Fund Release.</h6>
        </>
    );
};

export default CommissionEdistCeoForm;
