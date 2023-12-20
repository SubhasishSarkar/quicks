import React, { useEffect } from "react";
import FPUploader from "../../components/FPUploader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import { disableQuery } from "../../data";
import LoadingOverlay from "../../components/LoadingOverlay";

const DocumentDetailsNdfForm = ({ nextStep, prevStep }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const { isLoading, data } = useQuery(["caf-registration-preview", "documents-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=documents-details`), {
        ...disableQuery,
        enabled: application_id ? true : false,
    });
    const handleUploadSuccess = (path, docType) => {
        query.setQueriesData(["caf-registration-preview", "documents-details", application_id], (state) => ({ ...state, [docType]: path }));
    };
    const handleDeleteSuccess = (docType) => {
        query.setQueriesData(["caf-registration-preview", "documents-details", application_id], (state) => {
            const newState = { ...state };
            delete newState[docType];
            return { ...newState };
        });
    };
    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "documents-details", application_id], {
                exact: true,
            });
        };
    }, [application_id, query]);
    return (
        <>
            <div className="card datatable-box mb-4" style={{ position: "relative" }}>
                {isLoading && <LoadingOverlay />}
                <div className="card-header py-4">
                    <h5 className="m-0 font-weight-bold text-white">Step:6 Document Details</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.Photo ? `${process.env.APP_BASE}${data?.Photo}` : ''}
                                title="Photo"
                                maxFileSize="50KB"
                                description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                                acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Photo")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Photo")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Photo`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.Signature ? `${process.env.APP_BASE}${data?.Signature}` : ''} 
                                title="Signature"
                                maxFileSize="50KB"
                                description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 70)"
                                acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Signature")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Signature")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Signature`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.Aadhar ? `${process.env.APP_BASE}${data?.Aadhar}` : ''} 
                                title="Aadhar"
                                maxFileSize="450KB"
                                description="Upload Document both side (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Aadhar")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Aadhar")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Aadhar`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.Epic ? `${process.env.APP_BASE}${data?.Epic}` : ''} 
                                title="Epic"
                                description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                                acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Epic")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Epic")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Epic`}
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.Passbook ? `${process.env.APP_BASE}${data?.Passbook}` : ''} 
                                title="Passbook"
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Passbook")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Passbook")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Passbook`}
                                required="true"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <button
                                type="submit"
                                className="btn btn-success btn-sm mt-3"
                                disabled={data && (Object.keys(data).length === 5 || (Object.keys(data).length === 4 && !Object.keys(data).includes("Epic"))) ? false : true}
                                onClick={() => nextStep(6)}
                            >
                                Next step
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentDetailsNdfForm;
