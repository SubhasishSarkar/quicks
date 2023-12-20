import moment from "moment";
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";
import BankDetails from "../../../features/approvedBeneficiary/BankDetails";
import BasicDetails from "../../../features/approvedBeneficiary/BasicDetails";
import DependentDetails from "../../../features/approvedBeneficiary/DependentDetails";
import DocumentsDetails from "../../../features/approvedBeneficiary/DocumentsDetails";
import NomineeDetails from "../../../features/approvedBeneficiary/NomineeDetails";
import WorkerDetails from "../../../features/approvedBeneficiary/WorkerDetails";
import { fetcher } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import DocumentsDetailsForModal from "../../../features/approvedBeneficiary/DocumentsDetailsForModal";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import PendingApplicationSubmitByImw from "./PendingApplicationSubmitByImw";
import ApprovedBenAllRemarks from "../../../features/approvedBeneficiary/ApprovedBenAllRemarks";
import EmployerDetails from "../../../features/approvedBeneficiary/EmployerDetails";
import AadhaarCorrectionRejectButton from "./AadhaarCorrectionRejectButton";

const BeneficiaryViewDetails = ({ propsId, propsType }) => {
    const { id, type } = useParams();
    const location = useLocation();
    const [newId, setNewId] = useState(id);
    const [newType, setNewType] = useState(type);

    useEffect(() => {
        if (propsId && propsType) {
            setNewId(propsId);
            setNewType(propsType);
        }
    }, [propsId, propsType]);

    const { error, data, isFetching } = useQuery(["approved-beneficiary-details", newId, newType], () => fetcher(`/approved-beneficiary-details/${newId}?type=${newType}`), { enabled: newId ? true : false });
    const arrBasicData = data?.basicDetails.details;
    const arrRemarksData = data?.remark;

    const dispatch = useDispatch();
    useEffect(() => {
        if (propsId && propsType) dispatch(setPageAddress({ title: "Claim List", url: "/claim/list", subTitle: "Claim Details", subUrl: "" }));
        else if (location?.state?.fromAadhaarCorrection) {
            dispatch(setPageAddress({ title: "Aadhaar Correction", url: "/rectification/aadhar-correction-imw", subTitle: "Beneficiary Details", subUrl: "" }));
        } else dispatch(setPageAddress({ title: "BMSSY Approved Beneficiary List", url: "/beneficiary-approved-list/bmssy", subTitle: "Beneficiary Details", subUrl: "" }));
    }, [propsId, propsType, location]);

    const user = useSelector((state) => state.user.user);
    const cDate = moment().format("2017-03-31");

    const remarkCondition = () => {
        if (user?.role === "inspector") {
            return (
                data?.basicDetails?.details?.status?.trim() === "S" &&
                ((data?.basicDetails?.details?.registration_type?.trim() === "OLD" && data?.basicDetails?.details?.registration_date <= cDate) ||
                    (data?.basicDetails?.details?.registration_type?.trim() === "NEW" && data?.basicDetails?.details?.is_ndf == "1" && data?.basicDetails?.details?.registration_date <= cDate) ||
                    (data?.basicDetails?.details?.registration_type?.trim() === "NEW" && data?.basicDetails?.details?.is_ndf == "0"))
            );
        } else return false;
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {data && (
                <div className="row">
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col">
                                <div className="card-nav-tabs mb-2">
                                    <Tabs>
                                        <Tab eventKey="0" title="Basic Details">
                                            <BasicDetails arrData={data?.basicDetails} newType={newType} certifiedBy={arrBasicData?.certified_by} designation={arrBasicData?.designation} />
                                        </Tab>
                                        <Tab eventKey="1" title="Worker Details">
                                            <WorkerDetails arrData={data?.basicDetails} />
                                        </Tab>
                                        <Tab eventKey="2" title="Bank Details">
                                            <BankDetails arrData={data?.basicDetails} />
                                        </Tab>
                                        <Tab eventKey="3" title="BMSSY Nominee Details">
                                            <NomineeDetails arrData={data?.basicDetails} />
                                        </Tab>
                                        <Tab eventKey="4" title="Dependent Details">
                                            <DependentDetails arrData={data?.basicDetails} />
                                        </Tab>
                                        {["cw"].includes(data?.basicDetails?.workerDetails?.cat_worker_type) &&
                                            data?.basicDetails?.details?.registration_type === "NEW" &&
                                            data?.basicDetails?.details?.is_ndf === 0 &&
                                            moment("2011-01-01").isBefore(data?.basicDetails?.details?.created_date) && (
                                                <Tab eventKey="5" title="Addl. Info for BOCW">
                                                    <EmployerDetails data={data?.basicDetails} />
                                                </Tab>
                                            )}
                                        {["tw"].includes(data?.basicDetails?.workerDetails?.cat_worker_type) && (
                                            <Tab eventKey="5" title="Addl. Info for WBTWSSS">
                                                <EmployerDetails data={data?.basicDetails} />
                                            </Tab>
                                        )}
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
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
                    </div>
                    <div className="col-md-12">{remarkCondition() && <PendingApplicationSubmitByImw data={data} newId={newId} />}</div>
                    <div className="col-md-12">
                        {location?.state?.fromAadhaarCorrection && (
                            <div>
                                <div className="card mb-2">
                                    <div className="card-header">Action For Aadhar Rectification</div>
                                    <div className="card-body">
                                        <AadhaarCorrectionRejectButton application_id={location?.state?.id} aadhaar={data?.basicDetails?.details?.aadhar} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {data && <ApprovedBenAllRemarks newId={newId} newType={newType} arrRemarksData={arrRemarksData} />}
        </>
    );
};

export default BeneficiaryViewDetails;
