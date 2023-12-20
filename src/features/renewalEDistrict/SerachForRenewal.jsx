import React from "react";
import { useValidate } from "../../hooks";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const SearchForRenewal = ({ handleSubmit, isLoading }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const [form, validator] = useValidate({
        radiostacked: { value: searchParams.has("searchBy") ? searchParams.get("searchBy") : "regno", validate: "required" },
        ssin_reg: { value: searchParams.has("searchValue") ? searchParams.get("searchValue") : "", validate: "required" },
    });

    const clearHandler = () => {
        validator.setState((state) => {
            state.ssin_reg.value = "";
            state.ssin_reg.error = null;
            return { ...state };
        });
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "radiostacked":
                    if (value === "ssin") {
                        setState((state) => {
                            state.ssin_reg.validate = "required|length:12";
                            return { ...state };
                        });
                    } else {
                        setState((state) => {
                            state.ssin_reg.validate = "required";
                            return { ...state };
                        });
                    }
                    clearHandler();
                    break;
            }
        });
    };

    return (
        <>
            <div className="card datatable-box">
                <form
                    noValidate
                    onSubmit={(e) => {
                        query.invalidateQueries("renew-e-district", searchParams.toString());
                        e.preventDefault();
                        if (!validator.validate()) return;
                        const data = validator.generalize();
                        handleSubmit(data);
                    }}
                >
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Select Search Type {form.radiostacked.required && <span className="text-danger">*</span>}
                                </label>

                                <div className="form-check ">
                                    <input
                                        type="radio"
                                        value="ssin"
                                        checked={form.radiostacked.value == "ssin" ? true : false}
                                        className={`form-check-input`}
                                        id="radiostacked_ssin"
                                        name="radiostacked"
                                        onChange={() => handleChange({ name: "radiostacked", value: "ssin" })}
                                    />
                                    <label className="form-check-label" htmlFor="radiostacked">
                                        SSIN
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        value="regno"
                                        type="radio"
                                        checked={form.radiostacked.value == "regno" ? true : false}
                                        className={`form-check-input `}
                                        id="radiostacked_reg"
                                        name="radiostacked"
                                        onChange={() => handleChange({ name: "radiostacked", value: "regno" })}
                                    />
                                    <label className="form-check-label" htmlFor="radiostacked">
                                        Registration No.
                                    </label>
                                    <div className="invalid-feedback">More example invalid feedback text</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    SSIN / Registration Number {form.ssin_reg.required && <span className="text-danger">*</span>}
                                </label>

                                <div className="row">
                                    <div className="col-md-10">
                                        <input
                                            placeholder="Enter SSIN / registration number"
                                            className={`form-control ${form.ssin_reg.error && "is-invalid"}`}
                                            type="text"
                                            name="ssin_reg"
                                            id="ssin_reg"
                                            value={form.ssin_reg.value}
                                            onChange={(e) => handleChange(e.currentTarget)}
                                        />
                                    </div>
                                </div>

                                <label className="invalid-feedback" htmlFor="ssin_reg">
                                    {form.ssin_reg.error}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid  d-md-flex justify-content-md-end gap-2">
                            <button className="btn btn-success btn-sm " type="submit">
                                {isLoading ? "Loading..." : "Search"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SearchForRenewal;
