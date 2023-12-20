import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import BasicNomineeInformation from "./BasicNomineeInformation";
import AddressNomineeDetailsForm from "./AddressNomineeDetailsForm";
import DocumentNomineeDetails from "./DocumentNomineeDetails";
import FinalNomineeReview from "./FinalNomineeReview";
import LoadingSpinner from "../../components/list/LoadingSpinner";

const CAFNomineeRegistrationForm = ({ data }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const [active, setActive] = useState(0);
    const {
        data: counter,
        isLoading,
        isFetching,
    } = useQuery(["caf-registration-steps", application_id], () => fetcher(`/caf-registration-steps?id=${application_id}`), {
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
    const nextStep = (step) => {
        query.setQueriesData(["caf-registration-steps", application_id], () => step);
        setActive(step);
    };

    useEffect(() => {
        if (!isFetching && !isLoading && counter != 0) {
            setActive(counter);
        }
    }, [isFetching, isLoading, counter]);

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    return (
        <>
            {(isLoading || isFetching) && application_id ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="row">
                        <div className="col">
                            <div className="card-nav-tabs">
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
                                        <BasicNomineeInformation workerTypeData={data} nextStep={nextStep} prevStep={prevStep} />
                                    </Tab>
                                    <Tab eventKey="1" title="Address Details" disabled={counter >= 1 ? false : true}>
                                        <AddressNomineeDetailsForm nextStep={nextStep} prevStep={prevStep} />
                                    </Tab>
                                    <Tab eventKey="2" title="Document Details" disabled={counter >= 2 ? false : true}>
                                        <DocumentNomineeDetails nextStep={nextStep} prevStep={prevStep} />
                                    </Tab>
                                    <Tab eventKey="3" title="Final Review" disabled={counter >= 3 ? false : true}>
                                        <FinalNomineeReview nextStep={nextStep} prevStep={prevStep} isActive={active == 3 ? true : false} />
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CAFNomineeRegistrationForm;
