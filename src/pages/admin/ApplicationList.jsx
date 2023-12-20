import React, { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetcher, searchParamsToObject } from "../../utils";
import { useValidate } from "../../hooks";
import ApplicationStatusWiseLink from "../../components/list/ApplicationStatusWiseLink ";
import ApplicationStatus from "../../components/list/ApplicationStatus";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import TableList from "../../components/table/TableList";
const namePattern = /^[a-zA-Z ]+(\.|')?[a-zA-Z ]+(\.|')?/;
const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "application_id",
        headerName: "Application No.",
    },
    {
        field: "ssin_no",
        headerName: "SSIN",
    },
    {
        field: "fullname",
        headerName: "Beneficiary Name",
    },
    {
        field: 1,
        headerName: "Fathers / Husband Name",
        renderHeader: (item) => {
            return (
                <>
                    {item.husband_name && namePattern.test(item.husband_name) && item.husband_name?.trim() !== "." ? (
                        <>
                            <span className="badge text-bg-light me-1 ">Husband:</span>
                            {item.husband_name}
                        </>
                    ) : (
                        <>
                            <span className="badge text-bg-light me-1">Father:</span>
                            {item.father_name}
                        </>
                    )}
                </>
            );
        },
    },
    // {
    //     field: "dob",
    //     headerName: "Date Of Birth",
    // },
    {
        field: "mobile",
        headerName: "Mobile",
    },

    {
        field: "created_date",
        headerName: "Submitted Date",
    },

    {
        field: "status",
        headerName: "Status",
        renderHeader: (props) => {
            return <ApplicationStatus status={props.status?.trim()} />;
        },
    },
    {
        field: 1,
        headerName: "Action",
        renderHeader: (props) => {
            return <ApplicationStatusWiseLink item={props} />;
        },
    },
];

const ApplicationList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [form, validator] = useValidate(
        {
            status: { value: "", validate: "" },
            searchBy: { value: "", validate: "" },
            searchVal: { value: "", validate: "" },
        },
        searchParamsToObject(searchParams)
    );

    const clearParams = () => {
        validator.setState((state) => {
            state.status.value = "";
            state.status.error = null;
            state.status.validate = "";

            state.searchBy.value = "";
            state.searchBy.error = null;
            state.status.validate = "";

            state.searchVal.value = "";
            state.searchVal.error = null;
            state.searchVal.validate = "";
            return { ...state };
        });
    };

    const { isLoading, error, data, isFetching } = useQuery(["my-application-list", searchParams.toString()], () => fetcher(`/my-application-list?${searchParams.toString()}`));

    const handleLimit = useCallback(
        (val) => {
            searchParams.set("limit", val);
            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "searchBy":
                    setState((state) => {
                        if (value) {
                            state.searchVal.required = true;
                            state.searchVal.validate = "required";
                        } else {
                            state.searchVal.required = false;
                            state.searchVal.validate = "";
                            state.searchVal.error = "";
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

        if (e.nativeEvent.submitter.innerText.trim().toLowerCase() === "clear") {
            Object.keys(data).forEach((key) => {
                searchParams.delete(key);
            });
        } else {
            Object.keys(data).forEach((key) => {
                if (data[key] === "ALL") data[key] = "";
                searchParams.set(key, data[key]);
            });
        }
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Application List", url: "" }));
    }, []);

    return (
        <>
            <form noValidate onSubmit={handleSubmit} className="filter_box container">
                <div className="row">
                    <div className="col-md-3 filter_items">
                        <label htmlFor="status" className="form-control-label">
                            Status {form.status.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            className={`form-select  ${form.status.error && "is-invalid"}`}
                            id="status"
                            name="status"
                            required={form.status.required}
                            value={form.status.value}
                            onChange={(e) => handleChange({ name: "status", value: e.currentTarget.value })}
                        >
                            <option value="">All</option>
                            <option value="S">Submitted</option>
                            <option value="I">Upload Form-1 Pending</option>
                            <option value="B">Back For Correction</option>
                            <option value="A">Approved</option>
                            <option value="0">Incomplete</option>
                        </select>
                        <div className="invalid-feedback">{form.status.error}</div>
                    </div>
                    <div className="col-md-3 filter_items">
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
                    <div className="col-md-3 filter_items">
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

                    <div className="col-md-3 filter_items">
                        <div className="my-md-4 d-flex gap-2">
                            <button type="submit " className="btn btn-success btn-sm" disabled={isLoading || isFetching}>
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button type="text" className="btn btn-danger btn-sm" disabled={isLoading || isFetching} onClick={clearParams}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default ApplicationList;
