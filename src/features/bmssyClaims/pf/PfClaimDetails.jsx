import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Humanize, downloadFile, fetcher } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import NoDataFound from "../../../components/list/NoDataFound";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal";
import ClaimRemarkStatus from "../../../pages/admin/BmssyClaims/ClaimRemarkStatus";
import ClaimForBadge from "../claimList/ClaimForBadge";
import OffcanvasPdfViewer from "../../../components/OffcanvasPdfViewer";
import moment from "moment";

const PfClaimDetails = ({ id }) => {
    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();
    const [loading, setLoading] = useState(false);

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);

    const claimType = "pf";
    const { error, data, isFetching } = useQuery(["get-claim-details", id, claimType], () => fetcher(`/get-claim-details?id=${id}&claimType=${claimType}`), { enabled: id ? true : false });

    const { data: requiredDocCheck } = useQuery(["check-if-required-doc-not-uploaded-for-claim", id, claimType], () => fetcher(`/check-if-required-doc-not-uploaded-for-claim?id=${id}&claimType=${claimType}`), { enabled: id ? true : false });

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDoc(Humanize(e.currentTarget.getAttribute("attr_name")));
        setUrl(e.currentTarget.getAttribute("attr_url"));
    };

    const navigate = useNavigate();
    const uploadFormV = () => {
        if (requiredDocCheck?.status === false) toast.error(requiredDocCheck.message);
        else navigate(`/claim/form-V/${id}?type=Pf`);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setOpenConfirm(false);
        const doc = await downloadFile(`/download-form-v?id=${id}&type=Pf`, "form-v.pdf");
        if (doc === false) toast.error("Unable to download form-v");
        setLoading(false);
    };

    const generateFormV = async () => {
        if (requiredDocCheck?.status === false) {
            toast.error(requiredDocCheck.message);
        } else {
            setOpenConfirm(true);
        }
    };

    const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;
    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <>
                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header py-2">Basic Information</div>
                        <div className="card-body">
                            <div className="details_section">
                                <div>
                                    <b>Name : </b> {data?.claimData?.beneficiary_name}
                                </div>
                                <div>
                                    <b>SSIN : </b> {data?.claimData?.ssin_no}
                                </div>
                                <div>
                                    <b>Registration No : </b> {data?.claimData?.registration_no ? data?.claimData?.registration_no : "--"}
                                </div>
                                <div>
                                    <b>Registration Date : </b> {data?.claimData?.registration_date}
                                </div>
                                <div>
                                    <b>Worker Type : </b> {data?.claimData?.worker_type === "ow" ? "Other Worker" : data?.claimData?.worker_type === "cw" ? "Contraction Worker" : "Transport Worker"}
                                </div>
                                {data?.pfClaimBy === 1 && (
                                    <div>
                                        <b>Aadhaar No : </b> {data?.benDetails?.ben_aadhaar}
                                    </div>
                                )}
                                {data?.pfClaimBy === 2 && (
                                    <div>
                                        <b>Date of Death : </b> {moment(data?.nomDetails?.date_of_death).format("DD-MM-YYYY")}
                                    </div>
                                )}

                                <div>
                                    <b>Claim For : </b>
                                    <div className="claim_for_section">
                                        <ClaimForBadge claimFor="PF" benefitName={data?.claimData?.claim_for} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {data?.pfClaimBy === 1 && (
                        <div className="card datatable-box shadow mb-2">
                            <div className="card-header py-2">Bank Information</div>
                            <div className="card-body">
                                <div className="details_section">
                                    <div>
                                        <b>Name : </b> {data?.benDetails?.ben_bank_name}
                                    </div>
                                    <div>
                                        <b>IFSC : </b> {data?.benDetails?.ben_bank_ifsc}
                                    </div>
                                    <div>
                                        <b>Account No : </b> {data?.benDetails?.ben_bank_account}
                                    </div>
                                    <div>
                                        <b>Branch Name : </b> {data?.benDetails?.ben_bank_branch}
                                    </div>
                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.benDetails?.ben_bank_loc)}>
                                        <div className="add_dots">
                                            <b>Location : </b> {data?.benDetails?.ben_bank_loc}
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                    )}

                    {data?.pfClaimBy === 2 && (
                        <div className="card datatable-box shadow mb-2">
                            <div className="card-header py-2">Nominee/Legal Heir Details</div>
                            <div className="card-body">
                                <div className="details_section">
                                    <div>
                                        <b>Name : </b> {data?.nomDetails?.nominee_name}
                                    </div>
                                    <div>
                                        <b>Mobile : </b> {data?.nomDetails?.nominee_mobile}
                                    </div>
                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.nomDetails?.nominee_address)}>
                                        <div className="add_dots">
                                            <b>Address : </b> {data?.nomDetails?.nominee_address}
                                        </div>
                                    </OverlayTrigger>
                                    <div>
                                        <b>Relation : </b> {data?.nomDetails?.relationship}
                                    </div>
                                    <div>
                                        <b>Aadhar : </b> {data?.nomDetails?.nominee_aadhaar}
                                    </div>
                                    <div>
                                        <b>Share : </b> {data?.nomDetails?.claim_share}
                                    </div>
                                    <div>
                                        <b>Bank Name : </b> {data?.nomDetails?.nominee_bank_name}
                                    </div>
                                    <div>
                                        <b>Bank IFSC : </b> {data?.nomDetails?.nominee_bank_ifsc}
                                    </div>
                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(data?.nomDetails?.nominee_bank_branch)}>
                                        <div className="add_dots">
                                            <b>Bank Branch : </b> {data?.nomDetails?.nominee_bank_branch}
                                        </div>
                                    </OverlayTrigger>
                                    <div>
                                        <b>Bank A/C No. : </b> {data?.nomDetails?.nominee_bank_account}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header py-2">
                            <div className="row">
                                <div className="col-md-4">Documents Information</div>
                                {!requiredDocCheck?.status && (
                                    <div className="col-md-8">
                                        <div className="d-flex justify-content-md-end">
                                            <button className="btn btn-outline-warning btn-sm " onClick={() => navigate(`/claim/documents/${id}`)}>
                                                <i className="fa-solid fa-cloud-arrow-up"></i> Upload All Require Documents
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            {data?.docDetails.length > 0 ? (
                                <div className="doc_details_section">
                                    {data?.docDetails.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <Button onClick={handleShow} attr_name={item?.doc_name} attr_url={item?.file} size="sm" variant="light">
                                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip(Humanize(item?.doc_name))}>
                                                        <div className="add_dots">
                                                            <i className="fa-solid fa-file-pdf"></i> {Humanize(item?.doc_name)}
                                                        </div>
                                                    </OverlayTrigger>
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <NoDataFound />
                            )}
                        </div>
                        <OffcanvasPdfViewer show={show} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />
                    </div>

                    {data?.claimData?.submit_status === "0" && (
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        {loading === false ? (
                                            <button className="btn btn-success btn-sm" type="button" onClick={() => generateFormV()}>
                                                <i className="fa-regular fa-file-lines"></i> Generate Form V
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-success btn-sm">
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Generate Form V
                                            </button>
                                        )}
                                        <button className="btn btn-success btn-sm" type="button" onClick={() => uploadFormV()}>
                                            <i className="fa-solid fa-file-arrow-up"></i> Upload Form V and Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {data?.claimData?.submit_status != "0" && <ClaimRemarkStatus id={id} />}
                </>
            )}
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="After generation of Form - V you will not be able to edit your claim. Are you sure?" />}
        </>
    );
};

export default PfClaimDetails;
