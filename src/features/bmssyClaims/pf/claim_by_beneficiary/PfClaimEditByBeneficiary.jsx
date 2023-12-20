import React, { useState } from "react";
import { useValidate } from "../../../../hooks";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../utils";
import { useNavigate } from "react-router";
import AsyncSelect from "../../../../components/select/AsyncSelect";
import ErrorAlert from "../../../../components/list/ErrorAlert";

const PfClaimEditByBeneficiary = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState("");
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
            registrationNo: { value: data?.registrationNo, validate: "" },
            workerType: { value: data?.workerType, validate: "" },
            benRloCode: { value: data?.benRloCode, validate: "" },
            applicationId: { value: data?.applicationId, validate: "" },
            claimType: { value: "pf", validate: "" },
            pfClaimApplyBy: { value: "pf_by_ben", validate: "" },
            maturityDate: { value: data?.maturityDate, validate: "" },
            benAadhar: { value: data?.benAadhar, validate: "" },
            benDob: { value: data?.benDob, validate: "" },
            claimBenMstId: { value: data?.claimBenMstId, validate: "" },
            claimMstId: { value: data?.claimMstId, validate: "" },
        },
        data,
        true
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
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

    const { data: checkBankData, isFetching: isFetchingBank, error: bankError } = useQuery(["check-bank-for-disability-claim", searchQuery], () => fetcher("/check-bank-for-disability-claim?" + searchQuery), { enabled: searchQuery ? true : false });
    const checkBank = () => {
        if (form.benBankIfsc.value === "" && form.benBnkAcc.value === "") {
            toast.error("Please enter bank ifsc and account number");
        } else {
            setSearchQuery(`benBankIfsc=${form.benBankIfsc.value}&benBnkAcc=${form.benBnkAcc.value}&benBnkName=${form.benBnkName.value}&benBnkBranch=${form.benBnkBranch.value}&benBnkLoc=${form.benBnkLoc.value}&applicationId=${data?.applicationId}`);
        }
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
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={insertClaimLoading}>
                                {insertClaimLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Save and Proceed
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PfClaimEditByBeneficiary;
