import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetcher, updater } from "../../../utils";
import { useValidate } from "../../../hooks";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CheckBox } from "../../../components/form/checkBox";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import FPUploader from "../../../components/FPUploader";
import moment from "moment";

const ImwPfClaimSubmitFormTwoScheme = ({ id, data }) => {
    const { data: checkChronological, isLoading: loadingChronological } = useQuery(["check-chronological-order", id], () => fetcher(`/check-chronological-order?id=${id}&status='1'`));

    const claimType = data?.basicDetails?.claim_for;
    const claimBy = data?.basicDetails?.claim_by;
    const { data: preViewData } = useQuery(["claim-documents-preview", id, claimType, claimBy], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimType}&claimBy=${claimBy}`));

    const [form, validator] = useValidate({
        first_subscription_date: { value: "", validate: "" },
        action: { value: "", validate: "required" },
        remark: { value: "", validate: "required" },
        excRemark: { value: "", validate: "" },
        hardCopy: { value: "", validate: "required" },
        id: { value: id, validate: "" },
        claimType: { value: "Pf", validate: "" },
        approve_share: { value: "", validate: "" },
        excess: { value: "0", validate: "" },
        ssy_closing_balance: { value: "0", validate: "" },
        twoSchemStdt: { value: data?.startDate ? data?.startDate : "", validate: "" },
        upto_date: { value: data?.applicantDetails?.upto_date, validate: "required" },
    });

    useEffect(() => {
        validator.setState((state) => {
            if (checkChronological) state.excRemark.validate = "required";
            if (data.new_reg == "0" && data.worker_type != "ow") state.first_subscription_date.validate = "required";
            return { ...state };
        });
    }, []);

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        //if (!validator.validate()) return;
        const formData = validator.generalize();
        console.log(formData);
        mutate(
            { url: `/imw-from-action-submit`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.msg);
                    navigate("/claim/list");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("claim-documents-preview");
    };

    return (
        <>
            {loadingChronological && <LoadingSpinner />}

            <div className="card mb-2">
                <div className="card-header">PF Information</div>
                <div className="card-body">
                    <div className="card  mb-3">
                        <div className="section_title">
                            <strong>PF Details</strong>
                        </div>
                        <div className="card-body">
                            <div className="pf_details_section">
                                <div>
                                    <b>Date Of Birth :</b>
                                    {data?.applicantDetails?.date_of_birth}
                                </div>
                                <div>
                                    <b>Maturity Date :</b>
                                    {data?.applicantDetails?.maturity_dt}
                                </div>

                                <div>
                                    <b>Total Calculated Amount (Upto {data?.applicantDetails?.upto_date_1}) :</b>
                                    <span className="fs-6 fw-semibold font-monospace pf_amount">{data.old_ben == 0 ? data?.claim_amount : data?.applicantDetails?.claim_amount ? data?.applicantDetails?.claim_amount : "----"}</span>
                                </div>
                                <div>
                                    <b>Total Excess Amount (Upto {data?.applicantDetails?.upto_date_1}) :</b>
                                    <span className="fs-6 fw-semibold font-monospace pf_amount"> {data?.applicantDetails?.excess_amount ? data?.applicantDetails?.excess_amount : "----"}</span>
                                </div>
                                <div>
                                    <b>Total Payable Amount :</b>
                                    <span className="fs-6 fw-semibold font-monospace pf_amount"> {data?.payable_amount ? data?.payable_amount : "----"}</span>
                                </div>
                                <div>
                                    <b>
                                        Amount Payable from {data?.basicDetails?.workerTypeBoard} Upto {data?.applicantDetails?.upto_date_1} :
                                    </b>
                                    <span className="fs-6 fw-semibold font-monospace pf_amount"> {data?.applicantDetails?.approved_amount ? data?.applicantDetails?.approved_amount : "----"}</span>
                                </div>
                                {data?.twoschemeExcessOnly}
                                <div>
                                    <b>Excess Amount :</b>
                                    <input className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.excess.value} name="excess" id="excess" onChange={(e) => handleChange(e.currentTarget)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card datatable-box mb-2">
                <div className="card-header">Please Submit Your Action</div>
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="row">
                                    {data?.basicDetails.worker_type != "ow" &&
                                        data?.basicDetails.new_reg ==
                                            "0"(
                                                <div className="col-md-6 mb-2">
                                                    <div className="form-check">
                                                        <label htmlFor="first_subscription_date" className="form-label">
                                                            First Date Of PF Subscription {form.first_subscription_date.required && <span className="text-danger">*</span>}
                                                        </label>
                                                        <input
                                                            placeholder=""
                                                            className={`form-control ${form.first_subscription_date.error && "is-invalid"}`}
                                                            type="date"
                                                            value={form.first_subscription_date.value}
                                                            name="first_subscription_date"
                                                            id="first_subscription_date"
                                                            min="2017-04-01"
                                                            onChange={(e) =>
                                                                handleChange({
                                                                    name: "first_subscription_date",
                                                                    value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                                                })
                                                            }
                                                        />
                                                        <div className="invalid-feedback">{form.first_subscription_date.error}</div>
                                                    </div>
                                                </div>
                                            )}

                                    <div className="col-md-6 mb-2">
                                        <div className="form-check">
                                            <label className="form-label" htmlFor="action">
                                                Select Action {form.action.required && <span className="text-danger">*</span>}
                                            </label>
                                            <select
                                                id="action"
                                                name="action"
                                                className={`form-select ${form.action.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.action.value}
                                                required={form.action.required}
                                            >
                                                <option value="">Select</option>
                                                <option value="B">Back for Rectification</option>
                                                <option value="A">Forward to ALC for approval</option>

                                                <option value="R">Recommend for Rejection to ALC</option>
                                            </select>
                                            <div className="invalid-feedback">{form.action.error}</div>
                                        </div>
                                    </div>

                                    {form.action.value === "A" && data?.basicDetails?.type_of_claim == "12" && (
                                        <div className="col-md-6">
                                            <div className="form-check mb-2">
                                                <label className="form-label" htmlFor="approve_share">
                                                    Approved Share {form.approve_share.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    className={`form-control ${form.approve_share.error && "is-invalid"}`}
                                                    type="text"
                                                    value={form.approve_share.value}
                                                    name="approve_share"
                                                    id="approve_share"
                                                    onChange={(e) => handleChange(e.currentTarget)}
                                                />
                                                <div className="invalid-feedback">{form.approve_share.error}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-6 mb-2">
                                        <div className="form-check ">
                                            <label className="form-label" htmlFor="remark">
                                                Enter Remark {form.remark.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.remark.value} name="remark" id="remark" onChange={(e) => handleChange(e.currentTarget)} />
                                            <div className="invalid-feedback">{form.remark.error}</div>
                                        </div>
                                    </div>
                                    {checkChronological && (
                                        <div className="col-md-6 mb-2">
                                            <div className="form-check">
                                                <label className="form-label" htmlFor="excRemark">
                                                    Enter Exception Remark {checkChronological && <span className="text-danger">*</span>}
                                                </label>
                                                <input className={`form-control ${form.excRemark.error && "is-invalid"}`} type="text" value={form.excRemark.value} name="excRemark" id="excRemark" onChange={(e) => handleChange(e.currentTarget)} />
                                                <div className="invalid-feedback">{form.excRemark.error}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <label className="form-label" htmlFor="excRemark">
                                                Please clarify {form.hardCopy.required && <span className="text-danger">*</span>}
                                            </label>
                                            <CheckBox.Group
                                                value={form.hardCopy.value}
                                                onChange={(value) => {
                                                    handleChange({ name: "hardCopy", value: [...value] });
                                                }}
                                            >
                                                <div className="form-check">
                                                    <CheckBox className={`form-check-input ${form.hardCopy.error && "is-invalid"}`} value="hardCopy" name="hardCopy" id="hardCopy" required={form.hardCopy.required} />
                                                    <label className="form-check-label" htmlFor="hardCopy">
                                                        <span> All relevant documents have been received in hard copy.</span>
                                                    </label>
                                                    <div className="invalid-feedback">
                                                        <i className="fa-solid fa-triangle-exclamation"></i> Check this checkbox
                                                    </div>
                                                </div>
                                            </CheckBox.Group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <FPUploader
                                    fileURL={preViewData?.imwOtherDocument ? process.env.APP_BASE + preViewData?.imwOtherDocument : ""}
                                    title="Copy of any other document"
                                    maxFileSize="150KB"
                                    description="Please upload pdf only. File size must be under 150 KB"
                                    acceptedFileTypes={["application/pdf"]}
                                    name="enquiryReport"
                                    onUploadSuccessful={() => afterSuccess("Other Document")}
                                    onDeleteSuccessful={() => afterDelete("Other Document")}
                                    upload={`/claim-documents-upload?id=${id}&name=IMW_other_doc&claimType=${claimType}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ImwPfClaimSubmitFormTwoScheme;
