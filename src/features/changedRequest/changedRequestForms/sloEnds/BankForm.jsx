import React from "react";
import AsyncSelect from "../../../../components/select/AsyncSelect";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import { fetcher } from "../../../../utils";

const BankForm = ({ form, validator, handleChange }) => {
    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.bnkName.value = item.bank_name || "";
            state.bnkBranch.value = item.branch_name || "";
            state.bnkDistrict.value = item.dist_code || "";
            state.bnkLocation.value = item.branch_address || "";
            return { ...state };
        });
    };

    return (
        <>
            <div className="card mb-3">
                <div className="section_title">
                    <strong>Bank</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="ifsc">
                                Bank IFSC {form.ifsc.required && <span className="text-danger">*</span>}
                            </label>
                            <AsyncSelect
                                className={form.ifsc.error && "is-invalid"}
                                loadOptions={async (value) => {
                                    try {
                                        const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                        return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                    } catch (error) {
                                        return [];
                                    }
                                }}
                                onItemSubmit={autoPopulate}
                                id="ifsc"
                                value={form.ifsc.value}
                                onChange={(value) => handleChange({ name: "ifsc", value: value })}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.ifsc.error}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="bnkName">
                                Bank Name {form.bnkName.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="bnkName"
                                name="bnkName"
                                className={`form-control ${form.bnkName.error && "is-invalid"}`}
                                value={form.bnkName.value}
                                required={form.bnkName.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.bnkName.error}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="bnkBranch">
                                Bank Branch {form.bnkBranch.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="bnkBranch"
                                name="bnkBranch"
                                className={`form-control ${form.bnkBranch.error && "is-invalid"}`}
                                value={form.bnkBranch.value}
                                required={form.bnkBranch.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.bnkBranch.error}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="bnkLocation">
                                Bank Location {form.bnkLocation.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="bnkLocation"
                                name="bnkLocation"
                                className={`form-control ${form.bnkLocation.error && "is-invalid"}`}
                                value={form.bnkLocation.value}
                                required={form.bnkLocation.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.bnkLocation.error}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="bnkDistrict" className="form-label">
                                Bank District Name {form.bnkDistrict.required && <span className="text-danger">*</span>}
                            </label>
                            <DistrictSelect
                                className={`form-select ${form.bnkDistrict.error && "is-invalid"}`}
                                placeholder="Bank District Name"
                                label="Bank District Name"
                                value={form.bnkDistrict.value}
                                onChange={(e) => handleChange({ name: "bnkDistrict", value: e.currentTarget.value })}
                                required={form.bnkDistrict.required}
                            />
                            <div className="invalid-feedback">{form.bnkDistrict.error}</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="bnkAccNo">
                                Bank Account No. {form.bnkAccNo.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="bnkAccNo"
                                name="bnkAccNo"
                                className={`form-control ${form.bnkAccNo.error && "is-invalid"}`}
                                value={form.bnkAccNo.value}
                                required={form.bnkAccNo.required}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.bnkAccNo.error}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BankForm;
