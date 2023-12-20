import React from "react";
import FPUploader from "../../../../components/FPUploader";
import { useNavigate } from "react-router-dom";

const PfClaimDocumentsUploadForBeneficiary = ({ data, id, afterSuccess, afterDelete, goNextPage, redirectFrom }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.schemePassbook ? process.env.APP_BASE + data?.schemePassbook : ""}
                                title="Copy Of Scheme Passbook (First Page) "
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="schemePassbook"
                                onUploadSuccessful={() => afterSuccess("First Page of Scheme Passbook")}
                                onDeleteSuccessful={() => afterDelete("First Page of Scheme Passbook")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_scheme_passbook&claimType=pf`}
                                required="true"
                            />
                        </div>

                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.aadhar ? process.env.APP_BASE + data?.aadhar : ""}
                                title="Copy Of Aadhaar"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="aadhar"
                                onUploadSuccessful={() => afterSuccess("Aadhar")}
                                onDeleteSuccessful={() => afterDelete("Aadhar")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_aadhaar_doc&claimType=pf`}
                                required="true"
                            />
                        </div>

                        <div className="col-md-4">
                            <FPUploader
                                fileURL={data?.firstSubscription ? process.env.APP_BASE + data?.firstSubscription : ""}
                                title="Copy Of Scheme Passbook (Page Containing First Subscription Details) "
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="firstSubscription"
                                onUploadSuccessful={() => afterSuccess("First Subscription Details")}
                                onDeleteSuccessful={() => afterDelete("First Subscription Details")}
                                upload={`/claim-documents-upload?id=${id}&name=pf_subscription&claimType=pf`}
                                required="true"
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

export default PfClaimDocumentsUploadForBeneficiary;
