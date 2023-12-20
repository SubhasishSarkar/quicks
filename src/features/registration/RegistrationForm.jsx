import React, { createContext, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import AddressDetailsForm from "./AddressDetailsForm";
import BankDetailsForm from "./BankDetailsForm";
import BasicInformationForm from "./BasicInformationForm";
import DependentDetails from "./DependentDetails";
import DocumentDetails from "./DocumentDetails";
import FinalReview from "./FinalReview";
import NomineeDetailsForm from "./NomineeDetailsForm";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const RegistrationForm = ({ data }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const {
        isLoading,
        isFetching,
        data: counter,
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
    const [active, setActive] = useState(0);
    const dispatch = useDispatch();

    const nextStep = (step) => {
        query.setQueriesData(["caf-registration-steps", application_id], () => step);
        setActive(step);
    };

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    useEffect(() => {
        if (!isFetching && !isLoading && counter != 0) {
            setActive(counter);
        }
    }, [isFetching, isLoading, counter]);

    useEffect(() => {
        let tab_title = "";
        if (active == 0) tab_title = "Basic Information";
        if (active == 1) tab_title = "Address Details";
        if (active == 2) tab_title = "Bank Details";
        if (active == 3) tab_title = "Nominee Details";
        if (active == 4) tab_title = "Dependent Details";
        if (active == 5) tab_title = "Document Details";
        if (active == 6) tab_title = "Final Review";

        dispatch(setPageAddress({ title: "Beneficiary Registration/CAF Update", url: "/caf", subTitle: tab_title ? tab_title : "Basic Information", subUrl: "" }));
    }, [active]);

    return (
        <>
            <RegistrationProvider>
                {(isLoading || isFetching) && application_id ? (
                    <p>Loading...</p>
                ) : (
                    <>
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
                                    >
                                        <Tab eventKey="0" title="Basic Information" disabled={counter >= 0 ? false : true}>
                                            <BasicInformationForm workerTypeData={data} nextStep={nextStep} prevStep={prevStep} />
                                        </Tab>
                                        <Tab eventKey="1" title="Address Details" disabled={counter >= 1 ? false : true}>
                                            <AddressDetailsForm nextStep={nextStep} prevStep={prevStep} />
                                        </Tab>
                                        <Tab eventKey="2" title="Bank Details" disabled={counter >= 2 ? false : true}>
                                            <BankDetailsForm nextStep={nextStep} prevStep={prevStep} />
                                        </Tab>
                                        <Tab eventKey="3" title="Nominee Details" disabled={counter >= 3 ? false : true}>
                                            <NomineeDetailsForm nextStep={nextStep} prevStep={prevStep} />
                                        </Tab>
                                        <Tab eventKey="4" title="Dependent Details" disabled={counter >= 4 ? false : true}>
                                            <DependentDetails nextStep={nextStep} prevStep={prevStep} />
                                        </Tab>
                                        <Tab eventKey="5" title="Document Details" disabled={counter >= 5 ? false : true}>
                                            <DocumentDetails nextStep={nextStep} prevStep={prevStep} />
                                        </Tab>
                                        <Tab eventKey="6" title="Final Review" disabled={counter >= 6 ? false : true}>
                                            <FinalReview isActive={active == 6 ? true : false} />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </RegistrationProvider>
        </>
    );
};

export default RegistrationForm;

export const RegistrationContext = createContext();
const RegistrationProvider = ({ children }) => {
    const [basicDetails, setBasicDetails] = useState();
    const [isDirty, setIsDirty] = useState(false);
    return <RegistrationContext.Provider value={{ basicDetails: basicDetails, setBasicDetails: setBasicDetails, isDirty: isDirty, setIsDirty: setIsDirty }}>{children}</RegistrationContext.Provider>;
};
