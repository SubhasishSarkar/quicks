import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../hooks";
import moment from "moment";

const CAFUpdationRegistration = () => {
    const dispatch = useDispatch();
    const [regDateCheck, setRegDateCheck] = useState(false);
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Registration / CAF Update", url: "" }));
    }, []);
    const navigate = useNavigate();

    const [form, validator] = useValidate({
        registration_date: { value: "", validate: "required" },
    });

    const maxDate = moment().format("2023-11-31");
    const minDate = moment().format("2001-01-01");

    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name, setState) => {
            switch (name) {
                case "registration_date":
                    setState((state) => {
                        if (value) {
                            const validateDate = moment(value).format("YYYY-MM-DD");
                            if (validateDate >= minDate && validateDate <= maxDate) {
                                state.registration_date.error = "";
                            } else {
                                state.registration_date.error = "Please provide a valid  registration date.";
                            }
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const yesClass = {
        padding: "6px 26px 5px",
        textAlign: "center",
        borderRadius: "6px",
        cursor: "pointer",
        boxShadow: "rgba(0, 0, 0, 0.3) 0px -1px 9px, rgba(0, 0, 0, 0.22) 0px 5px 8px",
    };

    const checkEdistrict = () => {
        setRegDateCheck(true);
    };

    const checkDate = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        const edistrictValidDate = moment().format("2017-04-01");
        if (data?.registration_date < edistrictValidDate) {
            navigate("updation");
        } else if (data?.registration_date >= edistrictValidDate) {
            navigate(`registration?edistrict_registration_date=${data?.registration_date}`);
        }
    };

    return (
        <>
            <div className="card shadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8 mb-3" style={{ position: "relative", top: "6px" }}>
                            <span className="fw-semibold">
                                <i className="fa-solid fa-street-view"></i> I am a beneficiary under SASPFUW/ BOCWA/ WBTWSSS<span className="text-danger">*</span> :
                            </span>
                        </div>
                        <div className="col-md-4" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5px", cursor: "pointer" }}>
                            {/* <button className="btn btn-sm btn-success fw-semibold" onClick={() => navigate("updation")} style={yesClass}>
                                Yes
                            </button> */}
                            <button className="btn btn-sm btn-success fw-semibold" onClick={checkEdistrict} style={yesClass} disabled={regDateCheck}>
                                Yes
                            </button>
                            <button className="btn btn-sm btn-primary fw-semibold" onClick={() => navigate("registration")} style={yesClass}>
                                No
                            </button>
                        </div>
                        <div>
                            {regDateCheck && (
                                <form onSubmit={checkDate} noValidate autoComplete="off" className="mt-5">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3 mt-1">
                                                <label htmlFor="registration_date" className="form-label">
                                                    Registration Date {form.registration_date.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    placeholder="Registration Date"
                                                    className={`form-control ${form.registration_date.error && "is-invalid"}`}
                                                    type="date"
                                                    value={form.registration_date.value}
                                                    name="registration_date"
                                                    id="registration_date"
                                                    min={minDate}
                                                    max={maxDate}
                                                    onChange={(e) =>
                                                        handleChange({
                                                            name: "registration_date",
                                                            value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                                        })
                                                    }
                                                />
                                                <div className="invalid-feedback">{form.registration_date.error}</div>
                                            </div>
                                            <div className="col-md-3 mt-4">
                                                <button className="btn btn-success" type="submit">
                                                    Proceed
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-footer" style={{ background: "none", fontSize: "13px", letterSpacing: "0.5px" }}>
                    <p className="text-danger fw-semibold lh-1 m-2 ">
                        <i className="fa-regular fa-hand-point-right"></i> Instructions To The Applicants
                    </p>
                    <p className="text-dark fw-semibold m-2 text-wrap">
                        {/* Please fill up all the fields for successful submission of information to generate SSIN. While filling up application, you should provide your Mobile Number and either Aadhar Number or EPIC number to register. You can provide
                        all of them if you already possess such information. */}
                        Please fill in all the fields for successful submission of information to generate SSIN and/or Registration No. under BOCW / WBTWSSS
                    </p>
                </div>
            </div>
        </>
    );
};

export default CAFUpdationRegistration;
