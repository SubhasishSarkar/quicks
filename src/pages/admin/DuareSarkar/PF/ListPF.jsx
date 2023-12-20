import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../../hooks";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import SubDivSelect from "../../../../components/select/SubDivSelect";
import BMCNameSelect from "../../../../components/select/BMCNameSelect";
import GPWardSelect from "../../../../components/select/GPWardSelect";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../../utils";

import Pagination from "../../../../components/Pagination";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import noDataFound from "../../../../../public/assets/no_data.png";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";

const ListPF = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar PF Passbook List", url: "" }));
    }, []);

    const user = useSelector((state) => state.user.user);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchPassbook, setSearchPassbook] = useState();
    const { error, data, isFetching } = useQuery(["duare-sarkar-passbook-list-fetch", searchParams.toString()], () => fetcher(`/duare-sarkar-passbook-list-fetch?${searchParams.toString()}`), {
        enabled: searchPassbook == 1 ? true : false,
    });

    const [form, validator] = useValidate({
        district: { value: user?.role == "inspector" || user?.role == "ALC" ? user?.district : "", validate: "required" },
        subdivision: { value: user?.role == "inspector" || user?.role == "ALC" ? user?.subDivision : "", validate: "" },
        block: { value: user?.role == "inspector" ? user?.blockCode : "", validate: "" },
        gpWard: { value: "", validate: "" },
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
                                    <label htmlFor="district" className="form-control-label">
                                        District {form.district.required && <span className="text-danger">*</span>}
                                    </label>
                                    <DistrictSelect
                                        className={`form-select ${form.district.error && "is-invalid"}`}
                                        id="district"
                                        name="district"
                                        option_all="true"
                                        disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                        required={form.district.required}
                                        value={form.district.value}
                                        onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })}
                                    />

                                    <div className="invalid-feedback">{form.district.error}</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="subdivision" className="form-control-label">
                                        Sub Division {form.subdivision.required && <span className="text-danger">*</span>}
                                    </label>
                                    <SubDivSelect
                                        className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                        id="subdivision"
                                        name="subdivision"
                                        disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                        required={form.subdivision.required}
                                        value={form.subdivision.value}
                                        onChange={(e) => handleChange({ name: "subdivision", value: e.currentTarget.value })}
                                        districtCode={form.district.value}
                                    />
                                    <div className="invalid-feedback">{form.subdivision.error}</div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="block" className="form-control-label">
                                        Block {form.block.required && <span className="text-danger">*</span>}
                                    </label>
                                    <BMCNameSelect
                                        className={`form-select ${form.block.error && "is-invalid"}`}
                                        id="block"
                                        name="block"
                                        disabled={user?.role == "inspector" ? true : false}
                                        required={form.block.required}
                                        value={form.block.value}
                                        onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                        subDivision={form.subdivision.value}
                                    />
                                    <div className="invalid-feedback">{form.block.error}</div>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-control-label" htmlFor="gpWard">
                                        GP/Ward {form.gpWard.required && <span className="text-danger">*</span>}
                                    </label>
                                    <GPWardSelect
                                        className={`form-select ${form.gpWard.error && "is-invalid"}`}
                                        id="gpWard"
                                        name="gpWard"
                                        required={form.gpWard.required}
                                        value={form.gpWard.value}
                                        onChange={(e) => handleChange({ name: "gpWard", value: e.currentTarget.value })}
                                        block={form.block.value}
                                    />
                                    <div className="invalid-feedback">{form.gpWard.error}</div>
                                </div>
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

                                            {data && data?.data_Set.data.length > 0 ? (
                                                <>
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
                                                </>
                                            ) : (
                                                data && (
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={6} align="center">
                                                                <img src={noDataFound} alt="" style={{ height: "105%", width: "14%" }} />
                                                                <i className="fa-regular fa-face-sad-tear"></i> <span>NO DATA FOUND!</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            )}
                                        </table>
                                    </div>
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

export default ListPF;
