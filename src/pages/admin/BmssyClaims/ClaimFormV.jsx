import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import FPUploader from "../../../components/FPUploader";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const ClaimFormV = () => {
    const [pfClaimBy, setPfClaimBy] = useState("");
    const { id } = useParams();
    const [params] = useSearchParams();
    const type = params.get("type");
    const { error, data, isFetching } = useQuery(["get-form-v-details", id, type], () => fetcher(`/get-form-v-details?id=${id}&type=${type}`), { enabled: id ? true : false });

    let claimType = "";
    if (type === "Death") claimType = "death";
    if (type === "Disability") claimType = "disability";
    if (type === "Pf") claimType = "pf";

    useEffect(() => {
        if (claimType === "pf") setPfClaimBy(data?.claim_by);
    }, [data?.claim_by]);

    const { data: preViewData } = useQuery(["claim-documents-preview", id, claimType, pfClaimBy], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimType}&claimBy=${pfClaimBy}`));

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };
    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("claim-documents-preview");
    };

    const { mutate } = useMutation(() => fetcher(`/claim-final-submit?id=${id}&type=${type}&delay=${parseInt(data?.delay)}`));
    const navigate = useNavigate();
    const goNextPage = (id) => {
        mutate(id, {
            onSuccess(data, variables, context) {
                toast.success("Claim entry successfully saved.");
                navigate("/claim/list");
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim Details", url: "/claim/details/" + id, subTitle: "Upload Form V", subUrl: "" }));
    }, []);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card datatable-box mb-2">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon3">
                                        Beneficiary Name
                                    </span>
                                    <input type="text" value={data?.beneficiary_name} className="form-control" disabled />
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon3">
                                        SSIN
                                    </span>
                                    <input type="text" value={data?.ssin_no} className="form-control" disabled />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <FPUploader
                                    // fileURL={preViewData?.formV ? process.env.APP_BASE + "/" + preViewData?.formV : ""}
                                    fileURL={preViewData?.formV ? process.env.APP_BASE + preViewData?.formV : ""}
                                    title="Upload Form V"
                                    maxFileSize="150KB"
                                    description="Please upload pdf only. File size must be under 150 KB"
                                    acceptedFileTypes={["application/pdf"]}
                                    name="fromV"
                                    onUploadSuccessful={() => afterSuccess("Form V")}
                                    onDeleteSuccessful={() => afterDelete("Form V")}
                                    upload={`/form-v-documents-upload?id=${id}&type=${type}&name=formv`}
                                    required="true"
                                />
                            </div>

                            {data && parseInt(data?.delay) > 90 && (
                                <div className="col-md-6">
                                    <FPUploader
                                        fileURL={preViewData?.delay ? process.env.APP_BASE + preViewData?.delay : ""}
                                        title="Prayer for condonation of delay"
                                        maxFileSize="150KB"
                                        description="Please upload pdf only. File size must be under 150 KB"
                                        acceptedFileTypes={["application/pdf"]}
                                        name="fromV"
                                        onUploadSuccessful={() => afterSuccess("Prayer for Delay Condonation")}
                                        onDeleteSuccessful={() => afterDelete("Prayer for Delay Condonation")}
                                        upload={`/form-v-documents-upload?id=${id}&type=${type}&name=delay`}
                                        required="true"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="button">
                                <Link to={"/claim/details/" + id} style={{ textDecoration: "none", color: "#fff" }}>
                                    <i className="fa-solid fa-circle-arrow-left"></i> Go Back
                                </Link>
                            </button>
                            <button className="btn btn-success btn-sm" type="button" onClick={(id) => goNextPage(id)}>
                                <i className="fa-solid fa-cloud-arrow-up"></i> Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClaimFormV;
