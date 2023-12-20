import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Humanize, fetcher } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import BeneficiaryViewDetails from "../../../pages/admin/ApprovedBeneficiary/BeneficiaryViewDetails";
import ClaimRemarkStatus from "../../../pages/admin/BmssyClaims/ClaimRemarkStatus";
import ClaimForBadge from "../claimList/ClaimForBadge";
import AlcPfClaimDetailsSubmitForm from "./AlcPfClaimDetailsSubmitForm";
import OffcanvasPdfViewer from "../../../components/OffcanvasPdfViewer";

const AlcPfClaimDetails = ({ id, funClaimViewAlcId }) => {
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

    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
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
                            <b>Worker Type : </b> {data?.basicDetails?.worker_type === "ow" ? "Other Worker" : data?.basicDetails?.worker_type === "cw" ? "Contraction Worker" : "Transport Worker"}
                        </div>
                        <div>
                            <b>Aadhaar No : </b> {data?.basicDetails?.aadhar}
                        </div>
                        <div>
                            <b>Claim For : </b>
                            <div className="claim_for_section">
                                <ClaimForBadge claimFor={data?.basicDetails?.claim_for} benefitName={data?.basicDetails?.benefit_name} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {(data?.basicDetails?.type_of_claim === "13" || data?.basicDetails?.type_of_claim === "14") && (
                <>
                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Bank Details</div>
                        <div className="card-body">
                            <div className="details_section">
                                <div>
                                    <b>IFSC : </b> {data?.applicantDetails?.ben_bank_ifsc}
                                </div>
                                <div>
                                    <b>Account No : </b> {data?.applicantDetails?.ben_bank_account}
                                </div>
                                <div>
                                    <b>Name : </b> {data?.applicantDetails?.ben_bank_name}
                                </div>
                                <div>
                                    <b>Branch Name : </b> {data?.applicantDetails?.ben_bank_branch}
                                </div>
                                <div>
                                    <b>Location : </b> {data?.applicantDetails?.ben_bank_loc}
                                </div>
                            </div>
                            {/* <div className="table-responsive">
                                <table className="table  table-sm">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Branch Name</th>
                                            <th>Location</th>
                                            <th>IFSC</th>
                                            <th>Account No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data?.applicantDetails?.ben_bank_name}</td>
                                            <td>{data?.applicantDetails?.ben_bank_branch}</td>
                                            <td>{data?.applicantDetails?.ben_bank_loc}</td>
                                            <td>{data?.applicantDetails?.ben_bank_ifsc}</td>
                                            <td>{data?.applicantDetails?.ben_bank_account}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                    </div>
                </>
            )}

            {data?.basicDetails?.type_of_claim === "12" && (
                <div className="card datatable-box mb-2">
                    <div className="card-header">Nominee Details</div>
                    <div className="card-body">
                        <div className="card shadow mb-4">
                            <div className="section_title">
                                <strong>Applicant Nominee</strong>
                            </div>
                            <div className="card-body">
                                <div className="details_section">
                                    <div>
                                        <b>Name : </b> {data?.applicantDetails?.nominee_name}
                                    </div>
                                    <div>
                                        <b>Mobile : </b> {data?.applicantDetails?.nominee_mobile}
                                    </div>
                                    <div>
                                        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.applicantDetails?.nominee_address)}>
                                            <div className="add_dots">
                                                <b>Address : </b> {data?.applicantDetails?.nominee_address}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                    <div>
                                        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.applicantDetails?.nominee_bank_name)}>
                                            <div className="add_dots">
                                                <b>Bank Name : </b> {data?.applicantDetails?.nominee_bank_name}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                    <div>
                                        <b>Bank IFSC : </b> {data?.applicantDetails?.nominee_bank_ifsc}
                                    </div>
                                    <div>
                                        <b>Bank Account No : </b> {data?.applicantDetails?.nominee_bank_account}
                                    </div>
                                    <div>
                                        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.applicantDetails?.nominee_bank_branch)}>
                                            <div className="add_dots">
                                                <b>Bank Branch : </b> {data?.applicantDetails?.nominee_bank_branch}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                    <div>
                                        <b>Aadhaar : </b> {data?.applicantDetails?.nominee_aadhaar}
                                    </div>
                                    <div>
                                        <b>Relationship : </b> {data?.applicantDetails?.relationship}
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
                                                        <b>Name : </b> {item.nominee_name}
                                                    </div>
                                                    <div>
                                                        <b>Relationship : </b> {item.nominee_relationship}
                                                    </div>
                                                    <div>
                                                        <b>Share (%) : </b> {item.nominee_share}
                                                    </div>
                                                    <div>
                                                        <b>Gender : </b> {item.nominee_gender}
                                                    </div>
                                                    <div>
                                                        <b>Date of Birth : </b>
                                                        {item.nominee_dob} ({item.nominee_age})
                                                    </div>
                                                    <div>
                                                        <b>Bank IFSC : </b> {item.nominee_bank_ifsc_code}
                                                    </div>
                                                    <div>
                                                        <b>Bank Name : </b> {item.nominee_bank_name}
                                                    </div>
                                                    <div>
                                                        <b>Bank Branch Name : </b> {item.nominee_bank_branch_name}
                                                    </div>
                                                    <div>
                                                        <b>Bank Account No : </b> {item.nominee_bank_account_no}
                                                    </div>
                                                </div>
                                                <hr className="solid" style={{ display: data?.approvedNomineeDetails?.length === index + 1 && "none" }} />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="d-flex justify-content-md-center">
                                        <span className="text-danger font-monospace">
                                            <i className="fa-solid fa-triangle-exclamation"></i> Not Found any approved nominee
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card datatable-box shadow mb-2">
                <div className="card-header">PF Details</div>
                <div className="card-body">
                    <div className="table-responsive">
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
                                        Total Payable PF Amount <br /> {data?.basicDetails?.claim_by === 2 && "(Recommended Share :" + data?.applicantDetails?.approve_share + ")"}{" "}
                                    </th>
                                    <th>
                                        Amount Payable from {data?.basicDetails?.workerTypeBoard} <br />
                                        Upto {data?.applicantDetails?.upto_date_1}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>{data?.applicantDetails?.date_of_birth}</td>
                                    <td>{data?.applicantDetails?.maturity_dt}</td>
                                    <td className="bg-warning text-dark font-monospace">{data?.old_ben == 0 ? data?.claim_amount : data?.applicantDetails?.claim_amount ? data?.applicantDetails?.claim_amount : "----"}</td>
                                    <td className="bg-primary text-light font-monospace">{data?.payable_amount ? data?.payable_amount : "----"}</td>
                                    <td className="bg-success text-light font-monospace">{data?.applicantDetails?.approved_amount ? data?.applicantDetails?.approved_amount : "----"}</td>
                                </tr>
                            </tbody>
                        </table>
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
                ? (parseInt(data?.basicDetails?.submit_status) != 11 || parseInt(data?.basicDetails?.submit_status != 9) || parseInt(data?.basicDetails?.submit_status != 8)) && (
                      <AlcPfClaimDetailsSubmitForm id={id} status={data?.basicDetails?.submit_status} SubmitStatus={data?.basicDetails?.submit_status} approveAmount={data?.applicantDetails?.approved_amount} />
                  )
                : ""}

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
    );
};

export default AlcPfClaimDetails;
