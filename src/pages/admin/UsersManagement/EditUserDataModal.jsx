import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";

const EditUserDataModal = ({ lgShow, userId, handleClose, otherData }) => {
    const { error, data } = useQuery(["users-management-edit-user", userId], () => fetcher(`/users-management-edit-user?id=${userId}`), { enabled: userId ? true : false });

    const [form, validator] = useValidate(
        {
            fullname: { value: "", validate: "required" },
            employeeId: { value: "", validate: "required" },
            mobile: { value: "", validate: "required|number|length:10" },
            mail: { value: "", validate: "required|email" },
            designation: { value: "", validate: "required" },
            userPlace: { value: "", validate: "required" },
            userName: { value: "", validate: "required" },
            password: { value: "", validate: "" },
            userId: { value: userId, validate: "" },
        },
        data,
        true
    );

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
            { url: `/users-management-update-user`, body: formData },
            {
                onSuccess(data, variables, context) {
                    handleClose();
                    validator.reset();
                    query.invalidateQueries("users-management-list");
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
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => {
                    handleClose();
                    validator.reset();
                }}
                backdrop="static"
                className="confirm_modal"
            >
                <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", border: "none" }}>
                    <Modal.Title id="example-modal-sizes-title-lg">User Details of {otherData}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <ErrorAlert error={error} />}
                    <div className="card">
                        <form noValidate onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="fullname">
                                                Full Name {form.fullname.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="fullname"
                                                name="fullname"
                                                className={`form-control ${form.fullname.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.fullname.value}
                                                required={form.fullname.required}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.fullname.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="employeeId">
                                                Employee Id {form.employeeId.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="employeeId"
                                                name="employeeId"
                                                className={`form-control ${form.employeeId.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.employeeId.value}
                                                required={form.employeeId.required}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.employeeId.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="mobile">
                                                Mobile {form.mobile.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="mobile"
                                                name="mobile"
                                                className={`form-control ${form.mobile.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.mobile.value}
                                                required={form.mobile.required}
                                            />

                                            <div id="Feedback" className="invalid-feedback">
                                                {form.mobile.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="mail">
                                                Email Id {form.mail.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="mail"
                                                name="mail"
                                                className={`form-control ${form.mail.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.mail.value}
                                                required={form.mail.required}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.mail.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="designation">
                                                Post {form.designation.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="designation"
                                                name="designation"
                                                className={`form-control ${form.designation.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.designation.value}
                                                required={form.designation.required}
                                                disabled
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.designation.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="userPlace">
                                                Location {form.userPlace.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="userPlace"
                                                name="userPlace"
                                                className={`form-control ${form.userPlace.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.userPlace.value}
                                                required={form.userPlace.required}
                                                disabled={data && data.userPlace !== null && data.userPlace !== "" ? true : false}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.userPlace.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="userName">
                                                Username {form.userName.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="userName"
                                                name="userName"
                                                className={`form-control ${form.userName.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.userName.value}
                                                required={form.userName.required}
                                                disabled
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.userName.error}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="form-group">
                                            <label className="form-control-label" htmlFor="password">
                                                Password
                                            </label>
                                            <input
                                                type="text"
                                                id="password"
                                                name="password"
                                                className={`form-control ${form.password.error && "is-invalid"}`}
                                                onChange={(e) => {
                                                    handleChange(e.currentTarget);
                                                }}
                                                value={form.password.value}
                                                required={form.password.required}
                                            />
                                            <div id="Feedback" className="invalid-feedback">
                                                {form.password.error}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-grid d-md-flex justify-content-md-end">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default EditUserDataModal;
