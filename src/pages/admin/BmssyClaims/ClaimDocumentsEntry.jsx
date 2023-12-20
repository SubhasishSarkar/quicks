import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useParams } from "react-router";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import DeathClaimDocuments from "../../../features/bmssyClaims/death/DeathClaimDocuments";
import DisabilityDocumentsEntry from "../../../features/bmssyClaims/disability/DisabilityDocumentsEntry";
import { fetcher } from "../../../utils";
import PfClaimDocumentEntry from "../../../features/bmssyClaims/pf/PfClaimDocumentEntry";

const ClaimDocumentsEntry = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["get-claim-type", id], () => fetcher(`/get-claim-type?id=${id}`), { enabled: id ? true : false });
    const { state } = useLocation();
    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {!isFetching && data?.claimFor === "death" && <DeathClaimDocuments id={id} redirectFrom={state?.from?.pathname} />}
            {!isFetching && data?.claimFor === "disability" && <DisabilityDocumentsEntry id={id} redirectFrom={state?.from?.pathname} />}
            {!isFetching && data?.claimFor === "pf" && <PfClaimDocumentEntry id={id} claimBy={data?.claimBy} redirectFrom={state?.from?.pathname} />}
        </>
    );
};

export default ClaimDocumentsEntry;
