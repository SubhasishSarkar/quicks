import React from "react";

const config = {
    A: {
        name: "Approved",
        style: "badge rounded-pill text-bg-success",
    },
    S: {
        name: "Pending",
        style: "badge rounded-pill text-bg-warning",
    },
    Pending: {
        name: "CAF Not Updated",
        style: "badge rounded-pill text-bg-warning",
    },
    B: {
        name: "Back For Correction",
        style: "badge rounded-pill text-bg-danger",
    },
    R: {
        name: "Rejected",
        style: "badge rounded-pill text-bg-danger",
    },
    0: {
        name: "Incomplete",
        style: "badge rounded-pill text-bg-danger",
    },
    "-1": {
        name: "Incomplete",
        style: "badge rounded-pill text-bg-danger",
    },
    OA: {
        name: "Other Person",
        style: "badge rounded-pill text-bg-warning",
    },
    DA: {
        name: "Duplicate Aadhar",
        style: "badge rounded-pill text-bg-warning",
    },
    TS: {
        name: "Deactivated Tagged SSIN",
        style: "badge rounded-pill text-bg-warning",
    },
    SA: {
        name: "Same Person",
        style: "badge rounded-pill text-bg-warning",
    },
    NA: {
        name: "Duplicate",
        style: "badge rounded-pill text-bg-warning",
    },
    SSDA: {
        name: "Same Person Different Aadhar",
        style: "badge rounded-pill text-bg-warning",
    },
    NA_DA: {
        name: "Same SSIN Same Aadhar",
        style: "badge rounded-pill text-bg-warning",
    },
};
export const SearchBeneficiaryStatus = ({ status }) => {
    return (
        <>
            <span className={config[status]?.style ?? ""}>{config[status]?.name ?? ""}</span>
        </>
    );
};
