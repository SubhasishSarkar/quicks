import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import BasicNomineeInformation from "./BasicNomineeInformation";
import AddressNomineeDetailsForm from "./AddressNomineeDetailsForm";
import DocumentNomineeDetails from "./DocumentNomineeDetails";
import FinalNomineeReview from "./FinalNomineeReview";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const CafNomineeUpdate = ({ data }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const [active, setActive] = useState(0);
    const { data: counter } = useQuery(["caf-registration-steps", application_id], () => fetcher(`/caf-registration-steps?id=${application_id}`), {
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

    const dispatch = useDispatch();
    useEffect(() => {
        let tab_title = "";
        if (active == 0) tab_title = "Basic Information";
        if (active == 1) tab_title = "Address Details";
        if (active == 5) tab_title = "Document Details";
        if (active == 6) tab_title = "Final Review";

        dispatch(setPageAddress({ title: "CAF Nominee Updation", url: "/caf/nominee-update", subTitle: tab_title ? tab_title : "Basic Information", subUrl: "" }));
    }, [active]);
    return (
        <>
            <div className="card-nav-tabs">
                <Tabs
                    defaultActiveKey="0"
                    activeKey={active}
                    onSelect={(k) => {
                        setActive(k);
                    }}
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
        </>
    );
};

export default CafNomineeUpdate;
