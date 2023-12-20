import React, { useEffect } from "react";
import { useValidate } from "../../../../hooks";
import BMCNameSelect from "../../../../components/select/BMCNameSelect";
import GPWardSelect from "../../../../components/select/GPWardSelect";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../utils";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import moment from "moment";

const DsCafEntry = () => {
    const [form, validator] = useValidate({
        ds_reg_no: { value: "", validate: "required|number|length:24" },
        ds_reg_date: { value: "", validate: "required" },
        ben_aadhar: { value: "", validate: "required|number|length:12" },
        ben_name: { value: "", validate: "required" },
        mobile: { value: "", validate: "required|number|length:10" },
        block: { value: "", validate: "required" },
        gp_ward: { value: "", validate: "required" },
    });

    const { mutate: dsSubmit, isLoading: dsLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "ds_reg_date":
                    setState((state) => {
                        if (moment(value).isAfter("2023-12-14") && moment(value).isBefore("2024-01-01")) {
                            state.ds_reg_date.required = false;
                            state.ds_reg_date.validate = "";
                            state.ds_reg_date.error = null;
                        } else {
                            state.ds_reg_date.required = true;
                            state.ds_reg_date.validate = "required";
                            state.ds_reg_date.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        dsSubmit(
            { url: `/duare-sarkar-caf-entry`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("DS CAF successfully submitted.");
                    navigate("/duare-sarkar/caf-list");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const user = useSelector((state) => state.user.user);

    const { mutate } = useMutation((ben_aadhar) => fetcher("/check-aadhaar-algorithm-with-duplicate?aadhaar=" + ben_aadhar + "&searchIn=ds"));
    const handleBlur = (e) => {
        mutate(e, {
            onSuccess(data, variables, context) {
                validator.setState((state) => {
                    state.ben_aadhar.success = data.message;
                    state.ben_aadhar.error = null;
                    return {
                        ...state,
                    };
                });
            },
            onError(error, variables, context) {
                validator.setState((state) => {
                    state.ben_aadhar.success = null;
                    state.ben_aadhar.error = error.message;
                    return {
                        ...state,
                    };
                });
            },
        });
    };

    const { mutate: duplicateDsReg } = useMutation((ds_reg_no) => fetcher("/check-duplicate-ds-reg-no?regNo=" + ds_reg_no));
    const handleBlurReg = (e) => {
        if (e.length === 24) {
            duplicateDsReg(e, {
                onSuccess(data, variables, context) {
                    validator.setState((state) => {
                        state.ds_reg_no.success = data.message;
                        state.ds_reg_no.error = null;
                        return {
                            ...state,
                        };
                    });
                },
                onError(error, variables, context) {
                    validator.setState((state) => {
                        state.ds_reg_no.success = null;
                        state.ds_reg_no.error = error.message;
                        return {
                            ...state,
                        };
                    });
                },
            });
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar CAF Update Entry", url: "" }));
    }, []);

    return (
        <>
            <div className="card datatable-box mb-4">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="ds_reg_no">
                                        DS Registration Number {form.ds_reg_no.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="ds_reg_no"
                                        name="ds_reg_no"
                                        className={`form-control ${form.ds_reg_no.error ? "is-invalid" : form.ds_reg_no?.success && "is-valid"}`}
                                        value={form.ds_reg_no.value}
                                        required={form.ds_reg_no.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                            handleBlurReg(e.currentTarget.value);
                                        }}
                                    />
                                    <div id="Feedback" className={form.ds_reg_no.error ? "invalid-feedback" : form.ds_reg_no?.success ? "valid-feedback" : ""}>
                                        {form.ds_reg_no.error ? form.ds_reg_no.error : form.ds_reg_no?.success && form.ds_reg_no?.success}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="ds_reg_date">
                                        DS Registration Date {form.ds_reg_date.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="ds_reg_date"
                                        name="ds_reg_date"
                                        className={`form-control ${form.ds_reg_date.error && "is-invalid"}`}
                                        value={form.ds_reg_date.value}
                                        required={form.ds_reg_date.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        min={"2023-12-15"}
                                        max={"2023-12-30"}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.ds_reg_date.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="ben_aadhar">
                                        Aadhar Number of the Beneficiary {form.ben_aadhar.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="ben_aadhar"
                                        name="ben_aadhar"
                                        className={`form-control ${form.ben_aadhar.error ? "is-invalid" : form.ben_aadhar?.success && "is-valid"}`}
                                        value={form.ben_aadhar.value}
                                        required={form.ben_aadhar.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                            handleBlur(e.currentTarget.value);
                                        }}
                                    />
                                    <div id="Feedback" className={form.ben_aadhar.error ? "invalid-feedback" : form.ben_aadhar?.success ? "valid-feedback" : ""}>
                                        {form.ben_aadhar.error ? form.ben_aadhar.error : form.ben_aadhar?.success && form.ben_aadhar?.success}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="ben_name">
                                        Name of the Beneficiary (As Per Aadhar Card) {form.ben_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="ben_name"
                                        name="ben_name"
                                        className={`form-control ${form.ben_name.error && "is-invalid"}`}
                                        value={form.ben_name.value}
                                        required={form.ben_name.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.ben_name.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="mobile">
                                        Mobile Number {form.mobile.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="mobile"
                                        name="mobile"
                                        className={`form-control ${form.mobile.error && "is-invalid"}`}
                                        value={form.mobile.value}
                                        required={form.mobile.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.mobile.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="block" className="form-label">
                                        Venue (Block/Municipality/Corp.) {form.block.required && <span className="text-danger">*</span>}
                                    </label>
                                    <BMCNameSelect
                                        className={`form-select ${form.block.error && "is-invalid"}`}
                                        id="block"
                                        name="block"
                                        required={form.block.required}
                                        value={form.block.value}
                                        onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                        subDivision={user.subDivision}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.block.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="gp_ward" className="form-label">
                                        Venue (GP/Ward) {form.gp_ward.required && <span className="text-danger">*</span>}
                                    </label>
                                    <GPWardSelect
                                        className={`form-select ${form.gp_ward.error && "is-invalid"}`}
                                        id="gp_ward"
                                        name="gp_ward"
                                        required={form.gp_ward.required}
                                        value={form.gp_ward.value}
                                        onChange={(e) => handleChange({ name: "gp_ward", value: e.currentTarget.value })}
                                        block={form.block.value}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.gp_ward.error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="col-md-12">
                            <div className="d-grid  d-md-flex justify-content-md-end">
                                <button className="btn btn-success btn-sm" type="submit" disabled={dsLoading}>
                                    {dsLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DsCafEntry;
