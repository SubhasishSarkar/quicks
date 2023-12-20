import React from "react";
import PfClaimEntryByNominee from "./claim_by_nominee/PfClaimEntryByNominee";
import PfClaimEntryByBeneficiary from "./claim_by_beneficiary/PfClaimEntryByBeneficiary";

const PfClaimEntry = ({ data }) => {
    return (
        <>
            {data?.pfClaimBy === "pf_by_ben" && <PfClaimEntryByBeneficiary data={data} />}
            {data?.pfClaimBy === "pf_by_nom" && <PfClaimEntryByNominee data={data} />}
        </>
    );
};

export default PfClaimEntry;
