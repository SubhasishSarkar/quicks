import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../../utils";
import { useValidate } from "../../../../hooks";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import NoDataFound from "../../../../components/list/NoDataFound";
import Pagination from "../../../../components/Pagination";

const ListPFSP = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar PF Passbook List", url: "" }));
    }, []);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchPassbook, setSearchPassbook] = useState();
    const { error, data, isFetching } = useQuery(["duare-sarkar-passbook-list-fetch", searchParams.toString()], () => fetcher(`/duare-sarkar-passbook-list-fetch?${searchParams.toString()}`), {
        enabled: searchPassbook == 1 ? true : false,
    });

    const [form, validator] = useValidate({
        dsDate: { value: "", validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setSearchPassbook();
        setSearchParams();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchPassbook(1);
        setSearchParams(searchParams);
    };
    return (
        <>
            {error && <ErrorAlert error={error} />}
            <form noValidate onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="form-control-label" htmlFor="dsDate">
                                            Duare Sarkar Registration Date {form.dsDate.required && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            type="date"
                                            id="dsDate"
                                            name="dsDate"
                                            className={`form-control ${form.dsDate.error && "is-invalid"}`}
                                            value={form.dsDate.value}
                                            required={form.dsDate.required}
                                            onChange={(e) => {
                                                handleChange(e.currentTarget);
                                            }}
                                        />
                                        <div id="Feedback" className="invalid-feedback">
                                            {form.dsDate.error}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-group me-2 mb-2">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                        {isFetching ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "View"}
                                    </button>
                                </div>
                                <div className="btn-group me-2 mb-2">
                                    <button className="btn btn-primary btn-sm" onClick={handleReset}>
                                        <i className="fa-solid fa-backward"></i> Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                {isFetching ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        {data && data?.data_Set.data.length > 0 ? (
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
                                                        {data?.data_Set?.data?.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{data?.data_Set?.from + index}</td>
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
                                        ) : (
                                            <NoDataFound />
                                        )}
                                    </>
                                )}

                                {data && data?.data_Set.data.length > 0 && <Pagination data={data?.data_Set} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ListPFSP;
