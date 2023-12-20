import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import PfClaimEditByBeneficiary from "./claim_by_beneficiary/PfClaimEditByBeneficiary";
import PfClaimEditByNominee from "./claim_by_nominee/PfClaimEditByNominee";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";

const PfClaimEdit = ({ id, claimBy }) => {
    const claimType = "pf";
    const { error, data, isFetching } = useQuery(["get-data-for-claim-edit", id, claimType], () => fetcher(`/get-data-for-claim-edit?id=${id}&claimType=${claimType}&claimBy=${claimBy}`), { enabled: id ? true : false });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim List", url: "claim/list", subTitle: "PF Claim Edit", subUrl: "" }));
    }, []);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data?.claim_by === 1 && <PfClaimEditByBeneficiary data={data} />}
            {data?.claim_by === 2 && <PfClaimEditByNominee data={data} />}
        </>
    );
};

export default PfClaimEdit;
