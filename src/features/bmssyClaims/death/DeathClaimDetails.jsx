import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ClaimRemarkStatus from "../../../pages/admin/BmssyClaims/ClaimRemarkStatus";
import { Humanize, downloadFile, fetcher } from "../../../utils";
import NoDataFound from "../../../components/list/NoDataFound";
import ClaimForBadge from "../claimList/ClaimForBadge";
import OffcanvasPdfViewer from "../../../components/OffcanvasPdfViewer";
import ConfirmationModal from "../../../components/ConfirmationModal";

const DeathClaimDetails = ({ id }) => {
    const claimType = "death";
    const { error, data, isFetching } = useQuery(["get-claim-details", id, claimType], () => fetcher(`/get-claim-details?id=${id}&claimType=${claimType}`), { enabled: id ? true : false });

    const { data: requiredDocCheck } = useQuery(["check-if-required-doc-not-uploaded-for-claim", id, claimType], () => fetcher(`/check-if-required-doc-not-uploaded-for-claim?id=${id}&claimType=${claimType}`), { enabled: id ? true : false });

    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDoc(Humanize(e.currentTarget.getAttribute("attr_name")));
        setUrl(e.currentTarget.getAttribute("attr_url"));
    };

    const navigate = useNavigate();
    const uploadFormV = () => {
        if (requiredDocCheck?.status === false) toast.error(requiredDocCheck.message);
        else navigate(`/claim/form-V/${id}?type=Death`);
    };

    const [loading, setLoading] = useState(false);
    const generateFormV = async () => {
        if (requiredDocCheck?.status === false) {
            toast.error(requiredDocCheck.message);
        } else {
            setOpenConfirm(true);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        setOpenConfirm(false);
        const doc = await downloadFile(`/download-form-v?id=${id}&type=Death`, "form-v.pdf");
        if (doc === false) toast.error(doc.message);
        setLoading(false);
    };

    const renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

    return (
        <>
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="After generation of Form - V you will not be able to edit your claim. Are you sure?" />}
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div>
                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Basic Information</div>
                        <div className="card-body">
                            <div className="details_section">
                                <div>
                                    <b>Name : </b> {data?.benDetails?.beneficiary_name}
                                </div>
                                <div>
                                    <b>SSIN : </b> {data?.benDetails?.ssin_no}
                                </div>
                                <div>
                                    <b>Registration No : </b> {data?.benDetails?.registration_no}
                                </div>
                                <div>
                                    <b>Registration Date : </b> {data?.benDetails?.registration_date}
                                </div>

                                <div>
                                    <b>Claim For : </b>
                                    <div className="claim_for_section">
                                        <ClaimForBadge claimFor="DEATH" benefitName={parseInt(data?.nomineeDetails?.nature_of_death) === 3 ? "Natural Death" : "Accidental Death"} />
                                    </div>
                                </div>
                                <div>
                                    <b>Date Of Death : </b> {data?.nomineeDetails?.date_of_death}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header ">Nominee Information</div>
                        <div className="card-body">
                            <div className="details_section">
                                <div>
                                    <b>Name : </b> {data?.nomineeDetails?.nominee_name}
                                </div>
                                <div>
                                    <b>Mobile : </b> {data?.nomineeDetails?.nominee_mobile}
                                </div>
                                <div>
                                    <b>Aadhaar : </b> {data?.nomineeDetails?.nominee_aadhaar}
                                </div>
                                <div>
                                    <b>Address : </b> {data?.nomineeDetails?.nominee_address}
                                </div>
                                <div>
                                    <b>Share : </b> {data?.nomineeDetails?.claim_share}
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

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header">Documents Information</div>
                        <div className="card-body">
                            {data?.docDetails?.length > 0 ? (
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
                                <>
                                    <NoDataFound />
                                </>
                            )}
                        </div>
                        <OffcanvasPdfViewer show={show} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />
                    </div>

                    {data?.benDetails?.submit_status === "0" && (
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        {requiredDocCheck?.status === false && (
                                            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/claim/documents/${id}`)}>
                                                <i className="fa-solid fa-file-arrow-up"></i> Upload all require Documents
                                            </button>
                                        )}
                                        {loading === false ? (
                                            <button className="btn btn-success btn-sm" type="button" onClick={() => generateFormV()}>
                                                <i className="fa-regular fa-file-lines"></i> Generate Form V
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-success btn-sm" disabled={loading}>
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Generate Form V
                                            </button>
                                        )}
                                        <button className="btn btn-success btn-sm" type="button" onClick={() => uploadFormV()}>
                                            <i className="fa-solid fa-file-arrow-up"></i> Upload Form V
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {data?.benDetails?.submit_status != "0" && <ClaimRemarkStatus id={id} />}
                </div>
            )}
        </>
    );
};

export default DeathClaimDetails;
