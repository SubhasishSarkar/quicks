import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetcher, updater } from "../../utils";
import { disableQuery } from "../../data";
import { toast } from "react-toastify";
import BasicInformation from "../registrationV2/FinalReview/BasicInformation";
import PermanentAddressInformation from "../registrationV2/FinalReview/PermanentAddressInformation";
import ErrorAlert from "../../components/list/ErrorAlert";
import LoadingOverlay from "../../components/LoadingOverlay";



const FinalNomineeReview = ({ nextStep, prevStep, isActive }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const { data, refetch,error,isLoading:loader } = useQuery(["caf-registration-preview", "final-submit", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=final-submit`), {
        ...disableQuery,
        enabled: application_id ? true : false,
    });


    useEffect(() => {
        if (isActive) refetch();
    }, [isActive]);

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));



    console.log("------------",data);

    const handleSubmit = () => {
        if (application_id) {
            mutate(
                {
                    url: "/caf-registration?type=final-submit&id=" + application_id,
                    body: { finalSubmit: data },
                },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        navigate(`/caf/form1upload/${application_id}`);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                    },
                }
            );
        }
    };


        return (
            <> 
                {loader&& <LoadingOverlay/>}
                
                {error && <ErrorAlert error={error}/>}
                <BasicInformation data={data}/>
                <PermanentAddressInformation data={data}/>
                
                {data?.status === "0" && (
                    <button type="submit" className="btn btn-success btn-sm" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? "Loading..." : "Final Submit"}
                    </button>
                )}
            </>
        );
};

export default FinalNomineeReview;
