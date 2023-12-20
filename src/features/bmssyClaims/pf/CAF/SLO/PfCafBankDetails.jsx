import React from "react";
import AsyncSelect from "../../../../../components/select/AsyncSelect";
import { fetcher } from "../../../../../utils";
import DistrictSelect from "../../../../../components/select/DistrictSelect";

const PfCafBankDetails = ({ form, handleChange, validator }) => {
    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.bank_name.value = item.bank_name || "";
            state.bank_branch_name.value = item.branch_name || "";
            state.bank_district_name.value = item.dist_code || "";
            state.bank_location.value = item.branch_address || "";

            state.bank_name.error = "";
            state.bank_branch_name.error = "";
            state.bank_district_name.error = "";
            state.bank_location.error = "";
            return { ...state };
        });
    };

    return (
        <>
            <div className="card mb-2">
                <div className="card-body">
                    <h5 className="card-title">Beneficiary Bank Details</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">
                                Bank IFSC Code {form.bank_ifsc.required && <span className="text-danger">*</span>}
                            </label>

                            <AsyncSelect
                                className={form.bank_ifsc.error && "is-invalid"}
                                loadOptions={async (value) => {
                                    try {
                                        const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                        return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                    } catch (error) {
                                        return [];
                                    }
                                }}
                                onItemSubmit={autoPopulate}
                                id="bank_ifsc"
                                value={form.bank_ifsc.value}
                                onChange={(value) => handleChange({ name: "bank_ifsc", value: value })}
                            />
                            <div className="invalid-feedback">Please enter Bank Ifsc</div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="bank_name" className="form-label">
                                Bank Name {form.bank_name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Name "
                                className={`form-control ${form.bank_name.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_name.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_name"
                                id="bank_name"
                                required={form.bank_name.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Name.</div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">
                                Bank Branch Name {form.bank_branch_name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Branch Name"
                                className={`form-control ${form.bank_branch_name.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_branch_name.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_branch_name"
                                id="bank_branch_name"
                                required={form.bank_branch_name.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Branch Name.</div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">
                                Bank District Name {form.bank_district_name.required && <span className="text-danger">*</span>}
                            </label>
                            {/* <input placeholder="Bank Branch Name" className={`form-control ${"is-invalid"}`} type="text" value="" name="mname" id="mname" /> */}
                            <DistrictSelect
                                className={`form-select ${form.bank_district_name.error && "is-invalid"}`}
                                placeholder="Bank District Name"
                                label="Bank District Name"
                                value={form.bank_district_name.value}
                                onChange={(e) => handleChange({ name: "bank_district_name", value: e.currentTarget.value })}
                                required={form.bank_district_name.required}
                            />
                            <div className="invalid-feedback">Please select district</div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">
                                Bank Location {form.bank_location.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Location"
                                className={`form-control ${form.bank_location.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_location.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_location"
                                id="bank_location"
                                required={form.bank_location.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Location.</div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">
                                Bank Account No. {form.bank_account_no.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Account Name"
                                className={`form-control ${form.bank_account_no.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_account_no.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_account_no"
                                id="bank_account_no"
                                required={form.bank_account_no.required}
                            />
                            <div className="invalid-feedback">{form.bank_account_no.error}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PfCafBankDetails;
