import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import PfCafSubmittedList from "../../pf/CAF/SLO/List/PfCafSubmittedList";
import PfCafApprovedList from "../../pf/CAF/SLO/List/PfCafApprovedList";
import PfCafBackForCorrectionList from "../../pf/CAF/SLO/List/PfCafBackForCorrectionList";
import PfCafRejectedList from "../../pf/CAF/SLO/List/PfCafRejectedList";
import PfCafIncompleteList from "../../pf/CAF/SLO/List/PfCafIncompleteList";

const CAFSubmittedDuringClaim = () => {
    const setSearchParams = useSearchParams()[1];
    const clearSearchParams = (e) => {
        setSearchParams(`type=CAF Submitted During Claim&caf-type=` + e);
    };
    const queryParameters = new URLSearchParams(window.location.search);
    const cafType = queryParameters.get("caf-type");
    return (
        <>
            <div className="card border-0">
                <div className="row">
                    <div className="col-md-12">
                        <Tabs
                            defaultActiveKey={cafType ? cafType : "Caf Incomplete"}
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                        >
                            <Tab eventKey="Caf Incomplete" title="Incomplete">
                                <PfCafIncompleteList />
                            </Tab>
                            <Tab eventKey="Caf Submitted" title="Submitted">
                                <PfCafSubmittedList />
                            </Tab>
                            <Tab eventKey="Caf Approved" title="Approved">
                                <PfCafApprovedList />
                            </Tab>
                            <Tab eventKey="Caf Back For Correction" title="Back For Correction">
                                <PfCafBackForCorrectionList />
                            </Tab>
                            <Tab eventKey="Caf Rejected" title="Rejected">
                                <PfCafRejectedList />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CAFSubmittedDuringClaim;
