const AadhaarNumberForm = ({ form, handleChange, handleBlur, aadharAlgoLoading }) => {
    return (
        <>
            <div className="card mb-3">
                <div className="section_title">
                    <strong>Aadhaar</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-control-label" htmlFor="aadhaar">
                                Aadhaar Number {form.aadhaar.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="aadhaar"
                                name="aadhaar"
                                className={`form-control ${form.aadhaar.error ? "is-invalid" : form.aadhaar?.success && "is-valid"}`}
                                value={form.aadhaar.value}
                                required={form.aadhaar.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                    handleBlur(e.currentTarget.value);
                                }}
                            />

                            {aadharAlgoLoading && <span className="valid-feedback spinner-border spinner-border-sm lh-6" role="status" aria-hidden="true"></span>}

                            {!aadharAlgoLoading && (
                                <div id="Feedback" className={form.aadhaar.error ? "invalid-feedback" : form.aadhaar?.success ? "valid-feedback" : ""}>
                                    {form.aadhaar.error ? form.aadhaar.error : form.aadhaar?.success && form.aadhaar?.success}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AadhaarNumberForm;
