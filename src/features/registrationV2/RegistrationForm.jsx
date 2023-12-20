import React, { useContext, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import AddressDetailsForm from "./Steps/AddressDetailsForm";
import BankDetailsForm from "./Steps/BankDetailsForm";
import BasicInformationForm from "./Steps/BasicInformationForm";
import DependentDetails from "./Steps/DependentDetails";
import DocumentDetails from "./Steps/DocumentDetails";
import FinalReview from "./FinalReview";
import NomineeDetailsForm from "./Steps/NomineeDetailsForm";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import AdditionalDetails from "./Steps/AdditionalDetails";
import RegistrationContext, { RegistrationProvider } from "./Context";
import moment from "moment";

const RegistrationForm = ({ data }) => {
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    return (
        <>
            <RegistrationProvider>
                <div className="row">
                    <div className="col">
                        <div className="card-nav-tabs">
                            <WorkerTypeBasedTabs data={data} application_id={application_id} />
                        </div>
                    </div>
                </div>
            </RegistrationProvider>
        </>
    );
};
export default RegistrationForm;

const getTabsBasedOnRegistrationType = (data, application_id) => {
    if (!application_id) {
        return true;
    }
    if (data?.registration_type === "NEW" && data?.is_ndf != 1 && moment("2023-11-01").isBefore(moment(data?.created_date)) && data?.e_district_reg_date == null && !data?.registration_no) {
        return true;
    }
    return false;
};

const WorkerTypeBasedTabs = ({ data, application_id }) => {
    const dispatch = useDispatch();
    const { workerType, setWorkerType, active, setActive } = useContext(RegistrationContext);

    const { isFetching, data: basicInformation } = useQuery(["caf-registration-preview", "basic-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=basic-details`), {
        enabled: application_id ? true : false,
    });

    const query = useQueryClient();
    const {
        isLoading,
        isFetching: isFetchingSteps,
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

    const nextStep = (step) => {
        query.setQueriesData(["caf-registration-steps", application_id], () => step);
        setActive(step);
    };
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    useEffect(() => {
        if (!isFetchingSteps && !isLoading && counter != 0) {
            setActive(counter);
        }
    }, [isFetchingSteps, isLoading, counter]);

    useEffect(() => {
        let tab_title = "";
        if (active == 0) tab_title = "Basic Information";
        if (active == 1) tab_title = "Address Details";
        if (active == 2) tab_title = "Bank Details";
        if (active == 3) tab_title = "Nominee Details";
        if (active == 4) tab_title = "Dependent Details";

        if (workerType === "ow") {
            if (active == 5) tab_title = "Document Details";
            if (active == 6) tab_title = "Final Review";
        } else {
            if (active == 5) tab_title = workerType === "tw" ? "Addl. Info for WBTWSSS" : workerType === "cw" ? "Addl. Info for BOCW" : "";
            if (active == 6) tab_title = "Document Details";
            if (active == 7) tab_title = "Final Review";
        }

        dispatch(setPageAddress({ title: "Beneficiary Registration/CAF Update", url: "/caf", subTitle: tab_title ? tab_title : "Basic Information", subUrl: "" }));
    }, [active]);

    useEffect(() => {
        if (!isFetching && basicInformation) {
            setWorkerType(basicInformation.cat_worker_type);
        }
    }, [basicInformation, isFetching]);

    const commonConfig = [
        {
            title: "Basic information",
            element: <BasicInformationForm workerTypeData={data} nextStep={nextStep} prevStep={prevStep} />,
        },
        {
            title: "Address Details",
            element: <AddressDetailsForm nextStep={nextStep} prevStep={prevStep} />,
        },
        {
            title: "Bank Details",
            element: <BankDetailsForm nextStep={nextStep} prevStep={prevStep} />,
        },
        {
            title: "Nominee Details",
            element: <NomineeDetailsForm nextStep={nextStep} prevStep={prevStep} />,
        },
        {
            title: "Dependent Details",
            element: <DependentDetails nextStep={nextStep} prevStep={prevStep} />,
        },
    ];

    const defaultConfig = [
        ...commonConfig,
        {
            title: "Document Details",
            element: <DocumentDetails nextStep={nextStep} prevStep={prevStep} />,
        },
        {
            title: "Final Review",
            element: <FinalReview isActive={active == 6 ? true : false} />,
        },
    ];

    const config = {
        tw: {
            tabs: [
                ...commonConfig,
                {
                    title: "Addl. Info for WBTWSSS",
                    element: <AdditionalDetails nextStep={nextStep} prevStep={prevStep} setActive={setActive} />,
                },
                {
                    title: "Document Details",
                    element: <DocumentDetails nextStep={nextStep} prevStep={prevStep} />,
                },
                {
                    title: "Final Review",
                    element: <FinalReview isActive={active == 7 ? true : false} />,
                },
            ],
        },
        cw: {
            tabs: [
                ...commonConfig,
                {
                    title: "Addl. Info for BOCW",
                    element: <AdditionalDetails nextStep={nextStep} prevStep={prevStep} setActive={setActive} />,
                },
                {
                    title: "Document Details",
                    element: <DocumentDetails nextStep={nextStep} prevStep={prevStep} />,
                },
                {
                    title: "Final Review",
                    element: <FinalReview isActive={active == 7 ? true : false} />,
                },
            ],
        },
        ow: {
            tabs: [...defaultConfig],
        },
        default: {
            tabs: [...defaultConfig],
        },
    };

    if (isFetching || (application_id && !workerType) || isFetchingSteps) {
        return <>Loading.....</>;
    } else {
        return (
            <>
                <Tabs
                    defaultActiveKey="0"
                    activeKey={active}
                    onSelect={(k) => {
                        setActive(k);
                    }}
                    id="uncontrolled-tab-example"
                >
                    {config[getTabsBasedOnRegistrationType(basicInformation, application_id) ? (workerType ? workerType : data?.cat_worker_type) : "default"].tabs.map((item, index) => {
                        return (
                            <Tab key={index} eventKey={index} title={item.title} disabled={counter >= index ? false : true}>
                                {item.element}
                            </Tab>
                        );
                    })}
                </Tabs>
            </>
        );
    }
};
