import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../../utils";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import LoadingOverlay from "../../../components/LoadingOverlay";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import moment from "moment";
import { Button } from "react-bootstrap";
import CommissionGovGrantAdviceList from "./CommissionGovGrantAdviceList";
import NoDataFound from "../../../components/list/NoDataFound";
import ErrorAlert from "../../../components/list/ErrorAlert";

const workerTypeShort = ["ow", "cw", "tw"];
const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CommissionGovGrantGenerateAdvice = ({ workerType }) => {
    const [genAdvice, setGenAdvice] = useState(1);
    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const [radioSelect, setRadioSelect] = useState();
    const [show, setShow] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [showMemo, setShowMemo] = useState();
    const [memoDetails, setMemoDetails] = useState();

    const queryClient = useQueryClient();
    const [form, validator] = useValidate({
        advice_no: { value: "", validate: "required" },
        advice_dt: { value: "", validate: "required" },
        workerType: { value: workerTypeShort[workerType], validate: "" },
    });
    const handleClose = () => {
        setShow(false);
        setShowMemo();
        setMemoDetails();
    };
    const { isLoading, error, data, isFetching } = useQuery(["ds-generate-advice", workerType, searchParams], () => fetcher(`/ds-generate-advice?${searchParams}`));
    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validator.validate()) return;
        setShowSubmit(true);
        const data = validator.generalize();
        mutate(
            { url: `/ds-generate-advice-post`, body: { receipt_id: radioSelect, worker_type: workerTypeShort[workerType], data: data } },
            {
                onSuccess(data) {
                    toast.success(data.message);
                    setSearchParams(`workerType=${workerTypeShort[workerType]}`);
                    setRadioSelect();
                    setGenAdvice(2);
                    setShowSubmit(false);
                    queryClient.invalidateQueries(["ds-generate-advice", workerType]);
                },
                onError(error) {
                    toast.error(error.message);
                    setShowSubmit(false);
                },
            }
        );
    };

    const handleChange = (evt) => {
        //setCheckboxSelect([]);
        validator.validOnChange(evt);
    };
    const { mutate: newMutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "GET", body: body }));
    const handleShow = async (e) => {
        setMemoDetails();
        setShow(true);
        const memo_id = e.currentTarget.getAttribute("attrMemo");

        newMutate(
            { url: `/ds-view-memo-detail-list/` + memo_id },
            {
                onSuccess(data) {
                    setMemoDetails(data);
                },
                onError(error) {
                    toast.error(error.message);
                    setMemoDetails();
                },
            }
        );
        setShowMemo(e.currentTarget.getAttribute("attrMemoName"));
    };

    let total_amount = 0;

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {genAdvice == 1 && isLoading && <LoadingSpinner />}
            {genAdvice == 1 && error && <ErrorAlert error={error} />}
            {genAdvice == 1 && data && (
                <>
                    <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                        {isFetching && <LoadingOverlay />}
                        {data &&
                            (data?.data_Set.length === 0 ? (
                                <NoDataFound />
                            ) : (
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>SNO</th>
                                            <th>Memo No</th>
                                            <th>Date</th>
                                            <th>Total Amount</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data_Set?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={wrapStyle}>
                                                        <input className="" type="radio" value={item.memo_id} name="memo_id" id="memo_id" onClick={(e) => setRadioSelect(e.currentTarget.value)} />
                                                    </td>
                                                    <td style={wrapStyle} >{item.memo_no}</td>
                                                    <td style={wrapStyle}>{item.fdate}</td>
                                                    <td style={wrapStyle}>{item.total.toFixed(2)}</td>
                                                    <td style={wrapStyle}>
                                                        <Button variant="primary" onClick={handleShow} attrMemo={item.memo_id} attrMemoName={item.memo_no} className="btn-sm me-2">
                                                            Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ))}
                    </div>
                </>
            )}
            {genAdvice == 1 && radioSelect && (
                <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>SNO</th>
                                <th>Memo No</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data_Set
                                ?.filter((val) => radioSelect.includes(val.memo_id))
                                ?.map((item, index) => {
                                    return (
                                        <tr key={index} data-enc-id={item.enc_application_id}>
                                            <td style={wrapStyle}>{index + 1}</td>
                                            <td style={wrapStyle}>{item.memo_no}</td>
                                            <td style={wrapStyle}>{item.fdate}</td>
                                            <td style={wrapStyle}>{item.total.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <div className="row g-3">
                        <div className="col-md-4">
                            <input placeholder="Advice No" className={`form-control ${form.advice_no.error && "is-invalid"}`} type="text" value={form.advice_no.value} name="advice_no" id="advice_no" onChange={(e) => handleChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.advice_no.error}</div>
                        </div>
                        <div className="col-md-4">
                            <input
                                placeholder="Advice Date"
                                className={`form-control ${form.advice_dt.error && "is-invalid"}`}
                                type="date"
                                value={form.advice_dt.value}
                                name="advice_dt"
                                id="advice_dt"
                                //  onChange={(e) => handleChange(e.currentTarget)}
                                onChange={(e) =>
                                    handleChange({
                                        name: "advice_dt",
                                        value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                    })
                                }
                            />
                            <div className="invalid-feedback">{form.advice_dt.error}</div>
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-sm btn-success mt-2" onClick={(evt) => handleSubmit(evt)} disabled={showSubmit}>
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="static" style={{ width: "70%" }}>
                <Offcanvas.Header closeButton style={{ background: "rgb(237 237 237 / 76%)", fontWeight: "800", letterSpacing: "1.5px", fontSize: "20px" }}>
                    <div className="d-flex justify-content-md-center"></div>
                    <Offcanvas.Title>DETAILS OF MEMO {showMemo}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {!memoDetails && <LoadingSpinner />}
                    {memoDetails && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SNO</th>
                                        <th>Release ID</th>
                                        <th>ARN</th>
                                        <th>Name</th>
                                        <th>LWFC</th>
                                        <th>Month Year</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memoDetails?.data_Set?.map((item, index) => {
                                        total_amount = total_amount + item.net_amt;
                                        const myear = [];
                                        item.month.forEach((newitem, key) => {
                                            if (key == 0) myear.push(monthFull[newitem - 1] + "-" + item.year[key]);
                                            else {
                                                myear.push(", " + monthFull[newitem - 1] + "-" + item.year[key]);
                                            }
                                        });

                                        return (
                                            <tr key={index}>
                                                <td style={wrapStyle}>{index + 1}</td>
                                                <td style={wrapStyle}>{item.receipt_id_cfco}</td>
                                                <td style={wrapStyle}>{item.arn}</td>
                                                <td style={wrapStyle}>{item.fullname}</td>
                                                <td style={wrapStyle}>{item.block_mun_name}</td>
                                                <td style={wrapStyle}>{myear}</td>
                                                <td style={wrapStyle}>{item.net_amt}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr style={{ background: "rgb(185 185 185)", fontWeight: "800", letterSpacing: "1.5px" }}>
                                        <td colSpan="6" align="center" className="text-dark">
                                            Total Amount
                                        </td>
                                        <td className="text-dark">{total_amount.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
            {genAdvice == 2 && <CommissionGovGrantAdviceList workerType={workerTypeShort[workerType]} />}
        </>
    );
};

export default CommissionGovGrantGenerateAdvice;
