import React from "react";
import { useSearchParams } from "react-router-dom";
import { Humanize } from "../../../utils";

const ClaimSearchFilter = ({ handleSubmit, form, handleChange, validator }) => {
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const clearParams = () => {
        validator.reset();
        form.searchBy.value = "";
        form.searchVal.value = "";
        setSearchParams();
    };
    return (
        <>
            <form noValidate onSubmit={handleSubmit} className="filter_box">
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="searchBy">
                            Select Search Preference {form.searchBy.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            className={`form-select  ${form.searchBy.error && "is-invalid"}`}
                            id="searchBy"
                            name="searchBy"
                            required={form.searchBy.required}
                            value={form.searchBy.value}
                            onChange={(e) => handleChange({ name: "searchBy", value: e.currentTarget.value })}
                        >
                            <option value="">Select One</option>
                            <option value="ssin">SSIN</option>
                            <option value="registration_no">Registration No</option>
                            <option value="aadhar">Aadhar</option>
                            <option value="claim_reference_no">Claim Reference No</option>
                        </select>
                        <div className="invalid-feedback">{form.searchBy.error}</div>
                    </div>
                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="searchBy">
                            Enter Preference Value {form.searchVal.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder={form.searchBy.value ? "Enter " + Humanize(form.searchBy.value) : ""}
                            className={`form-control ${form.searchVal.error && "is-invalid"}`}
                            type="text"
                            value={form.searchVal.value}
                            name="searchVal"
                            id="searchVal"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">{form.searchVal.error}</div>
                    </div>
                    <div className="col-md-4">
                        <div className="mt-4 d d-md-flex gap-2">
                            <button type="submit " className="btn btn-success btn-sm">
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button type="button" className="btn btn-warning btn-sm" onClick={() => clearParams()} disabled={form.searchBy.value === "" && form.searchVal.value === "" ? true : false}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ClaimSearchFilter;
