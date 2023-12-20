import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import BasicInformationNdfForm from "./BasicInformationNdfForm";
import AddressDetailsNdfForm from "./AddressDetailsNdfForm";
import BankDetailsNdfForm from "./BankDetailsNdfForm";
import NomineeDetailsNdfForm from "./NomineeDetailsNdfForm";
import DependentDetailsNdfForm from "./DependentDetailsNdfForm";
import DocumentDetailsNdfForm from "./DocumentDetailsNdfForm";
import FinalNdfReview from "./FinalNdfReview";

const RegistrationForm = ({ data }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const { isLoading,isFetching, data: counter } = useQuery(["caf-registration-steps", application_id], () => fetcher(`/caf-registration-steps?id=${application_id}`), {
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retryOnMount: false,
        enabled: application_id ? true : false,
    });
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!isFetching && !isLoading && counter != 0) {
            setActive(counter);
        }
    }, [isFetching, isLoading, counter]);

    const nextStep = (step) => {
        query.setQueriesData(["caf-registration-steps", application_id], () => step);
        setActive(step);
    };

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <>
            {isFetching ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Tabs
                        defaultActiveKey="0"
                        activeKey={active}
                        onSelect={(k) => {
                            setActive(k);
                        }}
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="0" title="Basic Information" disabled={counter >= 0 ? false : true}>
                            <BasicInformationNdfForm workerTypeData={data} nextStep={nextStep} prevStep={prevStep} />
                        </Tab>
                        <Tab eventKey="1" title="Address Details" disabled={counter >= 1 ? false : true}>
                            <AddressDetailsNdfForm nextStep={nextStep} prevStep={prevStep} />
                        </Tab>
                        <Tab eventKey="2" title="Bank Details" disabled={counter >= 2 ? false : true}>
                            <BankDetailsNdfForm nextStep={nextStep} prevStep={prevStep} />
                        </Tab>
                        <Tab eventKey="3" title="Nominee Details" disabled={counter >= 3 ? false : true}>
                            <NomineeDetailsNdfForm nextStep={nextStep} prevStep={prevStep} />
                        </Tab>
                        <Tab eventKey="4" title="Dependent Details" disabled={counter >= 4 ? false : true}>
                            <DependentDetailsNdfForm nextStep={nextStep} prevStep={prevStep} />
                        </Tab>
                        <Tab eventKey="5" title="Document Details" disabled={counter >= 5 ? false : true}>
                            <DocumentDetailsNdfForm nextStep={nextStep} prevStep={prevStep} />
                        </Tab>
                        <Tab eventKey="6" title="Final Review" disabled={counter >= 6 ? false : true}>
                            <FinalNdfReview />
                        </Tab>
                    </Tabs>
                </>
            )}
        </>
    );
};

export default RegistrationForm;
