import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ImwPfCafPendingList from "../../pf/CAF/IMW/ImwPfCafPendingList";
import ImwPfCafRectificationList from "../../pf/CAF/IMW/ImwPfCafRectificationList";
import ImwPfCafRejectList from "../../pf/CAF/IMW/ImwPfCafRejectList";
import ImwPfCafApprovedList from "../../pf/CAF/IMW/ImwPfCafApprovedList";

const ImwCAFSubmittedDuringClaim = () => {
    const setSearchParams = useSearchParams()[1];
    const clearSearchParams = (e) => {
        setSearchParams(`type=CAF Submitted During Claim&caf-type=` + e);
    };
    const queryParameters = new URLSearchParams(window.location.search);
    const cafType = queryParameters.get("caf-type");

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Tabs
                        defaultActiveKey={cafType ? cafType : "Caf Pending"}
                        onSelect={(e) => {
                            clearSearchParams(e);
                        }}
                    >
                        <Tab eventKey="Caf Pending" title="Pending">
                            <ImwPfCafPendingList />
                        </Tab>
                        <Tab eventKey="Caf Approved" title="Approved">
                            <ImwPfCafApprovedList />
                        </Tab>
                        <Tab eventKey="Caf Back For Correction" title="Back For Correction">
                            <ImwPfCafRectificationList />
                        </Tab>
                        <Tab eventKey="Caf Rejected" title="Rejected">
                            <ImwPfCafRejectList />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default ImwCAFSubmittedDuringClaim;
