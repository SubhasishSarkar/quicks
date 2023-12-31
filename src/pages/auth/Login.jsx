/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/userSlice";
import { Navigate, useNavigate } from "react-router";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
//import { useConfirm } from "react-confirm-window";
const Login = () => {
    const [token, setToken] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, validator] = useValidate({
        id: { value: "", validate: "required", error: null },
        password: { value: "", validate: "required", error: null },
    });

    const [isVisibleOld, setVisibleOld] = useState(false);
    //const confirm = useConfirm();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const choice = await confirm({
        //     header: "Please Confirm",
        //     title: "Are you sure you want to delete?",
        //     closeButtonLable: "No",
        //     confirmButtonLable: "Yes",
        // });

        // check that all the field are valid
        if (!validator.validate()) return;
        //checking captcha

        setLoading(true);

        // get the key value pair of the formSchema
        const values = validator.generalize();

        setLoading(true);
        try {
            const res = await fetch(process.env.APP_BASE_API + "/super/admin/sign-in", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                const data = await res.json();

                localStorage.clear();
                dispatch(login({ ...data.superAdmin, token: data.token }));
                toast.success("Login Successfully");
                document.cookie = "token=" + data.token;
                localStorage.setItem("quicks_token", data.token);
                navigate("/dashboard");
            } else {
                const data = await res.json();

                toast.error(data.message);
                throw Error(data.message);
            }
        } catch (error) {
            toast.error(error);
            setLoading(false);
        }
    };

    const onFocus = () => {
        setToken(localStorage.getItem("quicks_token"));
    };
    useEffect(() => {
        window.addEventListener("focus", onFocus);
        onFocus();
        return () => {
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    if (token) return <Navigate to="/dashboard" />;

    const handleChange = (e) => {
        validator.validOnChange(e);
    };

    const toggleOld = () => {
        setVisibleOld(!isVisibleOld);
    };

    const eye = {
        float: "right",
        marginTop: "-41px",
        marginRight: "8px",
        color: "#817c7c",
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-100  login">
            <Card>
                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-12 mb-4">
                            <h1>Sign in to Continue</h1>
                        </div>

                        <div className="col-md-12 mb-4">
                            <div className="form-floating custom-form-login">
                                <span className="form-icon">
                                    <i className="fas fa-user"></i>
                                </span>
                                <input type="text" className={`form-control ${form.id.error && "is-invalid"}`} id="id" name="id" placeholder="id" required="" onChange={(e) => handleChange(e.currentTarget)} value={form.id.value} />
                                <label htmlFor="id" className="form-control-label floating-label">
                                    Enter Your id
                                </label>
                            </div>
                            {form.id.error && <div className="text-danger">{form.id.error}</div>}
                        </div>
                        <div className="col-md-12 mb-4">
                            <div className="form-floating custom-form-login">
                                <span className="form-icon">
                                    <i className="fas fa-key"></i>
                                </span>
                                <input
                                    type={isVisibleOld ? "text" : "password"}
                                    className={`form-control ${form.password.error && "is-invalid"}`}
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    value={form.password.value}
                                />

                                <label htmlFor="id" className="form-control-label floating-label">
                                    Enter Your Password
                                </label>
                                <span className="icon" onClick={toggleOld} style={eye}>
                                    {isVisibleOld ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                </span>
                            </div>
                            {form.password.error && <div className="text-danger">{form.password.error}</div>}
                        </div>

                        <div className="col-md-12 mb-4"></div>
                        <div className="col-md-12 mb-4">
                            <button className="btn" type="submit" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Login
                            </button>
                        </div>

                        <div className="col-md-12 mb-4">
                            <Link to="/forgot-password" className="text-dark" style={{ float: "left", textDecoration: "none" }}>
                                <i className="fas fa-unlock-alt"></i> Forgot Password?
                            </Link>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
