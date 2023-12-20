import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CheckBox } from "../../../components/form/checkBox";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";

const ImwClaimSubmitForm = ({ id }) => {
    const { data: checkChronological } = useQuery(["check-chronological-order", id], () => fetcher(`/check-chronological-order?id=${id}&status='1'`));

    const [form, validator] = useValidate({
        action: { value: "", validate: "required" },
        remark: { value: "", validate: "required" },
        excRemark: { value: "", validate: "" },
        hardCopy: { value: "", validate: "required" },
        id: { value: id, validate: "" },
        claimType: { value: "Disability", validate: "" },
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

    return (
        <>
            <div className="card datatable-box shadow mb-2">
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
                                        <option value="A">Forward to ALC for approval</option>

                                        <option value="R">Recommend for Rejection to ALC</option>
                                    </select>
                                    <div className="invalid-feedback">{form.action.error}</div>
                                </div>
                            </div>

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

                        <div className="col-md-12">
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

export default ImwClaimSubmitForm;
