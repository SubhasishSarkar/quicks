import React, { useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import RegistrationContext from "../Context";
import AdditionalDetailsForm from "../components/AdditionalDetails/AdditionalDetailsForm";

function AdditionalDetails({ nextStep, prevStep, setActive }) {
    const { basicDetails } = useContext(RegistrationContext);
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const query = useQueryClient();
    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "additional-details", application_id], {
                exact: true,
            });
        };
    }, [application_id, query]);
    const handleEmpSubmit = () => {
        nextStep(6);
    };
    return (
        <>
            <AdditionalDetailsForm workerType={basicDetails?.cat_worker_type} handleEmpSubmit={handleEmpSubmit} application_id={application_id} />
        </>
    );
}

export default AdditionalDetails;
