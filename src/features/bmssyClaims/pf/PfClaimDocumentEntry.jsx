import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import PfClaimDocumentsUploadForBeneficiary from "./claim_by_beneficiary/PfClaimDocumentsUploadForBeneficiary";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import PfClaimDocumentsUploadForNominee from "./claim_by_nominee/PfClaimDocumentsUploadForNominee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PfClaimDocumentEntry = ({ id, claimBy, redirectFrom }) => {
    const claimType = "pf";
    const { data: preViewData, error, isFetching } = useQuery(["claim-documents-preview", id, claimType, claimBy], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimType}&claimBy=${claimBy}`));

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim Entry", url: "claim/entry", subTitle: "Claim Documents Uploads", subUrl: "" }));
    }, []);

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("claim-documents-preview");
    };

    const { mutate } = useMutation(() => fetcher(`/check-claim-doc-validation?id=${id}&claimType=pf&claimBy=${claimBy}`));
    const navigate = useNavigate();
    const goNextPage = (id) => {
        mutate(id, {
            onSuccess(data, variables, context) {
                navigate("/claim/details/" + data.id);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {preViewData && parseInt(claimBy) === 1 && (
                <>
                    <PfClaimDocumentsUploadForBeneficiary data={preViewData} id={id} afterSuccess={afterSuccess} afterDelete={afterDelete} goNextPage={goNextPage} redirectFrom={redirectFrom} />
                </>
            )}
            {preViewData && parseInt(claimBy) === 2 && (
                <>
                    <PfClaimDocumentsUploadForNominee data={preViewData} id={id} afterSuccess={afterSuccess} afterDelete={afterDelete} goNextPage={goNextPage} redirectFrom={redirectFrom} />
                </>
            )}
        </>
    );
};

export default PfClaimDocumentEntry;
