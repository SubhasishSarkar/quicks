import React from "react";

const NameAndDobForm = ({ form, handleChange }) => {
    return (
        <>
            <div className="card mb-3">
                <div className="section_title">
                    <strong>Name and Date of Birth</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-control-label" htmlFor="name">
                                Full Name {form.name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-control ${form.name.error && "is-invalid"}`}
                                value={form.name.value}
                                required={form.name.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                disabled
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.name.error}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-control-label" htmlFor="dob">
                                Date Of Birth {form.dob.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                className={`form-control ${form.dob.error && "is-invalid"}`}
                                value={form.dob.value}
                                required={form.dob.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.dob.error}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NameAndDobForm;
