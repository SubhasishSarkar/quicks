/* eslint-disable no-unused-vars */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Humanize } from "../../../utils";

const UsersManagementListFilter = ({ handleSubmit, form, handleChange }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const clearParams = () => {
        setSearchParams();
        form.searchBy.value = "";
        form.searchVal.value = "";
    };
    return (
        <>
            <form noValidate onSubmit={handleSubmit} className="filter_box">
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="searchBy" className="form-control-label">
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
                            <option value="name">Name</option>
                            <option value="username">Username</option>
                            <option value="employee_id">Employee Id</option>
                            <option value="area">Area</option>
                            <option value="mobile">Mobile</option>
                        </select>
                        <div className="invalid-feedback">{form.searchBy.error}</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="searchBy" className="form-control-label">
                            Enter Preference {form.searchVal.required && <span className="text-danger">*</span>}
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
                        <div className="mt-4 d-md-flex gap-2">
                            <button type="submit " className="btn btn-success btn-sm">
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => clearParams()}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default UsersManagementListFilter;
