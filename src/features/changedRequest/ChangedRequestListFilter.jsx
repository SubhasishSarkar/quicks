import React, { useState } from "react";
import { searchParamsToObject } from "../../utils";
import { useSearchParams } from "react-router-dom";
import { useValidate } from "../../hooks";

export const ChangedRequestListFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [setClear] = useState(false);
    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const handelChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "searchBy":
                    setState((state) => {
                        if (value) {
                            state.searchVal.required = true;
                            state.searchVal.value = "";
                            state.searchVal.error = null;
                        } else {
                            state.searchVal.required = false;
                            state.searchVal.value = "";
                            state.searchVal.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
        setClear(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const handleClear = () => {
        setClear(true);
        validator.setState((prev) => {
            const newState = prev;
            newState.searchBy.value = "";
            newState.searchBy.required = "false";
            newState.searchBy.validate = "";
            newState.searchBy.error = null;
            newState.searchVal.value = "";
            newState.searchVal.required = "false";
            newState.searchVal.validate = "";
            newState.searchVal.error = null;
            return { ...newState };
        });
        setSearchParams("");
    };
    return (
        <>
            <form noValidate onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="searchBy" className="form-control-label">
                                Select Search Preference {form.searchBy.required && <span className="text-danger">*</span>}
                            </label>
                            <select
                                name="searchBy"
                                id="searchBy"
                                className={`form-select ${form.searchBy.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handelChange({ name: "searchBy", value: e.currentTarget.value });
                                }}
                                value={form.searchBy.value}
                            >
                                <option value="" disabled>
                                    Select One
                                </option>
                                <option value="cr_num">Changed Request Number</option>
                                <option value="ssin">SSIN</option>
                            </select>
                            <div className="invalid-feedback">{form.searchBy.error}</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="searchVal">Enter Preference value {form.searchVal.required && <span className="text-danger">*</span>}</label>
                            <input className={`form-control ${form.searchVal.error && "is-invalid"}`} type="text" name="searchVal" id="searchVal" value={form.searchVal.value} onChange={(e) => handelChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.searchVal.error}</div>
                        </div>

                        <div className="col-md-3">
                            <div className="my-md-4 d-flex gap-2">
                                <button type="submit " className="btn btn-success btn-sm">
                                    <i className="fa-solid fa-magnifying-glass"></i> Search
                                </button>
                                <button
                                    disabled={!form.searchBy.value && !form.searchVal.value}
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        handleClear();
                                    }}
                                >
                                    <i className="fa-solid fa-broom"></i> Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};
