import React from "react";
import { useParams } from "react-router";
import BMSSYApprovedList from "../../../features/approvedBeneficiary/BMSSYApprovedList";
import SSYApprovedList from "../../../features/approvedBeneficiary/SSYApprovedList";

const ApprovedBeneficiaryList = () => {
    const { type } = useParams();
    return (
        <>
            {type === "bmssy" && <BMSSYApprovedList />}
            {type === "ssy" && <SSYApprovedList />}
        </>
    );
};

export default ApprovedBeneficiaryList;
