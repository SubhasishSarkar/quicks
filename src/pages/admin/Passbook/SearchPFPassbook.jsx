import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useMutation } from "@tanstack/react-query";
import { useValidate } from "../../../hooks";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { toast } from "react-toastify";
import { updater } from "../../../utils";
import NoDataFound from "../../../components/list/NoDataFound";

const SearchPFPassbook = () => {
    const [searchPassbook, setSearchPassbook] = useState({});
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "PF Passbook Search", url: "" }));
    }, []);

    const [form, validator] = useValidate({
        ssin_no: { value: "", validate: "required|number|length:12" },
    });

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();

        mutate(
            { url: `/ppu-search`, body: { data } },
            {
                onSuccess(data) {
                    setSearchPassbook(data);
                },
                onError(error) {
                    toast.error(error.message);
                    validator.setError(error.message);
                },
            }
        );
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleReset = () => {
        setSearchPassbook([]);
        validator.reset();
    };

    return (
        <>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <form noValidate onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
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
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                        Search
                                    </button>
                                    <button className="btn btn-warning btn-sm" type="button" onClick={handleReset}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <LoadingSpinner />}
                            {searchPassbook && searchPassbook?.dataSet?.length === 0 ? (
                                <NoDataFound />
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm">
                                            <thead>
                                                <tr>
                                                    <th>SL No</th>
                                                    <th>SSIN No</th>
                                                    <th>Submit Date</th>
                                                    <th>Aadhaar No.</th>
                                                    <th>Period From</th>
                                                    <th>Period To</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {searchPassbook?.dataSet?.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.ssin_no}</td>
                                                            <td>{item.submitted_dt}</td>
                                                            <td>{item.aadhaar_no}</td>
                                                            <td>{item.period_from}</td>
                                                            <td>{item.period_to}</td>
                                                            <td>SERVICE DELIVERED</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchPFPassbook;
