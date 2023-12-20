import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";

const AlcPfClaimDetailsSubmitForm = ({ id, status, SubmitStatus, approveAmount }) => {
    const [runUseQuery, setRunUseQuery] = useState(false);
    useEffect(() => {
        if (id) setRunUseQuery(true);
    }, [id]);

    const { data: checkChronological, isLoading: loadingChronological, error } = useQuery(["check-chronological-order", id, status], () => fetcher(`/check-chronological-order?id=${id}&status='${status}'`), { enabled: runUseQuery ? true : false });

    const [form, validator] = useValidate({
        action: { value: "", validate: "required" },
        remark: { value: "", validate: "required" },
        excRemark: { value: "", validate: "" },
        id: { value: id, validate: "" },
        claimType: { value: "Pf", validate: "" },
    });

    useEffect(() => {
        if (checkChronological)
            validator.setState((state) => {
                state.excRemark.validate = "required";
                return { ...state };
            });
    }, [checkChronological]);

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/alc-from-action-submit`, body: formData },
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

    return (
        <>
            {checkChronological && error && <ErrorAlert error={error} />}
            {loadingChronological && <LoadingSpinner />}
            <div className="card datatable-box shadow mb-3">
                <div className="card-header">Please Submit Your Preference</div>

                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
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
                                    {SubmitStatus === "10" ? (
                                        <option disabled value="B">
                                            Back for Rectification to Inspector
                                        </option>
                                    ) : (
                                        <option value="B">Back for Rectification to Inspector</option>
                                    )}
                                    <option value="BI">Back for Rectification to SLO</option>
                                    {SubmitStatus === "10" ? (
                                        <option disabled value="A">
                                            Approve
                                        </option>
                                    ) : approveAmount && approveAmount != 0 ? (
                                        <option value="A">Approve</option>
                                    ) : (
                                        ""
                                    )}
                                    <option value="R">Reject</option>
                                </select>
                                <div className="invalid-feedback">{form.action.error}</div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label" htmlFor="remark">
                                    Enter Remark {form.remark.required && <span className="text-danger">*</span>}
                                </label>
                                <textarea className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.remark.value} name="remark" id="remark" onChange={(e) => handleChange(e.currentTarget)} cols="40" rows="10"></textarea>
                                {/* <input className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.remark.value} name="remark" id="remark" onChange={(e) => handleChange(e.currentTarget)} /> */}
                                <div className="invalid-feedback">{form.remark.error}</div>
                            </div>
                            {checkChronological && (
                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="excRemark">
                                        Enter Exception Remark {checkChronological && <span className="text-danger">*</span>}
                                    </label>
                                    <textarea
                                        className={`form-control ${form.excRemark.error && "is-invalid"}`}
                                        type="text"
                                        value={form.excRemark.value}
                                        name="excRemark"
                                        id="excRemark"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                        cols="40"
                                        rows="10"
                                    ></textarea>
                                    {/* <input className={`form-control ${form.excRemark.error && "is-invalid"}`} type="text" value={form.excRemark.value} name="excRemark" id="excRemark" onChange={(e) => handleChange(e.currentTarget)} /> */}
                                    <div className="invalid-feedback">{form.excRemark.error}</div>
                                </div>
                            )}
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

export default AlcPfClaimDetailsSubmitForm;
