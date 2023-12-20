import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import AlcApprovedList from "../../../features/bmssyClaims/claimList/ALC/AlcApprovedList";
import AlcBackForRectification from "../../../features/bmssyClaims/claimList/ALC/AlcBackForRectification";
import AlcPendingList from "../../../features/bmssyClaims/claimList/ALC/AlcPendingList";
import AlcRejectList from "../../../features/bmssyClaims/claimList/ALC/AlcRejectList";
import AlcRejectRecommended from "../../../features/bmssyClaims/claimList/ALC/AlcRejectRecommended";
import ImwClaimPending from "../../../features/bmssyClaims/claimList/IMW/ImwClaimPending";
import ImwForwardedToALC from "../../../features/bmssyClaims/claimList/IMW/ImwForwardedToALC";
import ImwSentBackFromALC from "../../../features/bmssyClaims/claimList/IMW/ImwSentBackFromALC";
import ImwSentBackToSLO from "../../../features/bmssyClaims/claimList/IMW/ImwSentBackToSLO";
import BackForCorrection from "../../../features/bmssyClaims/claimList/SLO/BackForCorrection";
import Incomplete from "../../../features/bmssyClaims/claimList/SLO/Incomplete";
import Rejected from "../../../features/bmssyClaims/claimList/SLO/Rejected";
import Submitted from "../../../features/bmssyClaims/claimList/SLO/Submitted";
import CAFSubmittedDuringClaim from "../../../features/bmssyClaims/claimList/SLO/CAFSubmittedDuringClaim";
import ImwCAFSubmittedDuringClaim from "../../../features/bmssyClaims/claimList/IMW/ImwCAFSubmittedDuringClaim";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { downloadFile } from "../../../utils";
import { toast } from "react-toastify";
import DlcPendingList from "../../../features/bmssyClaims/claimList/DLC/DlcPendingList";
import DlcForwardList from "../../../features/bmssyClaims/claimList/DLC/DlcForwardList";
import CeoClaimPendingList from "../../../features/bmssyClaims/claimList/CEO/OwCeoClaimPendingList";
import CeoMemoList from "../../../features/bmssyClaims/claimList/CEO/CeoMemoList";
import CfacoClaimPendingList from "../../../features/bmssyClaims/claimList/CFCO/CfacoClaimPendingList";
import ClaimReleaseList from "../../../features/bmssyClaims/claimList/CEO/ClaimReleaseList";

const ClaimList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim List", url: "" }));
    }, []);
    const [loading, setLoading] = useState();

    const user = useSelector((state) => state.user?.user);
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const clearSearchParams = (e) => {
        // if (e === "Approved") setSearchParams();
        // else
        setSearchParams("type=" + e);
    };

    const queryParameters = new URLSearchParams(window.location.search);
    const type = queryParameters.get("type");

    const downloadBenefitReport = async (type) => {
        // console.log(type);
        setLoading(type);
        const file = await downloadFile("/download-claim-benefit-report?type=" + type, type + "_benefit.xlsx");
        if (file.status === false) toast.error(file.message.message);
        setLoading();
    };

    return (
        <>
            <div className="card-nav-tabs">
                {(["SLO", "collectingagent", "otherserviceprovider"].includes(user.role) || user.role === "collectingagent") && (
                    <>
                        <div className="slo_new_claim_btn">
                            <button className="btn btn-primary" type="button" title="Click here for add new claim">
                                <Link to="/claim/entry" style={{ color: "#fff", textDecoration: "none" }}>
                                    <i className="fa-solid fa-circle-plus"></i> Add New Claim
                                </Link>
                            </button>
                        </div>

                        <Tabs
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                            defaultActiveKey={type ? type : "Incomplete"}
                            className="alc_claim_tabs"
                        >
                            <Tab eventKey="Incomplete" title="Incomplete">
                                <Incomplete />
                            </Tab>
                            <Tab eventKey="Back For Correction" title="Back For Correction">
                                <BackForCorrection />
                            </Tab>
                            <Tab eventKey="Reject" title="Reject">
                                <Rejected />
                            </Tab>
                            <Tab eventKey="Submitted" title="Submitted">
                                <Submitted />
                            </Tab>
                            <Tab eventKey="CAF Submitted During Claim" title="CAF Submitted During Claim">
                                <CAFSubmittedDuringClaim />
                            </Tab>
                        </Tabs>
                    </>
                )}
                {user.role === "inspector" && (
                    <>
                        <div className="d-grid d-md-flex alc_dwn_ben_report">
                            <div className="dropdown">
                                <button className="btn btn-primary dropdown-toggle" type="button" aria-expanded="false">
                                    Download Benefit Report
                                </button>
                                <ul className="dropdown-menu  alc_dwn_ben_report_dropdown">
                                    <li>
                                        <span className="dropdown-item" onClick={() => downloadBenefitReport("Death")}>
                                            {loading === "Death" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} <b>Death</b>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="dropdown-item" onClick={() => downloadBenefitReport("Disability")}>
                                            {loading === "Disability" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} <b>Disability</b>
                                        </span>
                                    </li>

                                    <li>
                                        <span className="dropdown-item" onClick={() => downloadBenefitReport("PF")}>
                                            {loading === "PF" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} <b>PF</b>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Tabs
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                            defaultActiveKey={type ? type : "Pending"}
                            className="alc_claim_tabs"
                        >
                            <Tab eventKey="Pending" title="Pending">
                                <ImwClaimPending />
                            </Tab>
                            <Tab eventKey="Sent Back To SLO" title="Sent Back To SLO">
                                <ImwSentBackToSLO />
                            </Tab>
                            <Tab eventKey="Sent Back From ALC" title="Sent Back From ALC">
                                <ImwSentBackFromALC />
                            </Tab>
                            <Tab eventKey="Forwarded To ALC" title="Forwarded To ALC">
                                <ImwForwardedToALC />
                            </Tab>
                            <Tab eventKey="CAF Submitted During Claim" title="CAF Submitted During Claim">
                                <ImwCAFSubmittedDuringClaim />
                            </Tab>
                        </Tabs>
                    </>
                )}
                {user.role === "ALC" && (
                    <>
                        <div className="d-grid d-md-flex alc_dwn_ben_report">
                            <div className="dropdown">
                                <button className="btn btn-primary dropdown-toggle" type="button" aria-expanded="false">
                                    Download Benefit Report
                                </button>
                                <ul className="dropdown-menu  alc_dwn_ben_report_dropdown">
                                    <li>
                                        <span className="dropdown-item" onClick={() => downloadBenefitReport("Death")}>
                                            {loading === "Death" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} <b>Death</b>
                                        </span>
                                    </li>
                                    <li>
                                        <span className="dropdown-item" onClick={() => downloadBenefitReport("Disability")}>
                                            {loading === "Disability" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} <b>Disability</b>
                                        </span>
                                    </li>

                                    <li>
                                        <span className="dropdown-item" onClick={() => downloadBenefitReport("PF")}>
                                            {loading === "PF" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} <b>PF</b>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Tabs
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                            defaultActiveKey={type ? type : "Pending"}
                            className="alc_claim_tabs"
                        >
                            <Tab eventKey="Pending" title="Pending">
                                <AlcPendingList />
                            </Tab>
                            <Tab eventKey="Approved" title="Approved">
                                <AlcApprovedList />
                            </Tab>
                            <Tab eventKey="Recommended to Rejection" title="Recommended to Rejection">
                                <AlcRejectRecommended />
                            </Tab>
                            <Tab eventKey="Back For Rectification" title="Back For Rectification">
                                <AlcBackForRectification />
                            </Tab>
                            <Tab eventKey="Rejected" title="Rejected">
                                <AlcRejectList />
                            </Tab>
                        </Tabs>
                    </>
                )}

                {user.role === "DLC" && (
                    <>
                        <Tabs
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                            defaultActiveKey={type ? type : "Pending"}
                        >
                            <Tab eventKey="Pending" title="Pending">
                                <DlcPendingList />
                            </Tab>
                            <Tab eventKey="Forwarded" title="Forwarded To CEO">
                                <DlcForwardList />
                            </Tab>
                        </Tabs>
                    </>
                )}

                {(user.role === "ceo_cw" || user.role === "ceo_tw" || user.role === "ceo_ow") && (
                    <>
                        <Tabs
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                            defaultActiveKey={type ? type : "Pending"}
                        >
                            <Tab eventKey="Pending" title="Pending">
                                <CeoClaimPendingList />
                            </Tab>
                            <Tab eventKey="fundReleaseList" title="Forwarded Release List">
                                <ClaimReleaseList />
                            </Tab>
                            <Tab eventKey="fundGenerateMemoList" title="Forwarded Generate Memo List">
                                <CeoMemoList />
                            </Tab>
                        </Tabs>
                    </>
                )}

                {(user.role === "cfco_cw" || user.role === "cfco_ow" || user.role === "cfco_tw") && (
                    <>
                        <Tabs
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                            defaultActiveKey={type ? type : "Pending"}
                        >
                            <Tab eventKey="Pending" title="Pending">
                                <CfacoClaimPendingList />
                            </Tab>
                        </Tabs>
                    </>
                )}
            </div>
        </>
    );
};

export default ClaimList;
