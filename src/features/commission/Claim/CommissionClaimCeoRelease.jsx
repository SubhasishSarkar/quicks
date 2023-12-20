import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, searchParamsToObject, updater } from "../../../utils";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { useState } from "react";
import { CheckBox } from "../../../components/form/checkBox";
import moment from "moment";
import { Button, Offcanvas } from "react-bootstrap";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";

const workerTypeShort = ["ow", "cw", "tw"];
const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CommissionClaimCeoRelease = ({ workerType }) => {
    let total_amount = 0;
    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const [checkboxSelect, setCheckboxSelect] = useState([]);
    const [show, setShow] = useState(false);
    const [showRelease, setShowRelease] = useState();
    const [releaseDetails, setReleaseDetails] = useState();
    const [showSubmit, setShowSubmit] = useState(false);
    const queryClient = useQueryClient();

    const [form, validator] = useValidate({
        memo_no: { value: "", validate: "required" },
        memo_dt: { value: "", validate: "required" },
        workerType: { value: workerTypeShort[workerType], validate: "" },
    });

    const handleClose = () => {
        setShow(false);
        setShowRelease();
        setReleaseDetails();
    };
    const { isLoading, error, data } = useQuery(["claim-fund-release-list"], () => fetcher(`/claim-fund-release-list?${searchParams}`));

    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleCheckSubmit = (e) => {
        setShowSubmit(true);
        e.preventDefault();
        const data = validator.generalize();
        mutate(
            { url: `/claim-fund-release-post`, body: { receipt_id: checkboxSelect, data: data } },
            {
                onSuccess(data) {
                    toast.success(data.message);
                    setSearchParams(`workerType=${workerTypeShort[workerType]}`);
                    setCheckboxSelect([]);
                    setShowSubmit(false);
                    queryClient.invalidateQueries(["claim-fund-release-list"]);
                },
                onError(error) {
                    setShowSubmit(false);
                    toast.error(error.message);
                },
            }
        );
    };

    const { mutate: newMutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "GET", body: body }));
    const handleShow = async (e) => {
        setReleaseDetails();
        setShow(true);
        const release_id = e.currentTarget.getAttribute("attrRelease");

        newMutate(
            { url: `/claim-view-release-detail-list/` + release_id },
            {
                onSuccess(data) {
                    setReleaseDetails(data);
                },
                onError(error) {
                    toast.error(error.message);
                    setReleaseDetails();
                },
            }
        );
        setShowRelease(e.currentTarget.getAttribute("attrReleaseName"));
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
            <form noValidate>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorAlert error={error} />}
                {data && (
                    <>
                        <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                            <CheckBox.Group onChange={(val) => setCheckboxSelect(val)} value={checkboxSelect}>
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className="form_check"
                                                    onChange={(e) => {
                                                        if (e.currentTarget.checked) {
                                                            setCheckboxSelect(data?.data_Set?.data?.map((item) => item.receipt_id));
                                                        } else {
                                                            setCheckboxSelect([]);
                                                        }
                                                    }}
                                                />
                                            </th>
                                            <th>Released ID</th>
                                            <th>Fund Released Date</th>
                                            <th>Total Amount</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data_Set?.data?.map((item, index) => {
                                            return (
                                                <tr key={index} data-enc-id={item.enc_application_id}>
                                                    <td style={wrapStyle}>{<CheckBox value={item.receipt_id} />}</td>
                                                    <td style={wrapStyle}>{item.receipt_id}</td>
                                                    <td style={wrapStyle}>{item.fdate}</td>
                                                    <td style={wrapStyle}>{item.net_amt}</td>
                                                    <td style={wrapStyle}>
                                                        <Button variant="primary" onClick={handleShow} attrRelease={item.receipt_id} attrReleaseName={item.receipt_id} className="me-2">
                                                            Details
                                                        </Button>
                                                    </td>
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
                                    <th>Released ID</th>
                                    <th>Fund Released Date</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data_Set?.data
                                    ?.filter((val) => checkboxSelect.includes(val.receipt_id))
                                    ?.map((item, index) => {
                                        total_amount = total_amount + item.net_amt;
                                        return (
                                            <tr key={index} data-enc-id={item.id}>
                                                <td style={wrapStyle}>{index + 1}</td>
                                                <td style={wrapStyle}>{item.receipt_id}</td>
                                                <td style={wrapStyle}>{item.fdate}</td>
                                                <td style={wrapStyle}>{item.net_amt}</td>
                                            </tr>
                                        );
                                    })}
                                <tr>
                                    <td colSpan="3" align="Right">
                                        Total Amount
                                    </td>
                                    <td>{total_amount}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <input placeholder="Memo No" className={`form-control ${form.memo_no.error && "is-invalid"}`} type="text" value={form.memo_no.value} name="memo_no" id="memo_no" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.memo_no.error}</div>
                            </div>
                            <div className="col-md-4">
                                <input
                                    placeholder="Memo Date"
                                    className={`form-control ${form.memo_dt.error && "is-invalid"}`}
                                    type="date"
                                    value={form.memo_dt.value}
                                    name="memo_dt"
                                    id="memo_dt"
                                    //  onChange={(e) => handleChange(e.currentTarget)}
                                    onChange={(e) =>
                                        handleChange({
                                            name: "memo_dt",
                                            value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                        })
                                    }
                                />
                                <div className="invalid-feedback">{form.memo_dt.error}</div>
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-sm btn-success mt-2" onClick={(evt) => handleCheckSubmit(evt)} disabled={showSubmit}>
                                    SUBMIT
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="static" style={{ width: "90%" }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>DETAILS OF RELEASE ID {showRelease}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {releaseDetails && (
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>SNO</th>
                                    <th>ARN</th>
                                    <th>Name</th>
                                    <th>RLO</th>
                                    <th>LWFC</th>
                                    <th>Month Year</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {releaseDetails?.data_Set?.data?.map((item, index) => {
                                    total_amount = total_amount + item.net_amt;

                                    return (
                                        <tr key={index}>
                                            <td style={wrapStyle}>{index + 1}</td>
                                            <td style={wrapStyle}>{item.arn}</td>
                                            <td style={wrapStyle}>{item.fullname}</td>
                                            <td style={wrapStyle}>{item.subdivision_name}</td>
                                            <td style={wrapStyle}>{item.block_mun_name}</td>
                                            <td style={wrapStyle}>
                                                {monthFull[item.month - 1]}-{item.year}
                                            </td>
                                            <td style={wrapStyle}>{item.net_amt}</td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td colSpan="6" align="Right">
                                        Total Amount
                                    </td>
                                    <td>{total_amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default CommissionClaimCeoRelease;
