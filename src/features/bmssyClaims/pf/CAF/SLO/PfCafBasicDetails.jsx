import { useMutation } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../../../utils";
import CastSelect from "../../../../../components/select/CastSelect";
import ReligionSelect from "../../../../../components/select/ReligionSelect";
import GenderSelect from "../../../../../components/select/GenderSelect";
import MaritalSelect from "../../../../../components/select/MaritalSelect";
import moment from "moment";

const PfCafBasicDetails = ({ form, handleChange, validator, isBackLog }) => {
    const { mutate } = useMutation((aadhar) => fetcher("/check-aadhaar-algorithm-with-duplicate?aadhaar=" + aadhar));
    const handleBlur = (e) => {
        mutate(e, {
            onSuccess(data, variables, context) {
                validator.setState((state) => {
                    state.aadhar.success = data.message;
                    state.aadhar.error = null;
                    return {
                        ...state,
                    };
                });
            },
            onError(error, variables, context) {
                validator.setState((state) => {
                    state.aadhar.success = null;
                    state.aadhar.error = error.message;
                    return {
                        ...state,
                    };
                });
            },
        });
    };

    return (
        <>
            <div className="card mb-2">
                <div className="card-body">
                    <h5 className="card-title">Beneficiary Basic Details</h5>
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="ssin">
                                    SSIN
                                </label>
                                <input
                                    type="text"
                                    id="ssin"
                                    name="ssin"
                                    className="form-control"
                                    value={form.ssin.value}
                                    required={form.ssin.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    disabled={isBackLog ? true : false}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="regNo">
                                    Registration Number {form.regNo.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="regNo"
                                    name="regNo"
                                    className={`form-control ${form.regNo.error && "is-invalid"}`}
                                    value={form.regNo.value}
                                    required={form.regNo.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.regNo.error}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="regDate">
                                    Registration Date {form.regDate.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="regDate"
                                    name="regDate"
                                    max="2017-03-31"
                                    min="2001-01-01"
                                    className={`form-control ${form.regDate.error && "is-invalid"}`}
                                    value={form.regDate.value}
                                    required={form.regDate.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.regDate.error}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="name">
                                    Full Name {form.name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="test"
                                    id="name"
                                    name="name"
                                    className={`form-control ${form.name.error && "is-invalid"}`}
                                    value={form.name.value}
                                    required={form.name.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.name.error}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="fatherName">
                                    Father Name {form.fatherName.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="test"
                                    id="fatherName"
                                    name="fatherName"
                                    className={`form-control ${form.fatherName.error && "is-invalid"}`}
                                    value={form.fatherName.value}
                                    required={form.fatherName.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.fatherName.error}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="dob">
                                    Date Of Birth {form.dob.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    max={moment(Date.now()).format("YYYY-MM-DD")}
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
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="mobile">
                                    Mobile {form.mobile.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="mobile"
                                    name="mobile"
                                    className={`form-control ${form.mobile.error && "is-invalid"}`}
                                    value={form.mobile.value}
                                    required={form.mobile.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.mobile.error}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="aadhar">
                                    Aadhar Number {form.aadhar.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="aadhar"
                                    name="aadhar"
                                    className={`form-control ${form.aadhar.error ? "is-invalid" : form.aadhar?.success && "is-valid"}`}
                                    value={form.aadhar.value}
                                    required={form.aadhar.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                        handleBlur(e.currentTarget.value);
                                    }}
                                />
                                <div id="Feedback" className={form.aadhar.error ? "invalid-feedback" : form.aadhar?.success ? "valid-feedback" : ""}>
                                    {form.aadhar.error ? form.aadhar.error : form.aadhar?.success && form.aadhar?.success}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <div className="form-group">
                                <label className="form-label" htmlFor="caste">
                                    Caste {form.caste.required && <span className="text-danger">*</span>}
                                </label>
                                <CastSelect placeholder="Caste" className={`form-select ${form.caste.error && "is-invalid"}`} type="text" value={form.caste.value} name="caste" id="caste" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.caste.error}</div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label" htmlFor="religion">
                                Religion {form.religion.required && <span className="text-danger">*</span>}
                            </label>
                            <ReligionSelect
                                placeholder="Religion"
                                className={`form-select ${form.religion.error && "is-invalid"}`}
                                type="text"
                                value={form.religion.value}
                                name="religion"
                                id="religion"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">{form.caste.error}</div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="gender" className="form-label">
                                    Gender {form.gender.required && <span className="text-danger">*</span>}
                                </label>
                                <GenderSelect
                                    className={`form-select ${form.gender.error && "is-invalid"}`}
                                    type="text"
                                    id="gender"
                                    name="gender"
                                    required={form.gender.required}
                                    value={form.gender.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.gender.error}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="maritalStatus" className="form-label">
                                    Marital Status {form.maritalStatus.required && <span className="text-danger">*</span>}
                                </label>
                                <MaritalSelect
                                    className={`form-select ${form.maritalStatus.error && "is-invalid"}`}
                                    type="text"
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    required={form.maritalStatus.required}
                                    value={form.maritalStatus.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.maritalStatus.error}</div>
                            </div>
                        </div>
                        {form.gender.value === "Female" && form.maritalStatus.value === "Married" && (
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="husbandName">
                                        Husband Name {form.husbandName.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="husbandName"
                                        name="husbandName"
                                        className={`form-control ${form.husbandName.error && "is-invalid"}`}
                                        value={form.husbandName.value}
                                        required={form.husbandName.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.husbandName.error}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PfCafBasicDetails;
