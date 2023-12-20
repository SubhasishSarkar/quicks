import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import DistrictSelect from "../../../components/select/DistrictSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import { useValidate } from "../../../hooks";
import { fetcher, searchParamsToObject } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { Link, useSearchParams } from "react-router-dom";
import TableList from "../../../components/table/TableList";
import moment from "moment";
import { SearchBeneficiaryStatus } from "../../../features/SearchBeneficiaryStatus";
import ErrorAlert from "../../../components/list/ErrorAlert";

const namePattern = /^[a-zA-Z ]+(\.|')?[a-zA-Z ]+(\.|')?/;
const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "name",
        headerName: "Name",
    },
    {
        field: 1,
        headerName: "Father / Husband Name",
        renderHeader: ({ father_name, husband_name }) => {
            return (
                <>
                    {husband_name && husband_name !== "N/A" && namePattern.test(husband_name) && husband_name?.trim() !== "." ? (
                        <>
                            <span className="badge text-bg-light me-1">Husband:</span>
                            {husband_name}
                        </>
                    ) : (
                        <>
                            <span className="badge text-bg-light me-1">Father:</span>
                            {father_name}
                        </>
                    )}
                </>
            );
        },
    },
    {
        field: "ssin_no",
        headerName: "SSIN",
    },
    {
        field: "reg_number",
        headerName: "Registration Number",
    },
    {
        field: "aadhar",
        headerName: "Aadhaar",
    },
    {
        field: "dob",
        headerName: "DOB",
        renderHeader: (prop) => {
            return <>{moment(prop?.dob).format("DD-MM-YYYY")}</>;
        },
    },
    {
        field: "status",
        headerName: "Status",
        renderHeader: (prop) => {
            return <SearchBeneficiaryStatus status={prop?.status} />;
        },
    },

    {
        field: 1,
        headerName: "Action",
        renderHeader: (item) => {
            return (
                <>
                    {item.backlog === 0 ? (
                        <button className="btn btn-sm btn-success">
                            <Link to={"/beneficiary-details/" + item.slug + "/" + (item.is_active === 1 ? "bmssy" : "ssy")} style={{ textDecoration: "none", color: "#fff" }}>
                                View
                            </Link>
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-success">
                            <Link to={"/beneficiary-details/" + item.slug} style={{ textDecoration: "none" }}>
                                View
                            </Link>
                        </button>
                    )}
                </>
            );
        },
    },
];

const SearchBeneficiary = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Search Beneficiary", url: "" }));
    }, []);
    const [searchParams, setSearchParams] = useSearchParams();
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    //const [searchQuery, setSearchQuery] = useState("");
    //{ retry: false, refetchOnWindowFocus: false, enabled: searchQuery ? true : false }
    const { data, isFetching, error } = useQuery(["search-beneficiary", searchParams.toString()], () => fetcher("/search-beneficiary?" + searchParams.toString()), {
        enabled: searchParams.toString() ? true : false,
    });

    const [form, validator] = useValidate(
        {
            worker_type: { value: "", validate: "required" },
            district: { value: "", validate: "required" },
            subdivision: { value: "", validate: "required" },
            block: { value: "", validate: "required" },
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
                            state.ssin.validate = "required|number|length:12";
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
                            state.aadhar.validate = "required|number|length:12";
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
                            state.registration_number.validate = "required|number";
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
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const clearParams = () => {
        setSearchParams();
        form.worker_type.value = "";
        form.district.value = "";
        form.subdivision.value = "";
        form.block.value = "";
        form.search_type.value = "";
        form.ssin.value = "";
        form.aadhar.value = "";
        form.registration_number.value = "";
    };

    const user = useSelector((state) => state.user?.user);
    return (
        <>
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="worker_type">
                                        Category of Worker Type {form.worker_type.required && <span className="text-danger">*</span>}
                                    </label>
                                    <select
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        id="worker_type"
                                        name="worker_type"
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.worker_type.value}
                                        required={form.worker_type.required}
                                    >
                                        <option value="">-Select-</option>
                                        <option value="ow">Others Worker</option>
                                        <option value="cw">Construction Worker</option>
                                        <option value="tw">Transport Worker</option>
                                    </select>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.worker_type.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="district">
                                    District {form.worker_type.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="subdivision">
                                    Subdivision {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    value={form.subdivision.value}
                                    onChange={(e) => {
                                        handleChange({ name: "subdivision", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">Please select sub division</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="block">
                                    Block/Municipality/Corporation {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subdivision.value}
                                />
                                <div className="invalid-feedback">Please select B/M/C</div>
                            </div>

                            {/* <div className="col-md-12">
                                <label className="form-label">Select Search By {form.search_type.required && <span className="text-danger">*</span>}</label>
                                <div className="form-group">
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
                                            onChange={() => handleChange({ name: "search_type", value: "radio_aadhar_no" })}
                                            checked={form.search_type.value == "radio_aadhar_no" ? true : false}
                                            value="radio_aadhar_no"
                                            required={form.search_type.required}
                                        />
                                        <label className="form-check-label" htmlFor="search_type2">
                                            Aadhaar Number
                                        </label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            className={`form-check-input ${form.search_type.error && "is-invalid"}`}
                                            type="radio"
                                            name="search_type"
                                            id="search_type3"
                                            onChange={() => handleChange({ name: "search_type", value: "radio_registration_number" })}
                                            checked={form.search_type.value == "radio_registration_number" ? true : false}
                                            value="radio_registration_number"
                                            required={form.search_type.required}
                                        />
                                        <label className="form-check-label" htmlFor="search_type3">
                                            Numerical Digits of Registration Number
                                        </label>
                                    </div>
                                </div>
                                <div className="invalid-feedback">Please select search by</div>
                            </div> */}

                            <div className="col-md-3">
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
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
                                <div className="col-md-3">
                                    <label className="form-control-label" htmlFor="registration_number">
                                        Numerical Digits of Registration Number {form.registration_number.required && <span className="text-danger">*</span>}
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
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching ? true : false}>
                                Search
                            </button>
                            {data && (
                                <button className="btn btn-sm btn-warning" style={{ marginLeft: "5px" }} onClick={() => clearParams()}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {error && <ErrorAlert error={error} />}
            {error && (user.role === "SLO" || user.role === "otherserviceprovider" || user.role === "collectingagent") && (
                <div className="card">
                    <div className="card-body">
                        Search beneficiary is not found. Are you want to register as NDF Caf?{" "}
                        <Link to="/caf/ndf-registration">
                            <button className="btn  btn-success btn-sm m-1">NDF CAF Registration by Beneficiary</button>
                        </Link>
                        <Link to="/caf/nominee-update">
                            <button className="btn  btn-primary btn-sm m-1">NDF CAF Registration by Nominee</button>
                        </Link>
                        <button className="btn btn-warning btn-sm" onClick={() => clearParams()}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {searchParams.toString() && (
                <>
                    <div className="card">
                        <div className="card-body">
                            <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                        </div>
                    </div>
                </>
            )}
            {/* <SearchBeneficiaryResult data={data} /> */}
        </>
    );
};

export default SearchBeneficiary;
