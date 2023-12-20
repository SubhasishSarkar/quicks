/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/userSlice";
import { Navigate, useNavigate } from "react-router";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";



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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                dispatch(login({ ...data.user, token: data.token }));
                // toast.success("Login Successfully");
                localStorage.setItem("bmssy_token", data.token);
                navigate("/dashboard");
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

   
    const onFocus = () => {
        setToken(localStorage.getItem("bmssy_token"));
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

    const forgetPass = () => {
        toast.warning("Coming soon...");
    };

    return (
        <>
            <div className="login">
                <div className="login-bg">
                    <div className="row">
                        <div className="col-md-12 col-lg-8 ml-auto">
                            <div className="logo">
                                <Link to="/">
                                   QUICKS
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-form">
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-12 mb-4">
                            <h1>Sign in to Continue</h1>
                           
                        </div>

                        <div className="col-md-12 mb-4">
                            <div className="form-floating custom-form-login">
                                <span className="form-icon">
                                    <i className="fas fa-user"></i>
                                </span>
                                <input
                                    type="text"
                                    className={`form-control ${form.id.error && "is-invalid"}`}
                                    id="id"
                                    name="id"
                                    placeholder="id"
                                    required=""
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    value={form.id.value}
                                />
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

                        <div className="col-md-12 mb-4">
                            
                        </div>
                        <div className="col-md-12 mb-4">
                            <button className="btn" type="submit" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Login
                            </button>
                        </div>

                        <div className="col-md-12 mb-4">
                            <Link to="#" className="text-dark" style={{ float: "left", textDecoration: "none" }} onClick={() => forgetPass()}>
                                <i className="fas fa-unlock-alt"></i> Forgot Password?
                            </Link>

                            <Link to="/" className="text-dark" style={{ float: "right", textDecoration: "none" }}>
                                <i className="fas fa-home"></i> Back To Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="form-footer">
                <div className="copyright" style={{ float: "right" }}>
                    <span className="float-right">
                        <Link to="https://www.quicks.com" target="_blank" rel="noreferrer">
                            QUICKS
                        </Link>
                    </span>
                </div>
            </div>
        </>
    );
};

export default Login;
