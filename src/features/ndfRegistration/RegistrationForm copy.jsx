import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

const RegSchema = yup.object().shape({
    fname: yup.string().required("Please enter your first name"),
    lname: yup.string().required("Please enter your last name"),
    email: yup.string().email().required("Please enter your email"),
    //email: yup.array().of(yup.string().email().required("Please enter your email")).unique("email must be unique"),
});

const RegistrationForm = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            email: "",
            ...data,
        },
        validationSchema: RegSchema,
        onSubmit: async (values, { resetForm }) => {
            setError(null);
            setLoading(true);
            setSuccess(null);
            try {
                const token = localStorage.getItem("bmssy_token");
                const res = await fetch(process.env.APP_BASE_API + (data ? "/user-update/" + data?.id : "/registration-test"), {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify(values),
                });
                if (res.ok) {
                    const data = await res.json();
                    setLoading(false);
                    setSuccess(data.message);
                    resetForm({ values: "" });
                } else {
                    const data = await res.json();
                    throw Error(data.message);
                }
            } catch (error) {
                setLoading(false);
                setError(error.message);
                console.error(error);
            }
        },
    });

    return (
        <>
            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form className="needs-validation" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="col-md-4 mb-3">
                        <label className="form-control-label">First Name</label>
                        <input type="text" className="form-control" id="validationCustom01" name="fname" placeholder="First name" required="" onBlur={handleBlur} onChange={handleChange} value={values.fname} />
                        {errors.fname && touched.fname && <div className="text-danger">{errors.fname}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-control-label">Last Name</label>
                        <input type="text" className="form-control" id="validationCustom02" name="lname" placeholder="Last name" required="" onBlur={handleBlur} onChange={handleChange} value={values.lname} />
                        {errors.lname && touched.lname && <div className="text-danger">{errors.lname}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-control-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="validationCustomUsername"
                            name="email"
                            placeholder="Email address"
                            aria-describedby="inputGroupPrepend"
                            required=""
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                        />
                        {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                </div>
                <div className="form-group">
                    <div className="custom-control custom-checkbox mb-3">
                        <input className="custom-control-input" id="invalidCheck" type="checkbox" value="" required="" />
                        <label className="custom-control-label">Agree to terms and conditions</label>
                    </div>
                </div>
                <button disabled={loading} className="btn btn-success btn-sm" type="submit">
                    {loading && (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                    {data ? "Update" : "Save"}
                </button>
            </form>
        </>
    );
};

export default RegistrationForm;
