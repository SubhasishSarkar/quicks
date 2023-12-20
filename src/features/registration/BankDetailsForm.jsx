import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import DistrictSelect from "../../components/select/DistrictSelect";
import { useValidate } from "../../hooks";
import { autoPopulate, fetcher, updater } from "../../utils";
import { disableQuery } from "../../data";
import AsyncSelect from "../../components/select/AsyncSelect";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";

const BankDetailsForm = ({ nextStep, prevStep }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const { isFetching, data } = useQuery(["caf-registration-preview", "bank-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=bank-details`), {
        ...disableQuery,
        enabled: application_id ? true : false,
    });
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const [form, validator] = useValidate(
        {
            bank_ifsc: { value: "", validate: "required" },
            bank_name: { value: "", validate: "required" },
            bank_branch_name: { value: "", validate: "required" },
            bank_district_name: { value: "", validate: "required" },
            bank_location: { value: "", validate: "required" },
            bank_account_no: { value: "", validate: "number|bankAccount|number|required" },
        },
        data,
        true
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    // const autoPopulate = (item) => {
    //     validator.setState((state) => {
    //         state.bank_name.value = item.bank_name || "";
    //         state.bank_branch_name.value = item.branch_name || "";
    //         state.bank_district_name.value = item.dist_code || "";
    //         state.bank_location.value = item.branch_address || "";
    //         return { ...state };
    //     });
    //     validator.validOnChange({ name: "bank_name", value: item.bank_name || "" });
    //     validator.validOnChange({ name: "bank_branch_name", value: item.branch_name || "" });
    //     validator.validOnChange({ name: "bank_district_name", value: item.dist_code || "" });
    //     validator.validOnChange({ name: "bank_location", value: item.branch_address || "" });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        if (application_id) {
            const data = validator.generalize();
            mutate(
                { url: "/caf-registration?type=bank-details&id=" + application_id, body: data },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        nextStep(3);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };
    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "bank-details", application_id], {
                exact: true,
            });
        };
    }, [application_id, query]);

    return (
        <>
            {isFetching && <LoadingOverlay />}
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="row g-3 mb-3">
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
                            onItemSubmit={(item) => {
                                autoPopulate(item, validator);
                            }}
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
                            placeholder="Bank Account No."
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

                <div className="card-footer">
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button className="btn btn-success" type="submit" disabled={isLoading}>
                            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-floppy-disk"></i>} Save Draft & Proceed
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default BankDetailsForm;
