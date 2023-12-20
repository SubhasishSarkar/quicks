import React from "react";

const PassbookServiceForm = ({ isLoading, handleSubmit, handleChange, duaresarkar, form, dsregDate, dsregdt_min }) => {
    return (
        <>
            <div className="card datatable-box shadow mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row g-3">
                            {duaresarkar == 1 && (
                                <>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="dsregno">
                                            Duare Sarkar Registration No. <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${form.ds_reg_no.error && "is-invalid"}`}
                                            name="ds_reg_no"
                                            id="ds_reg_no"
                                            value={form.ds_reg_no.value}
                                            required={form.ds_reg_no.required}
                                            onChange={(e) => handleChange(e.currentTarget)}
                                        />

                                        <div className="invalid-feedback">{form.ds_reg_no.error}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label" htmlFor="dsregdt">
                                            Duare Sarkar Registration Date <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`form-control ${form.ds_reg_dt.error && "is-invalid"}`}
                                            name="ds_reg_dt"
                                            id="ds_reg_dt"
                                            onKeyDown={(e) => e.preventDefault()}
                                            value={form.ds_reg_dt.value}
                                            required={form.ds_reg_dt.required}
                                            onChange={(e) => handleChange(e.currentTarget)}
                                            max={dsregDate}
                                            min={dsregdt_min}
                                        />
                                        <div className="invalid-feedback">{form.ds_reg_dt.error}</div>
                                    </div>
                                </>
                            )}
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="ssin">
                                    SSIN <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${form.ssin_no.error && "is-invalid"}`}
                                    name="ssin_no"
                                    id="ssin_no"
                                    value={form.ssin_no.value}
                                    required={form.ssin_no.required}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.ssin_no.error}</div>
                            </div>
                            <div className="col-md-1">
                                <label className="form-label"></label>
                                <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                    {isLoading ? "Loading..." : "Proceed"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PassbookServiceForm;
