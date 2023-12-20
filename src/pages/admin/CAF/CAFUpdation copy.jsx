import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";

const CAFUpdation = () => {
    const [ssinDetails, setSsinDetails] = useState({ data: null, error: null, loading: false });
    const [regDetails, setRegDetails] = useState({ regData: null, regError: null, regLoading: false });
    //const [isLoading, setisLoading] = useState(null);

    const [form, validator] = useValidate({
        ssin_no: { value: "", validate: "required" },
        registration_no: { value: "", validate: "required" },
    });
    /*----------  HandelSubmit ------------ */
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "ssin_no":
                    setState((state) => {
                        if (value) {
                            state.registration_no.required = false;
                            state.registration_no.validate = "";
                        } else {
                            state.registration_no.required = true;
                            state.registration_no.validate = "required";
                        }

                        return { ...state };
                    });
                    break;
                case "registration_no":
                    setState((state) => {
                        if (!value) {
                            state.ssin_no.required = true;
                            state.ssin_no.validate = "required";
                        } else {
                            state.ssin_no.required = false;
                            state.ssin_no.validate = "";
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };
    /*----------  End HandelSubmit ------------ */
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        mutate(
            { url: `/old-caf-registration`, body: data },
            {
                onSuccess(data, variables, context) {
                    toast.success("Successfully update basic details");
                    //navigate("?application_id=" + data.enc_application_id);
                    //nextStep(1);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };
    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="card">
                <div className="card-header">Beneficiary Registration / CAF Update</div>
                <div className="card-body">
                    <div className="rows">
                        <div className="col-mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                SSIN {form.ssin_no.required && <span className="text-danger">*</span>}
                            </label>
                            <div className="col-md-4">
                                <input
                                    placeholder="Enter ssin"
                                    className={`form-control ${form.ssin_no.error && "is-invalid"}`}
                                    type="text"
                                    name="ssin_no"
                                    id="ssin_no"
                                    required={form.ssin_no.required}
                                    value={form.ssin_no.value}
                                    onChange={(e) => handleChange({ name: "ssin_no", value: e.currentTarget.value })}
                                    onBlur={async (e) => {
                                        try {
                                            setSsinDetails({ data: null, loading: true });
                                            const a = await fetcher("/checkbacklogdata-name-withssin-ajax?ssin=" + e.currentTarget.value);
                                            setSsinDetails({ data: a, loading: false });
                                        } catch (error) {
                                            validator.setError({ ssin_no: [error.message] });
                                            setSsinDetails({ data: null, loading: false });
                                        }
                                    }}
                                />
                                <label className="invalid-feedback" htmlFor="ssin_no">
                                    {form.ssin_no.error}
                                </label>
                                {ssinDetails.loading && (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                                {ssinDetails.data && (
                                    <div id="emailHelp" className="form-text">
                                        <div id="emailHelp" className="form-text">
                                            <span className="text-primary">Name : {ssinDetails.data.name}</span>
                                            <br />
                                            <span className="text-success">
                                                Father{"'"}s Name : {ssinDetails.data.father_name}
                                            </span>
                                            <br />
                                            <span className="text-danger">DOB : {ssinDetails.data.dob}</span>
                                        </div>
                                    </div>
                                )}
                                {/* {ssinDetails.error && <p className="text-danger">{ssinDetails.error.message}</p>} */}
                            </div>
                        </div>

                        <div className="col-mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                Registration Number {form.registration_no.required && <span className="text-danger">*</span>}
                            </label>
                            <div className="col-md-4">
                                <input
                                    placeholder="Enter registration number"
                                    className={`form-control ${form.registration_no.error && "is-invalid"}`}
                                    type="text"
                                    name="registration_no"
                                    id="registration_no"
                                    required={form.registration_no.required}
                                    value={form.registration_no.value}
                                    onChange={(e) => handleChange({ name: "registration_no", value: e.currentTarget.value })}
                                    onBlur={async (e) => {
                                        try {
                                            setRegDetails({ regData: null, regLoading: true });
                                            const rg = await fetcher("/checkbacklogdatareg-name-withssin-ajax?reg=" + e.currentTarget.value);
                                            setRegDetails({ regData: rg, regLoading: false });
                                        } catch (error) {
                                            validator.setError({ registration_no: [error.message] });
                                            setRegDetails({ regData: null, regLoading: false });
                                        }
                                    }}
                                />

                                <label className="invalid-feedback" htmlFor="registration_no">
                                    {form.registration_no.error}
                                </label>
                                {regDetails.loading && (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                                {regDetails.regData && (
                                    <div id="emailHelp" className="form-text">
                                        <span className="text-primary">Name : {regDetails.regData.name}</span>
                                        <br />
                                        <span className="text-success">
                                            Father{"'"}s Name : {regDetails.regData.father_name}
                                        </span>
                                        <br />
                                        <span className="text-danger">DOB : {regDetails.regData.dob}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <button className="btn btn-primary btn-sm mt-4 btn-danger" type="button">
                            Cancel
                        </button>
                        <button className="btn btn-success btn-sm mt-4" type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Save Draft & Proceed"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CAFUpdation;
