import React from "react";
import { Modal } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updater } from "../../utils";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";

const EditUserPasswordModal = ({ psShow, userId, handleClose, otherData }) => {
    const [form, validator] = useValidate({
        newPassword: { value: "", validate: "required" },
        confirmPassword: { value: "", validate: "required" },
        userId: { value: userId, validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const query = useQueryClient();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/users-management-update-employee`, body: { data: formData, changeType: 1 } },
            {
                onSuccess(data, variables, context) {
                    handleClose(false);
                    query.invalidateQueries("users-management-list");
                    toast.success("Password Successfully Updated");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };
    return (
        <>
            <Modal size="lg" show={psShow} onHide={handleClose} backdrop="static" aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <b>Reset Password </b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-header" style={{ fontSize: "20px" }}>
                                {" "}
                                <b>
                                    <i
                                        className="fa-solid fa-user-tie"
                                        style={{
                                            backgroundColor: "#fff",
                                            padding: "8px",
                                            borderRadius: "19px",
                                            color: "black",
                                            marginRight: "7px",
                                        }}
                                    ></i>
                                </b>
                                {otherData}
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="newPassword">
                                                New Password {form.newPassword.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                className={`form-control ${form.newPassword.error && "is-invalid"}`}
                                                value={form.newPassword.value}
                                                required={form.newPassword.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.newPassword.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="confirmPassword">
                                                Confirm Password {form.confirmPassword.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className={`form-control ${form.confirmPassword.error && "is-invalid"}`}
                                                value={form.confirmPassword.value}
                                                required={form.confirmPassword.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.confirmPassword.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                                                <button className="btn btn-success" type="submit" disabled={isLoading}>
                                                    {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                    Update
                                                </button>
                                            </div>
                                        </div>
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

export default EditUserPasswordModal;
