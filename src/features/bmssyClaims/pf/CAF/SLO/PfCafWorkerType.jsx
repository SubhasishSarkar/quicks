import React from "react";
import CWSelect from "../../../../../components/select/CWSelect";
import TWSelect from "../../../../../components/select/TWSelect";
import SelfEmployedSelect from "../../../../../components/select/SelfEmployedSelect";
import UnOrganisedIndustriesSelect from "../../../../../components/select/UnOrganisedIndustriesSelect";

const PfCafWorkerType = ({ form, handleChange }) => {
    return (
        <>
            <div className="card mb-2">
                <div className="card-body">
                    <h5 className="card-title mb-2">Beneficiary Worker Details</h5>
                    <div className="row">
                        <div className="col-md-2">
                            <label className="form-label">Worker Type {form.cat_worker_type.required && <span className="text-danger">*</span>}</label>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.cat_worker_type.error && "is-invalid"}`}
                                    type="radio"
                                    name="cat_worker_type"
                                    value="ow"
                                    id="other-worker"
                                    onChange={() => handleChange({ name: "cat_worker_type", value: "ow" })}
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
                                    onChange={() => handleChange({ name: "cat_worker_type", value: "cw" })}
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
                                    onChange={() => handleChange({ name: "cat_worker_type", value: "tw" })}
                                    checked={form.cat_worker_type.value == "tw" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="transport-worker">
                                    Transport Worker
                                </label>

                                <div className="invalid-feedback">Please provide a valid Worker Type.</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Sub Category {form.sub_cat_name.required && <span className="text-danger">*</span>}</label>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.sub_cat_name.error && "is-invalid"}`}
                                    type="radio"
                                    name="sub_cat_name"
                                    value="Self Employed"
                                    id="self_employed"
                                    onChange={() => handleChange({ name: "sub_cat_name", value: "Self Employed" })}
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
                                    onChange={() => handleChange({ name: "sub_cat_name", value: "Unorganised Industries" })}
                                    disabled={form.cat_worker_type.value !== "ow" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="unorganised_industries">
                                    Unorganised Industries
                                </label>
                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            {form.cat_worker_type.value === "cw" && (
                                <>
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <CWSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        defaultValue={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        error={form.worker_type.error}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                </>
                            )}
                            {form.cat_worker_type.value === "tw" && (
                                <>
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <TWSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        label="Select Sub Category Name"
                                        size="xs"
                                        placeholder="Pick one"
                                        defaultValue={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        error={form.worker_type.error}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                </>
                            )}
                            {form.cat_worker_type.value === "ow" && form.sub_cat_name.value === "Self Employed" && (
                                <>
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <SelfEmployedSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        label="Select Sub Category Name"
                                        size="xs"
                                        placeholder="Pick one"
                                        defaultValue={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        error={form.worker_type.error}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                </>
                            )}
                            {form.cat_worker_type.value === "ow" && form.sub_cat_name.value === "Unorganised Industries" && (
                                <>
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <UnOrganisedIndustriesSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        label="Select Sub Category Name"
                                        size="xs"
                                        placeholder="Pick one"
                                        defaultValue={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                                </>
                            )}
                        </div>

                        <div className="col-md-4">
                            {((form.cat_worker_type.value === "tw" && form.worker_type.value == 11) || (form.cat_worker_type.value === "cw" && form.worker_type.value == 7)) && (
                                <>
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
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">Please provide a valid Other Sub Category Name.</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PfCafWorkerType;
