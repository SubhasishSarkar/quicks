import React, { useEffect } from "react";
import FPUploader from "../../components/FPUploader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetcher } from "../../utils";
import { disableQuery } from "../../data";
import LoadingOverlay from "../../components/LoadingOverlay";

const DocumentUploadCms = () => {
    const query = useQueryClient();
    const { id } = useParams();
    const applicationId = id;
    const { isLoading, data } = useQuery(["caf-registration-preview", "documents-details", applicationId], () => fetcher(`/caf-registration-preview?id=${applicationId}&step_name=documents-details`), {
        ...disableQuery,
        enabled: applicationId ? true : false,
    });
    const handleUploadSuccess = (path, docType) => {
        query.setQueriesData(["caf-registration-preview", "documents-details", applicationId], (state) => ({ ...state, [docType]: path }));
    };
    const handleDeleteSuccess = (docType) => {
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
            {isLoading && <LoadingOverlay />}

            <div className="card" style={{ border: "none" }}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.Photo ? `${process.env.APP_BASE}${data?.Photo}` : ""}
                                title="Photo"
                                maxFileSize="50KB"
                                description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                                acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Photo")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Photo")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=Photo`}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.Signature ? `${process.env.APP_BASE}${data?.Signature}` : ""}
                                title="Signature"
                                maxFileSize="50KB"
                                description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 70)"
                                acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Signature")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Signature")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=Signature`}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.Aadhar ? `${process.env.APP_BASE}${data?.Aadhar}` : ""}
                                title="Aadhar"
                                maxFileSize="450KB"
                                description="Upload Document both side (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Aadhar")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Aadhar")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=Aadhar`}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.Epic ? `${process.env.APP_BASE}${data?.Epic}` : ""}
                                title="Epic"
                                maxFileSize="450KB"
                                description="Upload Document (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Epic")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Epic")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=Epic`}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.Passbook ? `${process.env.APP_BASE}${data?.Passbook}` : ""}
                                title="Bank Passbook"
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Passbook")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Passbook")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=Passbook`}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.SchemePassbook ? `${process.env.APP_BASE}${data?.SchemePassbook}` : ""}
                                title="Scheme Certificate"
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Scheme Certificate")}
                                onDeleteSuccessful={() => handleDeleteSuccess("SchemePassbook")}
                                upload={`/form_document_details_correction_cms_insert?id=${applicationId}&type=documents-details&name=SchemePassbook`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentUploadCms;
