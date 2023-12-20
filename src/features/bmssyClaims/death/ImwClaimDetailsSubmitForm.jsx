import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CheckBox } from "../../../components/form/checkBox";
import FPUploader from "../../../components/FPUploader";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";

const ImwClaimDetailsSubmitForm = ({ id, approvedShare, claimShare, duplicateBankDataSSIN, aadhaarDuplicateStatus }) => {
    const { data: claimTypeData } = useQuery(["get-claim-type", id], () => fetcher(`/get-claim-type?id=${id}`), { enabled: id ? true : false });

    const { data: checkChronological } = useQuery(["check-chronological-order", id], () => fetcher(`/check-chronological-order?id=${id}&status='1'`));

    const [form, validator] = useValidate({
        action: { value: "", validate: "required" },
        approvedShare: { value: "", validate: "" },
        remark: { value: "", validate: "required" },
        excRemark: { value: "", validate: "" },
        hardCopy: { value: "", validate: "required" },
        id: { value: id, validate: "" },
        claimType: { value: "Death", validate: "" },
        claimShare: { value: claimShare, validate: "" },
        duplicateBankDataSSIN: { value: duplicateBankDataSSIN, validate: "" },
    });
    useEffect(() => {
        if (checkChronological)
            validator.setState((state) => {
                state.excRemark.validate = "required";
                return { ...state };
            });
    }, [checkChronological]);

    const [enquiry, setEnquiry] = useState(true);

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "action":
                    setState((state) => {
                        if (value === "A") {
                            state.approvedShare.required = true;
                            state.approvedShare.validate = "required|number";
                            state.approvedShare.value = "";
                            state.approvedShare.error = null;
                            setEnquiry(true);
                        } else {
                            state.approvedShare.required = false;
                            state.approvedShare.validate = "";
                            state.approvedShare.value = "";
                            state.approvedShare.error = null;
                            setEnquiry(false);
                        }
                        return { ...state };
                    });
                    break;
                case "approvedShare":
                    setState((state) => {
                        if (approvedShare != undefined && 100 - parseInt(approvedShare) < parseInt(value)) {
                            state.approvedShare.error = "Another nominee already approved share : " + approvedShare + "%";
                        } else if (value > 100) {
                            state.approvedShare.error = "Share percentage exceeding 100%";
                        } else {
                            state.approvedShare.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return toast.error("Please fill all mandatory field");
        const formData = validator.generalize();

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

    const { data: preViewData } = useQuery(["claim-documents-preview", id, claimTypeData], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimTypeData.claimFor}`));

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("claim-documents-preview");
    };

    const [docReady, setDocReady] = useState(false)

    const isDocReady = (cb) => {
        setDocReady(cb);
    };

    return (
        <>
            <div className="card datatable-box mb-2">
                <div className="card-header py-2">Please Submit Your Action</div>
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check mb-2">
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
                                        {parseInt(approvedShare) > 100 || aadhaarDuplicateStatus ? (
                                            <option value="B" disabled>
                                                Forward to ALC for approval (100% claim is approved)
                                            </option>
                                        ) : (
                                            <option value="A">Forward to ALC for approval</option>
                                        )}

                                        <option value="R">Recommend for Rejection to ALC</option>
                                    </select>
                                    <div className="invalid-feedback">{form.action.error}</div>
                                </div>
                            </div>

                            {form.action.value === "A" && (
                                <div className="col-md-4">
                                    <div className="form-check mb-2">
                                        <label className="form-label" htmlFor="approvedShare">
                                            Approved Share {form.approvedShare.required && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            className={`form-control ${form.approvedShare.error && "is-invalid"}`}
                                            type="text"
                                            value={form.approvedShare.value}
                                            name="approvedShare"
                                            id="approvedShare"
                                            onChange={(e) => handleChange(e.currentTarget)}
                                        />
                                        <div className="invalid-feedback">{form.approvedShare.error}</div>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="remark">
                                        Enter Remark {form.remark.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.remark.value} name="remark" id="remark" onChange={(e) => handleChange(e.currentTarget)} />
                                    <div className="invalid-feedback">{form.remark.error}</div>
                                </div>
                            </div>
                            {checkChronological && (
                                <div className="col-md-4">
                                    <div className="form-check mb-2">
                                        <label className="form-label" htmlFor="excRemark">
                                            Enter Exception Remark {checkChronological && <span className="text-danger">*</span>}
                                        </label>
                                        <input className={`form-control ${form.excRemark.error && "is-invalid"}`} type="text" value={form.excRemark.value} name="excRemark" id="excRemark" onChange={(e) => handleChange(e.currentTarget)} />
                                        <div className="invalid-feedback">{form.excRemark.error}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="row">
                            {enquiry && (
                                <div className="col-md-4">
                                    <div className="form-check mb-2">
                                        <FPUploader
                                            fileURL={preViewData?.enquiryReport ? process.env.APP_BASE + preViewData?.enquiryReport : ""}
                                            title="Copy of enquiry report"
                                            maxFileSize="150KB"
                                            description="Please upload pdf only. File size must be under 150 KB"
                                            acceptedFileTypes={["application/pdf"]}
                                            name="enquiryReport"
                                            onUploadSuccessful={() => afterSuccess("Enquiry Report")}
                                            onDeleteSuccessful={() => afterDelete("Enquiry Report")}
                                            upload={`/claim-documents-upload?id=${id}&name=verify_certificate&claimType=${claimTypeData.claimFor}`}
                                            isFileReadyToUpload={isDocReady}
                                            required="true"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="col-md-6">
                                <div className="form-check">
                                    <CheckBox.Group
                                        value={form.hardCopy.value}
                                        onChange={(value) => {
                                            handleChange({ name: "hardCopy", value: [...value] });
                                        }}
                                    >
                                        <div className="form-check">
                                            <CheckBox className={`form-check-input ${form.hardCopy.error && "is-invalid"}`} value="hardCopy" name="hardCopy" id="hardCopy" required={form.hardCopy.required} />
                                            <label className="form-check-label" htmlFor="hardCopy">
                                                <h6> All relevant documents have been received in hard copy.</h6>
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
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading || docReady }>
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ImwClaimDetailsSubmitForm;
