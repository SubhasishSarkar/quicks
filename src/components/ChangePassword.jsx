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
        current: { value: "", validate: "required" },
        new: { value: "", validate: "required" },
        confirm: { value: "", validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "PUT", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/super/admin/password/reset`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Password successfully updated.");
                    dispatch(logout());
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
        form.current.value = "";
        form.current.error = "";
        form.new.value = "";
        form.new.error = "";
        form.confirm.value = "";
        form.confirm.error = "";
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
                                            <label className="form-control-label" htmlFor="current">
                                                Old Password {form.current.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={isVisibleOld ? "name" : "new"}
                                                id="current"
                                                name="current"
                                                className={`form-control ${form.current.error && "is-invalid"}`}
                                                value={form.current.value}
                                                required={form.current.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <span className="icon" onClick={toggleOld} style={eye}>
                                                {isVisibleOld ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                            </span>
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.current.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="new">
                                                New Password {form.new.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={isVisibleNew ? "name" : "new"}
                                                id="new"
                                                name="new"
                                                className={`form-control ${form.new.error && "is-invalid"}`}
                                                value={form.new.value}
                                                required={form.new.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />

                                            <span className="icon" onClick={toggleNew} style={eye}>
                                                {isVisibleNew ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                            </span>
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.new.error}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="confirm">
                                                Confirm Password {form.confirm.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={isVisibleCon ? "name" : "confirm"}
                                                id="confirm"
                                                name="confirm"
                                                className={`form-control ${form.confirm.error && "is-invalid"}`}
                                                value={form.confirm.value}
                                                required={form.confirm.required}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                            />
                                            <span className="icon" onClick={toggleCon} style={eye}>
                                                {isVisibleCon ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                            </span>
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.confirm.error}
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
