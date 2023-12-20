import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import useValidate from "../hooks/useValidate";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../utils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";

const ChangePassword = ({ show, setShow, forceUpdate = false }) => {
    const dispatch = useDispatch();

    const [form, validator] = useValidate({
        oldPassword: { value: "", validate: "required" },
        password: { value: "", validate: "required" },
        confirm_password: { value: "", validate: "required|confirm_password" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/reset-password`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Password successfully updated.");
                    dispatch(logout());
                    // nextStep(1);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };

    const [isVisibleOld, setVisibleOld] = useState(false);
    const [isVisibleNew, setVisibleNew] = useState(false);
    const [isVisibleCon, setVisibleCon] = useState(false);

    const toggleOld = () => {
        setVisibleOld(!isVisibleOld);
    };
    const toggleNew = () => {
        setVisibleNew(!isVisibleNew);
    };
    const toggleCon = () => {
        setVisibleCon(!isVisibleCon);
    };

    const eye = {
        float: "right",
        marginTop: "-39px",
        marginRight: "6px",
    };

    const handleClose = () => {
        setShow(false);
        form.oldPassword.value = "";
        form.oldPassword.error = "";
        form.password.value = "";
        form.password.error = "";
        form.confirm_password.value = "";
        form.confirm_password.error = "";
    };
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" className="confirm_modal">
                <Modal.Header closeButton={!forceUpdate} style={{ fontFamily: "Poppins, sans-serif", border: "none" }}>
                    <Modal.Title>
                        <i className="fa-solid fa-unlock-keyhole"></i> Change Password
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="oldPassword">
                                                Old Password {form.oldPassword.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={isVisibleOld ? "name" : "password"}
                                                id="oldPassword"
                                                name="oldPassword"
                                                className={`form-control ${form.oldPassword.error && "is-invalid"}`}
                                                value={form.oldPassword.value}
                                                required={form.oldPassword.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <span className="icon" onClick={toggleOld} style={eye}>
                                                {isVisibleOld ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                            </span>
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.oldPassword.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="password">
                                                New Password {form.password.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={isVisibleNew ? "name" : "password"}
                                                id="password"
                                                name="password"
                                                className={`form-control ${form.password.error && "is-invalid"}`}
                                                value={form.password.value}
                                                required={form.password.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />

                                            <span className="icon" onClick={toggleNew} style={eye}>
                                                {isVisibleNew ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                            </span>
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.password.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="confirm_password">
                                                Confirm Password {form.confirm_password.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={isVisibleCon ? "name" : "password"}
                                                id="confirm_password"
                                                name="confirm_password"
                                                className={`form-control ${form.confirm_password.error && "is-invalid"}`}
                                                value={form.confirm_password.value}
                                                required={form.confirm_password.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <span className="icon" onClick={toggleCon} style={eye}>
                                                {isVisibleCon ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                            </span>
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.confirm_password.error}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-md-flex justify-content-md-end">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update Password
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

export default ChangePassword;
