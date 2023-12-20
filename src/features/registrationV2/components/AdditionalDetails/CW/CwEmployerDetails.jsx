import React, { useEffect, useState } from "react";
import TableList from "../../../../../components/table/TableList";
import { useValidate } from "../../../../../hooks";
import moment from "moment";

function CwEmployerDetails({ application_id, handleChangeEmp, data }) {
    const [empList, setEmpList] = useState([]);

    useEffect(() => {
        setEmpList(data);
    }, [data]);
    const [form, validator] = useValidate(
        {
            employers_name: { value: "", validate: "required" },
            employer_address: { value: "", validate: "required" },
            registration_no_of_institute: { value: "", validate: "" },
            workplace_details: { value: "", validate: "required" },
            nature_of_job: { value: "", validate: "required" },
            start_date: { value: "", validate: "required" },
            end_date: { value: "", validate: "required" },
            remarks: { value: "", validate: "" },
        },
        data,
        true
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "end_date":
                    setState((state) => {
                        if (form.start_date.value && form.start_date.value > value) state.end_date.error = "End date should be greater or equal to start date";
                        else {
                            state.end_date.error = null;
                            state.start_date.error = null;
                        }
                        return { ...state };
                    });

                    break;
                case "start_date":
                    setState((state) => {
                        if (form.end_date.value && form.end_date.value < value) state.start_date.error = "Start date should be lesser or equal to end date";
                        else {
                            state.end_date.error = null;
                            state.start_date.error = null;
                        }
                        return { ...state };
                    });
                    break;
                default:
                    break;
            }
        });
    };

    const handleAdd = (evt) => {
        evt.preventDefault();
        if (!validator.validate()) return;
        handleChangeEmp({ name: "empList", value: [...data, { ...validator.generalize() }] });
        setEmpList((prev) => {
            return [...prev, { ...validator.generalize() }];
        });

        validator.reset();
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "employers_name",
            headerName: "Employer Name",
        },
        {
            field: "employer_address",
            headerName: "Employer Address",
        },
        {
            field: "registration_no_of_institute",
            headerName: "Institute Registration Number",
        },
        {
            field: "workplace_details",
            headerName: "Workplace Details",
        },
        {
            field: "nature_of_job",
            headerName: "Nature Of Job",
        },
        {
            field: "start_date",
            headerName: "Start Date",
            renderHeader: (item) => {
                return moment(item.start_date).format("DD-MM-YYYY");
            },
        },
        {
            field: "end_date",
            headerName: "End Date",
            renderHeader: (item) => {
                return moment(item.end_date).format("DD-MM-YYYY");
            },
        },
        {
            field: "remarks",
            headerName: "Remarks",
        },
        {
            field: 1,
            headerName: "Duration (Days)",
            renderHeader: (item) => {
                return moment(item.end_date).diff(moment(item.start_date), "days") ?? "";
            },
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (item) => {
                return (
                    <div
                        className="text-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleChangeEmp({ name: "empList", value: empList.filter((i) => i.id != item?.id) });
                            setEmpList((prev) => {
                                return prev.filter((i) => i.id != item?.id);
                            });
                        }}
                    >
                        <i className="fa fa-trash text-danger"></i>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <form onSubmit={handleAdd} noValidate autoComplete="off">
                <div className="card datatable-box mb-2">
                    <div className="card-header">Employer details</div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-2">
                                <label htmlFor="employers_name" className="form-label">
                                    Employer Name {form.employers_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Employer Name "
                                    className={`form-control ${form.employers_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.employers_name.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="employers_name"
                                    id="employers_name"
                                    required={form.employers_name.required}
                                />
                                <div className="invalid-feedback">Please enter Employer Name.</div>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="employer_address" className="form-label">
                                    Employer Address {form.employer_address.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder=" Employer Address"
                                    className={`form-control ${form.employer_address.error && "is-invalid"}`}
                                    type="text"
                                    value={form.employer_address.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="employer_address"
                                    id="employer_address"
                                    required={form.employer_address.required}
                                />

                                <div className="invalid-feedback">Please enter Employer Address</div>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="registration_no_of_institute" className="form-label">
                                    Institute Registration Number {form.registration_no_of_institute.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Institute Registration Number"
                                    className={`form-control ${form.registration_no_of_institute.error && "is-invalid"}`}
                                    type="text"
                                    value={form.registration_no_of_institute.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="registration_no_of_institute"
                                    id="registration_no_of_institute"
                                    required={form.registration_no_of_institute.required}
                                />

                                <div className="invalid-feedback">Please enter institute registration number</div>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="workplace_details" className="form-label">
                                    Workplace Details {form.workplace_details.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder=" Worker Details"
                                    className={`form-control ${form.workplace_details.error && "is-invalid"}`}
                                    type="text"
                                    value={form.workplace_details.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="workplace_details"
                                    id="workplace_details"
                                    required={form.workplace_details.required}
                                />

                                <div className="invalid-feedback">Please enter worker details</div>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="nature_of_job" className="form-label">
                                    Nature of Job {form.nature_of_job.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Nature of job"
                                    className={`form-control ${form.nature_of_job.error && "is-invalid"}`}
                                    type="text"
                                    value={form.nature_of_job.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="nature_of_job"
                                    id="nature_of_job"
                                    required={form.nature_of_job.required}
                                />
                                <div className="invalid-feedback">Please enter nature of job</div>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label" htmlFor="start_date">
                                    Start Date {form.start_date.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Start Date"
                                    className={`form-control ${form.start_date.error && "is-invalid"}`}
                                    type="date"
                                    value={form.start_date.value}
                                    name="start_date"
                                    id="start_date"
                                    onChange={(e) =>
                                        handleChange({
                                            name: "start_date",
                                            value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                        })
                                    }
                                    max={moment().format("YYYY-MM-DD")}
                                    min={moment().subtract(1, "years").format("YYYY-MM-DD")}
                                />
                                <div className="invalid-feedback">{form.start_date.error}</div>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label" htmlFor="end_date">
                                    End Date {form.end_date.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="End Date"
                                    className={`form-control ${form.end_date.error && "is-invalid"}`}
                                    type="date"
                                    value={form.end_date.value}
                                    name="end_date"
                                    id="end_date"
                                    onChange={(e) =>
                                        handleChange({
                                            name: "end_date",
                                            value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                        })
                                    }
                                    min={moment(form.start_date.value).format("YYYY-MM-DD")}
                                />
                                <div className="invalid-feedback">{form.end_date.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="remarks" className="form-label">
                                    Remarks {form.remarks.required && <span className="text-danger">*</span>}
                                </label>
                                <textarea
                                    placeholder="Remarks"
                                    className={`form-control ${form.remarks.error && "is-invalid"}`}
                                    type="text"
                                    value={form.remarks.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="remarks"
                                    id="remarks"
                                    required={form.remarks.required}
                                />
                                <div className="invalid-feedback">Please enter remarks</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success" type="submit">
                                <i className="fa-solid fa-add"></i> Add Employer
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {empList.length > 0 && (
                <>
                    <div className="card">
                        <div className="card-title">
                            <h5>All Employers</h5>
                        </div>

                        <div className="card-body">
                            <TableList data={{ data: empList }} tableHeader={columns} disablePagination />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default CwEmployerDetails;
