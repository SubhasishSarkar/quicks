import React  from "react";
import useValidate from "../../hooks/useValidate";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../../utils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/userSlice";

const ChangePassword = () => {
    const dispatch = useDispatch();

    const [form, validator] = useValidate({
        current: { value: "", validate: "required" },
        new: { value: "", validate: "required" },
        confirm: { value: "", validate: "required" },
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
            { url: `/super/admin/password/reset`, body: formData },
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




    return (
        <>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label" htmlFor="current">
                                Current Password {form.current.required && <span className="text-danger">*</span>}
                            </label>
                            <input placeholder="current" className={`form-control ${form.current.error && "is-invalid"}`} type="text" value={form.current.value} name="current" id="current" onChange={(e) => handleChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.current.error}</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" htmlFor="new">
                                New Password {form.new.required && <span className="text-danger">*</span>}
                            </label>
                            <input placeholder="new" className={`form-control ${form.new.error && "is-invalid"}`} type="password" value={form.new.value} name="new" id="new" onChange={(e) => handleChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.new.error}</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" htmlFor="confirm">
                                Confirm Password {form.confirm.required && <span className="text-danger">*</span>}
                            </label>
                            <input placeholder="confirm" className={`form-control ${form.confirm.error && "is-invalid"}`} type="password" value={form.confirm.value} name="name" id="name" onChange={(e) => handleChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.confirm.error}</div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button className="btn btn-success" type="submit">
                            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-floppy-disk"></i>} Change Password
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ChangePassword;
