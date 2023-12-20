import React from "react";
import ApprovedBenRemarks from "./ApprovedBenRemarks";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import ApprovedBenCRApplicationRemarks from "./ApprovedBenCRApplicationRemarks";
import AdminViewClaims from "../bmssyClaims/adminClaim/AdminViewClaims";
import AdminViewClaimLogs from "../bmssyClaims/adminClaim/AdminViewClaimLogs";

const ApprovedBenAllRemarks = ({ newId, newType, arrRemarksData }) => {
    return (
        <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <b>
                            <i className="fa-solid fa-bars-staggered"></i> Application Remarks
                        </b>
                    </Accordion.Header>
                    <Accordion.Body>
                        {newType === "bmssy" ? (
                            <ApprovedBenRemarks arrRemarksData={arrRemarksData} />
                        ) : (
                            <div style={{ display: "flex", justifyContent: "center", color: "#ee2727bd" }}>
                                <i className="fa-solid fa-circle-exclamation" style={{ margin: "3px" }}></i> No remarks details found for ssy data
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <b>
                            <i className="fa-solid fa-bars-staggered"></i> Changed Request Remarks
                        </b>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ApprovedBenCRApplicationRemarks applicationId={newId} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <b>
                            <i className="fa-solid fa-bars-staggered"></i> Claim Details and Logs
                        </b>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="card-nav-tabs">
                            <Tabs>
                                <Tab eventKey="0" title="Claim Details">
                                    <AdminViewClaims applicationId={newId} />
                                </Tab>
                                <Tab eventKey="1" title="Claim Logs">
                                    <AdminViewClaimLogs applicationId={newId} />
                                </Tab>
                            </Tabs>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
};

export default ApprovedBenAllRemarks;
