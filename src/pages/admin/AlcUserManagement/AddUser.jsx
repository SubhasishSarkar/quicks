import React, { useEffect } from "react";
import { useValidate } from "../../../hooks";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../../../utils";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { toast } from "react-toastify";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useNavigate } from "react-router";

const AddUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Add User", url: "" }));
    }, []);
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [form, validator] = useValidate({
        role_id: { value: "", validate: "required" },
        subDivision: { value: user?.subDivision, validate: "required" },
        block: { value: "", validate: "required" },
        username: { value: "", validate: "required" },
        password: { value: "", validate: "required" },
        fullname: { value: "", validate: "required|onlyAlphabets" },
        mobile: { value: "", validate: "required|number|length:10" },
        email: { value: "", validate: "email" },
        userId: { value: user?.id, validate: "" },
    });

    const { mutate, isLoading, error } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!validator.validate()) return;
        const data = validator.generalize();

        mutate(
            { url: `/add-user`, body: data },
            {
                onSuccess(data) {
                    toast.success("User Successfully added.");
                    validator.reset();
                    navigate("/dashboard");
                },
                onError(error) {
                    validator.setError(error.message);
                    // validator.reset();
                },
            }
        );
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}

            <div className="card datatable-box">
                <form noValidate onSubmit={handleFormSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 mb-2">
                                <label className="form-control-label" htmlFor="role_id">
                                    Role {form.role_id.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    name="role_id"
                                    id="role_id"
                                    className={`form-select ${form.role_id.error && "is-invalid"}`}
                                    value={form.role_id.value}
                                    required={form.role_id.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                >
                                    <option value="">Select One</option>
                                    <option value="23">Collecting Agent</option>
                                    <option value="22">Other Service Provider/DEO</option>
                                    <option value="13">SLO</option>
                                    <option value="31">CKCO</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    {form.role_id.error}
                                </div>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-control-label" htmlFor="block">
                                    Block/Municipality/Corporation {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subDivision.value}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.block.error}
                                </div>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-control-label" htmlFor="username">
                                    Username {form.username.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className={`form-control ${form.username.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.username.value}
                                    required={form.username.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.username.error}
                                </div>
                            </div>

                            <div className="col-md-3 mb-2">
                                <label className="form-control-label" htmlFor="password">
                                    Password {form.password.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="password"
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
                            <div className="col-md-3 mb-2">
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
                            <div className="col-md-3 mb-2">
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
                            <div className="col-md-3 mb-2">
                                <label className="form-control-label" htmlFor="email">
                                    E-mail {form.email.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className={`form-control ${form.email.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.email.value}
                                    required={form.email.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.email.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-user-plus"></i>} Add User
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddUser;
