import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "../../utils";
import { useValidate } from "../../hooks";
import StatusSelect from "../select/StatusSelect";
import ApprovedSelect from "../select/ApprovedSelect";

const FilterList = ({ isLoading, isFetching }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [clear, setClear] = useState(false);
    const [form, validator] = useValidate(
        {
            status: { value: "", validate: "" },
            approved: { value: "", validate: "" },
        },
        searchParamsToObject(searchParams)
    );

    const handelChange = (evt) => {
        validator.validOnChange(evt);
        setClear(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validator.validate()) return;
        const data = validator.generalize();

        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        console.log(searchParams);
        setSearchParams(searchParams);
    };

    const handleClear = () => {
        setClear(true);
        validator.setState((prev) => {
            const newState = prev;
            newState.status.value = "";
            newState.searchBy.error = null;
            newState.approved.value = "";

            newState.searchVal.error = null;
            return { ...newState };
        });
        searchParams.set("status", "");
        searchParams.set("approved", "");
        setSearchParams(searchParams);
    };

    // console.log(searchOption)
    return (
        <form noValidate onSubmit={handleSubmit} className="filter_box">
            <div className="row">
                <div className="col-md-3">
                    <label htmlFor="status" className="form-label mb-0">
                        Status {form.status.required && <span className="text-danger">*</span>}
                    </label>
                    <StatusSelect
                        className={`form-select ${form.status.error && "is-invalid"}`}
                        id="status"
                        name="status"
                        required={form.status.required}
                        value={form.status.value ? form.status.value : 0}
                        onChange={(e) => {
                            handelChange({ name: "status", value: e.currentTarget.value });
                        }}
                    />
                </div>

                <div className="col-md-3">
                    <label htmlFor="approved" className="form-label mb-0">
                        Approved {form.approved.required && <span className="text-danger">*</span>}
                    </label>
                    <ApprovedSelect
                        className={`form-select ${form.approved.error && "is-invalid"}`}
                        id="approved"
                        name="approved"
                        required={form.approved.required}
                        value={form.approved.value ? form.approved.value : 0}
                        onChange={(e) => {
                            handelChange({ name: "approved", value: e.currentTarget.value });
                        }}
                    />
                </div>

                <div className="col-md-3">
                    <div className="my-md-4 d-flex gap-2">
                        <button type="submit" className="btn btn-success btn-sm" disabled={isLoading || isFetching}>
                            <i className="fa-solid fa-magnifying-glass"></i> Search
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            disabled={isLoading || isFetching || clear || (!searchParams.get("status") && !searchParams.get("approved"))}
                            onClick={() => {
                                handleClear();
                            }}
                        >
                            <i className="fa-solid fa-close"></i> Clear
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FilterList;
