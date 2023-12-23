import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import BasicDetails from "./BasicDetails";

function SuperAdminViewDeatils({ data }) {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="row">
                    <div className="col">
                        <div className="card-nav-tabs mb-2">
                            <Tabs>
                                <Tab eventKey="0" title="Basic Details">
                                    <BasicDetails data={data} />
                                </Tab>
                                <Tab eventKey="1" title="Approved Super Admin">
                                    {/* <WorkerDetails arrData={data?.basicDetails} /> */}
                                </Tab>
                                <Tab eventKey="2" title="Approved Admin">
                                    {/* <BankDetails arrData={data?.basicDetails} /> */}
                                </Tab>
                                <Tab eventKey="3" title="Approved Franchise">
                                    {/* <NomineeDetails arrData={data?.basicDetails} /> */}
                                </Tab>
                                <Tab eventKey="4" title="Approve Multicity">
                                    {/* <DependentDetails arrData={data?.basicDetails} /> */}
                                </Tab>
                                <Tab eventKey="5" title="Approve Firms">
                                    {/* <DependentDetails arrData={data?.basicDetails} /> */}
                                </Tab>
                                <Tab eventKey="6" title="History">
                                    {/* <DependentDetails arrData={data?.basicDetails} /> */}
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-md-2">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card-nav-tabs mb-2">
                                    <Tabs>
                                        <Tab eventKey="6" title="Document Details">
                                            {!propsId && !propsType && <DocumentsDetails arrData={data?.basicDetails} />}
                                            {propsId && propsType && <DocumentsDetailsForModal arrData={data?.basicDetails} />}
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div> */}
            {/* <div className="col-md-12">{remarkCondition() && <PendingApplicationSubmitByImw data={data} newId={newId} />}</div> */}
        </div>
    );
}

export default SuperAdminViewDeatils;
