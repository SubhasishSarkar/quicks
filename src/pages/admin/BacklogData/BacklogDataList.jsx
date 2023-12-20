import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { fetcher, searchParamsToObject } from "../../../utils";
import LoadingOverlay from "../../../components/LoadingOverlay";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useValidate } from "../../../hooks";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import Pagination from "../../../components/Pagination";

const BacklogDataList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, data, isFetching, error } = useQuery(["back-log-data-list", searchParams.toString()], () => fetcher(`/back-log-data-list?${searchParams.toString()}`));

    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "" },
        },
        searchParamsToObject(searchParams)
    );

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "searchBy":
                    setState((state) => {
                        if (value) {
                            state.searchVal.required = true;
                            state.searchVal.validate = "required|length:12";
                            state.searchVal.error = null;
                        } else {
                            state.searchVal.required = false;
                            state.searchVal.validate = "";
                            state.searchVal.value = "";
                            state.searchVal.error = null;
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
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Backlog Beneficiary List", url: "" }));
    }, []);

    return (
        <>
            <form noValidate onSubmit={handleSubmit} className="filter_box">
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="searchBy" className="form-control-label">
                            Search By {form.searchBy.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            className={`form-select ${form.searchBy.error && "is-invalid"}`}
                            id="searchBy"
                            name="searchBy"
                            required={form.searchBy.required}
                            value={form.searchBy.value}
                            onChange={(e) => handleChange({ name: "searchBy", value: e.currentTarget.value })}
                        >
                            <option value="">Select One</option>
                            <option value="ssin_no">SSIN</option>
                            <option value="aadhaar">Aadhaar No</option>
                        </select>
                        <div className="invalid-feedback">{form.searchBy.error}</div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-control-label" htmlFor="searchVal">
                            SSIN/Aadhaar {form.searchVal.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="SSIN/Aadhaar No"
                            className={`form-control ${form.searchVal.error && "is-invalid"}`}
                            type="text"
                            value={form.searchVal.value}
                            name="searchVal"
                            id="searchVal"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">{form.searchVal.error}</div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-grid mt-3 d-md-flex ">
                            <button type="submit" className="btn btn-sm btn-success mt-2" disabled={isLoading || isFetching}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="card datatable-box mb-4">
                <div className="card-body">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <>
                            <div className="table-responsive">
                                {isFetching && <LoadingOverlay />}
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>SL No.</th>
                                            <th>SSIN</th>
                                            <th>Registration No</th>
                                            <th>Beneficiary Name</th>
                                            <th>Aadhar</th>
                                            <th>Block/Mun./Corr.</th>
                                            <th>Caf Form Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.data.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{data?.from + index}</td>
                                                    <td>{item.ssin}</td>
                                                    <td>{item.reg_number}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.aadhar_number}</td>
                                                    <td>{item.block_mun_name}</td>
                                                    <td>{item.caf_form_status}</td>
                                                    <td>
                                                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                            <button type="button" className="btn btn-sm">
                                                                <Link to={"/back-log-data-details/" + item.slug} style={{ textDecoration: "none" }}>
                                                                    <i className="fa-sharp fa-solid fa-eye"></i> View
                                                                </Link>
                                                            </button>
                                                            <button type="button" className="btn btn-sm">
                                                                <Link className="dropdown-item" to="" style={{ textDecoration: "none" }}>
                                                                    <i className="fa-solid fa-file-arrow-down"></i> Download
                                                                </Link>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
                <div className="card-footer">
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </div>
            </div>
        </>
    );
};

export default BacklogDataList;
