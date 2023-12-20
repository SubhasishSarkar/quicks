import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useValidate } from "../../../../hooks";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";

const SearchPF = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar PF Passbook Search", url: "" }));
    }, []);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchPassbook, setSearchPassbook] = useState(0);

    const { error, data, isFetching } = useQuery(["duare-sarkar-search", searchParams.toString()], () => fetcher(`/duare-sarkar-search?${searchParams.toString()}`), { enabled: searchPassbook == 1 ? true : false });

    const [form, validator] = useValidate({
        ds_reg_no: { value: "", validate: "required" },
        ssin_no: { value: "", validate: "" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setSearchParams();
        setSearchPassbook(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
        setSearchPassbook(1);
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <form noValidate onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="ds_reg_no">
                                                Duare Sarkar Registration No {form.ds_reg_no.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="ds_reg_no"
                                                name="ds_reg_no"
                                                className={`form-control ${form.ds_reg_no.error && "is-invalid"}`}
                                                value={form.ds_reg_no.value}
                                                required={form.ds_reg_no.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.ds_reg_no.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="ssin_no">
                                                SSIN {form.ssin_no.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="ssin_no"
                                                name="ssin_no"
                                                className={`form-control ${form.ssin_no.error && "is-invalid"}`}
                                                value={form.ssin_no.value}
                                                required={form.ssin_no.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.ssin_no.error}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex gap-2">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                        <i className="fa-solid fa-magnifying-glass"></i> Search
                                    </button>
                                    <button className="btn btn-primary btn-sm" onClick={handleReset}>
                                        <i className="fa-solid fa-backward"></i> Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        {isFetching && <LoadingSpinner />}
                        <>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th>SL No</th>
                                                <th>Duare Sarkar Reg No.</th>
                                                <th>Duare Sarkar Reg Date</th>
                                                <th>SSIN</th>
                                                <th>Aadhaar No</th>
                                                <th>Collected By ARN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data &&
                                                data?.data_Set?.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.ds_reg_no}</td>
                                                            <td>{item.ds_reg_date}</td>
                                                            <td>{item.ssin_no}</td>
                                                            <td>{item.aadhaar_no}</td>
                                                            <td>{item.collected_by_arn}</td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchPF;
