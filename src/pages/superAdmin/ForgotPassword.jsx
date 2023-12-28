import React, { useState } from "react";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [form, validator] = useValidate({
        _id: { value: "", validate: "required" },
        dateOfBirth: { value: "", validate: "required" },
        aadharNo: { value: "", validate: "required" },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        setLoading(true);
        const values = validator.generalize();
        setLoading(true);
        try {
            const res = await fetch(process.env.APP_BASE_API + "/super/admin/password/forgot", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                const data = await res.json();
                setLoading(false);
                toast.success(data.message);
            } else {
                const data = await res.json();
                //setError(data.message);
                toast.error(data.message);
                throw Error(data.message);
            }
        } catch (error) {
            toast.error(error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        validator.validOnChange(e);
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-100  login">
            <Card>
                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-12 mb-4">
                            <h1>Forgot Password</h1>
                        </div>

                        <div className="col-md-12 mb-4">
                            <div className="form-floating custom-form-login">
                                <input type="text" className={`form-control ${form._id.error && "is-invalid"}`} id="_id" name="_id" placeholder="_id" required="" onChange={(e) => handleChange(e.currentTarget)} value={form._id.value} />
                                <label htmlFor="_id" className="form-control-label floating-label">
                                    Enter Your id
                                </label>
                            </div>
                            {form._id.error && <div className="text-danger">{form._id.error}</div>}
                        </div>
                        <div className="col-md-12 mb-4">
                            <div className="form-floating custom-form-login">
                                <input
                                    type="date"
                                    className={`form-control ${form.dateOfBirth.error && "is-invalid"}`}
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    placeholder="Date Of Birth"
                                    required=""
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    value={form.dateOfBirth.value}
                                />
                                <label htmlFor="dateOfBirth" className="form-control-label floating-label">
                                    Date of Birth
                                </label>
                            </div>
                            {form.dateOfBirth.error && <div className="text-danger">{form.dateOfBirth.error}</div>}
                        </div>
                        <div className="col-md-12 mb-4">
                            <div className="form-floating custom-form-login">
                                <input
                                    type="text"
                                    className={`form-control ${form.aadharNo.error && "is-invalid"}`}
                                    id="aadharNo"
                                    name="aadharNo"
                                    placeholder="aadharNo"
                                    required=""
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    value={form.aadharNo.value}
                                />
                                <label htmlFor="aadharNo" className="form-control-label floating-label">
                                    Aadhaar No.
                                </label>
                            </div>
                            {form.aadharNo.error && <div className="text-danger">{form.aadharNo.error}</div>}
                        </div>
                        <div className="col-md-12 mb-4">
                            <button className="btn" type="submit" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Forgot
                            </button>
                        </div>

                        <div className="col-md-12 mb-4">
                            <Link to="/login" className="text-dark" style={{ float: "left", textDecoration: "none" }}>
                                <i className="fas fa-unlock-alt"></i> Login?
                            </Link>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ForgotPassword;
