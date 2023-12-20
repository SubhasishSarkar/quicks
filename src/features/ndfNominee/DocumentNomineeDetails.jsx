import React, { useEffect } from "react";
import FPUploader from "../../components/FPUploader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import { disableQuery } from "../../data";
import LoadingOverlay from "../../components/LoadingOverlay";

const DocumentNomineeDetails = ({ nextStep, prevStep }) => {
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
    console.log(data && (Object.keys(data).length === 5 || (Object.keys(data).length === 4 && !Object.keys(data).includes("Epic"))));
    return (
        <>
            <div className="card datatable-box mb-4" style={{ position: "relative" }}>
                {isLoading && <LoadingOverlay />}
              
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.Aadhar? `${process.env.APP_BASE}${data?.Aadhar}` : ''}
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
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "Epic")}
                                onDeleteSuccessful={() => handleDeleteSuccess("Epic")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=Epic`}
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.SchemePassbook ? `${process.env.APP_BASE}${data?.SchemePassbook}` : ''} 
                                title="Scheme Passbook"
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "SchemePassbook")}
                                onDeleteSuccessful={() => handleDeleteSuccess("SchemePassbook")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=SchemePassbook`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.DeathCertificate ? `${process.env.APP_BASE}${data?.DeathCertificate}` : ''} 
                                title="Death Certificate"
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "DeathCertificate")}
                                onDeleteSuccessful={() => handleDeleteSuccess("DeathCertificate")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=DeathCertificate`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.NomineeAadhaar ? `${process.env.APP_BASE}${data?.NomineeAadhaar}` : ''} 
                                maxFileSize="450KB"
                                title="Nominee Aadhaar"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={(res) => handleUploadSuccess(res.path, "NomineeAadhaar")}
                                onDeleteSuccessful={() => handleDeleteSuccess("NomineeAadhaar")}
                                upload={`/caf-registration?id=${application_id}&type=documents-details&name=NomineeAadhaar`}
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
                                onClick={() => nextStep(3)}
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

export default DocumentNomineeDetails;
