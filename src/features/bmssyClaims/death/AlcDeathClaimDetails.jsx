import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import BeneficiaryViewDetails from "../../../pages/admin/ApprovedBeneficiary/BeneficiaryViewDetails";
import ClaimRemarkStatus from "../../../pages/admin/BmssyClaims/ClaimRemarkStatus";
import { fetcher, Humanize } from "../../../utils";
import AlcDeathClaimDetailsSubmitForm from "./AlcDeathClaimDetailsSubmitForm";
import ClaimForBadge from "../claimList/ClaimForBadge";
import OffcanvasPdfViewer from "../../../components/OffcanvasPdfViewer";

const AlcDeathClaimDetails = ({ id, funClaimViewAlcId }) => {
    const type = "Death";
    const { error, data, isFetching } = useQuery(["alc-imw-claim-details", id, type], () => fetcher(`/alc-imw-claim-details?id=${id}&type=${type}`), { enabled: id ? true : false });

    // console.log(data);

    const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

    const { data: duplicateBankData } = useQuery(
        ["alc-imw-claim-check-duplicate-bank", id, data?.nomineeDetails?.nominee_bank_account],
        () => fetcher(`/alc-imw-claim-check-duplicate-bank?id=${id}&account=${data?.nomineeDetails?.nominee_bank_account}`),
        {
            enabled: data ? true : false,
        }
    );

    const { data: duplicateAadhaarData } = useQuery(
        ["alc-imw-claim-check-duplicate-aadhaar", id, data?.nomineeDetails?.nominee_aadhaar],
        () => fetcher(`/alc-imw-claim-check-duplicate-aadhaar?id=${id}&aadhaar=${data?.nomineeDetails?.nominee_aadhaar}`),
        {
            enabled: data ? true : false,
        }
    );

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
                <div>
                    {duplicateBankData?.status === true && <ErrorAlert error={duplicateBankData} />}

                    {duplicateAadhaarData?.status === true && <ErrorAlert error={duplicateAadhaarData} />}

                    {data?.basicDetails?.status.trim() != "A" && <ErrorAlert error={{ message: "Beneficiary is Inactive" }} />}

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
                                    <b>Date Of Death : </b> {data?.nomineeDetails?.date_of_death}
                                </div>
                                <div>
                                    <b>Claim For : </b>
                                    <div className="claim_for_section">
                                        <ClaimForBadge claimFor="DEATH" benefitName={parseInt(data?.nomineeDetails?.nature_of_death) === 3 ? "Natural Death" : "Accidental Death"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Nominee Details</div>
                        <div className="card-body">
                            <div className="card shadow mb-4">
                                <div className="section_title">
                                    <strong>Applicant Nominee</strong>
                                </div>
                                <div className="card-body">
                                    <div className="details_section">
                                        <div>
                                            <b>Name : </b> {data?.nomineeDetails?.nominee_name}
                                        </div>
                                        <div>
                                            <b>Mobile : </b> {data?.nomineeDetails?.nominee_mobile}
                                        </div>
                                        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.nomineeDetails?.nominee_address)}>
                                            <div className="add_dots">
                                                <b>Address : </b> {data?.nomineeDetails?.nominee_address}
                                            </div>
                                        </OverlayTrigger>

                                        <div>
                                            <b>Aadhaar : </b> {data?.nomineeDetails?.nominee_aadhaar}
                                        </div>
                                        <div>
                                            <b>Claim Share : </b> {data?.nomineeDetails?.claim_share}
                                        </div>
                                        <div>
                                            <b>Claim Amount : </b> {data?.nomineeDetails?.claim_amount}
                                        </div>
                                        <div>
                                            <b>Recommended Share : </b> {data?.nomineeDetails?.approve_share}
                                        </div>
                                        <div>
                                            <b>Recommended Amount : </b> {data?.nomineeDetails?.approved_amount}
                                        </div>
                                        <div>
                                            <b>Bank Name : </b> {data?.nomineeDetails?.nominee_bank_name}
                                        </div>
                                        <div>
                                            <b>Bank IFSC : </b> {data?.nomineeDetails?.nominee_bank_ifsc}
                                        </div>
                                        <div>
                                            <b>Bank Account : </b> {data?.nomineeDetails?.nominee_bank_account}
                                        </div>
                                        <div>
                                            <b>Bank Branch : </b> {data?.nomineeDetails?.nominee_bank_branch}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow">
                                <div className="section_title">
                                    <strong>Approved Nominee</strong>
                                </div>
                                <div className="card-body">
                                    {data?.approvedNomineeDetails?.length > 0 ? (
                                        data?.approvedNomineeDetails?.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    {data?.approvedNomineeDetails?.length > 1 && <span className="nominee_index">{index + 1}</span>}
                                                    <div className="details_section" style={{ marginLeft: data?.approvedNomineeDetails?.length > 1 && "20px" }}>
                                                        <div>
                                                            <b>Name : </b> {item?.nominee_name}
                                                        </div>
                                                        <div>
                                                            <b>Relationship : </b> {item?.nominee_relationship}
                                                        </div>
                                                        <div>
                                                            <b>Share : </b> {item?.nominee_share}
                                                        </div>
                                                        <div>
                                                            <b>Gender : </b> {item?.nominee_gender}
                                                        </div>
                                                        <div>
                                                            <b>Date of Birth (Age) : </b> {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                                        </div>
                                                        <div>
                                                            <b>Bank IFSC : </b> {item?.nominee_bank_ifsc_code}
                                                        </div>
                                                        <div>
                                                            <b>Bank Name : </b> {item?.nominee_bank_name}
                                                        </div>
                                                        <div>
                                                            <b>Bank Branch Name : </b> {item?.nominee_bank_branch_name}
                                                        </div>
                                                        <div>
                                                            <b>Bank Account No : </b> {item?.nominee_bank_account_no}
                                                        </div>
                                                    </div>
                                                    <hr className="solid" style={{ display: data?.approvedNomineeDetails?.length === index + 1 && "none" }} />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <span>Not Found any approved nominee</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Documents Details</div>
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
                              <AlcDeathClaimDetailsSubmitForm id={id} duplicateBankDataSSIN={duplicateBankData?.ssin} SubmitStatus={data?.basicDetails?.submit_status} status={data?.basicDetails?.status} />
                          )
                        : ""}

                    <ClaimRemarkStatus id={id} />

                    <Modal backdrop="static" show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title" className="rectification_modal ">
                        <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#fff", color: "#0886e3" }}>
                            <Modal.Title>Approved Beneficiary Details</Modal.Title>
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
                </div>
            )}
        </>
    );
};

export default AlcDeathClaimDetails;
