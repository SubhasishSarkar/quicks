import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NoDataFound from "../../../components/list/NoDataFound";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Pagination from "../../../components/Pagination";
import { useValidate } from "../../../hooks";
import { fetcher, searchParamsToObject } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const DeathClaimBacklogData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const { isFetching, data } = useQuery(["death-claim-backlog-data", searchParams.toString()], () => fetcher(`/death-claim-backlog-data?${searchParams.toString()}`), { keepPreviousData: true });

    const [form, validator] = useValidate(
        {
            search_type: { value: "", validate: "required" },
            ssin: { value: "", validate: "" },
            aadhar: { value: "", validate: "" },
            registration_number: { value: "", validate: "" },
        },
        searchParamsToObject(searchParams)
    );

    const handleChange = (evt) => {
        // validator.validOnChange(evt);
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "search_type":
                    setState((state) => {
                        if (value === "radio_ssin") {
                            state.aadhar.required = false;
                            state.aadhar.validate = "";
                            state.aadhar.value = "";
                            state.aadhar.error = null;

                            state.registration_number.required = false;
                            state.registration_number.validate = "";
                            state.registration_number.value = "";
                            state.registration_number.error = null;

                            state.ssin.required = true;
                            state.ssin.validate = "required";
                            state.ssin.value = "";
                            state.ssin.error = null;
                        } else if (value === "radio_aadhar_no") {
                            state.ssin.required = false;
                            state.ssin.validate = "";
                            state.ssin.value = "";
                            state.ssin.error = null;

                            state.registration_number.required = false;
                            state.registration_number.validate = "";
                            state.registration_number.value = "";
                            state.registration_number.error = null;

                            state.aadhar.required = true;
                            state.aadhar.validate = "required";
                            state.aadhar.value = "";
                            state.aadhar.error = null;
                        } else if (value === "radio_registration_number") {
                            state.ssin.required = false;
                            state.ssin.validate = "";
                            state.ssin.value = "";
                            state.ssin.error = null;

                            state.aadhar.required = false;
                            state.aadhar.validate = "";
                            state.aadhar.value = "";
                            state.aadhar.error = null;

                            state.registration_number.required = true;
                            state.registration_number.validate = "required";
                            state.registration_number.value = "";
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
        const data = validator.generalize();
        searchParams.set("page", 1);
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const searchClearHAndler = () => {
        validator.setState((state) => {
            state.search_type.value = "";
            state.registration_number.value = "";
            state.aadhar.value = "";
            state.ssin.value = "";
            return { ...state };
        });
        navigate("/claim/death-claim-backlog-data");
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Death Claim Backlog Data", url: "" }));
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="search_type">
                            Select Search By {form.search_type.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            name="search_type"
                            id="search_type"
                            className={`form-select ${form.search_type.error && "is-invalid"}`}
                            value={form.search_type.value}
                            required={form.search_type.required}
                            onChange={(e) => {
                                handleChange(e.currentTarget);
                            }}
                        >
                            <option value="">-Select-</option>
                            <option value="radio_ssin">SSIN</option>
                            <option value="radio_aadhar_no">Aadhaar Number</option>
                            <option value="radio_registration_number">Numerical Digits of Registration Number</option>
                        </select>
                        <div id="Feedback" className="invalid-feedback">
                            {form.search_type.error}
                        </div>
                    </div>
                    {form.search_type.value === "radio_ssin" && (
                        <div className="col-md-4">
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
                    )}

                    {form.search_type.value === "radio_aadhar_no" && (
                        <div className="col-md-4">
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
                    )}

                    {form.search_type.value === "radio_registration_number" && (
                        <div className="col-md-4">
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
                    )}
                    <div className="col-md-4">
                        <div className="d-grid mt-3 d-md-flex ">
                            <button className="btn btn-success btn-sm m-2" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Search
                            </button>
                            <button className="btn btn-secondary btn-sm m-2" onClick={searchClearHAndler} disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="card datatable-box  mb-4">
                <div className="card-body">
                    {data?.data?.length > 0 && (
                        <div className="table-responsive">
                            {isFetching && <LoadingOverlay />}
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Name</th>
                                        <th>Occupation</th>
                                        <th>Registration Number</th>
                                        <th>SSIN</th>
                                        <th>Aadhar</th>
                                        {/* <th>Epic</th> */}
                                        <th>District</th>
                                        <th>Subdivision</th>
                                        <th>Gp / Ward</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data?.from + index}</td>
                                                <td>{item.name}</td>
                                                <td>{item.occupation}</td>
                                                <td>{item.registration_number}</td>
                                                <td>{item.ssin}</td>
                                                <td>{item.aadhaar}</td>
                                                {/* <td>{item.epic_number}</td> */}
                                                <td>{item.district}</td>
                                                <td>{item.subdivision}</td>
                                                <td>{item.gp_ward}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!data?.data?.length > 0 && <NoDataFound />}
                    {data?.data?.length > 0 && <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
                </div>
            </div>
        </>
    );
};

export default DeathClaimBacklogData;
