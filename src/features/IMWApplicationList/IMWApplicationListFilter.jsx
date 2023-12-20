import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useValidate } from "../../hooks";
import { searchParamsToObject } from "../../utils";
import GPWardSelect from "../../components/select/GPWardSelect";
import { useSelector } from "react-redux";

const defaultSearchOptions = [
    { value: "ssin_no", name: "SSIN" },
    { value: "registration_no", name: "Registration No." },
    { value: "aadhaar", name: "Aadhaar" },
];
const ControlledIMWApplicationListFilter = ({ isLoading, isFetching, searchOptions = defaultSearchOptions, type, setFetchAgain, gpFilterAddOn }) => {
    const user = useSelector((state) => state.user.user);

    const [searchParams, setSearchParams] = useSearchParams();
    const [clear, setClear] = useState(false);
    const [form, validator] = useValidate(
        {
            gpWardCode: { value: "", validate: "" },
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

                case "gpWardCode":
                    setState((state) => {
                        if (value) {
                            state.searchVal.required = false;
                            state.searchVal.value = "";
                            state.searchVal.error = null;

                            state.searchBy.required = false;
                            state.searchBy.value = "";
                            state.searchBy.error = null;
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

            newState.gpWardCode.value = "";

            return { ...newState };
        });
        // setSearchParams("");
        searchParams.set("searchBy", "");
        searchParams.set("searchVal", "");
        searchParams.set("gpWardCode", "0");
        setSearchParams(searchParams);
    };

    // console.log(searchOption)
    return (
        <>
            <form noValidate onSubmit={handleSubmit} className="filter_box">
                <div className="row">
                    {gpFilterAddOn && (
                        <div className="col-md-3">
                            <label htmlFor="gpWardCode" className="form-label mb-0">
                                GP/Ward {form.gpWardCode.required && <span className="text-danger">*</span>}
                            </label>
                            <GPWardSelect
                                className={`form-select ${form.gpWardCode.error && "is-invalid"}`}
                                id="gpWardCode"
                                name="gpWardCode"
                                required={form.gpWardCode.required}
                                value={form.gpWardCode.value ? form.gpWardCode.value : 0}
                                onChange={(e) => {
                                    handelChange({ name: "gpWardCode", value: e.currentTarget.value });
                                    setFetchAgain(e.currentTarget.value);
                                }}
                                block={user.blockCode}
                                option_all="true"
                                basedOnUser
                            />
                        </div>
                    )}

                    <div className="col-md-3">
                        <label htmlFor="searchBy" className="form-control-label">
                            Search By {form.searchBy.required && <span className="text-danger">*</span>}
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
                            <option value="">Select One</option>
                            {searchOptions && (
                                <>
                                    {searchOptions?.map((item) => (
                                        <option value={item.value} key={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        <div className="invalid-feedback">{form.searchBy.error}</div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchVal">SSIN/AADHAAR/Registration no. {form.searchVal.required && <span className="text-danger">*</span>}</label>
                        <input
                            placeholder="SSIN/Aadhaar no/Registration no."
                            className={`form-control ${form.searchVal.error && "is-invalid"}`}
                            type="text"
                            name="searchVal"
                            id="searchVal"
                            value={form.searchVal.value}
                            onChange={(e) => handelChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">{form.searchVal.error}</div>
                    </div>

                    <div className="col-md-3">
                        <div className="my-md-4 d-flex gap-2">
                            <button type="submit " className="btn btn-success btn-sm" disabled={isLoading || isFetching}>
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                disabled={isLoading || isFetching || clear || (!searchParams.get("searchBy") && !searchParams.get("searchVal"))}
                                onClick={() => {
                                    handleClear();
                                }}
                            >
                                <i className="fa-solid fa-broom"></i>Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ControlledIMWApplicationListFilter;
