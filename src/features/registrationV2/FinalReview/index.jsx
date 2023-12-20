import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetcher, updater } from "../../../utils";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DependentInformation from "./DependentInformation";
import NomineeInformation from "./NomineeInformation";
import BankInformation from "./BankInformation";
import BasicInformation from "./BasicInformation";
import PresentAddressInformation from "./PresentAddressInformation";
import PermanentAddressInformation from "./PermanentAddressInformation";
import RegistrationContext from "../Context";
import AdditionalInformation from "./AdditionalInformation";

const FinalReview = ({ isActive }) => {
    const { isDirty } = useContext(RegistrationContext);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const {
        data,
        refetch,
        isLoading: isLoadingData,
        isFetching,
    } = useQuery(["caf-registration-preview", "final-submit", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=final-submit`), {
        enabled: application_id && isActive ? true : false,
    });

    const finalBtnFunc = (datax) => {
        const docLength = datax?.registration_type !== "NEW" && (datax?.is_ndf === 0 || datax?.is_ndf === null) ? 6 : 5;

        if (docLength === 6) {
            if (Object.keys(datax.documents).length < 5) return true;
            else if (Object.keys(datax.documents).length === 5 && Object.keys(datax).includes("Epic")) return true;
            return false;
        } else if (docLength === 5) {
            console.log(Object.keys(datax.documents).length < 4, datax.documents);
            if (Object.keys(datax.documents).length < 4) return true;
            else if (Object.keys(datax.documents).length === 4 && Object.keys(datax).includes("Epic")) return true;
            return false;
        }

        if (datax?.status) {
            if (datax.status != "0") return true;
            else if (datax.status == "0") return false;
        }
    };

    useEffect(() => {
        if (data && !isLoadingData && !isFetching) {
            const result = finalBtnFunc(data);
            setDisable(result);
        }
    }, [data, isLoadingData, isFetching]);

    useEffect(() => {
        if (isActive) refetch();
    }, [isActive]);

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const handleSubmit = () => {
        if (application_id) {
            mutate(
                {
                    url: "/caf-registration?type=final-submit&id=" + application_id,
                    body: { finalSubmit: data },
                },
                {
                    onSuccess(submitData, variables, context) {
                        toast.success(submitData.message);
                        navigate(`/caf/formupload/${application_id}`);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                    },
                }
            );
        }
    };

    const sectionRef = useRef(null);
    useEffect(() => {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }, [isActive]);

    console.log("ddddddd",data)

    return (
        <>
            {isFetching && <LoadingOverlay />}

            <BasicInformation data={data} />

            <BankInformation data={data} />

            <PermanentAddressInformation data={data} />

            <PresentAddressInformation data={data} />

            <BankInformation data={data} />

            <NomineeInformation data={data} />

            <DependentInformation data={data} />

            {["tw", "cw"].includes(data?.cat_worker_type) && data?.additionalDetails != '' &&<AdditionalInformation data={data?.additionalDetails} workerType={data?.cat_worker_type} />}

            <div className="d-grid d-md-flex justify-content-md-end" ref={sectionRef}>
                <button className="btn btn-success" type="submit" disabled={isLoading || isLoadingData || disable || isDirty} onClick={handleSubmit}>
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-coins"></i>} Final Submit
                </button>
            </div>
        </>
    );
};

export default FinalReview;
