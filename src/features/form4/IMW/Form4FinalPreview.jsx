import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { downloadFile, fetcher, updater } from "../../../utils";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingOverlay from "../../../components/LoadingOverlay";
import TableList from "../../../components/table/TableList";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useDispatch } from "react-redux";
import FPUploader from "../../../components/FPUploader";
import { toast } from "react-toastify";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

const Form4FinalPreview = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const { isFetching, error, data } = useQuery(["imw-view-pay-in-slip-final-preview", id, searchParams.toString()], () => fetcher(`/imw-view-pay-in-slip-final-preview/${id}?${searchParams.toString()}`), {
        enabled: id ? true : false,
    });

    const { data: docPreViewData } = useQuery(["form4-documents-preview", id], () => fetcher(`/form4-documents-preview?id=${id}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Pay In Slip Details", url: "" }));
    }, []);

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "registration_no",
            headerName: "REG_NO",
        },
        {
            field: "beneficiary_name",
            headerName: "Name",
        },
        {
            field: "book_no",
            headerName: "BOOK NO",
        },
        {
            field: "receipt_no",
            headerName: "RECEIPT NO",
        },
        {
            field: "contribution_amount",
            headerName: "AMOUNT",
        },
        {
            field: "fin_year",
            headerName: "FIN-YEAR",
        },
        {
            field: "contribution_date",
            headerName: "CONTRIBUTION DATE",
        },
    ];

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
    };

    const [loading, setLoading] = useState();

    const DownloadForm4 = async () => {
        setLoading(true);
        await downloadFile(`/form4-entry-pdf-download?id=${id}`, "form-iv.pdf");
        setLoading(false);
    };

    const navigate = useNavigate();
    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const BackForCorrection = async () => {
        mutate(
            { url: `/form4-back-for-correction?id=${data?.payin_slip_id}` },
            {
                onSuccess(data) {
                    toast.success("Successfully Back to SLO");
                    navigate("/form4/imw-pay-in-slip-list?type=pending");
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
    };

    const FinalCommit = async () => {
        mutate(
            { url: `/form4-final-commit?id=${data?.payin_slip_id}` },
            {
                onSuccess(data) {
                    toast.success("Successfully Committed");
                    navigate("/form4/imw-pay-in-slip-list?type=pending");
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
    };

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("form4-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("form4-documents-preview");
    };

    return (
        <>
            {isFetching && <LoadingOverlay />}
            {error && <ErrorAlert error={error} />}
            <div className="card datatable-box mb-2">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>Bank IFSC :</b> {data?.payin_slip_data?.bank_ifsc}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>Bank Name :</b> {data?.payin_slip_data?.bank_name}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>Account Number :</b> {data?.payin_slip_data?.bank_ac_no}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>Deposit Amount :</b> {data?.payin_slip_data?.deposit_amount}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>ARN :</b> {data?.payin_slip_data?.arn_number}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>ARN Name :</b> {data?.payin_slip_data?.arn_name}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>Worker Type :</b>{" "}
                                {data?.payin_slip_data?.worker_type === "ow" ? "Other Worker" : data?.payin_slip_data?.worker_type === "cw" ? "Construction Worker" : data?.payin_slip_data?.worker_type === "tw" ? "Transport Worker" : "N/A"}
                            </label>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc">
                                <b>Date Of Deposit :</b> {data?.payin_slip_data?.deposit_date}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {data && (
                <div>
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6 mt-1">Pay In Slip Entries ( ID - {data?.payin_slip_id} )</div>
                                <div className="col-md-6">
                                    <div className="d-flex justify-content-md-end gap-2">
                                        <button className="btn btn-sm btn-info border-light" onClick={handleShow}>
                                            <i className="fa-solid fa-file-download"></i> Download And Upload PDF{" "}
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-disabled">{docPreViewData?.form4 ? "Document Uploaded" : "Document not uploaded."}</Tooltip>}>
                                                {docPreViewData?.form4 ? (
                                                    <>
                                                        <span className="badge text-bg-success">
                                                            <i className="fa-solid fa-check"></i>
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="badge text-bg-danger">
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </span>
                                                )}
                                            </OverlayTrigger>
                                        </button>

                                        <button className="btn btn-warning btn-sm border-light" onClick={BackForCorrection}>
                                            <i className="fa-solid fa-pen-to-square"></i> Back for Correction
                                        </button>

                                        <button className="btn btn-success border-light btn-sm" disabled={docPreViewData?.form4 != "" ? false : true} onClick={FinalCommit}>
                                            <i className="fa-solid fa-clipboard-check"></i> Final Commit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <TableList data={data?.payin_slip_list} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                        </div>
                    </div>
                    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" className="rectification_modal">
                        <Modal.Header closeButton className="rectification_modal_header">
                            <Modal.Title>Download & Upload Pay In Slip PDF</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <div className="card-body" style={{ position: "relative", overflow: "hidden" }}>
                                    <div className="row g-3">
                                        <div className="col-md-6" style={{ textAlign: "center", margin: "auto" }}>
                                            <label className="p-2">
                                                <b>Download Your Form-IV PDF</b>
                                            </label>
                                            <button type="submit" className="btn btn-success" onClick={DownloadForm4} disabled={loading || docPreViewData?.form4}>
                                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Download
                                            </button>
                                        </div>
                                        <div className="col-md-6">
                                            <FPUploader
                                                fileURL={docPreViewData?.form4 ? process.env.APP_BASE + docPreViewData?.form4 : ""}
                                                title="Pay in slip Upload"
                                                maxFileSize="450KB"
                                                description="Upload Document both side (Max size 450 KB, pdf file only)"
                                                acceptedFileTypes={["application/pdf"]}
                                                name="file"
                                                onUploadSuccessful={(res) => afterSuccess("Form4")}
                                                onDeleteSuccessful={() => afterDelete("Form4")}
                                                upload={`/form4-entry-pdf-upload-imw?id=${id}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            )}
        </>
    );
};

export default Form4FinalPreview;
