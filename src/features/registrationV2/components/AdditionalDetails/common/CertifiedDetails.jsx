import React from "react";
import DesignationSelect from "../../../../../components/select/DesignationSelect";

const CertifiedDetails = ({ form, handleChange }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header">Certified by Edistrict</div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="certified_by_edist" className="form-label">
                            Form-XXVII under BOCW Certified By {form.certified_by_edist.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Certified By"
                            className={`form-control ${form.certified_by_edist.error && "is-invalid"}`}
                            type="text"
                            value={form.certified_by_edist.value}
                            onChange={(e) => handleChange(e.currentTarget)}
                            name="certified_by_edist"
                            id="certified_by_edist"
                            required={form.certified_by_edist.required}
                        />
                        <div className="invalid-feedback">Please enter certified by.</div>
                    </div>
                    <div className="col-md-3">
                            <label className="form-label" htmlFor="designation_edistrict">
                                Designation {form.designation_edistrict.required && <span className="text-danger">*</span>}
                            </label>
                            <DesignationSelect
                                placeholder="Designation"
                                className={`form-select ${form.designation_edistrict.error && "is-invalid"}`}
                                type="text"
                                value={form.designation_edistrict.value}
                                name="designation_edistrict"
                                id="designation_edistrict"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please provide a Designation Name.</div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default CertifiedDetails;
