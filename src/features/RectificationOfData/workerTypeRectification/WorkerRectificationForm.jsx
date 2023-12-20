import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import CWSelect from "../../../components/select/CWSelect";
import SelfEmployedSelect from "../../../components/select/SelfEmployedSelect";
import TWSelect from "../../../components/select/TWSelect";
import UnOrganisedIndustriesSelect from "../../../components/select/UnOrganisedIndustriesSelect";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";

const WorkerRectificationForm = ({ encId, ssin, handleClose }) => {
    const [form, validator] = useValidate({
        worker_type_select: { value: "", validate: "required" },
        sub_cat_name: { value: "", validate: "" },
        cat_worker_type: { value: "", validate: "required" },
        other_worker_name: { value: "", validate: "" },
        ssin_no: { value: ssin, validate: "" },
        application_id: { value: encId, validate: "" },
    });

    const { error, data, isFetching } = useQuery(["get-existing-type-worker-correction", encId], () => fetcher(`/get-existing-type-worker-correction?application_id=${encId}`));

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "worker_type_select":
                    setState((state) => {
                        if (value === "radio_ow") {
                            state.sub_cat_name.required = true;
                            state.sub_cat_name.validate = "required";
                        } else {
                            state.sub_cat_name.required = false;
                            state.sub_cat_name.validate = "";
                            state.sub_cat_name.value = "";
                            state.sub_cat_name.error = null;
                        }
                        state.other_worker_name.required = false;
                        state.other_worker_name.validate = "";
                        state.other_worker_name.value = "";
                        state.other_worker_name.error = null;
                        return { ...state };
                    });
                    break;
                case "cat_worker_type":
                    setState((state) => {
                        if (value == 11 || value == 7) {
                            state.other_worker_name.required = true;
                            state.other_worker_name.validate = "required";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        } else {
                            state.other_worker_name.required = false;
                            state.other_worker_name.validate = "";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate: forYesBtn, isLoading: forYesLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const query = useQueryClient();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        forYesBtn(
            { url: `/worker-type-rectification`, body: formData },
            {
                onSuccess(data, variables, context) {
                    query.invalidateQueries("wrong-worker-type-list");
                    toast.success("Worker type successfully rectified.");
                    handleClose(true);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            <form noValidate onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12 mb-2">
                        <label className="form-control-label" htmlFor="worker_type_select">
                            Select Worker Type {form.worker_type_select.required && <span className="text-danger">*</span>}
                        </label>
                        <div className="form-check">
                            <input
                                className={`form-check-input ${form.worker_type_select.error && "is-invalid"}`}
                                type="radio"
                                name="worker_type_select"
                                id="select_type_ow"
                                onChange={() => handleChange({ name: "worker_type_select", value: "radio_ow" })}
                                checked={form.worker_type_select.value == "radio_ow" ? true : false}
                                value="radio_ow"
                                required={form.worker_type_select.required}
                                disabled={data?.workerType === "ow" ? true : false}
                            />
                            <label className="form-check-label" htmlFor="select_type_ow">
                                Other Worker
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className={`form-check-input ${form.worker_type_select.error && "is-invalid"}`}
                                type="radio"
                                name="worker_type_select"
                                id="select_type_cw"
                                onChange={() => handleChange({ name: "worker_type_select", value: "radio_cw" })}
                                checked={form.worker_type_select.value == "radio_cw" ? true : false}
                                value="radio_cw"
                                required={form.worker_type_select.required}
                                disabled={data?.workerType === "cw" ? true : false}
                            />
                            <label className="form-check-label" htmlFor="select_type_cw">
                                Construction Worker
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className={`form-check-input ${form.worker_type_select.error && "is-invalid"}`}
                                type="radio"
                                name="worker_type_select"
                                id="select_type_tw"
                                onChange={() => handleChange({ name: "worker_type_select", value: "radio_tw" })}
                                checked={form.worker_type_select.value == "radio_tw" ? true : false}
                                value="radio_tw"
                                required={form.worker_type_select.required}
                                disabled={data?.workerType === "tw" ? true : false}
                            />
                            <label className="form-check-label" htmlFor="select_type_tw">
                                Transport Worker
                            </label>
                            <div className="invalid-feedback">Please select search by</div>
                        </div>
                    </div>

                    {form.worker_type_select.value === "radio_ow" && (
                        <div className="mb-2">
                            <p className="mb-0">
                                Select Sub Category <span className="text-danger"> *</span>{" "}
                            </p>
                            <div className="form-check">
                                <input
                                    className={`form-check-input ${form.sub_cat_name.error && "is-invalid"}`}
                                    type="radio"
                                    name="sub_cat_name"
                                    value="Self Employed"
                                    id="self_employed"
                                    onChange={() => handleChange({ name: "sub_cat_name", value: "Self Employed" })}
                                    checked={form.sub_cat_name.value == "Self Employed" ? true : false}
                                    disabled={form.worker_type_select.value !== "radio_ow" ? true : false}
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
                                    disabled={form.worker_type_select.value !== "radio_ow" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="unorganised_industries">
                                    Unorganised Industries
                                </label>
                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                            </div>
                        </div>
                    )}

                    {form.worker_type_select.value === "radio_cw" && (
                        <div className="col-md-12 mb-2">
                            <label className="form-label">Select Sub Category Name {form.cat_worker_type.required && <span className="text-danger">*</span>}</label>
                            <CWSelect
                                className={`form-select ${form.cat_worker_type.error && "is-invalid"}`}
                                defaultValue={form.cat_worker_type.value}
                                onChange={(e) => handleChange({ name: "cat_worker_type", value: e.currentTarget.value ? parseInt(e.currentTarget.value) : "" })}
                                error={form.cat_worker_type.error}
                                required={form.cat_worker_type.required}
                            />

                            <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                        </div>
                    )}
                    {form.worker_type_select.value === "radio_tw" && (
                        <div className="col-md-12 mb-2">
                            <label className="form-label">Select Sub Category Name {form.cat_worker_type.required && <span className="text-danger">*</span>}</label>
                            <TWSelect
                                className={`form-select ${form.cat_worker_type.error && "is-invalid"}`}
                                label="Select Sub Category Name"
                                size="xs"
                                placeholder="Pick one"
                                defaultValue={form.cat_worker_type.value}
                                onChange={(e) => handleChange({ name: "cat_worker_type", value: e.currentTarget.value ? parseInt(e.currentTarget.value) : "" })}
                                error={form.cat_worker_type.error}
                                required={form.cat_worker_type.required}
                            />
                            <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                        </div>
                    )}

                    {form.worker_type_select.value === "radio_ow" && form.sub_cat_name.value === "Self Employed" && (
                        <div className="col-md-12 mb-2">
                            <label className="form-label">Select Sub Category Name {form.cat_worker_type.required && <span className="text-danger">*</span>}</label>
                            <SelfEmployedSelect
                                className={`form-select ${form.cat_worker_type.error && "is-invalid"}`}
                                label="Select Sub Category Name"
                                size="xs"
                                placeholder="Pick one"
                                value={form.cat_worker_type.value}
                                onChange={(e) => handleChange({ name: "cat_worker_type", value: e.currentTarget.value ? parseInt(e.currentTarget.value) : "" })}
                                error={form.cat_worker_type.error}
                                required={form.cat_worker_type.required}
                            />
                            <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                        </div>
                    )}

                    {form.worker_type_select.value === "radio_ow" && form.sub_cat_name.value === "Unorganised Industries" && (
                        <div className="col-md-12 mb-2">
                            <label className="form-label">Select Sub Category Name {form.cat_worker_type.required && <span className="text-danger">*</span>}</label>
                            <UnOrganisedIndustriesSelect
                                className={`form-select ${form.cat_worker_type.error && "is-invalid"}`}
                                label="Select Sub Category Name"
                                size="xs"
                                placeholder="Pick one"
                                value={form.cat_worker_type.value}
                                onChange={(e) => handleChange({ name: "cat_worker_type", value: e.currentTarget.value ? parseInt(e.currentTarget.value) : "" })}
                                required={form.cat_worker_type.required}
                            />
                            <div className="invalid-feedback">Please provide a valid Sub Category.</div>
                        </div>
                    )}

                    {((form.worker_type_select.value === "radio_tw" && form.cat_worker_type.value == 11) || (form.worker_type_select.value === "radio_cw" && form.cat_worker_type.value == 7)) && (
                        <div className="col-md-12 mb-2">
                            <label className="form-label" htmlFor="other_worker_name">
                                Other Sub Category Name{" "}
                                {((form.worker_type_select.value === "radio_tw" && form.cat_worker_type.value == 11) || (form.worker_type_select.value === "radio_cw" && form.cat_worker_type.value == 7)) && <span className="text-danger">*</span>}
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
                        </div>
                    )}

                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                                <button className="btn btn-success btn-sm" type="submit" disabled={forYesLoading}>
                                    {forYesLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default WorkerRectificationForm;
