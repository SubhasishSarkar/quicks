import React from "react";
import BeneficiaryViewDetails from "../../pages/admin/ApprovedBeneficiary/BeneficiaryViewDetails";
import AdditionalDetailsForm from "../registrationV2/components/AdditionalDetails/AdditionalDetailsForm";

const ReverseCaf = ({ applicationId, type, workerType }) => {
    const handleEmpSubmit = () => {};
    return (
        <>
            <BeneficiaryViewDetails propsId={applicationId} propsType={type} />
            <AdditionalDetailsForm workerType={workerType} handleEmpSubmit={handleEmpSubmit} application_id={applicationId} />
        </>
    );
};

export default ReverseCaf;
