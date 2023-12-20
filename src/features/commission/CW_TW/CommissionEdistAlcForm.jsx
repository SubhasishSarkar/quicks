import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, searchParamsToObject, updater } from "../../../utils";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { useState } from "react";
import { CheckBox } from "../../../components/form/checkBox";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import PaginationType2 from "../../../components/PaginationType2";
import ErrorAlert from "../../../components/list/ErrorAlert";

const workerTypeShort = ["cw", "tw"];
const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const statusTypes = { S: "Pending", F: "Pending at Board", C: "Pending at CF&CAO", A: "Approved by CF&CAO", M: "Fund Released by Board", 1: "Fund Released" };

const CommissionEdistAlcForm = ({ workerType }) => {
    let total_amount = 0;
    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const [checkboxSelect, setCheckboxSelect] = useState([]);
    const queryClient = useQueryClient();
    const [form, validator] = useValidate({
        lwfc_code: { value: "", validate: "" },
        month_year: { value: "", validate: "" },
        status: { value: "S", validate: "" },
        workerType: { value: workerTypeShort[workerType], validate: "" },
    });

    const { isLoading, error, data } = useQuery(["commission-edist-alc", workerType, searchParams], () => fetcher(`/commission-edist-alc?${searchParams}`));

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
                    toast.success(data.message);
                    setSearchParams(`workerType=${workerTypeShort[workerType]}`);

                    queryClient.invalidateQueries(["commission-edist-alc", workerType]);
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
                                <label className="form-control-label" htmlFor="lwfc_code">
                                    LWFC List
                                </label>

                                <select
                                    className={`form-select ${form.lwfc_code.error && "is-invalid"}`}
                                    id="lwfc_code"
                                    name="lwfc_code"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.lwfc_code.value}
                                    required={form.lwfc_code.required}
                                >
                                    <option value="">-ALL LWFC-</option>
                                    {data?.block_code_array?.map((item, key) => {
                                        return (
                                            <option value={item.lwfc_code} key={key}>
                                                {item.block_mun_name}
                                            </option>
                                        );
                                    })}
                                </select>

                                <div id="Feedback" className="invalid-feedback">
                                    {form.lwfc_code.error}
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
                                    <option value="S" key="1">
                                        Pending
                                    </option>
                                    <option value="F" key="2">
                                        Pending at Board
                                    </option>
                                    <option value="C" key="3">
                                        Pending at CF&CAO
                                    </option>
                                    <option value="A" key="4">
                                        Approved by CF&CAO
                                    </option>
                                    <option value="M" key="5">
                                        Fund Released by Board
                                    </option>
                                    <option value="1" key="6">
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
                                <button type="submit" className="btn btn-sm btn-primary mt-2" disabled={isLoading}>
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
                        <CheckBox.Group onChange={(val) => setCheckboxSelect(val)} value={checkboxSelect}>
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>
                                            {data.sel_status == "S" && (
                                                <input
                                                    type="checkbox"
                                                    className="form_check"
                                                    checked={checkboxSelect.length == 0 ? false : true}
                                                    onChange={(e) => {
                                                        if (e.currentTarget.checked) {
                                                            setCheckboxSelect(data?.data_Set?.data?.map((item) => item.id));
                                                        } else {
                                                            setCheckboxSelect([]);
                                                        }
                                                    }}
                                                />
                                            )}
                                            {data.sel_status != "S" && "SNO"}
                                        </th>
                                        <th>Month-Year</th>
                                        <th>ARN</th>
                                        <th>Name</th>
                                        <th>LWFC</th>
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
                                                    {data.sel_status != "S" && index + 1}
                                                </td>
                                                <td style={wrapStyle}>
                                                    {monthFull[item.month - 1]}-{item.year}
                                                </td>
                                                <td style={wrapStyle}>{item.arn}</td>
                                                <td style={wrapStyle}>{item.fullname}</td>
                                                <td style={wrapStyle}>{item.block_mun_name}</td>
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
                    {data?.data_Set?.links && <PaginationType2 data={data?.data_Set} setSearchParams={setSearchParams} searchParamsToObject={searchParamsToObject} searchParams={searchParams} />}
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
                                <th>LWFC</th>
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
                                            <td style={wrapStyle}>{item.block_mun_name}</td>
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

                    {data && data.btn_show == 1 && (
                        <button type="submit" className="btn btn-sm btn-success mt-2" onClick={(evt) => handleCheckSubmit(evt)}>
                            SUBMIT
                        </button>
                    )}
                </div>
            )}
            <br></br>
            <br></br>
            <h6>
                <span className="badge text-bg-danger">NOTE:</span> Check and forward monthly performance report of CA/SLO/DEO to Board for approval.
            </h6>
        </>
    );
};

export default CommissionEdistAlcForm;
