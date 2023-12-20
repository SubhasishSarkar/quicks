import React from "react";
import EmployerInformation from "./EmployerInformation";
import CertificationInformation from "./CertificationInformation";
import NomineeInformation from "./NomineeInformation";
import PaymentInformation from "./PaymentInformation";
import OtherInformation from "./OtherInformation";

const AdditionalInformation = ({ data, workerType }) => {
    console.log("daaa", data);
    return (
        <>
            {workerType === "cw" && <EmployerInformation data={data} />}
            {workerType === "tw" && <OtherInformation data={data} />}
            <NomineeInformation data={data} />
            <CertificationInformation data={data} />
            <PaymentInformation data={data} />
        </>
    );
};

export default AdditionalInformation;
