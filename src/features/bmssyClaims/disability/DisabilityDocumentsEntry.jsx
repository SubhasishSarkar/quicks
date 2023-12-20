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

const DisabilityDocumentsEntry = ({ id, redirectFrom }) => {
    const claimType = "disability";
    const { data: preViewData, error, isFetching } = useQuery(["claim-documents-preview", id, claimType], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimType}`));

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
            <div className="card datatable-box">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <FPUploader
                                fileURL={preViewData?.disabilityCertified ? process.env.APP_BASE + preViewData?.disabilityCertified : ""}
                                title="Certified by a Government Hospital"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="disabilityCertified"
                                onUploadSuccessful={() => afterSuccess("Disability Certified")}
                                onDeleteSuccessful={() => afterDelete("Disability Certified")}
                                upload={`/claim-documents-upload?id=${id}&name=disability_certificate&claimType=${claimType}`}
                                required="true"
                            />
                        </div>

                        <div className="col-md-4">
                            <FPUploader
                                fileURL={preViewData?.relatedDoc ? process.env.APP_BASE + preViewData?.relatedDoc : ""}
                                title="Document Related To Hospital/Accidental/Other"
                                maxFileSize="150KB"
                                description="Please upload pdf only. File size must be under 150 KB"
                                acceptedFileTypes={["application/pdf"]}
                                name="relatedDoc"
                                onUploadSuccessful={() => afterSuccess("Document Related")}
                                onDeleteSuccessful={() => afterDelete("Document Related")}
                                upload={`/claim-documents-upload?id=${id}&name=disability_other_doc&claimType=${claimType}`}
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
                                <button className="btn btn-success btn-sm" type="button" onClick={(id) => goNextPage(id)}>
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

export default DisabilityDocumentsEntry;
