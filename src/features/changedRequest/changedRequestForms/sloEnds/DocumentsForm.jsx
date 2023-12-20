import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FPUploader from "../../../../components/FPUploader";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";

const DocumentsForm = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["get-filed-for-documents-upload", id], () => fetcher(`/get-filed-for-documents-upload?id=${id}`));

    const { data: preViewData } = useQuery(["cr-documents-preview", id], () => fetcher(`/cr-documents-preview?id=${id}`));

    let getClientSubmitBtn = data?.clientSubmitBtn;
    const [disabled, setDisabled] = useState(true);
    const query = useQueryClient();

    const afterSuccess = (docName) => {
        query.invalidateQueries("cr-documents-preview");
        if (preViewData?.count === getClientSubmitBtn) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        toast.success(docName + " uploaded successfully");
    };

    useEffect(() => {
        if (preViewData?.count === getClientSubmitBtn) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [preViewData, data]);

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("cr-documents-preview");
        if (preViewData?.count === getClientSubmitBtn) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        query.setQueriesData(["cr-documents-upload", id], (state) => {
            const newState = { ...state };
            delete newState[docName];
            return { ...newState };
        });
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Changed Request", url: "/change-request/entry", subTitle: "Upload Documents", subUrl: "" }));
    }, []);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card datatable-box mb-4">
                    <div className="card-body">
                        <div className="row">
                            {data?.aadhaarDocRequired && (
                                <div className="col-md-4">
                                    <FPUploader
                                        fileURL={preViewData?.aadhar ? process.env.APP_BASE + preViewData?.aadhar : ""}
                                        title="Upload Aadhaar Card"
                                        maxFileSize="150KB"
                                        description="Please upload pdf only. File size must be under 150 KB"
                                        acceptedFileTypes={["application/pdf"]}
                                        name="aadhar"
                                        onUploadSuccessful={() => afterSuccess("Aadhaar")}
                                        onDeleteSuccessful={() => afterDelete("Aadhaar")}
                                        upload={`/cr-documents-upload?id=${id}&name=aadhar`}
                                        required="true"
                                    />
                                </div>
                            )}
                            {data?.bankDocRequired && (
                                <div className="col-md-4">
                                    <FPUploader
                                        fileURL={preViewData?.passbook ? process.env.APP_BASE + preViewData?.passbook : ""}
                                        title="Upload Bank Passbook"
                                        maxFileSize="150KB"
                                        description="Please upload pdf only. File size must be under 150 KB"
                                        acceptedFileTypes={["application/pdf"]}
                                        name="passbook"
                                        onUploadSuccessful={() => afterSuccess("Bank Passbook")}
                                        onDeleteSuccessful={() => afterDelete("Bank Passbook")}
                                        upload={`/cr-documents-upload?id=${id}&name=passbook`}
                                        required="true"
                                    />
                                </div>
                            )}

                            {data?.nomineeDocRequired && (
                                <div className="col-md-4">
                                    <FPUploader
                                        fileURL={preViewData?.nominee ? process.env.APP_BASE + preViewData?.nominee : ""}
                                        title="Upload Nominee Declaration"
                                        maxFileSize="150KB"
                                        description="Please upload pdf only. File size must be under 150 KB"
                                        acceptedFileTypes={["application/pdf"]}
                                        name="nominee"
                                        onUploadSuccessful={() => afterSuccess("Nominee Declaration")}
                                        onDeleteSuccessful={() => afterDelete("Nominee Declaration")}
                                        upload={`/cr-documents-upload?id=${id}&name=nominee`}
                                        required="true"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="form-group">
                            <div className="d-grid d-md-flex justify-content-md-end">
                                <button className="btn btn-success btn-sm" type="button" disabled={disabled}>
                                    <Link to={"/change-request/final-review/" + id} style={{ textDecoration: "none", color: "#fff" }}>
                                        Go Next
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentsForm;
