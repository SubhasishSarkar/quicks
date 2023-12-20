import React from "react";

const MaritalStatusForm = ({ form, handleChange }) => {
    return (
        <>
            <div className="card mb-3">
                <div className="section_title">
                    <strong>Marital Status</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-control-label" htmlFor="maritalStatus">
                                Marital Status {form.maritalStatus.required && <span className="text-danger">*</span>}
                            </label>
                            <select
                                className={`form-select ${form.maritalStatus.error && "is-invalid"}`}
                                id="maritalStatus"
                                name="maritalStatus"
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.maritalStatus.value}
                                required={form.maritalStatus.required}
                            >
                                <option value="">-Select-</option>
                                <option value="Married">Married</option>
                                <option value="Unmarried">Unmarried</option>
                                <option value="Widow">Widow</option>
                                <option value="Widower">Widower</option>
                                <option value="Divorcee">Divorcee</option>
                            </select>
                            <div id="Feedback" className="invalid-feedback">
                                {form.maritalStatus.error}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-control-label" htmlFor="husName">
                                Husband Name / Spouse Name {form.husName.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="husName"
                                name="husName"
                                className={`form-control ${form.husName.error && "is-invalid"}`}
                                value={form.husName.value}
                                required={form.husName.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.husName.error}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MaritalStatusForm;
