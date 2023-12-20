import React from "react";
import { useValidate } from "../../../../hooks";
import AsyncSelect from "../../../../components/select/AsyncSelect";
import { fetcher, updater } from "../../../../utils";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import moment from "moment";

const PfClaimEditByNominee = ({ data }) => {
    const [form, validator] = useValidate(
        {
            benName: { value: "", validate: "onlyAlphabets|required" },
            benSsin: { value: "", validate: "required" },
            regDate: { value: "", validate: "required" },
            benDob: { value: data?.benDob, validate: "" },
            nomineeName: { value: "", validate: "onlyAlphabets|required" },
            nomineeMobile: { value: "", validate: "indianPhone|required|number|length:10" },
            nomineeAddress: { value: "", validate: "required" },
            nomineeAadhaar: { value: "", validate: "required|number|length:12" },
            nomineeShare: { value: "", validate: "required|number" },
            nomineeRelation: { value: "", validate: "onlyAlphabets|required" },
            nomineeBnkIfsc: { value: "", validate: "required" },
            nomineeBnkName: { value: "", validate: "onlyAlphabets|required" },
            nomineeBnkBranch: { value: "", validate: "required" },
            nomineeBnkLoc: { value: "", validate: "checkNoSpecialCharacter|required" },
            nomineeBnkAcc: { value: "", validate: "required|number" },
            dateOfDeath: { value: "", validate: "required" },
            benRlo: { value: "", validate: "" },
            benWorkerType: { value: "", validate: "" },
            benRegNo: { value: "", validate: "" },
            benApplicationId: { value: "", validate: "" },
            maturityDate: { value: "", validate: "" },
            uptoDate: { value: "", validate: "" },
            claimType: { value: "pf", validate: "" },
            pfClaimApplyBy: { value: "pf_by_nom", validate: "" },
            claimNomMstId: { value: data?.claimBenMstId, validate: "" },
            claimMstId: { value: data?.claimMstId, validate: "" },
        },
        data,
        true
    );
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "nomineeShare":
                    setState((state) => {
                        if (parseInt(value) > 100) {
                            state.nomineeShare.error = "Share should be less than or equal to 100%";
                            state.nomineeShare.required = true;
                            state.nomineeShare.validate = "required";
                        } else {
                            state.nomineeShare.error = null;
                            state.nomineeShare.required = false;
                            state.nomineeShare.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "dateOfDeath":
                    setState((state) => {
                        if (moment().format("YYYY-MM-DD") <= moment(value).format("YYYY-MM-DD")) {
                            state.dateOfDeath.error = "Date of death should be less than " + moment().format("DD-MM-YYYY");
                            state.dateOfDeath.required = true;
                            state.dateOfDeath.validate = "required";
                        }
                        // else if (moment("2001-01-01").format("YYYY-MM-DD") >= moment(value).format("YYYY-MM-DD")) {
                        //     //2001-01-01
                        //     state.dateOfDeath.error = "Date of death should be less than 2001-01-01";
                        //     state.dateOfDeath.required = true;
                        //     state.dateOfDeath.validate = "required";
                        // }
                        else if (moment(value).format("YYYY-MM-DD") < moment(data?.regDate, "DD-MM-YYYY").format("YYYY-MM-DD")) {
                            state.dateOfDeath.error = "Date of death must be on or after Registration Date or Approval date";
                            state.dateOfDeath.required = true;
                            state.dateOfDeath.validate = "required";
                        } else {
                            state.dateOfDeath.error = null;
                            state.dateOfDeath.required = false;
                            state.dateOfDeath.validate = "";
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate } = useMutation((aadhaar) => fetcher("/check-aadhaar-algorithm?aadhaar=" + aadhaar));
    const handleBlur = (e) => {
        mutate(e, {
            onSuccess(data, variables, context) {
                validator.setState((state) => {
                    state.nomineeAadhaar.success = data.message;
                    state.nomineeAadhaar.error = null;
                    return {
                        ...state,
                    };
                });
            },
            onError(error, variables, context) {
                validator.setState((state) => {
                    state.nomineeAadhaar.success = null;
                    state.nomineeAadhaar.error = error.message;
                    return {
                        ...state,
                    };
                });
            },
        });
    };

    const { mutate: insertClaim, isLoading: insertClaimLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        insertClaim(
            { url: `/update-claim-entry`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.msg);
                    navigate("/claim/documents/" + data.id);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.nomineeBnkName.value = item.bank_name || "";
            state.nomineeBnkBranch.value = item.branch_name || "";
            state.nomineeBnkLoc.value = item.branch_address || "";

            state.nomineeBnkName.error = "";
            state.nomineeBnkBranch.error = "";
            state.nomineeBnkLoc.error = "";
            return { ...state };
        });
    };
    return (
        <>
            <div className="card datatable-box mb-2">
                <div className="card-header ">Please Fill Up Claim Details</div>
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="card-title mb-4">
                            <h6>
                                <i className="fa-solid fa-user-tie"></i> Beneficiary Details
                            </h6>
                        </div>
                        {/* Beneficiary disabled filed section start here  */}
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benName">
                                        Beneficiary Name {form.benName.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input className={`form-control ${form.benName.error && "is-invalid"}`} type="text" value={form.benName.value} name="benName" id="benName" onChange={(e) => handleChange(e.currentTarget)} disabled />
                                    <div className="invalid-feedback">{form.benName.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benSsin">
                                        SSI Number {form.benSsin.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input className={`form-control ${form.benSsin.error && "is-invalid"}`} type="text" value={form.benSsin.value} name="benSsin" id="benSsin" onChange={(e) => handleChange(e.currentTarget)} disabled />
                                    <div className="invalid-feedback">{form.benSsin.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor=", 'DD-MM-YYYY'">
                                        Registration Date {form.regDate.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input className={`form-control ${form.regDate.error && "is-invalid"}`} type="text" value={form.regDate.value} name="regDate" id="regDate" onChange={(e) => handleChange(e.currentTarget)} disabled />
                                    <div className="invalid-feedback">{form.regDate.error}</div>
                                </div>
                            </div>
                        </div>
                        {/* Beneficiary disabled filed section ends here  */}

                        <div className="card-title mb-4">
                            <h6>
                                <i className="fa-solid fa-user-shield"></i> Nominee Details
                            </h6>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeName">
                                        Full Name {form.nomineeName.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee name"
                                        className={`form-control ${form.nomineeName.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeName.value}
                                        name="nomineeName"
                                        id="nomineeName"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeName.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeMobile">
                                        Mobile Number {form.nomineeMobile.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee mobile"
                                        className={`form-control ${form.nomineeMobile.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeMobile.value}
                                        name="nomineeMobile"
                                        id="nomineeMobile"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeMobile.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeAddress">
                                        Address {form.nomineeAddress.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee address"
                                        className={`form-control ${form.nomineeAddress.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeAddress.value}
                                        name="nomineeAddress"
                                        id="nomineeAddress"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeAddress.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeAadhaar">
                                        Aadhaar Number {form.nomineeAadhaar.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee aadhaar"
                                        className={`form-control ${form.nomineeAadhaar.error ? "is-invalid" : form.nomineeAadhaar?.success && "is-valid"}`}
                                        type="text"
                                        value={form.nomineeAadhaar.value}
                                        name="nomineeAadhaar"
                                        id="nomineeAadhaar"
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                            handleBlur(e.currentTarget.value);
                                        }}
                                    />
                                    <div id="Feedback" className={form.nomineeAadhaar.error ? "invalid-feedback" : form.nomineeAadhaar?.success ? "valid-feedback" : ""}>
                                        {form.nomineeAadhaar.error ? form.nomineeAadhaar.error : form.nomineeAadhaar?.success && "Aadhaar Checked"}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeShare">
                                        Share {form.nomineeShare.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee share"
                                        className={`form-control ${form.nomineeShare.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeShare.value}
                                        name="nomineeShare"
                                        id="nomineeShare"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeShare.error}</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeRelation">
                                        Relation {form.nomineeRelation.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee relation"
                                        className={`form-control ${form.nomineeRelation.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeRelation.value}
                                        name="nomineeRelation"
                                        id="nomineeRelation"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeRelation.error}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-title mb-4">
                            <h6>
                                <i className="fa-solid fa-building-columns"></i> Nominee Bank Details
                            </h6>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeBnkIfsc">
                                        IFSC {form.nomineeBnkIfsc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <AsyncSelect
                                        className={form.nomineeBnkIfsc.error && "is-invalid"}
                                        loadOptions={async (value) => {
                                            try {
                                                const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                                return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                            } catch (error) {
                                                return [];
                                            }
                                        }}
                                        onItemSubmit={autoPopulate}
                                        id="nomineeBnkIfsc"
                                        value={form.nomineeBnkIfsc.value}
                                        onChange={(value) => handleChange({ name: "nomineeBnkIfsc", value: value })}
                                    />
                                    <div className="invalid-feedback">{form.nomineeBnkIfsc.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeBnkName">
                                        Name {form.nomineeBnkName.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee bank name"
                                        className={`form-control ${form.nomineeBnkName.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeBnkName.value}
                                        name="nomineeBnkName"
                                        id="nomineeBnkName"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeBnkName.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeBnkBranch">
                                        Branch Name {form.nomineeBnkBranch.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee bank branch"
                                        className={`form-control ${form.nomineeBnkBranch.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeBnkBranch.value}
                                        name="nomineeBnkBranch"
                                        id="nomineeBnkBranch"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeBnkBranch.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeBnkLoc">
                                        Location {form.nomineeBnkLoc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee bank location"
                                        className={`form-control ${form.nomineeBnkLoc.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeBnkLoc.value}
                                        name="nomineeBnkLoc"
                                        id="nomineeBnkLoc"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeBnkLoc.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="nomineeBnkAcc">
                                        A/C Number {form.nomineeBnkAcc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter nominee bank a/c"
                                        className={`form-control ${form.nomineeBnkAcc.error && "is-invalid"}`}
                                        type="text"
                                        value={form.nomineeBnkAcc.value}
                                        name="nomineeBnkAcc"
                                        id="nomineeBnkAcc"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.nomineeBnkAcc.error}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-title mb-4">
                            <h6>
                                <i className="fa-solid fa-person-walking-dashed-line-arrow-right"></i> Death Details
                            </h6>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="dateOfDeath">
                                        Date of Death {form.dateOfDeath.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="select date of death"
                                        className={`form-control ${form.dateOfDeath.error && "is-invalid"}`}
                                        type="date"
                                        value={form.dateOfDeath.value}
                                        name="dateOfDeath"
                                        id="dateOfDeath"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.dateOfDeath.error}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={insertClaimLoading || form.nomineeAadhaar.error}>
                                {insertClaimLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Save and Proceed
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PfClaimEditByNominee;
