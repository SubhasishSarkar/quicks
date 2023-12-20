import React, { useEffect } from "react";
import FPUploader from "../../../../../components/FPUploader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { fetcher } from "../../../../../utils";

const PfCafByBeneficiaryDocuments = () => {
    const { id } = useParams();

    const { data } = useQuery(["get-pf-caf-claim-details", id], () => fetcher(`/get-pf-caf-claim-details?id=${id}`), { enabled: id ? true : false });

    useEffect(() => {
        if (data?.val.status === "Submitted") {
            navigate(`/claim/list?type=CAF Submitted During Claim&caf-type=Caf Submitted`);
        }
    }, [data?.status]);

    const { data: preViewData } = useQuery(["pf-caf-claim-documents-preview", id], () => fetcher(`/pf-caf-claim-documents-preview?id=${id}`));

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("pf-caf-claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("pf-caf-claim-documents-preview");
    };

    const { mutate } = useMutation(() => fetcher(`/pf-caf-claim-verify-and-submit?id=${id}`));
    const navigate = useNavigate();
    const goNextPage = (id) => {
        mutate(id, {
            onSuccess(data, variables, context) {
                toast.success("Pf Caf Successfully saved.");
                query.invalidateQueries("pf-caf-claim-documents-preview");
                navigate("/claim/pf-caf-details/" + id);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    return (
        <>
            <div className="card datatable-box shadow mb-4">
                <div className="card-header py-4">
                    <h5 className="m-0 font-weight-bold text-white">Please Upload Require Documents For CAF Claim</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <FPUploader
                                fileURL={preViewData?.PfCAFAadhaar ? process.env.APP_BASE + "/" + preViewData?.PfCAFAadhaar : ""}
                                title="Copy Of Aadhar"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfCafAadhar"
                                onUploadSuccessful={() => afterSuccess("Aadhar")}
                                onDeleteSuccessful={() => afterDelete("Aadhar")}
                                upload={`/pf-caf-claim-documents-upload?id=${id}&name=CAF_file_aadhaar`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-3">
                            <FPUploader
                                fileURL={preViewData?.PfCAFCertificate ? process.env.APP_BASE + "/" + preViewData?.PfCAFCertificate : ""}
                                title="Scheme Passbook (first page)"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfCafSchemePassbook"
                                onUploadSuccessful={() => afterSuccess("Scheme Passbook")}
                                onDeleteSuccessful={() => afterDelete("Scheme Passbook")}
                                upload={`/pf-caf-claim-documents-upload?id=${id}&name=CAF_file_certificate`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-3">
                            <FPUploader
                                fileURL={preViewData?.PfCAFPassbook ? process.env.APP_BASE + "/" + preViewData?.PfCAFPassbook : ""}
                                title="Bank Passbook"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfCafBankPassbook"
                                onUploadSuccessful={() => afterSuccess("Bank Passbook")}
                                onDeleteSuccessful={() => afterDelete("Bank Passbook")}
                                upload={`/pf-caf-claim-documents-upload?id=${id}&name=CAF_bank_passbook`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-3">
                            <FPUploader
                                fileURL={preViewData?.PfCAFFormV ? process.env.APP_BASE + "/" + preViewData?.PfCAFFormV : ""}
                                title="Form V"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfCafFormV"
                                onUploadSuccessful={() => afterSuccess("Form V")}
                                onDeleteSuccessful={() => afterDelete("Form V")}
                                upload={`/pf-caf-claim-documents-upload?id=${id}&name=CAF_form_v_doc`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-3">
                            <FPUploader
                                fileURL={preViewData?.PfCAFFrstSubPrf ? process.env.APP_BASE + "/" + preViewData?.PfCAFFrstSubPrf : ""}
                                title="First Subscription Proof"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="pfCafSubscriptionProof"
                                onUploadSuccessful={() => afterSuccess("Subscription Proof")}
                                onDeleteSuccessful={() => afterDelete("Subscription Proof")}
                                upload={`/pf-caf-claim-documents-upload?id=${id}&name=CAF_frst_sub_prf_doc`}
                                required="true"
                            />
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button className="btn btn-success" type="button">
                                        <Link to={"/claim/pf-caf-edit/" + id} style={{ textDecoration: "none", color: "#fff" }}>
                                            Go Back
                                        </Link>
                                    </button>
                                    <button className="btn btn-success" type="button" onClick={() => goNextPage(id)}>
                                        Verify And Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PfCafByBeneficiaryDocuments;
