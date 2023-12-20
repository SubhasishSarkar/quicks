import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FPUploader from "../../../components/FPUploader";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const DeathClaimDocuments = ({ id, redirectFrom }) => {
    const claimType = "death";
    const { error, data, isFetching } = useQuery(["get-required-documents-for-claim", id, claimType], () => fetcher(`/get-required-documents-for-claim?id=${id}&claimType=${claimType}`), { enabled: id ? true : false });

    const { data: preViewData } = useQuery(["claim-documents-preview", id, claimType], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimType}`));

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("claim-documents-preview");
    };

    const { mutate } = useMutation(() => fetcher(`/check-claim-doc-validation?id=${id}&claimType=${claimType}`));
    const navigate = useNavigate();
    const goNextPage = (id) => {
        mutate(id, {
            onSuccess(data, variables, context) {
                navigate("/claim/details/" + data.id);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim Entry", url: "claim/entry", subTitle: "Claim Documents Uploads", subUrl: "" }));
    }, []);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            <div className="card datatable-box mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <FPUploader
                                fileURL={preViewData?.deathCertificate ? process.env.APP_BASE + preViewData?.deathCertificate : ""}
                                title="Copy Of Death certificate"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="deathCertificate"
                                onUploadSuccessful={() => afterSuccess("Death Certificate")}
                                onDeleteSuccessful={() => afterDelete("Death Certificate")}
                                upload={`/claim-documents-upload?id=${id}&name=death_certificate&claimType=${claimType}`}
                                required="true"
                            />
                        </div>

                        <div className="col-md-3 mb-2">
                            <FPUploader
                                fileURL={preViewData?.doctorCertificate ? process.env.APP_BASE + preViewData?.doctorCertificate : ""}
                                title="Copy Of Death certificate issued by doctor"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="doctorCertificate"
                                onUploadSuccessful={() => afterSuccess("Death certificate issued by doctor")}
                                onDeleteSuccessful={() => afterDelete("Death certificate issued by doctor")}
                                upload={`/claim-documents-upload?id=${id}&name=doctor_certificate&claimType=${claimType}`}
                            />
                        </div>

                        <div className="col-md-3 mb-2">
                            <FPUploader
                                fileURL={preViewData?.nomineePassbook ? process.env.APP_BASE + preViewData?.nomineePassbook : ""}
                                title="First Page Of Bank Passbook of nominee"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="nomineePassbook"
                                onUploadSuccessful={() => afterSuccess("Bank Passbook of nominee")}
                                onDeleteSuccessful={() => afterDelete("Bank Passbook of nominee")}
                                upload={`/claim-documents-upload?id=${id}&name=passbook&claimType=${claimType}`}
                                required="true"
                            />
                        </div>

                        <div className="col-md-3 mb-2">
                            <FPUploader
                                fileURL={preViewData?.legalHeir ? process.env.APP_BASE + preViewData?.legalHeir : ""}
                                title="Copy Of Legal heir Certificate"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="legalHeir"
                                onUploadSuccessful={() => afterSuccess("Legal heir Certificate")}
                                onDeleteSuccessful={() => afterDelete("Legal heir Certificate")}
                                upload={`/claim-documents-upload?id=${id}&name=leagal_heir&claimType=${claimType}`}
                            />
                        </div>

                        <div className="col-md-3 mb-2">
                            <FPUploader
                                fileURL={preViewData?.nomineeAadhaar ? process.env.APP_BASE + preViewData?.nomineeAadhaar : ""}
                                title="Copy Of Nominee Aadhaar"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="nomineeAadhaar"
                                onUploadSuccessful={() => afterSuccess("Nominee Aadhaar")}
                                onDeleteSuccessful={() => afterDelete("Nominee Aadhaar")}
                                upload={`/claim-documents-upload?id=${id}&name=aadhaar&claimType=${claimType}`}
                                required="true"
                            />
                        </div>

                        {data?.postmortemReport === true && (
                            <div className="col-md-3 mb-2">
                                <FPUploader
                                    fileURL={preViewData?.postMortem ? process.env.APP_BASE + preViewData?.postMortem : ""}
                                    title="Copy Of Postmortem Report"
                                    maxFileSize="150KB"
                                    description="Please upload pdf only. File size must be under 150 KB"
                                    acceptedFileTypes={["application/pdf"]}
                                    name="postMortem"
                                    onUploadSuccessful={() => afterSuccess("Postmortem Report")}
                                    onDeleteSuccessful={() => afterDelete("Postmortem Report")}
                                    upload={`/claim-documents-upload?id=${id}&name=postmortem&claimType=${claimType}`}
                                />
                            </div>
                        )}
                        {data?.fir === true && (
                            <div className="col-md-3 mb-2">
                                <FPUploader
                                    fileURL={preViewData?.Fir ? process.env.APP_BASE + preViewData?.Fir : ""}
                                    title="Copy Of FIR"
                                    maxFileSize="150KB"
                                    description="Please upload pdf only. File size must be under 150 KB"
                                    acceptedFileTypes={["application/pdf"]}
                                    name="Fir"
                                    onUploadSuccessful={() => afterSuccess("FIR")}
                                    onDeleteSuccessful={() => afterDelete("FIR")}
                                    upload={`/claim-documents-upload?id=${id}&name=fir&claimType=${claimType}`}
                                    required="true"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn btn-success btn-sm" type="button" onClick={() => (redirectFrom === "/claim/entry" ? navigate(`/claim/edit/${id}`) : navigate(-1))}>
                            <i className="fa-solid fa-circle-arrow-left"></i> Go Back
                        </button>
                        <button className="btn btn-success btn-sm" type="button" onClick={(id) => goNextPage(id)}>
                            Go Next <i className="fa-solid fa-circle-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeathClaimDocuments;
