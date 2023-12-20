import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import { Tab, Tabs } from "react-bootstrap";
import FormBenBasicDetailsCorrection from "./FormBenBasicDetailsCorrection";
import MigratedDocument from "./MigratedDocument";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import RloLetterUpload from "./RloLetterUpload";
import DocumentUploadCms from "./DocumentUploadCms";

const CmsCorrectionTab = () => {
    const setSearchParams = useSearchParams()[1];
    const searchParamsRemove = () => {
        setSearchParams("");
    };

    const { id } = useParams();
    const applicationId = id;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Registration Date Rectification (OW)", url: "" }));
    }, []);

    const { isFetching, data: BasicData } = useQuery(["caf-registration-preview", "basic-details", applicationId], () => fetcher(`/caf-registration-preview?id=${applicationId}&step_name=basic-details`));

    const {
        isFetching: isDocFetch,
        data: documentDetails,
        refetch,
    } = useQuery(["caf-registration-preview", "documents-details", applicationId], () => fetcher(`/caf-registration-preview?id=${applicationId}&step_name=documents-details`), {
        enabled: applicationId ? true : false,
    });

    console.log("BasicData", BasicData);
    console.log("documentDetails", documentDetails);

    const isBack = (e) => {
        if (e === "isFetch") {
            refetch();
        }
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card-nav-tabs mb-4">
                        {documentDetails?.RloLetter ? (
                            <Tabs
                                defaultActiveKey="0"
                                onSelect={() => {
                                    searchParamsRemove();
                                }}
                                id="uncontrolled-tab-example"
                            >
                                <Tab eventKey="0" title="Upload RLO Letter">
                                    <RloLetterUpload isDocFetch={isDocFetch} data={documentDetails} isBack={isBack} />
                                </Tab>
                                <Tab eventKey="1" title="Basic Details">
                                    <FormBenBasicDetailsCorrection data={BasicData} isFetching={isFetching} />
                                </Tab>
                                {BasicData?.is_active === 2 && (
                                    <Tab eventKey="2" title="Migrated Docuemnt">
                                        <MigratedDocument documentDetails={documentDetails} />
                                    </Tab>
                                )}
                                <Tab eventKey="3" title="Upload Modified Document">
                                    <DocumentUploadCms />
                                </Tab>
                            </Tabs>
                        ) : (
                            <Tabs
                                defaultActiveKey="0"
                                onSelect={() => {
                                    searchParamsRemove();
                                }}
                                id="uncontrolled-tab-example"
                            >
                                <Tab eventKey="0" title="Upload RLO Letter">
                                    <RloLetterUpload />
                                </Tab>
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CmsCorrectionTab;
