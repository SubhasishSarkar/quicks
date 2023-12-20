import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import DeathClaimEdit from "../../../features/bmssyClaims/death/DeathClaimEdit";
import DisabilityClaimEdit from "../../../features/bmssyClaims/disability/DisabilityClaimEdit";
import { fetcher } from "../../../utils";
import PfClaimEdit from "../../../features/bmssyClaims/pf/PfClaimEdit";

const ClaimEdit = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["get-claim-type", id], () => fetcher(`/get-claim-type?id=${id}`), { enabled: id ? true : false });

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data?.claimFor === "death" && <DeathClaimEdit id={id} />}
            {data?.claimFor === "disability" && <DisabilityClaimEdit id={id} />}
            {data?.claimFor === "pf" && <PfClaimEdit id={id} claimBy={data?.claimBy} />}
        </>
    );
};

export default ClaimEdit;
