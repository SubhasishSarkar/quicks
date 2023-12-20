import React from "react";
import FPUploader from "../../../../components/FPUploader";
import { useNavigate } from "react-router";

const PfClaimDocumentsUploadForNominee = ({ data, id, afterSuccess, afterDelete, goNextPage, redirectFrom }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.pfDeathCertificate ? process.env.APP_BASE + data?.pfDeathCertificate : ""}
                                title="Copy Of Death Certificate"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfDeathCertificate"
                                onUploadSuccessful={() => afterSuccess("Death Certificate")}
                                onDeleteSuccessful={() => afterDelete("Death Certificate")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_death_certificate&claimType=pf`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.pfNomineePassbook ? process.env.APP_BASE + data?.pfNomineePassbook : ""}
                                title="First Page Of Bank Passbook of nominee/Legal heir"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfNomineePassbook"
                                onUploadSuccessful={() => afterSuccess("Bank Passbook of nominee/Legal heir")}
                                onDeleteSuccessful={() => afterDelete("Bank Passbook of nominee/Legal heir")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_nominee_passbook&claimType=pf`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.pfNomineeAadhaar ? process.env.APP_BASE + data?.pfNomineeAadhaar : ""}
                                title="Copy Of Nominee/Legal heir Aadhaar"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfNomineeAadhaar"
                                onUploadSuccessful={() => afterSuccess("Nominee/Legal heir Aadhaar")}
                                onDeleteSuccessful={() => afterDelete("Nominee/Legal heir Aadhaar")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_nominee_aadhaar_doc&claimType=pf`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.pfSchemePassbook ? process.env.APP_BASE + data?.pfSchemePassbook : ""}
                                title="Copy Of Scheme Passbook (First Page)"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfSchemePassbook"
                                onUploadSuccessful={() => afterSuccess("Scheme Passbook")}
                                onDeleteSuccessful={() => afterDelete("Scheme Passbook")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_scheme_passbook&claimType=pf`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.pfLegalHeir ? process.env.APP_BASE + data?.pfLegalHeir : ""}
                                title="Copy Of Legal heir Certificate"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfLegalHeir"
                                onUploadSuccessful={() => afterSuccess("Legal heir Certificate")}
                                onDeleteSuccessful={() => afterDelete("Legal heir Certificate")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_legal_heir&claimType=pf`}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <FPUploader
                                fileURL={data?.pfSubscription ? process.env.APP_BASE + data?.pfSubscription : ""}
                                title="Copy Of Scheme Passbook (Page Containing First Subscription Details)"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfSubscription"
                                onUploadSuccessful={() => afterSuccess("First Subscription Details")}
                                onDeleteSuccessful={() => afterDelete("First Subscription Details")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_subscription_doc&claimType=pf`}
                            />
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button className="btn btn-success btn-sm" type="button" onClick={() => (redirectFrom === "/claim/entry" ? navigate(`/claim/edit/${id}`) : navigate(-1))}>
                                    <i className="fa-solid fa-circle-arrow-left"></i> Go Back
                                </button>
                                <button className="btn btn-success btn-sm" type="button" onClick={() => goNextPage()}>
                                    Go Next <i className="fa-solid fa-circle-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PfClaimDocumentsUploadForNominee;
