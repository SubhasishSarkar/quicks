import React from "react";

const OtherDetails = ({ form, handleChange }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header">Other details</div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-4 mb-1">
                        <label htmlFor="name_of_worker" className="form-control-label">
                            Status of Transport Worker {form.name_of_worker.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            className={`form-select ${form.name_of_worker.error && "is-invalid"}`}
                            type="text"
                            id="name_of_worker"
                            name="name_of_worker"
                            required={form.name_of_worker.required}
                            value={form.name_of_worker.value}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.currentTarget)}
                        >
                            <option value="">Select One</option>
                            <option value="Self Employed">Self Employed</option>
                            <option value="Wage Employed">Wage Employed</option>
                        </select>
                        <div className="invalid-feedback">{form.name_of_worker.error}</div>
                    </div>
                    <div className="col-md-4 mb-1">
                        <label htmlFor="nature_of_vechicle" className="form-control-label">
                            Nature of Vehicle {form.nature_of_vechicle.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            className={`form-select ${form.nature_of_vechicle.error && "is-invalid"}`}
                            type="text"
                            id="nature_of_vechicle"
                            name="nature_of_vechicle"
                            required={form.nature_of_vechicle.required}
                            value={form.nature_of_vechicle.value}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.currentTarget)}
                        >
                            <option value="">Select One</option>
                            <option value="Bus">Bus</option>
                            <option value="Lorry">Lorry</option>
                            <option value="Taxi">Taxi</option>
                            <option value="Van">Van</option>
                            <option value="Autorickshaw">Autorickshaw</option>
                            <option value="Others">Others</option>
                        </select>
                        <div className="invalid-feedback">{form.nature_of_vechicle.error}</div>
                    </div>
                    <div className="col-md-4 mb-1">
                        <label htmlFor="nature_of_duties" className="form-control-label">
                            Nature of Duties {form.nature_of_duties.required && <span className="text-danger">*</span>}
                        </label>
                        <select
                            className={`form-select ${form.nature_of_duties.error && "is-invalid"}`}
                            type="text"
                            id="nature_of_duties"
                            name="nature_of_duties"
                            required={form.nature_of_duties.required}
                            value={form.nature_of_duties.value}
                            autoComplete="off"
                            onChange={(e) => handleChange(e.currentTarget)}
                        >
                            <option value="">Select One</option>
                            <option value="Driver">Driver</option>
                            <option value="Conductor">Conductor</option>
                            <option value="Cleaner">Cleaner</option>
                            <option value="Helper">Helper</option>
                        </select>
                        <div className="invalid-feedback">{form.nature_of_duties.error}</div>
                    </div>
                    {/* <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success" type="submit">
                                <i className="fa-solid fa-add"></i> Add Employer
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default OtherDetails;
