import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import BMCNameSelect from "../../components/select/BMCNameSelect";
import { useValidate } from "../../hooks";
import { updater } from "../../utils";

const OfflineClaimEntryForm = ({ data, boardName }) => {
    const [form, validator] = useValidate(
        {
            full_name: { value: "", validate: "required" },
            block_name: { value: "", validate: data.blockRequire ? "required" : "" },
            type_of_Claim: { value: "", validate: "required" },
            amount: { value: "", validate: "required|number" },
            bank_advice_no: { value: "", validate: "required" },
            bank_advice_date: { value: "", validate: "required" },
            claim_ref_no: { value: "", validate: "" },
            claim_ref_date: { value: "", validate: "" },
            board_name: { value: boardName, validate: "" },
            aadhaar: { value: data.aadhaar, validate: "" },
            application_id: { value: data.application_id, validate: "" },
            bld_id: { value: data.bld_id ? data.bld_id : 0, validate: "" },
            ssin_no: { value: data.ssin_no, validate: "" },
            registration_no: { value: data.registration_no, validate: "" },
        },
        { ...data.form }
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "claim_ref_no":
                    setState((state) => {
                        if (value) {
                            state.claim_ref_no.required = true;
                            state.claim_ref_no.validate = "required";
                            state.claim_ref_no.error = null;

                            state.claim_ref_date.required = true;
                            state.claim_ref_date.validate = "required";
                            state.claim_ref_date.error = null;
                        } else {
                            state.claim_ref_date.required = false;
                            state.claim_ref_date.validate = "";
                            state.claim_ref_date.value = "";
                            state.claim_ref_date.error = null;

                            state.claim_ref_no.required = false;
                            state.claim_ref_no.validate = "";
                            state.claim_ref_no.value = "";
                            state.claim_ref_no.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "claim_ref_date":
                    setState((state) => {
                        if (value) {
                            state.claim_ref_date.required = true;
                            state.claim_ref_date.validate = "required";
                            state.claim_ref_date.error = null;

                            state.claim_ref_no.required = true;
                            state.claim_ref_no.validate = "required";
                            state.claim_ref_no.error = null;
                        } else {
                            state.claim_ref_no.required = false;
                            state.claim_ref_no.validate = "";
                            state.claim_ref_no.value = "";
                            state.claim_ref_no.error = null;

                            state.claim_ref_date.required = false;
                            state.claim_ref_date.validate = "";
                            state.claim_ref_date.value = "";
                            state.claim_ref_date.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "type_of_Claim":
                    setState((state) => {
                        if (value == "Natural Death" || value == "40% Disability") {
                            state.amount.value = 50000;
                            state.amount.disabled = true;
                            state.amount.error = null;
                        } else if (value == "Accidental Death" || value == "Both eyes, or loss of use of both hands, or feet or loss of sight of one eye and loss of use of hand, or foot.") {
                            state.amount.value = 200000;
                            state.amount.disabled = true;
                            state.amount.error = null;
                        } else if (value == "Loss of sight of one eye, or loss of use of one hand, or foot.") {
                            state.amount.value = 100000;
                            state.amount.disabled = true;
                            state.amount.error = null;
                        } else {
                            state.amount.value = "";
                            state.amount.disabled = false;
                            state.amount.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/offline-claim-entry`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Claim successfully submitted.");
                    navigate("/offline-claim/list");
                    // nextStep(1);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };

    return (
        <>
            <div className="card datatable-box shadow mb-4">
                <div className="card-header py-2">
                    <h5 className="m-0 font-weight-bold text-white">Please fill the details for claim entry</h5>
                </div>
                <div className="card-body">
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="full_name">
                                        Full Name {form.full_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        className={`form-control ${form.full_name.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.full_name.value}
                                        required={form.full_name.required}
                                        disabled={data.form.full_name ? true : false}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.full_name.error}
                                    </div>
                                </div>
                            </div>

                            {data.blockRequire && (
                                <div className="col-md-3 mb-3">
                                    <div className="form-group">
                                        <label className="form-control-label" htmlFor="block_name">
                                            Select Block {form.block_name.required && <span className="text-danger">*</span>}
                                        </label>
                                        <BMCNameSelect
                                            className={`form-select ${form.block_name.error && "is-invalid"}`}
                                            onChange={(e) => {
                                                handleChange(e.currentTarget);
                                            }}
                                            value={form.block_name.value}
                                            required={form.block_name.required}
                                            id="block_name"
                                            name="block_name"
                                            subDivision={data.suvDivision}
                                        />
                                        <div id="Feedback" className="invalid-feedback">
                                            {form.type_of_Claim.error}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="type_of_Claim">
                                        Type of Claim {form.type_of_Claim.required && <span className="text-danger">*</span>}
                                    </label>
                                    <select
                                        id="type_of_Claim"
                                        name="type_of_Claim"
                                        className={`form-select ${form.type_of_Claim.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.type_of_Claim.value}
                                        required={form.type_of_Claim.required}
                                    >
                                        <option value="">Select</option>
                                        <option value="Natural Death">Natural Death</option>
                                        <option value="Accidental Death">Accidental Death</option>
                                        <option value="40% Disability">40% Disability</option>
                                        <option value="Both eyes, or loss of use of both hands, or feet or loss of sight of one eye and loss of use of hand, or foot.">
                                            Both eyes, or loss of use of both hands, or feet or loss of sight of one eye and loss of use of hand, or foot.
                                        </option>
                                        <option value="Loss of sight of one eye, or loss of use of one hand, or foot.">Loss of sight of one eye, or loss of use of one hand, or foot.</option>
                                        <option value="PF-Death">PF-Death</option>
                                        <option value="PF-Maturity">PF-Maturity</option>
                                        <option value="PE-Pre Mature withdrawal">PE-Pre Mature withdrawal</option>
                                    </select>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.type_of_Claim.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="amount">
                                        Amount(Rs) {form.amount.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="amount"
                                        name="amount"
                                        className={`form-control ${form.amount.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.amount.value}
                                        required={form.amount.required}
                                        disabled={form.amount.disabled}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.amount.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="bank_advice_no">
                                        Bank Advice No./Memo No./Treasury No. {form.bank_advice_no.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="bank_advice_no"
                                        name="bank_advice_no"
                                        className={`form-control ${form.bank_advice_no.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.bank_advice_no.value}
                                        list="adviceNoArray"
                                        required={form.bank_advice_no.required}
                                    />
                                    <datalist id="adviceNoArray">
                                        {data?.adviceNoArrData?.map((item, index) => {
                                            return (
                                                <option key={index} value={item.bank_advice_no}>
                                                    {item.bank_advice_no}
                                                </option>
                                            );
                                        })}
                                    </datalist>

                                    <div id="Feedback" className="invalid-feedback">
                                        {form.bank_advice_no.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="bank_advice_date">
                                        Bank Advice Date {form.bank_advice_date.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="bank_advice_date"
                                        name="bank_advice_date"
                                        className={`form-control ${form.bank_advice_date.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.bank_advice_date.value}
                                        required={form.bank_advice_date.required}
                                    />

                                    <div id="Feedback" className="invalid-feedback">
                                        {form.bank_advice_no.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="claim_ref_no">
                                        Claim Reference No. of SSY Portal (if any) {form.claim_ref_no.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="claim_ref_no"
                                        name="claim_ref_no"
                                        className={`form-control ${form.claim_ref_no.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.claim_ref_no.value}
                                        required={form.claim_ref_no.required}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.bank_advice_no.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="claim_ref_date">
                                        Claim Reference Date of SSY Portal (if any) {form.claim_ref_date.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="claim_ref_date"
                                        name="claim_ref_date"
                                        className={`form-control ${form.claim_ref_date.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.claim_ref_date.value}
                                        required={form.claim_ref_date.required}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.claim_ref_date.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                            {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default OfflineClaimEntryForm;
