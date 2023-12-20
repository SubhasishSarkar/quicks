import React from "react";
import { useSearchParams } from "react-router-dom";
import { useValidate } from "../../../../../hooks";
import { searchParamsToObject } from "../../../../../utils";

const FundRequestListSearchById = ({ type }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [form, validator] = useValidate(
        {
            searchVal: { value: "", validate: "required|number" },
        },
        searchParamsToObject(searchParams)
    );

    const clearParams = () => {
        form.searchVal.value = "";
        setSearchParams();
        validator.reset();
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        searchParams.set("page", 1);
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };
    return (
        <>
            <form noValidate onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="searchBy">
                            Enter Fund Request Id {form.searchVal.required && <span className="text-danger">*</span>}
                        </label>
                        <input className={`form-control ${form.searchVal.error && "is-invalid"}`} type="text" value={form.searchVal.value} name="searchVal" id="searchVal" onChange={(e) => handleChange(e.currentTarget)} />
                        <div className="invalid-feedback">{form.searchVal.error}</div>
                    </div>
                    <div className="col-md-4">
                        <div className="mt-4 d d-md-flex gap-2">
                            <button type="submit " className="btn btn-success btn-sm">
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button type="button" className="btn btn-warning btn-sm" onClick={() => clearParams()} disabled={form.searchVal.value === "" && form.searchVal.value === "" ? true : false}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default FundRequestListSearchById;
