import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import AsyncSelect from "../../../../components/select/AsyncSelect";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import GenderSelect from "../../../../components/select/GenderSelect";
import { useValidate } from "../../../../hooks";
import { fetcher, updater } from "../../../../utils";

const NomineeAddEditModal = ({ show, handleClose, modalData }) => {
    const { error, data, isFetching } = useQuery(["cr-get-nominee-details", modalData?.nominee_id], () => fetcher(`/cr-get-nominee-details?id=${modalData?.nominee_id}`), { enabled: modalData?.nominee_id ? true : false });
    const query = useQueryClient();

    const [form, validator] = useValidate(
        {
            nominee_name: { value: "", validate: "required" },
            nominee_dob: { value: "", validate: "required|maxDate" },
            nominee_age: { value: "", validate: "required|number" },
            nominee_relationship: { value: "", validate: "required" },
            nominee_oth_rel: { value: "", validate: "" },
            nominee_share: { value: "", validate: "required|number" },
            nominee_gender: { value: "", validate: "required" },
            ifsc: { value: "", validate: "" },
            bnkName: { value: "", validate: "" },
            bnkBranch: { value: "", validate: "" },
            bnkLocation: { value: "", validate: "" },
            bnkDistrict: { value: "", validate: "" },
            bnkAccNo: { value: "", validate: "number" },
            status: { value: "", validate: "" },
            flag_status: { value: "", validate: "" },
            modify_parent_id: { value: "", validate: "" },
            nominee_id: { value: "", validate: "" },
            application_id: { value: "", validate: "" },
        },
        data,
        true
    );

    useEffect(() => {
        if (modalData?.encAppId)
            validator.setState((state) => {
                state.application_id.value = modalData?.encAppId;
                state.status.value = modalData?.nominee_id ? data?.status : "";
                state.flag_status.value = modalData?.nominee_id ? (data?.flag_status ? data?.flag_status : "R") : "R";
                state.modify_parent_id.value = modalData?.nominee_id ? data?.modify_parent_id : "";
                state.nominee_id.value = modalData?.nominee_id ? data?.nominee_id : "";
                return { ...state };
            });
    }, [modalData?.encAppId]);

    useEffect(() => {
        if (!modalData?.nominee_id && modalData?.label === "Add Nominee") {
            validator.setState((state) => {
                state.nominee_name.value = "";
                state.nominee_dob.value = "";
                state.nominee_age.value = "";
                state.nominee_relationship.value = "";
                state.nominee_oth_rel.value = "";
                state.nominee_share.value = "";
                state.nominee_gender.value = "";
                state.ifsc.value = "";
                state.bnkName.value = "";
                state.bnkBranch.value = "";
                state.bnkLocation.value = "";
                state.bnkDistrict.value = "";
                state.bnkAccNo.value = "";
                state.status.value = "";
                state.flag_status.value = "";
                state.nominee_id.value = "";

                state.nominee_name.error = "";
                state.nominee_dob.error = "";
                state.nominee_age.error = "";
                state.nominee_relationship.error = "";
                state.nominee_oth_rel.error = "";
                state.nominee_share.error = "";
                state.nominee_gender.error = "";
                state.ifsc.error = "";
                state.bnkName.error = "";
                state.bnkBranch.error = "";
                state.bnkLocation.error = "";
                state.bnkDistrict.error = "";
                state.bnkAccNo.error = "";

                return { ...state };
            });
        }
    }, [!modalData?.nominee_id, !show]);

    const [submitEnable, setSubmitEnable] = useState(true);

    useEffect(() => {
        if (show === false) setSubmitEnable(true);
    }, [show]);

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            setSubmitEnable(false);
            switch (name) {
                case "nominee_relationship":
                    setState((state) => {
                        if (value === "Other") {
                            state.nominee_oth_rel.required = true;
                            state.nominee_oth_rel.validate = "required";
                            state.nominee_oth_rel.error = null;
                        } else {
                            state.nominee_oth_rel.required = false;
                            state.nominee_oth_rel.validate = "";
                            state.nominee_oth_rel.value = "";
                            state.nominee_oth_rel.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "ifsc":
                    setState((state) => {
                        if (value) {
                            state.bnkName.required = true;
                            state.bnkName.validate = "required";
                            state.bnkBranch.required = true;
                            state.bnkBranch.validate = "required";
                            state.bnkLocation.required = true;
                            state.bnkLocation.validate = "required";
                            state.bnkDistrict.required = true;
                            state.bnkDistrict.validate = "required";
                            state.bnkAccNo.required = true;
                            state.bnkAccNo.validate = "required";
                        } else {
                            state.bnkName.required = false;
                            state.bnkName.validate = "";
                            state.bnkBranch.required = false;
                            state.bnkBranch.validate = "";
                            state.bnkLocation.required = false;
                            state.bnkLocation.validate = "";
                            state.bnkDistrict.required = false;
                            state.bnkDistrict.validate = "";
                            state.bnkAccNo.required = false;
                            state.bnkAccNo.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "bnkName":
                    setState((state) => {
                        if (value) {
                            state.ifsc.required = true;
                            state.ifsc.validate = "required";
                            state.bnkBranch.required = true;
                            state.bnkBranch.validate = "required";
                            state.bnkLocation.required = true;
                            state.bnkLocation.validate = "required";
                            state.bnkDistrict.required = true;
                            state.bnkDistrict.validate = "required";
                            state.bnkAccNo.required = true;
                            state.bnkAccNo.validate = "required";
                        } else {
                            state.ifsc.required = false;
                            state.ifsc.validate = "";
                            state.bnkBranch.required = false;
                            state.bnkBranch.validate = "";
                            state.bnkLocation.required = false;
                            state.bnkLocation.validate = "";
                            state.bnkDistrict.required = false;
                            state.bnkDistrict.validate = "";
                            state.bnkAccNo.required = false;
                            state.bnkAccNo.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "bnkBranch":
                    setState((state) => {
                        if (value) {
                            state.ifsc.required = true;
                            state.ifsc.validate = "required";
                            state.bnkName.required = true;
                            state.bnkName.validate = "required";
                            state.bnkLocation.required = true;
                            state.bnkLocation.validate = "required";
                            state.bnkDistrict.required = true;
                            state.bnkDistrict.validate = "required";
                            state.bnkAccNo.required = true;
                            state.bnkAccNo.validate = "required";
                        } else {
                            state.ifsc.required = false;
                            state.ifsc.validate = "";
                            state.bnkName.required = false;
                            state.bnkName.validate = "";
                            state.bnkLocation.required = false;
                            state.bnkLocation.validate = "";
                            state.bnkDistrict.required = false;
                            state.bnkDistrict.validate = "";
                            state.bnkAccNo.required = false;
                            state.bnkAccNo.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "bnkLocation":
                    setState((state) => {
                        if (value) {
                            state.ifsc.required = true;
                            state.ifsc.validate = "required";
                            state.bnkName.required = true;
                            state.bnkName.validate = "required";
                            state.bnkBranch.required = true;
                            state.bnkBranch.validate = "required";
                            state.bnkDistrict.required = true;
                            state.bnkDistrict.validate = "required";
                            state.bnkAccNo.required = true;
                            state.bnkAccNo.validate = "required";
                        } else {
                            state.ifsc.required = false;
                            state.ifsc.validate = "";
                            state.bnkName.required = false;
                            state.bnkName.validate = "";
                            state.bnkBranch.required = false;
                            state.bnkBranch.validate = "";
                            state.bnkDistrict.required = false;
                            state.bnkDistrict.validate = "";
                            state.bnkAccNo.required = false;
                            state.bnkAccNo.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "bnkDistrict":
                    setState((state) => {
                        if (value) {
                            state.ifsc.required = true;
                            state.ifsc.validate = "required";
                            state.bnkName.required = true;
                            state.bnkName.validate = "required";
                            state.bnkBranch.required = true;
                            state.bnkBranch.validate = "required";
                            state.bnkLocation.required = true;
                            state.bnkLocation.validate = "required";
                            state.bnkAccNo.required = true;
                            state.bnkAccNo.validate = "required";
                        } else {
                            state.ifsc.required = false;
                            state.ifsc.validate = "";
                            state.bnkName.required = false;
                            state.bnkName.validate = "";
                            state.bnkBranch.required = false;
                            state.bnkBranch.validate = "";
                            state.bnkLocation.required = false;
                            state.bnkLocation.validate = "";
                            state.bnkAccNo.required = false;
                            state.bnkAccNo.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "bnkAccNo":
                    setState((state) => {
                        if (value) {
                            state.ifsc.required = true;
                            state.ifsc.validate = "required";
                            state.bnkName.required = true;
                            state.bnkName.validate = "required";
                            state.bnkBranch.required = true;
                            state.bnkBranch.validate = "required";
                            state.bnkLocation.required = true;
                            state.bnkLocation.validate = "required";
                            state.bnkDistrict.required = true;
                            state.bnkDistrict.validate = "required";
                        } else {
                            state.ifsc.required = false;
                            state.ifsc.validate = "";
                            state.bnkName.required = false;
                            state.bnkName.validate = "";
                            state.bnkBranch.required = false;
                            state.bnkBranch.validate = "";
                            state.bnkLocation.required = false;
                            state.bnkLocation.validate = "";
                            state.bnkDistrict.required = false;
                            state.bnkDistrict.validate = "";
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();

        mutate(
            { url: `/cr-add-update-nominee`, body: formData },
            {
                onSuccess(data, variables, context) {
                    handleClose(false);
                    query.invalidateQueries("previous-nominee-list");
                    toast.success(data.msg);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.bnkName.value = item.bank_name || "";
            state.bnkBranch.value = item.branch_name || "";
            state.bnkDistrict.value = item.dist_code || "";
            state.bnkLocation.value = item.branch_address || "";

            state.bnkName.error = "";
            state.bnkLocation.error = "";
            state.bnkBranch.error = "";
            state.bnkDistrict.error = "";
            state.bnkLocation.error = "";
            return { ...state };
        });
    };

    const { mutate: checkShare } = useMutation((urlQueryParams) => fetcher(`/check-new-nominee-share?${urlQueryParams}`));
    const handleShare = (e) => {
        const urlQueryParams = `application_id=${modalData?.encAppId}&nomineeId=${modalData?.nominee_id}&shareVal=${e}`;
        checkShare(urlQueryParams, {
            onSuccess(data, variables, context) {
                validator.setState((state) => {
                    state.nominee_share.error = null;
                    return {
                        ...state,
                    };
                });
            },
            onError(error, variables, context) {
                validator.setState((state) => {
                    state.nominee_share.error = error.message;
                    return {
                        ...state,
                    };
                });
            },
        });
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" className="rectification_modal">
                <Modal.Header closeButton className="rectification_modal_header">
                    <Modal.Title>{modalData?.label} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="nominee_name">
                                                Name {form.nominee_name.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="nominee_name"
                                                name="nominee_name"
                                                className={`form-control ${form.nominee_name.error && "is-invalid"}`}
                                                value={form.nominee_name.value}
                                                required={form.nominee_name.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.nominee_name.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="nominee_dob">
                                                Date Of Birth {form.nominee_dob.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="date"
                                                id="nominee_dob"
                                                name="nominee_dob"
                                                className={`form-control ${form.nominee_dob.error && "is-invalid"}`}
                                                value={form.nominee_dob.value}
                                                required={form.nominee_dob.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                max={moment().format("YYYY-MM-DD")}
                                                onBlur={(e) => handleChange({ name: "nominee_age", value: moment().diff(e.currentTarget.value, "years", false) })}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.nominee_dob.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="nominee_age">
                                                Age {form.nominee_age.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                id="nominee_age"
                                                name="nominee_age"
                                                className={`form-control ${form.nominee_age.error && "is-invalid"}`}
                                                value={form.nominee_age.value}
                                                required={form.nominee_age.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.nominee_age.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="nominee_relationship">
                                                Relationship {form.nominee_relationship.required && <span className="text-danger">*</span>}
                                            </label>
                                            <select
                                                id="nominee_relationship"
                                                name="nominee_relationship"
                                                className={`form-select ${form.nominee_relationship.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.nominee_relationship.value}
                                                required={form.nominee_relationship.required}
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
                                                {form.nominee_relationship.error}
                                            </div>
                                        </div>
                                    </div>

                                    {form.nominee_relationship.value === "Other" && (
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="nominee_oth_rel">
                                                    Other Relationship {form.nominee_oth_rel.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nominee_oth_rel"
                                                    name="nominee_oth_rel"
                                                    className={`form-control ${form.nominee_oth_rel.error && "is-invalid"}`}
                                                    value={form.nominee_oth_rel.value}
                                                    required={form.nominee_oth_rel.required}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.nominee_oth_rel.error}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="nominee_share">
                                                Share {form.nominee_share.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="nominee_share"
                                                name="nominee_share"
                                                className={`form-control ${form.nominee_share.error && "is-invalid"}`}
                                                value={form.nominee_share.value}
                                                required={form.nominee_share.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                    handleShare(e.currentTarget.value);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.nominee_share.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="nominee_gender">
                                                Gender {form.nominee_gender.required && <span className="text-danger">*</span>}
                                            </label>
                                            <GenderSelect
                                                className={`form-select ${form.nominee_gender.error && "is-invalid"}`}
                                                type="text"
                                                id="nominee_gender"
                                                name="nominee_gender"
                                                required={form.nominee_gender.required}
                                                value={form.nominee_gender.value}
                                                onChange={(e) => handleChange(e.currentTarget)}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.nominee_gender.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
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
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
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
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
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
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
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
                                        <div className="form-group">
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
                            <div className="card-footer">
                                <div className="d-md-flex justify-content-md-end">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={submitEnable || isLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NomineeAddEditModal;
