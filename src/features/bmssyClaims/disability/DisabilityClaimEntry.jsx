import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ErrorAlert from "../../../components/list/ErrorAlert";
import AsyncSelect from "../../../components/select/AsyncSelect";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";

const DisabilityClaimEntry = ({ data }) => {
    const [form, validator] = useValidate(
        {
            benName: { value: "", validate: "required" },
            benSsin: { value: "", validate: "required" },
            regDate: { value: "", validate: "required" },
            benBankIfsc: { value: "", validate: "required" },
            benBnkName: { value: "", validate: "required" },
            benBnkBranch: { value: "", validate: "required" },
            benBnkLoc: { value: "", validate: "required" },
            benBnkAcc: { value: "", validate: "required" },
            disabilityType: { value: "", validate: "required" },
            claimAmount: { value: "", validate: "required" },
            dateTypeSelect: { value: "", validate: "required" },
            dateOfOccurrence: { value: "", validate: "" },
            releaseFromHospital: { value: "", validate: "" },
            dateOfAccident: { value: "", validate: "" },
            registrationNo: { value: data?.registrationNo, validate: "" },
            workerType: { value: data?.workerType, validate: "" },
            benRloCode: { value: data?.benRloCode, validate: "" },
            applicationId: { value: data?.applicationId, validate: "" },
            claimType: { value: "disability", validate: "" },
        },
        data,
        true
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "disabilityType":
                    setState((state) => {
                        if (value === "15") {
                            state.claimAmount.value = 50000;
                            state.claimAmount.error = null;
                            state.claimAmount.required = false;
                            state.claimAmount.validate = "";
                        } else if (value === "16" || value === "20" || value === "19" || value === "17" || value === "18") {
                            state.claimAmount.value = 200000;
                            state.claimAmount.error = null;
                            state.claimAmount.required = false;
                            state.claimAmount.validate = "";
                        } else if (value === "21" || value === "22" || value === "23") {
                            state.claimAmount.value = 100000;
                            state.claimAmount.error = null;
                            state.claimAmount.required = false;
                            state.claimAmount.validate = "";
                        } else {
                            state.claimAmount.required = true;
                            state.claimAmount.validate = "required";
                            state.claimAmount.value = "";
                            state.claimAmount.error = "Select claim type.";
                        }

                        return { ...state };
                    });
                    break;
                case "dateTypeSelect":
                    setState((state) => {
                        if (value === "date_of_release_from_hospital") {
                            state.dateOfOccurrence.required = false;
                            state.dateOfOccurrence.validate = "";
                            state.dateOfOccurrence.value = "";
                            state.dateOfOccurrence.error = null;

                            state.dateOfAccident.required = false;
                            state.dateOfAccident.validate = "";
                            state.dateOfAccident.value = "";
                            state.dateOfAccident.error = null;

                            state.releaseFromHospital.required = true;
                            state.releaseFromHospital.validate = "required";
                            state.releaseFromHospital.value = "";
                            state.releaseFromHospital.error = null;
                        } else if (value === "date_of_accident") {
                            state.releaseFromHospital.required = false;
                            state.releaseFromHospital.validate = "";
                            state.releaseFromHospital.value = "";
                            state.releaseFromHospital.error = null;

                            state.dateOfOccurrence.required = false;
                            state.dateOfOccurrence.validate = "";
                            state.dateOfOccurrence.value = "";
                            state.dateOfOccurrence.error = null;

                            state.dateOfAccident.required = true;
                            state.dateOfAccident.validate = "required";
                            state.dateOfAccident.value = "";
                            state.dateOfAccident.error = null;
                        } else if (value === "date_of_occurrence") {
                            state.releaseFromHospital.required = false;
                            state.releaseFromHospital.validate = "";
                            state.releaseFromHospital.value = "";
                            state.releaseFromHospital.error = null;

                            state.dateOfAccident.required = false;
                            state.dateOfAccident.validate = "";
                            state.dateOfAccident.value = "";
                            state.dateOfAccident.error = null;

                            state.dateOfOccurrence.required = true;
                            state.dateOfOccurrence.validate = "required";
                            state.dateOfOccurrence.value = "";
                            state.dateOfOccurrence.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate: insertClaim, isLoading: insertClaimLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const location = useLocation();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        insertClaim(
            { url: `/insert-new-claim`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.msg);
                    navigate("/claim/documents/" + data.id, { state: { from: location } });
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.benBnkName.value = item.bank_name || "";
            state.benBnkBranch.value = item.branch_name || "";
            state.benBnkLoc.value = item.branch_address || "";

            state.benBnkName.error = "";
            state.benBnkBranch.error = "";
            state.benBnkLoc.error = "";
            return { ...state };
        });
    };

    const [searchQuery, setSearchQuery] = useState("");
    const { data: checkBankData, isFetching: isFetchingBank, error: bankError } = useQuery(["check-bank-for-disability-claim", searchQuery], () => fetcher("/check-bank-for-disability-claim?" + searchQuery), { enabled: searchQuery ? true : false });
    const checkBank = () => {
        if (form.benBankIfsc.value === "" && form.benBnkAcc.value === "") {
            toast.error("Please enter bank ifsc and account number");
        } else {
            setSearchQuery(`benBankIfsc=${form.benBankIfsc.value}&benBnkAcc=${form.benBnkAcc.value}&benBnkName=${form.benBnkName.value}&benBnkBranch=${form.benBnkBranch.value}&benBnkLoc=${form.benBnkLoc.value}&applicationId=${data?.applicationId}`);
        }
    };

    const { data: disabilityType } = useQuery(["get-disability-type", data?.basicDetails?.encAppId], () => fetcher(`/get-disability-type`), {
        enabled: checkBankData ? true : false,
    });

    return (
        <>
            <div className="card datatable-box mb-2">
                <div className="card-header py-2">
                    <h5 className="m-0">Please Fill Up Claim Details</h5>
                </div>
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
                                    <label className="form-label" htmlFor="regDate">
                                        {data?.registrationType === "NEW" && parseInt(data?.isNDF) === 0 && parseInt(data?.isActive) === 1 ? "Approval Date" : "Registration Date"} {form.regDate.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input className={`form-control ${form.regDate.error && "is-invalid"}`} type="text" value={form.regDate.value} name="regDate" id="regDate" onChange={(e) => handleChange(e.currentTarget)} disabled />
                                    <div className="invalid-feedback">{form.regDate.error}</div>
                                </div>
                            </div>
                        </div>
                        {/* Beneficiary disabled filed section ends here  */}

                        {/* Check bank details */}
                        <div className="card-title mb-4">
                            <h6>
                                <i className="fa-solid fa-bank"></i> Check Bank Details {checkBankData?.bankStatus && <i className="fa-solid fa-circle-check" style={{ color: "#097de1" }}></i>}
                            </h6>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benBankIfsc">
                                        Bank IFSC {form.benBankIfsc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <AsyncSelect
                                        className={form.benBankIfsc.error && "is-invalid"}
                                        loadOptions={async (value) => {
                                            try {
                                                const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                                return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                            } catch (error) {
                                                return [];
                                            }
                                        }}
                                        onItemSubmit={autoPopulate}
                                        id="benBankIfsc"
                                        value={form.benBankIfsc.value}
                                        onChange={(value) => handleChange({ name: "benBankIfsc", value: value })}
                                        disabled={checkBankData?.bankStatus}
                                    />
                                    <div className="invalid-feedback">{form.benBankIfsc.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benBnkName">
                                        Bank Name {form.benBnkName.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter bank name"
                                        className={`form-control ${form.benBnkName.error && "is-invalid"}`}
                                        type="text"
                                        value={form.benBnkName.value}
                                        name="benBnkName"
                                        id="benBnkName"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                        disabled={checkBankData?.bankStatus}
                                    />
                                    <div className="invalid-feedback">{form.benBnkName.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benBnkBranch">
                                        Bank Branch Name {form.benBnkBranch.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter bank branch"
                                        className={`form-control ${form.benBnkBranch.error && "is-invalid"}`}
                                        type="text"
                                        value={form.benBnkBranch.value}
                                        name="benBnkBranch"
                                        id="benBnkBranch"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                        disabled={checkBankData?.bankStatus}
                                    />
                                    <div className="invalid-feedback">{form.benBnkBranch.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benBnkLoc">
                                        Bank Location {form.benBnkLoc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter bank location"
                                        className={`form-control ${form.benBnkLoc.error && "is-invalid"}`}
                                        type="text"
                                        value={form.benBnkLoc.value}
                                        name="benBnkLoc"
                                        id="benBnkLoc"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                        disabled={checkBankData?.bankStatus}
                                    />
                                    <div className="invalid-feedback">{form.benBnkLoc.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check mb-2">
                                    <label className="form-label" htmlFor="benBnkAcc">
                                        A/C Number {form.benBnkAcc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="enter bank a/c"
                                        className={`form-control ${form.benBnkAcc.error && "is-invalid"}`}
                                        type="text"
                                        value={form.benBnkAcc.value}
                                        name="benBnkAcc"
                                        id="benBnkAcc"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                        disabled={checkBankData?.bankStatus}
                                    />
                                    <div className="invalid-feedback">{form.benBnkAcc.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-check">
                                    <div className="d-grid mt-4 d-md-flex">
                                        <button className="btn btn-success btn-sm" type="button" onClick={() => checkBank()} disabled={isFetchingBank || checkBankData?.bankStatus}>
                                            {isFetchingBank && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Check
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-check"> {bankError && <ErrorAlert error={bankError} />}</div>
                            </div>
                        </div>

                        {checkBankData?.bankStatus && (
                            <div>
                                <div className="card-title mb-4">
                                    <h6>
                                        <i className="fa-solid fa-person-circle-exclamation"></i> Claim Details
                                    </h6>
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-2">
                                        <div className="form-check ">
                                            <label className="form-label" htmlFor="disabilityType">
                                                Disability Type {form.disabilityType.required && <span className="text-danger">*</span>}
                                            </label>
                                            <select
                                                id="disabilityType"
                                                name="disabilityType"
                                                className={`form-select ${form.disabilityType.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.disabilityType.value}
                                                required={form.disabilityType.required}
                                            >
                                                <option value="">Select</option>
                                                {disabilityType?.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>
                                                            {item.benefit_name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <div className="invalid-feedback">{form.disabilityType.error}</div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <div className="form-check mb-2">
                                            <label className="form-label" htmlFor="claimAmount">
                                                Claim Amount {form.claimAmount.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                className={`form-control ${form.claimAmount.error && "is-invalid"}`}
                                                type="text"
                                                value={form.claimAmount.value}
                                                name="claimAmount"
                                                id="claimAmount"
                                                onChange={(e) => handleChange(e.currentTarget)}
                                                disabled
                                            />
                                            <div className="invalid-feedback">{form.claimAmount.error}</div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-check mb-2">
                                            <label className="form-control-label">Select Date Type {form.dateTypeSelect.required && <span className="text-danger">*</span>}</label>
                                            <div className="form-check">
                                                <input
                                                    className={`form-check-input ${form.dateTypeSelect.error && "is-invalid"}`}
                                                    type="radio"
                                                    name="dateTypeSelect"
                                                    id="search_type1"
                                                    onChange={() => handleChange({ name: "dateTypeSelect", value: "date_of_release_from_hospital" })}
                                                    checked={form.dateTypeSelect.value == "date_of_release_from_hospital" ? true : false}
                                                    value="date_of_release_from_hospital"
                                                    required={form.dateTypeSelect.required}
                                                />
                                                <label className="form-check-label" htmlFor="search_type1">
                                                    Date of Release From Hospital
                                                </label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    className={`form-check-input ${form.dateTypeSelect.error && "is-invalid"}`}
                                                    type="radio"
                                                    name="dateTypeSelect"
                                                    id="search_type2"
                                                    onChange={() => handleChange({ name: "dateTypeSelect", value: "date_of_accident" })}
                                                    checked={form.dateTypeSelect.value == "date_of_accident" ? true : false}
                                                    value="date_of_accident"
                                                    required={form.dateTypeSelect.required}
                                                />
                                                <label className="form-check-label" htmlFor="search_type2">
                                                    Date Of Accident
                                                </label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    className={`form-check-input ${form.dateTypeSelect.error && "is-invalid"}`}
                                                    type="radio"
                                                    name="dateTypeSelect"
                                                    id="search_type3"
                                                    onChange={() => handleChange({ name: "dateTypeSelect", value: "date_of_occurrence" })}
                                                    checked={form.dateTypeSelect.value == "date_of_occurrence" ? true : false}
                                                    value="date_of_occurrence"
                                                    required={form.dateTypeSelect.required}
                                                />
                                                <label className="form-check-label" htmlFor="search_type3">
                                                    Date Of Occurrence
                                                </label>
                                                <div className="invalid-feedback">Please select Date Type</div>
                                            </div>
                                        </div>
                                    </div>

                                    {form.dateTypeSelect.value === "date_of_release_from_hospital" && (
                                        <div className="col-md-4">
                                            <div className="form-check mb-2">
                                                <label className="form-control-label" htmlFor="releaseFromHospital">
                                                    Date of Release From Hospital {form.releaseFromHospital.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="date"
                                                    id="releaseFromHospital"
                                                    name="releaseFromHospital"
                                                    className={`form-control ${form.releaseFromHospital.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.releaseFromHospital.value}
                                                    required={form.releaseFromHospital.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.releaseFromHospital.error}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {form.dateTypeSelect.value === "date_of_accident" && (
                                        <div className="col-md-4">
                                            <div className="form-check mb-2">
                                                <label className="form-control-label" htmlFor="dateOfAccident">
                                                    Date Of Accident {form.dateOfAccident.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="date"
                                                    id="dateOfAccident"
                                                    name="dateOfAccident"
                                                    className={`form-control ${form.dateOfAccident.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.dateOfAccident.value}
                                                    required={form.dateOfAccident.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.dateOfAccident.error}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {form.dateTypeSelect.value === "date_of_occurrence" && (
                                        <div className="col-md-4">
                                            <div className="form-check mb-2">
                                                <label className="form-control-label" htmlFor="dateOfOccurrence">
                                                    Date Of Occurrence {form.dateOfOccurrence.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="date"
                                                    id="dateOfOccurrence"
                                                    name="dateOfOccurrence"
                                                    className={`form-control ${form.dateOfOccurrence.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.dateOfOccurrence.value}
                                                    required={form.dateOfOccurrence.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.dateOfOccurrence.error}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {checkBankData?.bankStatus && (
                        <div className="card-footer">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="d-grid d-md-flex justify-content-md-end">
                                        <button className="btn btn-success btn-sm" type="submit" disabled={insertClaimLoading}>
                                            {insertClaimLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Save and Proceed
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default DisabilityClaimEntry;
