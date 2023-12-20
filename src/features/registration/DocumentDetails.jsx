import React, { useContext, useEffect, useState } from "react";
import FPUploader from "../../components/FPUploader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import { disableQuery } from "../../data";
import LoadingOverlay from "../../components/LoadingOverlay";
import { RegistrationContext } from "./RegistrationForm";

const DocumentDetails = ({ nextStep, prevStep }) => {
    const { basicDetails } = useContext(RegistrationContext); //cannot destructuring
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const [stepNext, setStepNext] = useState(basicDetails?.registration_type !== "NEW" && (basicDetails?.is_ndf === 0 || basicDetails?.is_ndf === null) ? 6 : 5); //FOR DOCUMENT VALIDATION
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

    const DocValidationFunc = () => {
        if (stepNext === 6) {
            if (Object.keys(data).length < 5) return true;
            else if (Object.keys(data).length === 5 && Object.keys(data).includes("Epic")) return true;
            return false;
        } else if (stepNext === 5) {
            if (Object.keys(data).length < 4) return true;
            else if (Object.keys(data).length === 4 && Object.keys(data).includes("Epic")) return true;
            return false;
        }
    };
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
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Photo`}
                                required="true"
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
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Signature`}
                                required="true"
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
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Aadhar`}
                                required="true"
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
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Epic`}
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
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Passbook`}
                                required="true"
                            />
                        </div>
                        {basicDetails?.registration_type !== "NEW" && basicDetails?.is_ndf === 0 && (
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
                                    upload={`/caf-registration?id=${application_id}&type=documents-details&name=SchemePassbook`}
                                    required="true"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-footer" style={{ border: "none", backgroundColor: "transparent" }}>
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button
                            type="submit"
                            className="btn btn-success btn-sm"
                            // disabled={data && Object.keys(data).length !== stepNext ? true : false}
                            //disabled={data && (Object.keys(data).length === stepNext || (Object.keys(data).length === stepNext - 1 && !Object.keys(data).includes("Epic"))) ? false : true}
                            disabled={data && DocValidationFunc()}
                            onClick={() => nextStep(6)}
                        >
                            Next step <i className="fa-solid fa-circle-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentDetails;
