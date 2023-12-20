import React from "react";
import moment from "moment";
import RelationSelect from "../../../../../components/select/RelationSelect";
import GenderSelect from "../../../../../components/select/GenderSelect";

const NomineeDetails = ({ form, handleChange }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header">Nominee details for pension benefit</div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-2">
                        <label htmlFor="nominee_name" className="form-label">
                            Nominee Name {form.nominee_name.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Nominee Name"
                            className={`form-control ${form.nominee_name.error && "is-invalid"}`}
                            type="text"
                            value={form.nominee_name.value}
                            onChange={(e) => handleChange(e.currentTarget)}
                            name="nominee_name"
                            id="nominee_name"
                            required={form.nominee_name.required}
                        />
                        <div className="invalid-feedback">Please enter Employer Name.</div>
                    </div>
                    <div className="col-md-2 mb-1">
                        <label htmlFor="relationship" className="form-control-label">
                            Relationship {form.relationship.required && <span className="text-danger">*</span>}
                        </label>
                        <RelationSelect
                            className={`form-select ${form.relationship.error && "is-invalid"}`}
                            type="text"
                            id="relationship"
                            name="relationship"
                            required={form.relationship.required}
                            value={form.relationship.value}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">Please select Relationship.</div>
                    </div>
                    <div className="col-md-2 mb-1">
                        <label htmlFor="gender" className="form-control-label">
                            Gender {form.gender.required && <span className="text-danger">*</span>}
                        </label>
                        <GenderSelect
                            className={`form-select ${form.gender.error && "is-invalid"}`}
                            type="text"
                            id="gender"
                            name="gender"
                            required={form.gender.required}
                            value={form.gender.value}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">Please select Gender.</div>
                    </div>

                    <div className="col-md-2 mb-1">
                        <label htmlFor="dob" className="form-control-label">
                            Date of Birth {form.dob.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            className={`form-control ${form.dob.error && "is-invalid"}`}
                            type="date"
                            id="dob"
                            name="dob"
                            required={form.dob.required}
                            value={form.dob.value}
                            onChange={(e) => handleChange(e.currentTarget)}
                            autoComplete="off"
                            onBlur={(e) => handleChange({ name: "age", value: moment().diff(e.currentTarget.value, "years", false) })}
                        />
                        <div className="invalid-feedback">{form.dob.error}</div>
                    </div>

                    <div className="col-md-2 mb-1">
                        <label htmlFor="age" className="form-control-label">
                            Age {form.age.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            disabled
                            className={`form-control ${form.age.error && "is-invalid"}`}
                            type="number"
                            id="age"
                            name="age"
                            required={form.age.required}
                            value={form.age.value}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">Please enter your age.</div>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="nominee_address" className="form-label">
                            Address {form.nominee_address.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Address"
                            className={`form-control ${form.nominee_address.error && "is-invalid"}`}
                            type="text"
                            value={form.nominee_address.value}
                            onChange={(e) => handleChange(e.currentTarget)}
                            name="nominee_address"
                            id="nominee_address"
                            required={form.nominee_address.required}
                        />

                        <div className="invalid-feedback">Please enter address</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NomineeDetails;
