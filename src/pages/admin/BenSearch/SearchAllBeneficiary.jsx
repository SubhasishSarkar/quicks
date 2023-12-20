import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ErrorAlert from "../../../components/list/ErrorAlert";
import SearchBeneficiaryResult from "../../../features/SearchBeneficiaryResult";
import { useValidate } from "../../../hooks";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const SearchAllBeneficiary = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Search Beneficiary", url: "" }));
    }, []);

    const [searchQuery, setSearchQuery] = useState();

    const { data, isFetching, error, remove } = useQuery(["search-all-beneficiary", searchQuery], () => fetcher("/search-all-beneficiary?" + searchQuery), { enabled: searchQuery ? true : false });

    const [form, validator] = useValidate({
        ssin: { value: "", validate: "" },
        aadhar: { value: "", validate: "" },
        registration_number: { value: "", validate: "" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "ssin":
                    setState((state) => {
                        if (value) {
                            state.ssin.required = true;
                            state.ssin.validate = "required|number|length:12";
                            state.ssin.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "aadhar":
                    setState((state) => {
                        if (value) {
                            state.aadhar.required = true;
                            state.aadhar.validate = "required|number|length:12";
                            state.aadhar.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "registration_number":
                    setState((state) => {
                        if (value) {
                            state.registration_number.required = true;
                            state.registration_number.validate = "required";
                            state.registration_number.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchQuery(urlSearchParams.toString());
    };

    const clearForm = (evt) => {
        evt.preventDefault();
        validator.reset();
        setSearchQuery("");
        remove();
    };

    return (
        <>
            <div className="card datatable-box mb-4">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-control-label" htmlFor="ssin">
                                    SSIN {form.ssin.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="ssin"
                                    name="ssin"
                                    className={`form-control ${form.ssin.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.ssin.value}
                                    required={form.ssin.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.ssin.error}
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-control-label" htmlFor="aadhar">
                                    Aadhaar Number {form.aadhar.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="aadhar"
                                    name="aadhar"
                                    className={`form-control ${form.aadhar.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.aadhar.value}
                                    required={form.aadhar.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.aadhar.error}
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-control-label" htmlFor="registration_number">
                                    Registration Number {form.registration_number.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="registration_number"
                                    name="registration_number"
                                    className={`form-control ${form.registration_number.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.registration_number.value}
                                    required={form.registration_number.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.registration_number.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <div className="d-flex gap-2">
                                <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                    {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Search
                                </button>
                                <button className="btn btn-warning btn-sm" disabled={!data && !error} onClick={(evt) => clearForm(evt)}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {error && <ErrorAlert error={error} />}

            <SearchBeneficiaryResult data={data} />
        </>
    );
};

export default SearchAllBeneficiary;
