import React, { useEffect, useState } from "react";
import { useValidate } from "../../hooks";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import moment from "moment";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../../utils";
import { convertBase64 } from "../../utils/quicks";
import { useNavigate } from "react-router";

const AddSuperAdmin = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState({ preview: "", data: "" });
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageAddress({ title: "Add Super Admin", url: "" }));
    }, []);

    const [form, validator] = useValidate({
        imageUrl: { value: "", validate: "required", error: null },
        name: { value: "", validate: "onlyAlphabets|required", error: null },
        dateOfBirth: { value: "", validate: "required", error: null },
        role: { value: "", validate: "required", error: null },
        dateOfJoining: { value: "", validate: "required", error: null },
        aadharNo: { value: "", validate: "required|number|length:12", error: null },
        address: { value: "", validate: "required", error: null },
        mobile: { value: "", validate: "indianPhone|required", error: null },
        email: { value: "", validate: "required|email", error: null },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validator.validate()) return toast.error("Please fill of all required field");
        const data = validator.generalize();

        data.imageUrl = await convertBase64(image.data);
        console.log(data);
        mutate(
            { url: `/super/admin`, body: data },
            {
                onSuccess(data, variables, context) {
                    toast.success("Successfully update basic details");
                    navigate("/super-admin-list");
                },
                onError(error, variables, context) {
                    console.error(error);
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };

    const handleChange = (e) => {
        validator.validOnChange(e);
        console.log(e);
    };

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label" htmlFor="name">
                            Name {form.name.required && <span className="text-danger">*</span>}
                        </label>
                        <input placeholder="First Name" className={`form-control ${form.name.error && "is-invalid"}`} type="text" value={form.name.value} name="name" id="name" onChange={(e) => handleChange(e.currentTarget)} />
                        <div className="invalid-feedback">{form.name.error}</div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" htmlFor="email-1">
                            Email {form.email.required && <span className="text-danger">*</span>}
                        </label>
                        <input placeholder="Email" className={`form-control ${form.email.error && "is-invalid"}`} type="email" value={form.email.value} name="email" id="email-1" onChange={(e) => handleChange(e.currentTarget)} />
                        <div className="invalid-feedback">{form.email.error}.</div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label" htmlFor="mobile">
                            Mobile Number {form.mobile.required && <span className="text-danger">*</span>}
                        </label>
                        <input placeholder="Mobile Number" className={`form-control ${form.mobile.error && "is-invalid"}`} type="text" value={form.mobile.value} name="mobile" id="mobile" onChange={(e) => handleChange(e.currentTarget)} />
                        <div className="invalid-feedback">{form.mobile.error}</div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" htmlFor="aadharNo">
                            Aadhaar {form.aadharNo.required && <span className="text-danger">*</span>}
                        </label>
                        <input placeholder="First Name" className={`form-control ${form.aadharNo.error && "is-invalid"}`} type="text" value={form.aadharNo.value} name="aadharNo" id="aadharNo" onChange={(e) => handleChange(e.currentTarget)} />
                        <div className="invalid-feedback">{form.aadharNo.error}</div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label" htmlFor="dateOfBirth">
                            Date of Birth{form.dateOfBirth.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Date of Birth"
                            className={`form-control ${form.dateOfBirth.error && "is-invalid"}`}
                            type="date"
                            value={form.dateOfBirth.value}
                            name="dateOfBirth"
                            id="dateOfBirth"
                            //  onChange={(e) => handleChange(e.currentTarget)}
                            onChange={(e) =>
                                handleChange({
                                    name: "dateOfBirth",
                                    value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                })
                            }
                        />
                        <div className="invalid-feedback">{form.dateOfBirth.error}</div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" htmlFor="dateOfJoining">
                            Date of Joining{form.dateOfJoining.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Date of Birth"
                            className={`form-control ${form.dateOfJoining.error && "is-invalid"}`}
                            type="date"
                            value={form.dateOfJoining.value}
                            name="dateOfJoining"
                            id="dateOfJoining"
                            //  onChange={(e) => handleChange(e.currentTarget)}
                            onChange={(e) =>
                                handleChange({
                                    name: "dateOfJoining",
                                    value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                })
                            }
                        />
                        <div className="invalid-feedback">{form.dateOfJoining.error}</div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label" htmlFor="role">
                            Role {form.role.required && <span className="text-danger">*</span>}
                        </label>
                        <input placeholder="Role" className={`form-control ${form.role.error && "is-invalid"}`} type="text" value={form.role.value} name="role" id="role" onChange={(e) => handleChange(e.currentTarget)} />
                        <div className="invalid-feedback">{form.role.error}</div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" htmlFor="imageUrl">
                            Image {form.imageUrl.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Upload image"
                            className={`form-control ${form.imageUrl.error && "is-invalid"}`}
                            type="file"
                            accept="image/*"
                            name="imageUrl"
                            id="imageUrl"
                            onChange={(e) => {
                                const img = {
                                    preview: URL.createObjectURL(e.target.files[0]),
                                    data: e.target.files[0],
                                };
                                setImage(img);
                                handleChange({ name: "imageUrl", value: e.target.files[0].name });
                            }}
                        />
                        <div className="invalid-feedback">{form.imageUrl.error}</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="address" className="form-label">
                            Address {form.address.required && <span className="text-danger">*</span>}
                        </label>
                        <textarea
                            className={`form-control ${form.address.error && "is-invalid"}`}
                            id="address"
                            name="address"
                            rows={3}
                            required={form.address.required}
                            value={form.address.value}
                            onChange={(e) => handleChange({ name: "address", value: e.currentTarget.value })}
                        />
                        <div className="invalid-feedback">{form.address.error}</div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="d-grid d-md-flex justify-content-md-end">
                    <button className="btn btn-success" type="submit">
                        {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-add"></i>} Add Super Admin
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddSuperAdmin;
