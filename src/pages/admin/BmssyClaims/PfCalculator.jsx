import React, { useEffect, useState } from "react";
import { useValidate } from "../../../hooks";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import PfCalculate from "../../../features/bmssyClaims/Pfcalculate";

const PfCalculator = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useState();
    const [form, validator] = useValidate({
        pf_ssin: { value: "", validate: "" },
        ds_end_dt: { value: "", validate: "" },
        search_type: { value: "", validate: "" },
    });

    useEffect(() => {
        dispatch(setPageAddress({ title: "PF Calculator", url: "" }));
    }, []);

    const { data, isFetching, error } = useQuery(["pfcalculation", searchParams], () => fetcher(`/pfcalculation?${searchParams}`), { enabled: searchParams ? true : false });

    const handleChange = (evt) => {
        //validator.validOnChange(evt);
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "search_type":
                    validator.setState((state) => {
                        state.pf_ssin.value = "";
                        state.pf_ssin.error = null;
                        return { ...state };
                    });
                    break;
            }
        });
        setSearchParams();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchParams(urlSearchParams.toString());
    };
    return (
        <>
            <div className="card datatable-box">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-control-label">Select Search By {form.search_type.required && <span className="text-danger">*</span>}</label>

                                <div className="form-check form-check-inline">
                                    <input
                                        className={`form-check-input ${form.search_type.error && "is-invalid"}`}
                                        type="radio"
                                        name="search_type"
                                        id="search_type1"
                                        onChange={() => handleChange({ name: "search_type", value: "radio_ssin" })}
                                        checked={form.search_type.value == "radio_ssin" ? true : false}
                                        value="radio_ssin"
                                        required={form.search_type.required}
                                    />
                                    <label className="form-check-label" htmlFor="search_type1">
                                        SSIN
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className={`form-check-input ${form.search_type.error && "is-invalid"}`}
                                        type="radio"
                                        name="search_type"
                                        id="search_type2"
                                        onChange={() => handleChange({ name: "search_type", value: "radio_registration_number" })}
                                        checked={form.search_type.value == "radio_registration_number" ? true : false}
                                        value="radio_registration_number"
                                        required={form.search_type.required}
                                    />
                                    <label className="form-check-label" htmlFor="search_type2">
                                        Registration Number
                                    </label>
                                    <div className="invalid-feedback">Please select search by</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="pf_ssin">
                                    SSIN/Old Registration No. {form.pf_ssin.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="pf_ssin"
                                    name="pf_ssin"
                                    className={`form-control ${form.pf_ssin.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.pf_ssin.value}
                                    required={form.pf_ssin.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.pf_ssin.error}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="ds_end_dt" className="form-label">
                                    Date of Death/Maturity Date
                                </label>
                                <input
                                    placeholder="Date of Death/Maturity Date"
                                    className={`form-control ${form.ds_end_dt.error && "is-invalid"}`}
                                    type="date"
                                    value={form.ds_end_dt.value}
                                    name="ds_end_dt"
                                    id="ds_end_dt"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.ds_end_dt.error}</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm mt-2" type="submit">
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && <PfCalculate data={data} />}
        </>
    );
};

export default PfCalculator;
