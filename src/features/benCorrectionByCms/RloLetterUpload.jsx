import React, { useEffect } from "react";
import FPUploader from "../../components/FPUploader";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";

const DocumentUploadCms = ({ isDocFetch, data, isBack }) => {
    const query = useQueryClient();
    const { id } = useParams();
    const applicationId = id;
    const handleUploadSuccess = (path, docType) => {
        if (isBack) isBack("isFetch");
        query.setQueriesData(["caf-registration-preview", "documents-details", applicationId], (state) => ({ ...state, [docType]: path }));
    };
    const handleDeleteSuccess = (docType) => {
        if (isBack) isBack("isFetch");
        query.setQueriesData(["caf-registration-preview", "documents-details", applicationId], (state) => {
            const newState = { ...state };
            delete newState[docType];
            return { ...newState };
        });
    };

    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "documents-details", applicationId], {
                exact: true,
            });
        };
    }, [applicationId, query]);

    return (
        <>
            {isDocFetch && <LoadingOverlay />}

            <div className="card" style={{ border: "none" }}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.RloLetter ? `${process.env.APP_BASE}${data?.RloLetter}` : ""}
                                title="RloLetter"
                                maxFileSize="50KB"
                                description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                                acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "RloLetter")}
                                onDeleteSuccessful={() => handleDeleteSuccess("RloLetter")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=RloLetter`}
                                required="true"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentUploadCms;
