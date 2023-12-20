import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import BeneficiaryViewDetails from "../../../pages/admin/ApprovedBeneficiary/BeneficiaryViewDetails";
import ClaimRemarkStatus from "../../../pages/admin/BmssyClaims/ClaimRemarkStatus";
import { Humanize, fetcher } from "../../../utils";
import { AlcDisabilityDetailsSubmitForm } from "./AlcDisabilityDetailsSubmitForm";
import ClaimForBadge from "../claimList/ClaimForBadge";
import OffcanvasPdfViewer from "../../../components/OffcanvasPdfViewer";

const AlcDisabilityClaimDetails = ({ id, funClaimViewAlcId }) => {
    const type = "Disability";
    const { error, data, isFetching } = useQuery(["alc-imw-claim-details", id, type], () => fetcher(`/alc-imw-claim-details?id=${id}&type=${type}`), { enabled: id ? true : false });

    const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

    const { data: duplicateBankData } = useQuery(["alc-imw-claim-check-duplicate-bank", id, data?.basicDetails?.ben_bank_account], () => fetcher(`/alc-imw-claim-check-duplicate-bank?id=${id}&account=${data?.basicDetails?.ben_bank_account}`), {
        enabled: data ? true : false,
    });

    const [show, setShow] = useState(false);

    const { data: modalData } = useQuery(["alc-imw-claim-details-modal-data", data?.basicDetails?.encAppId], () => fetcher(`/alc-imw-claim-details-modal-data?id=${data?.basicDetails?.encAppId}`), {
        enabled: show ? true : false,
    });
    const [docShow, setDocShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setDocShow(false);
    const handleShow = (e) => {
        setDocShow(true);
        setDoc(Humanize(e.currentTarget.getAttribute("attr_name")));
        setUrl(e.currentTarget.getAttribute("attr_url"));
    };

    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
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
                                    <b>Name : </b> {data?.basicDetails?.beneficiary_name}
                                </div>
                                <div>
                                    <b>SSIN : </b>
                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view beneficiary details")}>
                                        <Button variant="light" size="sm" onClick={() => setShow(true)} className="basic_details_section_overlay">
                                            {data?.basicDetails?.ssin_no}
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                                <div>
                                    <b>Registration No : </b> {data?.basicDetails?.registration_no}
                                </div>
                                <div>
                                    <b>Registration Date : </b> {data?.basicDetails?.registration_date}
                                </div>
                                <div>
                                    <b>Claim For : </b>
                                    <div className="claim_for_section">
                                        <ClaimForBadge claimFor="DISABILITY" benefitName={data?.basicDetails?.benefit_name} />
                                    </div>
                                </div>
                                <div>
                                    <b>{data?.basicDetails?.select_date_type} : </b> {data?.basicDetails?.input_date}
                                </div>
                                <div>
                                    <b>Claim Amount : </b>
                                    <span className="fs-6 fw-semibold font-monospace pf_amount">{data?.basicDetails?.claim_amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Bank Information</div>
                        <div className="card-body">
                            <div className="details_section">
                                <div>
                                    <b>IFSC : </b> {data?.basicDetails?.ben_bank_ifsc}
                                </div>
                                <div>
                                    <b>Name : </b> {data?.basicDetails?.ben_bank_name}
                                </div>
                                <div>
                                    <b>Branch Name : </b> {data?.basicDetails?.ben_bank_branch}
                                </div>
                                <div>
                                    <b>Location : </b> {data?.basicDetails?.ben_bank_loc}
                                </div>
                                <div>
                                    <b>Account Number : </b> {data?.basicDetails?.ben_bank_account}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Documents Information</div>
                        <div className="card-body">
                            <div className="doc_details_section">
                                {data?.docDetails.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {funClaimViewAlcId ? (
                                                <Button onClick={() => openInNewTab(process.env.APP_BASE + item?.file)} size="sm" variant="light">
                                                    <i className="fa-solid fa-file-pdf"></i> {Humanize(item?.doc_name)}
                                                </Button>
                                            ) : (
                                                <Button onClick={handleShow} attr_name={item?.doc_name} attr_url={item?.file} size="sm" variant="light">
                                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(Humanize(item?.doc_name))}>
                                                        <div className="add_dots">
                                                            <i className="fa-solid fa-file-pdf"></i> {Humanize(item?.doc_name)}
                                                        </div>
                                                    </OverlayTrigger>
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <OffcanvasPdfViewer show={docShow} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />
                    </div>

                    {!funClaimViewAlcId
                        ? (parseInt(data?.basicDetails?.submit_status) === 2 || parseInt(data?.basicDetails?.submit_status) === 10) && (
                              <AlcDisabilityDetailsSubmitForm id={id} duplicateBankData={duplicateBankData} status={data?.basicDetails?.submit_status} SubmitStatus={data?.basicDetails?.submit_status} />
                          )
                        : ""}

                    <ClaimRemarkStatus id={id} />

                    <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title" backdrop="static" keyboard={false}>
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

export default AlcDisabilityClaimDetails;
