import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Humanize, fetcher } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ClaimForBadge from "../claimList/ClaimForBadge";
import BeneficiaryViewDetails from "../../../pages/admin/ApprovedBeneficiary/BeneficiaryViewDetails";
import ImwPfClaimSubmitForm from "./ImwPfClaimSubmitForm";
import ClaimRemarkStatus from "../../../pages/admin/BmssyClaims/ClaimRemarkStatus";
import OffcanvasPdfViewer from "../../../components/OffcanvasPdfViewer";
import ImwPfClaimSubmitFormTwoScheme from "./ImwPfClaimSubmitFormTwoScheme";
import moment from "moment";
import NoDataFound from "../../../components/list/NoDataFound";

const ImwPfClaimDetails = ({ id }) => {
    const type = "Pf";
    const [show, setShow] = useState(false);

    const { error, data, isFetching } = useQuery(["alc-imw-claim-details", id, type], () => fetcher(`/alc-imw-claim-details?id=${id}&type=${type}`), { enabled: id ? true : false });

    const { data: modalData } = useQuery(["alc-imw-claim-details-modal-data", data?.basicDetails?.encAppId], () => fetcher(`/alc-imw-claim-details-modal-data?id=${data?.basicDetails?.encAppId}`), {
        enabled: show ? true : false,
    });

    const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

    const [docShow, setDocShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setDocShow(false);
    const handleShow = (e) => {
        setDocShow(true);
        setDoc(Humanize(e.currentTarget.getAttribute("attr_name")));
        setUrl(e.currentTarget.getAttribute("attr_url"));
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <>
                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Basic Information</div>
                        <div className="card-body">
                            <div className="details_section">
                                <div>
                                    <b>Name :</b> {data?.basicDetails?.beneficiary_name}
                                </div>
                                <div>
                                    <b>SSIN :</b>
                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view beneficiary details")}>
                                        <Button variant="light" size="sm" onClick={() => setShow(true)} className="basic_details_section_overlay">
                                            {data?.basicDetails?.ssin_no}
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                                <div>
                                    <b>Registration No :</b>
                                    {data?.basicDetails?.registration_no ? data?.basicDetails?.registration_no : "--"}
                                </div>
                                <div>
                                    <b>Registration Date :</b>
                                    {data?.basicDetails?.registration_date}
                                </div>
                                <div>
                                    <b>Worker Type :</b>
                                    {data?.basicDetails?.worker_type === "ow" ? "Other Worker" : data?.basicDetails?.worker_type === "cw" ? "Contraction Worker" : "Transport Worker"}
                                </div>
                                <div>
                                    <b>Aadhaar No :</b>
                                    {data?.basicDetails?.aadhar}
                                </div>
                                <div>
                                    <b>Claim For :</b>
                                    <div className="claim_for_section">
                                        <ClaimForBadge claimFor={data?.basicDetails?.claim_for} benefitName={data?.basicDetails?.benefit_name} />
                                    </div>
                                </div>
                                {data?.basicDetails?.claim_by === 2 && (
                                    <div>
                                        <b>Date Of Death : </b>
                                        <span className="d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                                            {moment(data?.applicantDetails?.date_of_death).format("DD-MM-YYYY")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className={data?.basicDetails?.type_of_claim === "12" ? "col-md-9" : "col-md-12"}>
                            <div className="card datatable-box shadow mb-2">
                                <div className="card-header">Bank Information</div>
                                <div className="card-body">
                                    <div className="details_section mb-1">
                                        <div>
                                            <b>Name :</b>
                                            {data?.basicDetails?.claim_by === 1 ? data?.applicantDetails?.ben_bank_name : data?.applicantDetails?.nominee_bank_name}
                                        </div>
                                        <div>
                                            <b>Branch Name :</b>
                                            {data?.basicDetails?.claim_by === 1 ? data?.applicantDetails?.ben_bank_branch : data?.applicantDetails?.nominee_bank_branch}
                                        </div>

                                        <div>
                                            <b>IFSC :</b>
                                            {data?.basicDetails?.claim_by === 1 ? data?.applicantDetails?.ben_bank_ifsc : data?.applicantDetails?.nominee_bank_ifsc}
                                        </div>
                                        <div>
                                            <b>Account No :</b>
                                            {data?.basicDetails?.claim_by === 1 ? data?.applicantDetails?.ben_bank_account : data?.applicantDetails?.nominee_bank_account}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "15px" }}>
                                        <b>Location :</b>
                                        {data?.basicDetails?.claim_by === 1 ? data?.applicantDetails?.ben_bank_loc : data?.applicantDetails?.nominee_bank_location}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data?.basicDetails?.type_of_claim === "12" && (
                            <div className="col-md-3">
                                <div className="card datatable-box shadow mb-2">
                                    <div className="card-header">Share Information</div>
                                    <div className="card-body" style={{ fontSize: "14.5px" }}>
                                        <div className="mb-1">
                                            <b>Applied Share : </b>
                                            {data?.applicantDetails?.claim_share}%
                                        </div>
                                        {data?.basicDetails?.submit_status != "1" && (
                                            <div>
                                                <b>Approved Share : </b>
                                                {data?.applicantDetails?.approve_share}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card shadow mb-2">
                        <div className="card-header">Documents Information (Submitted by Beneficiary)</div>
                        <div className="card-body">
                            {data?.docDetails?.length != 0 ? (
                                <>
                                    <div className="doc_details_section">
                                        {data?.docDetails.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <Button onClick={handleShow} attr_name={item?.doc_name} attr_url={item?.file} size="sm" variant="light">
                                                        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view " + Humanize(item?.doc_name))}>
                                                            <div className="add_dots">
                                                                <i className="fa-solid fa-file-pdf"></i> {Humanize(item?.doc_name)}
                                                            </div>
                                                        </OverlayTrigger>
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex justify-content-md-center">
                                    <NoDataFound />
                                </div>
                            )}

                            <OffcanvasPdfViewer show={docShow} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />
                        </div>
                    </div>

                    {data?.basicDetails?.submit_status != "1" && data?.basicDetails?.submit_status != "8" && (
                        <div className="card mb-2">
                            <div className="card-header">PF Information</div>
                            <div className="card-body">
                                <div className="card  mb-3">
                                    <div className="section_title">
                                        <strong>PF Details</strong>
                                    </div>
                                    <div className="card-body">
                                        <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>Date Of Birth</th>
                                                        <th>Maturity Date</th>
                                                        <th>
                                                            Total Calculated Amount <br />
                                                            (Upto {data?.applicantDetails?.upto_date_1})
                                                        </th>
                                                        <th>
                                                            Total Excess Amount <br />
                                                            (Upto {data?.applicantDetails?.upto_date_1})
                                                        </th>
                                                        <th>Total Payable Amount</th>
                                                        <th>
                                                            Amount Payable from {data?.basicDetails?.workerTypeBoard} <br />
                                                            Upto {data?.applicantDetails?.upto_date_1}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="text-center">
                                                        <td style={wrapStyle}>{data?.applicantDetails?.date_of_birth}</td>
                                                        <td style={wrapStyle}>{data?.applicantDetails?.maturity_dt}</td>
                                                        <td style={wrapStyle} className="bg-info text-light">
                                                            {data?.old_ben == 0 ? data?.claim_amount : data?.applicantDetails?.claim_amount ? data?.applicantDetails?.claim_amount : "----"}
                                                        </td>
                                                        <td style={wrapStyle} className="bg-warning text-dark">
                                                            {data?.applicantDetails?.excess_amount ? data?.applicantDetails?.excess_amount : "----"}
                                                        </td>
                                                        <td style={wrapStyle} className="bg-primary text-light">
                                                            {data?.payable_amount ? data?.payable_amount : "----"}
                                                        </td>
                                                        <td style={wrapStyle} className="bg-success text-light">
                                                            {data?.applicantDetails?.approved_amount ? data?.applicantDetails?.approved_amount : "----"}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* <div className="pf_details_section">
                                            <div>
                                                <b>Date Of Birth :</b>
                                                {data?.applicantDetails?.date_of_birth}
                                            </div>
                                            <div>
                                                <b>Maturity Date :</b>
                                                {data?.applicantDetails?.maturity_dt}
                                            </div>

                                            <div>
                                                <b>Total Calculated Amount (Upto {data?.applicantDetails?.upto_date_1}) :</b>
                                                <span className="fs-6 fw-semibold font-monospace pf_amount">{data.old_ben == 0 ? data?.claim_amount : data?.applicantDetails?.claim_amount ? data?.applicantDetails?.claim_amount : "----"}</span>
                                            </div>
                                            <div>
                                                <b>Total Excess Amount (Upto {data?.applicantDetails?.upto_date_1}) :</b>
                                                <span className="fs-6 fw-semibold font-monospace pf_amount"> {data?.applicantDetails?.excess_amount ? data?.applicantDetails?.excess_amount : "----"}</span>
                                            </div>
                                            <div>
                                                <b>Total Payable Amount :</b>
                                                <span className="fs-6 fw-semibold font-monospace pf_amount"> {data?.payable_amount ? data?.payable_amount : "----"}</span>
                                            </div>
                                            <div>
                                                <b>
                                                    Amount Payable from {data?.basicDetails?.workerTypeBoard} Upto {data?.applicantDetails?.upto_date_1} :
                                                </b>
                                                <span className="fs-6 fw-semibold font-monospace pf_amount"> {data?.applicantDetails?.approved_amount ? data?.applicantDetails?.approved_amount : "----"}</span>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(data?.basicDetails?.submit_status === "1" || data?.basicDetails?.submit_status === "8") && data?.twoschemeExcessOnly === 0 && <ImwPfClaimSubmitForm id={id} data={data} />}
                    {(data?.basicDetails?.submit_status === "1" || data?.basicDetails?.submit_status === "8") && data?.twoschemeExcessOnly === 1 && <ImwPfClaimSubmitFormTwoScheme id={id} data={data} />}
                    <ClaimRemarkStatus id={id} />

                    <Modal backdrop="static" show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title">
                        <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">Approved Beneficiary Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                            style={{
                                maxHeight: "calc(100vh - 210px)",
                                overflowY: "auto",
                            }}
                        >
                            <BeneficiaryViewDetails propsId={modalData?.id} propsType={modalData?.type} />
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ImwPfClaimDetails;
