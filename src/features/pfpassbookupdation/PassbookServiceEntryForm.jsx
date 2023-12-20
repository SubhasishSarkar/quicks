import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useValidate } from "../../hooks";
import GPWardSelect from "../../components/select/GPWardSelect";
import { fetcher, updater } from "../../utils";
import { toast } from "react-toastify";
import moment from "moment";

const PassbookServiceEntryForm = ({ data, handleClick, setSsinDetails, setCollectedArn, setCollectedDetails, collectedArn, collectedDetails, duaresarkar, formValidator }) => {
    const [form, validator] = useValidate(
        {
            ssin_no: { value: "", validate: "required" },
            beneficiary_name: { value: "", validate: "required" },
            aadhaar_exists: { value: "", validate: "required" },
            aadhaar_no: { value: "", validate: "required" },
            application_id: { value: "", validate: "required" },

            ds_reg_no: { value: "", validate: duaresarkar == 1 ? "required" : "" },
            ds_reg_dt: { value: null, validate: duaresarkar == 1 ? "required" : "" },

            district_code: { value: "", validate: "required" },
            sub_div_code: { value: "", validate: "required" },
            gpward_code: { value: "", validate: "required" },

            block_code: { value: "", validate: duaresarkar == 1 ? "required" : "" },
            gp_ward_code: { value: "", validate: duaresarkar == 1 ? "required" : "" },

            worker_type: { value: "", validate: "required" },
            backlog: { value: "", validate: "required" },
            duaresarkar: { value: "", validate: "required" },

            reg_no: { value: "", validate: "" },
            reg_date: { value: "", validate: "" },
            ssin_approved_dt: { value: "", validate: "required" },
            period_from: { value: "", validate: "required" },
            period_to: { value: "", validate: "required" },
            total_amount: { value: "", validate: "required" },
            collected_arn: { value: "", validate: "required" },
        },
        {
            ssin_no: data.data.ssin_no,
            beneficiary_name: data.data.name,
            aadhaar_exists: data.aadhaar_exist ? "AADHAAR NUMBER EXISTS" : "AADHAAR NUMBER DOES NOT EXISTS",
            aadhaar_no: data.data.aadhar,
            application_id: data.data.application_id,
            ds_reg_no: duaresarkar == 1 ? data.ds_reg_no : "",
            ds_reg_dt: duaresarkar == 1 ? data.ds_reg_dt : null,
            district_code: data.parameters.district_code,
            sub_div_code: data.parameters.sub_div_code,
            gpward_code: data.parameters.gpward_code,
            block_code: duaresarkar != 1 ? data.parameters.block_code : "",
            gp_ward_code: duaresarkar != 1 ? data.parameters.gp_ward_code : "",
            worker_type: data.parameters.worker_type,
            backlog: data.parameters.backlog,
            duaresarkar: duaresarkar,
            reg_no: data.data.reg_no,
            reg_date: data.data.registration_date,
            ssin_approved_dt: data.ssin_approved_dt,
            period_from: data.period_from,
            period_to: data.period_to,
            total_amount: data.total_amount,
            collected_arn: data.parameters.pf_collected_by,
        }
    );
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!validator.validate()) return;
        const data = validator.generalize();
        mutate(
            { url: `/ppu-passbook-update`, body: data },
            {
                onSuccess(data) {
                    toast.success("SERVICE SUCCESSFULLY DELIVERED");
                    setSsinDetails("");
                    validator.reset();
                    formValidator.reset();
                },
                onError(error) {
                    toast.error(error.message);
                    validator.setError(error.message);
                    setSsinDetails("");
                    validator.reset();
                    formValidator.reset();
                },
            }
        );
    };

    const handleTotalAmount = async (e) => {
        try {
            handleChange(e);
            const data = validator.generalize();
            const total_amount = await fetcher(
                "/get_pfpassbook_total_amount?period_to=" +
                    moment(e.value).format("YYYY-MM-DD") +
                    "&&period_from=" +
                    moment(data.period_from).format("YYYY-MM-DD") +
                    "&&max_period=" +
                    moment(e.max).format("YYYY-MM-DD") +
                    "&&min_period=" +
                    moment(e.min).format("YYYY-MM-DD")
            );

            validator.setState((prev) => {
                prev.total_amount.value = total_amount;
                prev.period_to.value = e.value;
                return { ...prev };
            });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChange = (e) => {
        validator.validOnChange(e);
        if (e.name == "block_code" && e.value == "") {
            validator.setState((prev) => {
                prev.gp_ward_code.value = "";
                return { ...prev };
            });
        }
    };

    const handleBack = (e) => {
        setSsinDetails("");
        setCollectedDetails({ data: null, error: null, loading: false });
        validator.reset();
        formValidator.reset();
    };

    const handleCollectedByArnChange = (e) => {
        setCollectedDetails({ data: null, error: null, loading: false });
        setCollectedArn(e.value);
        validator.setState((prev) => {
            prev.collected_arn.value = e.value;
            return { ...prev };
        });
    };

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div className="card datatable-box shadow mb-4">
                    <div className="card-body">
                        {duaresarkar == 1 && (
                            <div className="row g-12">
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Duare Sarkar Service Type <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" name="scheme" id="scheme" value="PF PASSBOOK UPDATE" disabled="disabled" onChange={() => {}} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Duare Sarkar Registration No.<span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" name="ds_reg_no" id="ds_reg_no" value={form.ds_reg_no.value} required={form.ds_reg_no.required} disabled="disabled" onChange={() => {}} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Duare Sarkar Registration Date <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" name="ds_reg_dt" id="ds_reg_dt" value={moment(form.ds_reg_dt.value).format("DD-MM-YYYY")} required={form.ds_reg_dt.required} disabled="disabled" onChange={() => {}} />
                                </div>
                            </div>
                        )}

                        <div className="row g-12">
                            <div className="col-md-4">
                                <label className="form-label">
                                    SSIN <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" name="ssin_no" id="ssin_no" value={form.ssin_no.value} required={form.ssin_no.required} disabled="disabled" onChange={() => {}} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Beneficiary Name<span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" name="beneficiary_name" id="beneficiary_name" value={form.beneficiary_name.value} required={form.beneficiary_name.required} disabled="disabled" onChange={() => {}} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Aadhaar No <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" name="aadhaar_exists" id="aadhaar_exists" value={form.aadhaar_exists.value} required={form.aadhaar_exists.required} disabled="disabled" onChange={() => {}} />
                            </div>
                        </div>

                        <div className="row g-12">
                            <div className="col-md-4">
                                <label className="form-label">Old Registration No</label>
                                <input
                                    type="text"
                                    className={`form-control ${form.reg_no.error && "is-invalid"}`}
                                    name="reg_no"
                                    id="reg_no"
                                    value={form.reg_no.value}
                                    required={form.reg_no.required}
                                    disabled={data.reg_no ? "disabled" : false}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.reg_no.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Old Registration Date</label>
                                <input
                                    type="date"
                                    className={`form-control ${form.reg_date.error && "is-invalid"}`}
                                    name="reg_date"
                                    id="reg_date"
                                    value={form.reg_date.value}
                                    required={form.reg_date.required}
                                    disabled={data.reg_no ? "disabled" : false}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.reg_date.error}</div>
                            </div>
                            <div className="col-md-4">
                                <input type="hidden" name="ssin_approved_dt" id="ssin_approved_dt" value={form.ssin_approved_dt.value} required={form.ssin_approved_dt.required} onChange={() => {}} />
                            </div>
                        </div>

                        <div className="row g-12">
                            <div className="col-md-4">
                                <label className="form-label">
                                    Period From <span className="text-danger">*</span>
                                </label>
                                <input type="date" className="form-control" name="period_from" id="period_from" value={form.period_from.value} required={form.period_from.required} disabled="disabled" onChange={() => {}} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Period To<span className="text-danger">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${form.period_to.error && "is-invalid"}`}
                                    name="period_to"
                                    id="period_to"
                                    max={data.period_to}
                                    min={data.period_from}
                                    value={form.period_to.value}
                                    required={form.period_to.required}
                                    onKeyDown={(e) => e.preventDefault()}
                                    onChange={(e) => handleTotalAmount(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.period_to.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">
                                    Amount<span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" name="total_amount" id="total_amount" value={form.total_amount.value} required={form.total_amount.required} disabled="disabled" />
                            </div>
                        </div>

                        <div className="row g-12">
                            {duaresarkar == 1 && (
                                <>
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Venue of Camp (Block/Municipality/Corporation)<span className="text-danger">*</span>
                                        </label>
                                        <select className={`form-select ${form.block_code.error && "is-invalid"}`} name="block_code" id="block_code" onChange={(e) => handleChange({ name: "block_code", value: e.currentTarget.value })}>
                                            <option value=""> Select Block </option>
                                            {data.parameters.block_list.map((item) => (
                                                <option value={item.block_code} key={item.block_code}>
                                                    {item.block_mun_name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">{form.block_code.error}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Venue of Camp (G.P. ward) <span className="text-danger">*</span>
                                        </label>
                                        <GPWardSelect
                                            className={`form-select ${form.gp_ward_code.error && "is-invalid"}`}
                                            id="gp_ward_code"
                                            name="gp_ward_code"
                                            block={form.block_code.value}
                                            onChange={(e) => handleChange({ name: "gp_ward_code", value: e.currentTarget.value })}
                                        />
                                        <div className="invalid-feedback">{form.gp_ward_code.error}</div>
                                    </div>
                                </>
                            )}

                            <div className="col-md-3">
                                <label className="form-label">
                                    Entered in Passbook by (ARN) <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${form.collected_arn.error && "is-invalid"}`}
                                    name="collected_arn"
                                    id="collected_arn"
                                    value={collectedArn}
                                    disabled={data.parameters.pf_collected_by ? true : false}
                                    required={form.collected_arn.required}
                                    onChange={(e) => handleCollectedByArnChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.gp_ward_code.error}</div>
                                {collectedDetails.loading && (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                                {collectedDetails.data && (
                                    <div id="emailHelp" className="form-text">
                                        <div id="emailHelp" className="form-text">
                                            <span className="text-primary">
                                                {collectedDetails.data.fullname}({collectedDetails.data.name})
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {collectedDetails.error && <span className="text-danger">{collectedDetails.error}</span>}
                            </div>

                            {!data.parameters.pf_collected_by && (
                                <div className="col-md-1">
                                    <div id="proceed" className="btn btn-warning btn-sm" onClick={(e) => handleClick(collectedArn)}>
                                        Proceed
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="row g-12">
                            <div className="col-md-1">
                                {(collectedDetails.data || data.parameters.pf_collected_by) && (
                                    <button className="btn btn-success btn-sm" type="submit">
                                        {isLoading ? "Loading..." : "SUBMIT"}
                                    </button>
                                )}
                            </div>
                            <div className="col-md-1">
                                <button className="btn btn-danger btn-sm" onClick={(e) => handleBack()}>
                                    BACK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default PassbookServiceEntryForm;
