import React from "react";
import { useValidate } from "../../../hooks";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../../../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PendingApplicationSubmitByImw = ({ data, newId }) => {
    const [form, validator] = useValidate({
        action: { value: "", validate: "required" },
        remarks: { value: "", validate: "required" },
        applicationId: { value: newId, validate: "" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body }));
    // const query = useQueryClient();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const remarkData = validator.generalize();
        mutate(
            { url: `/add-action-remark-by-imw`, body: remarkData },
            {
                onSuccess(remarkData, variables, context) {
                    toast.success(remarkData.msg);
                    navigate("/application-list/pending");
                    // query.invalidateQueries("approved-beneficiary-details");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    return (
        <div>
            <div className="card datatable-box mb-2">
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div className="card-header py-2">
                        <h5 className="m-0 font-weight-bold text-white">Action & Remarks</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="action" className="form-label">
                                    Action<span className="text-danger">*</span>
                                </label>
                                <select
                                    aria-label="Default select example"
                                    className={`form-select ${form.action.error && "is-invalid"}`}
                                    id="action"
                                    name="action"
                                    required={form.action.required}
                                    value={form.action.value}
                                    onChange={(e) => handleChange({ name: "action", value: e.currentTarget.value })}
                                >
                                    <option value="">Select One</option>
                                    <option value="B">Back for Rectification</option>
                                    <option value="A">Approve</option>
                                    <option value="R">Reject</option>
                                </select>
                                <div className="invalid-feedback">Please select the Action</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="remarks" className="form-label">
                                    Remark<span className="text-danger">*</span>
                                </label>
                                <textarea className={`form-control ${form.remarks.error && "is-invalid"}`} type="text" value={form.remarks.value} name="remarks" id="remarks" onChange={(e) => handleChange(e.currentTarget)}></textarea>
                                <div className="invalid-feedback">Please write a remarks</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PendingApplicationSubmitByImw;
