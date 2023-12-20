import React from "react";
import CWSelect from "../../components/select/CWSelect";
import TWSelect from "../../components/select/TWSelect";
import SelfEmployedSelect from "../../components/select/SelfEmployedSelect";
import UnOrganisedIndustriesSelect from "../../components/select/UnOrganisedIndustriesSelect";
import { useNavigate } from "react-router";

const WorkerTypeSelectNdfForm = ({ onChange, form, handleContinue }) => {
    const navigate = useNavigate();
    return (
        <form className="needs-validation" noValidate onSubmit={handleContinue}>
            <div className="card datatable-box mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <label className="text-dark">
                                Select Worker Type <span className="text-danger">*</span>
                            </label>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.cat_worker_type.error && "is-invalid"}`}
                                    type="radio"
                                    name="cat_worker_type"
                                    value="ow"
                                    id="other-worker"
                                    onChange={() => onChange({ name: "cat_worker_type", value: "ow" })}
                                    checked={form.cat_worker_type.value == "ow" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="other-worker">
                                    Other Worker
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.cat_worker_type.error && "is-invalid"}`}
                                    type="radio"
                                    value="cw"
                                    name="cat_worker_type"
                                    id="construction-worker"
                                    onChange={() => onChange({ name: "cat_worker_type", value: "cw" })}
                                    checked={form.cat_worker_type.value == "cw" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="construction-worker">
                                    Construction Worker
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.cat_worker_type.error && "is-invalid"}`}
                                    type="radio"
                                    value="tw"
                                    name="cat_worker_type"
                                    id="transport-worker"
                                    onChange={() => onChange({ name: "cat_worker_type", value: "tw" })}
                                    checked={form.cat_worker_type.value == "tw" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="transport-worker">
                                    Transport Worker
                                </label>

                                <div className="invalid-feedback">Please provide a valid Worker Type.</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="text-dark">
                                Select Sub Category <span className="text-danger"> *</span>{" "}
                            </label>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.sub_cat_name.error && "is-invalid"}`}
                                    type="radio"
                                    name="sub_cat_name"
                                    value="Self Employed"
                                    id="self_employed"
                                    onChange={() => onChange({ name: "sub_cat_name", value: "Self Employed" })}
                                    checked={form.sub_cat_name.value == "Self Employed" ? true : false}
                                    disabled={form.cat_worker_type.value !== "ow" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="self_employed">
                                    Self Employed
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.sub_cat_name.error && "is-invalid"}`}
                                    type="radio"
                                    value="Unorganised Industries"
                                    name="sub_cat_name"
                                    id="unorganised_industries"
                                    checked={form.sub_cat_name.value == "Unorganised Industries" ? true : false}
                                    onChange={() => onChange({ name: "sub_cat_name", value: "Unorganised Industries" })}
                                    disabled={form.cat_worker_type.value !== "ow" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="unorganised_industries">
                                    Unorganised Industries
                                </label>
                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row g-3">
                                {form.cat_worker_type.value === "cw" && (
                                    <div className="col-md-6">
                                        <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                        <CWSelect
                                            className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                            defaultValue={form.worker_type.value}
                                            onChange={(e) => onChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                            error={form.worker_type.error}
                                            required={form.worker_type.required}
                                        />

                                        <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                    </div>
                                )}
                                {form.cat_worker_type.value === "tw" && (
                                    <div className="col-md-6">
                                        <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                        <TWSelect
                                            className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                            label="Select Sub Category Name"
                                            size="xs"
                                            placeholder="Pick one"
                                            defaultValue={form.worker_type.value}
                                            onChange={(e) => onChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                            error={form.worker_type.error}
                                            required={form.worker_type.required}
                                        />
                                        <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                    </div>
                                )}
                                {form.cat_worker_type.value === "ow" && form.sub_cat_name.value === "Self Employed" && (
                                    <div className="col-md-6">
                                        <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                        <SelfEmployedSelect
                                            className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                            label="Select Sub Category Name"
                                            size="xs"
                                            placeholder="Pick one"
                                            defaultValue={form.worker_type.value}
                                            onChange={(e) => onChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                            error={form.worker_type.error}
                                            required={form.worker_type.required}
                                        />
                                        <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                    </div>
                                )}
                                {form.cat_worker_type.value === "ow" && form.sub_cat_name.value === "Unorganised Industries" && (
                                    <div className="col-md-6">
                                        <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                        <UnOrganisedIndustriesSelect
                                            className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                            label="Select Sub Category Name"
                                            size="xs"
                                            placeholder="Pick one"
                                            defaultValue={form.worker_type.value}
                                            onChange={(e) => onChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                            required={form.worker_type.required}
                                        />
                                        <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                    </div>
                                )}
                                {((form.cat_worker_type.value === "tw" && form.worker_type.value == 11) || (form.cat_worker_type.value === "cw" && form.worker_type.value == 7)) && (
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="other_worker_name">
                                            Other Sub Category Name
                                        </label>
                                        <input
                                            placeholder="Enter the name"
                                            className={`form-control ${form.other_worker_name.error && "is-invalid"}`}
                                            type="text"
                                            value={form.other_worker_name.value}
                                            name="other_worker_name"
                                            id="other_worker_name"
                                            onChange={(e) => onChange(e.currentTarget)}
                                        />
                                        <div className="invalid-feedback">Please provide a valid Other Sub Category Name.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-md-end gap-2">
                    <button className="btn btn-primary btn-sm  btn-success" type="submit">
                        Submit
                    </button>
                    <button className="btn btn-primary btn-sm  btn-danger" type="button" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default WorkerTypeSelectNdfForm;
