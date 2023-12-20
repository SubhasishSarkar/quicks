import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import GenderSelect from "../../../../components/select/GenderSelect";
import { useValidate } from "../../../../hooks";
import { fetcher, updater } from "../../../../utils";

const DependentAddEditModal = ({ show, handleClose, modalData }) => {
    const { error, data, isFetching } = useQuery(["cr-get-dependent-details", modalData?.dependent_id], () => fetcher(`/cr-get-dependent-details?id=${modalData?.dependent_id}`), { enabled: modalData?.dependent_id ? true : false });

    const [form, validator] = useValidate(
        {
            dependent_name: { value: "", validate: "required" },
            dependent_relationship: { value: "", validate: "required" },
            dependent_gender: { value: "", validate: "required" },
            dependent_oth_rel: { value: "", validate: "" },
            dependent_dob: { value: "", validate: "required|maxDate" },
            dependent_age: { value: "", validate: "required" },
            status: { value: "", validate: "" },
            flag_status: { value: "", validate: "" },
            modify_parent_id: { value: "", validate: "" },
            dependent_id: { value: "", validate: "" },
            application_id: { value: "", validate: "" },
        },
        data,
        true
    );

    useEffect(() => {
        if (modalData?.encAppId)
            validator.setState((state) => {
                state.application_id.value = modalData?.encAppId;
                state.status.value = modalData?.dependent_id ? data?.status : "";
                state.flag_status.value = modalData?.dependent_id ? (data?.flag_status ? data?.flag_status : "R") : "R";
                state.modify_parent_id.value = modalData?.dependent_id ? data?.modify_parent_id : "";
                state.dependent_id.value = modalData?.dependent_id ? data?.dependent_id : "";
                return { ...state };
            });
    }, [modalData?.encAppId]);

    useEffect(() => {
        if (!modalData?.dependent_id && modalData?.label === "Add New Dependent") {
            validator.setState((state) => {
                state.dependent_name.value = "";
                state.dependent_dob.value = "";
                state.dependent_age.value = "";
                state.dependent_relationship.value = "";
                state.dependent_oth_rel.value = "";
                state.dependent_gender.value = "";
                state.status.value = "";
                state.flag_status.value = "";
                state.dependent_id.value = "";

                state.dependent_name.error = "";
                state.dependent_dob.error = "";
                state.dependent_age.error = "";
                state.dependent_relationship.error = "";
                state.dependent_oth_rel.error = "";
                state.dependent_gender.error = "";

                return { ...state };
            });
        }
    }, [!modalData?.dependent_id, !show]);

    const [submitEnable, setSubmitEnable] = useState(true);

    useEffect(() => {
        if (show === false) setSubmitEnable(true);
    }, [show]);

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            setSubmitEnable(false);
            switch (name) {
                case "dependent_relationship":
                    setState((state) => {
                        if (value === "Other") {
                            state.dependent_oth_rel.required = true;
                            state.dependent_oth_rel.validate = "required";
                            state.dependent_oth_rel.error = null;
                        } else {
                            state.dependent_oth_rel.required = false;
                            state.dependent_oth_rel.validate = "";
                            state.dependent_oth_rel.value = "";
                            state.dependent_oth_rel.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const query = useQueryClient();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/cr-add-update-dependent`, body: formData },
            {
                onSuccess(data, variables, context) {
                    handleClose(false);
                    query.invalidateQueries("previous-dependent-list");
                    toast.success(data.msg);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };
    return (
        <>
            {isFetching && !modalData?.dependent_id && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" className="rectification_modal">
                <Modal.Header closeButton className="rectification_modal_header">
                    <Modal.Title>{modalData?.label} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="dependent_name">
                                        Name {form.dependent_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="dependent_name"
                                        name="dependent_name"
                                        className={`form-control ${form.dependent_name.error && "is-invalid"}`}
                                        value={form.dependent_name.value}
                                        required={form.dependent_name.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.dependent_name.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="dependent_relationship">
                                        Relationship {form.dependent_relationship.required && <span className="text-danger">*</span>}
                                    </label>
                                    <select
                                        id="dependent_relationship"
                                        name="dependent_relationship"
                                        className={`form-select ${form.dependent_relationship.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.dependent_relationship.value}
                                        required={form.dependent_relationship.required}
                                    >
                                        <option value="" disabled="">
                                            -select one-
                                        </option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.dependent_relationship.error}
                                    </div>
                                </div>
                            </div>

                            {form.dependent_relationship.value === "Other" && (
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-control-label" htmlFor="dependent_oth_rel">
                                            Other Relationship {form.dependent_oth_rel.required && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            id="dependent_oth_rel"
                                            name="dependent_oth_rel"
                                            className={`form-control ${form.dependent_oth_rel.error && "is-invalid"}`}
                                            value={form.dependent_oth_rel.value}
                                            required={form.dependent_oth_rel.required}
                                            onChange={(e) => {
                                                handleChange(e.currentTarget);
                                            }}
                                        />
                                        <div id="Feedback" className="invalid-feedback">
                                            {form.dependent_oth_rel.error}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="dependent_gender" className="form-label">
                                        Gender {form.dependent_gender.required && <span className="text-danger">*</span>}
                                    </label>
                                    <GenderSelect
                                        className={`form-select ${form.dependent_gender.error && "is-invalid"}`}
                                        type="text"
                                        id="dependent_gender"
                                        name="dependent_gender"
                                        required={form.dependent_gender.required}
                                        value={form.dependent_gender.value}
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.dependent_gender.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="dependent_dob" className="form-label">
                                        Date of Birth {form.dependent_dob.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        className={`form-control ${form.dependent_dob.error && "is-invalid"}`}
                                        type="date"
                                        id="dependent_dob"
                                        name="dependent_dob"
                                        placeholder="DOB"
                                        required={form.dependent_dob.required}
                                        value={form.dependent_dob.value}
                                        max={moment().format("YYYY-MM-DD")}
                                        onChange={(e) => handleChange(e.currentTarget)}
                                        onBlur={(e) => handleChange({ name: "dependent_age", value: moment().diff(e.currentTarget.value, "years", false) })}
                                    />
                                    <div className="invalid-feedback">{form.dependent_dob.error}</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="dependent_age" className="form-label">
                                        Age {form.dependent_age.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        disabled
                                        className={`form-control ${form.dependent_age.error && "is-invalid"}`}
                                        type="number"
                                        id="dependent_age"
                                        name="dependent_age"
                                        required={form.dependent_age.required}
                                        value={form.dependent_age.value}
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.dependent_age.error}</div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="mt-4 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success btn-sm" type="submit" disabled={submitEnable || isLoading}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DependentAddEditModal;
