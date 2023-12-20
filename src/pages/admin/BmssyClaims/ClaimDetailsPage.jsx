import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import ErrorAlert from "../../../components/list/ErrorAlert";
import AlcDeathClaimDetails from "../../../features/bmssyClaims/death/AlcDeathClaimDetails";
import DeathClaimDetails from "../../../features/bmssyClaims/death/DeathClaimDetails";
import ImwDeathClaimDetails from "../../../features/bmssyClaims/death/ImwDeathClaimDetails";
import AlcDisabilityClaimDetails from "../../../features/bmssyClaims/disability/AlcDisabilityClaimDetails";
import DisabilityClaimDetails from "../../../features/bmssyClaims/disability/DisabilityClaimDetails";
import ImwDisabilityClaimDetails from "../../../features/bmssyClaims/disability/ImwDisabilityClaimDetails";
import { fetcher } from "../../../utils";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import AlcPfClaimDetails from "../../../features/bmssyClaims/pf/AlcPfClaimDetails";
import PfClaimDetails from "../../../features/bmssyClaims/pf/PfClaimDetails";
import ImwPfClaimDetails from "../../../features/bmssyClaims/pf/ImwPfClaimDetails";

const ClaimDetailsPage = ({ funClaimViewAlcId }) => {
    const [id, setId] = useState();
    const user = useSelector((state) => state.user?.user);
    const getParams = useParams();
    const orgId = getParams.id;

    useEffect(() => {
        if (funClaimViewAlcId && !orgId) setId(funClaimViewAlcId);
        else setId(orgId);
    }, [funClaimViewAlcId]);

    const { error, data } = useQuery(["get-claim-type", id], () => fetcher(`/get-claim-type?id=${id}`), { enabled: id ? true : false });

    const dispatch = useDispatch();
    useEffect(() => {
        if (funClaimViewAlcId) {
            dispatch(setPageAddress({ title: "Fund Request List", url: "" }));
        } else {
            dispatch(setPageAddress({ title: "Claim List", url: "/claim/list", subTitle: "Claim Details", subUrl: "" }));
        }
    }, []);

    return (
        <>
            {error && <ErrorAlert error={error} />}

            {data?.claimFor === "death" && ["SLO", "collectingagent", "otherserviceprovider"].includes(user.role) && <DeathClaimDetails id={id} />}
            {/* {data?.claimFor === "death" && user.role === "collectingagent" && <DeathClaimDetails id={id} />} */}
            {data?.claimFor === "death" && user.role === "inspector" && <ImwDeathClaimDetails id={id} />}
            {data?.claimFor === "death" && ["ALC", "DLC", "ceo_cw", "ceo_ow", "ceo_tw"].includes(user.role) && <AlcDeathClaimDetails id={id} funClaimViewAlcId={funClaimViewAlcId} />}

            {data?.claimFor === "disability" && ["SLO", "collectingagent", "otherserviceprovider"].includes(user.role) && <DisabilityClaimDetails id={id} />}
            {data?.claimFor === "disability" && user.role === "inspector" && <ImwDisabilityClaimDetails id={id} />}
            {data?.claimFor === "disability" && ["ALC", "DLC", "ceo_cw", "ceo_ow", "ceo_tw"].includes(user.role) && <AlcDisabilityClaimDetails id={id} funClaimViewAlcId={funClaimViewAlcId} />}

            {data?.claimFor === "pf" && ["SLO", "collectingagent", "otherserviceprovider"].includes(user.role) && <PfClaimDetails id={id} />}
            {data?.claimFor === "pf" && user.role === "inspector" && <ImwPfClaimDetails id={id} />}
            {data?.claimFor === "pf" && ["ALC", "DLC", "ceo_cw", "ceo_ow", "ceo_tw"].includes(user.role) && <AlcPfClaimDetails id={id} funClaimViewAlcId={funClaimViewAlcId} />}
        </>
    );
};

export default ClaimDetailsPage;
