import React, { useEffect, useState } from "react";
import CWSelect from "../../components/select/CWSelect";
import SelfEmployedSelect from "../../components/select/SelfEmployedSelect";
import TWSelect from "../../components/select/TWSelect";
import CastSelect from "../../components/select/CastSelect";
import RationSelect from "../../components/select/RationSelect";
import ReligionSelect from "../../components/select/ReligionSelect";
import GenderSelect from "../../components/select/GenderSelect";
import MaritalSelect from "../../components/select/MaritalSelect";
import UnOrganisedIndustriesSelect from "../../components/select/UnOrganisedIndustriesSelect";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { toast } from "react-toastify";
import WorkerTypeSelect from "../../components/select/WorkerTypeSelect";
import moment from "moment";
import DesignationSelect from "../../components/select/DesignationSelect";
import SelectSubWorkType from "../../components/select/SelectSubWorkType";
import DeathAlive from "../../components/select/DeathAlive";

const BasicNomineeInformation = ({ workerTypeData, nextStep, prevStep }) => {
    const [collectedByName, setCollectedByName] = useState({ name: null, error: null });
    const query = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const application_id = searchParams.get("application_id") || "";
    const { isFetching, data } = useQuery(["caf-registration-preview", "basic-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=basic-details`), {
        enabled: application_id ? true : false,
    });

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const [form, validator] = useValidate(
        {
            registration_type: { value: "OLD", validate: "" },
            cat_worker_type: { value: "", validate: "required" },
            sub_cat_name: { value: "", validate: data?.cat_worker_type === "ow" ? "required" : "" },
            worker_type: { value: "", validate: "required" },
            other_worker_name: { value: "", validate: "" },
            fname: { value: "", validate: "onlyAlphabets|required" },
            mname: { value: "", validate: "onlyAlphabets" },
            lname: { value: "", validate: "onlyAlphabets|required" },
            dob: { value: "", validate: "required" },
            email: { value: "", validate: "email" },
            mobile: { value: "", validate: "indianPhone|required" },
            aadhar: { value: "", validate: "required|number|length:12" },
            epic: { value: "", validate: "" },
            caste: { value: "", validate: "required" },
            ration_card_type: { value: "", validate: "" },
            ration_card: { value: "", validate: "" },
            religion: { value: "", validate: "required" },
            gender: { value: "", validate: "required" },
            marital_status: { value: "", validate: "required" },
            father_name: { value: "", validate: "onlyAlphabets|required" },
            husband_name: { value: "", validate: "" },
            monthly_family_income: { value: "", validate: "required|number" },
            certified_by: { value: "", validate: "onlyAlphabets|required" },
            designation: { value: "", validate: "required" },
            collected_by: { value: "", validate: "required" },
            swasthyasathi: { value: "", validate: "" },
            covered_under: { value: "", validate: "required" },
            // ssin: { value: "", validate: "" },
            registration_no: { value: "", validate: "required" },
            registration_date: { value: "", validate: "required" },
            new_caf: { value: "1", validate: "required" },
            nominee_name: { value: "", validate: "required" },
            nominee_mobile: { value: "", validate: "indianPhone|required" },
            nominee_aadhaar: { value: "", validate: "required|number|length:12" },
            esi_no: { value: "", validate: data?.covered_under === "Yes" ? "required": "" },
            pf_no: { value: "", validate: data?.covered_under === "Yes" ? "required": ""  },
        },
        application_id ? data || {} : workerTypeData,
        data,
        true
    );

    const maxDate = moment().format("2017-03-31");
    const minDate = moment().format("2001-01-01");

    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name, setState) => {
            switch (name) {
                case "cat_worker_type":
                    setState((state) => {
                        if (value === "ow") {
                            state.sub_cat_name.required = true;
                            state.sub_cat_name.validate = "required";

                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        } else {
                            state.sub_cat_name.required = false;
                            state.sub_cat_name.validate = "";
                            state.sub_cat_name.value = "";
                            state.sub_cat_name.error = null;

                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        }
                        state.other_worker_name.required = false;
                        state.other_worker_name.validate = "";
                        state.other_worker_name.value = "";
                        state.other_worker_name.error = null;
                        return { ...state };
                    });
                    break;
                case "worker_type":
                    setState((state) => {
                        if (value === 11 || value === 7) {
                            state.other_worker_name.required = true;
                            state.other_worker_name.validate = "required";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        } else {
                            state.other_worker_name.required = false;
                            state.other_worker_name.validate = "";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "marital_status":
                    setState((state) => {
                        if (state.gender.value == "Female" && (value == "Married" || value == "Widow" || value == "Divorcee")) {
                            state.husband_name.required = true;
                            state.husband_name.validate = "required";
                            state.husband_name.value = "";
                            state.husband_name.error = null;
                        } else {
                            state.husband_name.required = false;
                            state.husband_name.validate = "";
                            state.husband_name.value = "";
                            state.husband_name.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "dob":
                    setState((state) => {
                        const age = moment().diff(value, "years", false);
                        if (age < 18 || age > 90) state.dob.error = "Please provide Date of Birth (Age limit between 18 to 60)";
                        return { ...state };
                    });

                    break;
                case "monthly_family_income":
                    setState((state) => {
                        if (value > 6500) {
                            state.monthly_family_income.error = "Monthly Family Income should not greater than 6500/-";
                        }
                        return { ...state };
                    });
                    break;
                case "registration_date":
                    setState((state) => {
                        if (value) {
                            const validateDate = moment(value).format("YYYY-MM-DD");
                            if (validateDate >= minDate && validateDate <= maxDate) {
                                state.registration_date.error = "";
                            } else {
                                state.registration_date.error = "Please provide a valid registration date.";
                            }
                        }
                        return { ...state };
                    });
                    break;
                case "ration_card_type":
                    setState((state) => {
                        if (value) {
                            state.ration_card.required = true;
                            state.ration_card.validate = "required";
                        } else {
                            state.ration_card.error = null;
                            state.ration_card.required = false;
                            state.ration_card.validate = "";
                        }
                        return { ...state };
                    });
                    break;
                case "new_caf":
                    setState((state) => {
                        if (value === "1" || value === 1) {
                            state.new_caf.required = false;
                            state.new_caf.validate = "";
                            state.new_caf.error = "";
                        }
                        return { ...state };
                    });
                    break;
                    case "covered_under":
                        setState((state) => {
                            if (value === "Yes") {
                                state.esi_no.required = true;
                                state.pf_no.required = true;
                            }else if(value === "No"){
                                state.esi_no.required = "";
                                state.pf_no.required = "";
                            }
                            return { ...state };
                        });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validator.validate()) return toast.error("Please fill of all required field");

        const data = validator.generalize();
        mutate(
            { url: `/caf-registration?id=${application_id}&type=basic-details`, body: data },
            {
                onSuccess(data, variables, context) {
                    toast.success("Successfully update basic details");
                    nextStep(1);
                    searchParams.set("application_id", data.enc_application_id);
                    setSearchParams(searchParams);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };
    const { mutate: aadharMute } = useMutation((aadhaar) => fetcher("/check-aadhaar-algorithm?aadhaar=" + aadhaar));
    const handleBlur = (e) => {
        aadharMute(e, {
            onSuccess(data, variables, context) {
                validator.setState((state) => {
                    state.aadhar.success = data.message;
                    state.aadhar.error = null;
                    return {
                        ...state,
                    };
                });
            },
            onError(error, variables, context) {
                validator.setState((state) => {
                    state.aadhar.success = null;
                    state.aadhar.error = error.message;
                    return {
                        ...state,
                    };
                });
            },
        });
    };

    const { mutate: nomineeaadharMute } = useMutation((nominee_aadhaar) => fetcher("/check-aadhaar-algorithm?aadhaar=" + nominee_aadhaar));
    const nomineeAadhaarHandler = (e) => {
        nomineeaadharMute(e, {
            onSuccess(data, variables, context) {
                validator.setState((state) => {
                    state.nominee_aadhaar.success = data.message;
                    state.nominee_aadhaar.error = null;
                    return {
                        ...state,
                    };
                });
            },
            onError(error, variables, context) {
                validator.setState((state) => {
                    state.nominee_aadhaar.success = null;
                    state.nominee_aadhaar.error = error.message;
                    return {
                        ...state,
                    };
                });
            },
        });
    };

    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "basic-details", application_id], {
                exact: true,
            });
        };
    }, [application_id]);

    useEffect(() => {
        validator.setState((state) => {
            if (data?.cat_worker_type === "ow") {
                state.sub_cat_name.required = true;
                state.sub_cat_name.validate = "required";
            }
            if (data?.registration_type === "OLD") {
                state.registration_date.required = true;
                state.registration_date.validate = "required";
                state.registration_no.required = true;
                state.registration_no.validate = "required";
            }
            return { ...state };
        });
    }, [data]);

    return (
        <>
            <div className="card datatable-box mb-4">
               
                <div className="card-body" style={{ position: "relative", overflow: "hidden" }}>
                    {isFetching && <LoadingOverlay />}
                    <form onSubmit={handleSubmit} noValidate autoComplete="off">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label htmlFor="new_caf" className="form-label">
                                    Beneficiary type{form.new_caf.required && <span className="text-danger">*</span>}
                                </label>
                                <DeathAlive
                                    className={`form-select ${form.new_caf.error && "is-invalid"}`}
                                    type="text"
                                    value={form.new_caf.value}
                                    name="new_caf"
                                    id="new_caf"
                                    onChange={(e) => handleChange({ name: "new_caf", value: parseInt(e.currentTarget.value) })}
                                    disabled
                                />
                                <div className="invalid-feedback">{form.new_caf.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="registration_no" className="form-label">
                                    Registration No. {form.registration_no.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Registration No."
                                    className={`form-control ${form.registration_no.error && "is-invalid"}`}
                                    type="text"
                                    value={form.registration_no.value}
                                    name="registration_no"
                                    id="registration_no"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.registration_no.error}</div>
                            </div>
                            <div className="col-md-3">
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
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.registration_date.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="cat_worker_type" className="form-label">
                                    Worker Type {form.cat_worker_type.required && <span className="text-danger">*</span>}
                                </label>
                                <WorkerTypeSelect
                                    className={`form-select ${form.cat_worker_type.error && "is-invalid"}`}
                                    id="cat_worker_type"
                                    name="cat_worker_type"
                                    required={form.cat_worker_type.required}
                                    value={form.cat_worker_type.value}
                                    onChange={(e) => handleChange({ name: "cat_worker_type", value: e.currentTarget.value })}
                                />
                            </div>
                            {form.cat_worker_type.value === "ow" && (
                                <div className="col-md-3">
                                    <label htmlFor="sub_cat_name" className="form-label">
                                        Select Sub Category {form.sub_cat_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <SelectSubWorkType
                                        className={`form-select ${form.sub_cat_name.error && "is-invalid"}`}
                                        id="sub_cat_name"
                                        name="sub_cat_name"
                                        required={form.sub_cat_name.required}
                                        value={form.sub_cat_name.value}
                                        onChange={(e) => handleChange({ name: "sub_cat_name", value: e.currentTarget.value })}
                                    />
                                    <div className="invalid-feedback">{form.sub_cat_name.error}</div>
                                </div>
                            )}
                            {form.cat_worker_type.value === "cw" && (
                                <div className="col-md-3">
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <CWSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        value={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        error={form.worker_type.error}
                                        required={form.worker_type.required}
                                    />

                                    <div className="invalid-feedback">{form.worker_type.error}</div>
                                </div>
                            )}
                            {form.cat_worker_type.value === "tw" && (
                                <div className="col-md-3">
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <TWSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        label="Select Sub Category Name"
                                        size="xs"
                                        placeholder="Pick one"
                                        value={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        error={form.worker_type.error}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">{form.worker_type.error}</div>
                                </div>
                            )}
                            {form.cat_worker_type.value === "ow" && form.sub_cat_name.value === "Self Employed" && (
                                <div className="col-md-3">
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <SelfEmployedSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        label="Select Sub Category Name"
                                        size="xs"
                                        placeholder="Pick one"
                                        value={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        error={form.worker_type.error}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">{form.worker_type.error}</div>
                                </div>
                            )}
                            {form.cat_worker_type.value === "ow" && form.sub_cat_name.value === "Unorganised Industries" && (
                                <div className="col-md-3">
                                    <label className="form-label">Select Sub Category Name {form.worker_type.required && <span className="text-danger">*</span>}</label>
                                    <UnOrganisedIndustriesSelect
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        label="Select Sub Category Name"
                                        size="xs"
                                        placeholder="Pick one"
                                        value={form.worker_type.value}
                                        onChange={(e) => handleChange({ name: "worker_type", value: parseInt(e.currentTarget.value) })}
                                        required={form.worker_type.required}
                                    />
                                    <div className="invalid-feedback">{form.worker_type.error}</div>
                                </div>
                            )}
                            {((form.cat_worker_type.value === "tw" && form.worker_type.value == 11) || (form.cat_worker_type.value === "cw" && form.worker_type.value == 7)) && (
                                <div className="col-md-3">
                                    <label className="form-label" htmlFor="other_worker_name">
                                        Other Sub Category Name {form.other_worker_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="Enter the name"
                                        className={`form-control ${form.other_worker_name.error && "is-invalid"}`}
                                        type="text"
                                        value={form.other_worker_name.value}
                                        name="other_worker_name"
                                        id="other_worker_name"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.other_worker_name.error}</div>
                                </div>
                            )}
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="fname">
                                    First Name {form.fname.required && <span className="text-danger">*</span>}
                                </label>
                                <input placeholder="First Name" className={`form-control ${form.fname.error && "is-invalid"}`} type="text" value={form.fname.value} name="fname" id="fname" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.fname.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="mname">
                                    Middle Name {form.mname.required && <span className="text-danger">*</span>}
                                </label>
                                <input placeholder="Middle Name" className={`form-control ${form.mname.error && "is-invalid"}`} type="text" value={form.mname.value} name="mname" id="mname" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.mname.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="lname">
                                    Last Name {form.lname.required && <span className="text-danger">*</span>}
                                </label>
                                <input placeholder="Last Name" className={`form-control ${form.lname.error && "is-invalid"}`} type="text" value={form.lname.value} name="lname" id="lname" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.lname.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="dob">
                                    Date of Birth {form.dob.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Date of Birth"
                                    className={`form-control ${form.dob.error && "is-invalid"}`}
                                    type="date"
                                    value={form.dob.value}
                                    name="dob"
                                    id="dob"
                                    //  onChange={(e) => handleChange(e.currentTarget)}
                                    onChange={(e) =>
                                        handleChange({
                                            name: "dob",
                                            value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                        })
                                    }
                                />
                                <div className="invalid-feedback">{form.dob.error}</div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label" htmlFor="email-1">
                                    Email {form.email.required && <span className="text-danger">*</span>}
                                </label>
                                <input placeholder="Email" className={`form-control ${form.email.error && "is-invalid"}`} type="email" value={form.email.value} name="email" id="email-1" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.email.error}</div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label" htmlFor="mobile">
                                    Mobile Number {form.mobile.required && <span className="text-danger">*</span>}
                                </label>
                                <input placeholder="Mobile Number" className={`form-control ${form.mobile.error && "is-invalid"}`} type="text" value={form.mobile.value} name="mobile" id="mobile" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.mobile.error}</div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label" htmlFor="aadhar">
                                    Aadhar Number {form.aadhar.required && <span className="text-danger">*</span>}
                                </label>
                                {/* <input placeholder="Aadhar Number" className={`form-control ${form.aadhar.error && "is-invalid"}`} type="text" value={form.aadhar.value} name="aadhar" id="aadhar" onChange={(e) => handleChange(e.currentTarget)} /> */}

                                <input
                                    placeholder="Aadhaar"
                                    className={`form-control ${form.aadhar.error ? "is-invalid" : form.aadhar?.success && "is-valid"}`}
                                    type="text"
                                    name="aadhar"
                                    value={form.aadhar.value}
                                    id="aadhar"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                        handleBlur(e.currentTarget.value);
                                    }}
                                />
                                <div id="Feedback" className={form.aadhar.error ? "invalid-feedback" : form.aadhar?.success ? "valid-feedback" : ""}>
                                    {form.aadhar.error ? form.aadhar.error : form.aadhar?.success && "Aadhaar Checked"}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="epic">
                                    Epic Card {form.epic.required && <span className="text-danger">*</span>}
                                </label>
                                <input placeholder="Epic Card" className={`form-control ${form.epic.error && "is-invalid"}`} type="text" value={form.epic.value} name="epic" id="epic" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.epic.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="caste">
                                    Caste {form.caste.required && <span className="text-danger">*</span>}
                                </label>
                                <CastSelect placeholder="Caste" className={`form-select ${form.caste.error && "is-invalid"}`} type="text" value={form.caste.value} name="caste" id="caste" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.caste.error}</div>
                            </div>
                            <div className="col-md-3 ">
                                <label className="form-label" htmlFor="ration_card_type">
                                    Ration Card / Khadya Sathi No. Type {form.ration_card_type.required && <span className="text-danger">*</span>}
                                </label>
                                <RationSelect
                                    placeholder="Ration Card / Khadya Sathi No Type"
                                    className={`form-select ${form.ration_card_type.error && "is-invalid"}`}
                                    type="text"
                                    value={form.ration_card_type.value}
                                    name="ration_card_type"
                                    id="ration_card_type"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.ration_card_type.error}</div>
                            </div>
                            <div className={`col-md-3 ${form.ration_card.required && form.ration_card_type != "" ? "show" : "show"}`}>
                                <label className="form-label" htmlFor="ration_card">
                                    Ration Card / Khadya Sathi No {form.ration_card.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Ration Card / Khadya Sathi No"
                                    className={`form-control ${form.ration_card.error && "is-invalid"}`}
                                    type="text"
                                    value={form.ration_card.value}
                                    name="ration_card"
                                    id="ration_card"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.ration_card.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="religion">
                                    Religion {form.religion.required && <span className="text-danger">*</span>}
                                </label>
                                <ReligionSelect
                                    placeholder="Religion"
                                    className={`form-select ${form.religion.error && "is-invalid"}`}
                                    type="text"
                                    value={form.religion.value}
                                    name="religion"
                                    id="religion"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.religion.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="gender">
                                    Gender {form.gender.required && <span className="text-danger">*</span>}
                                </label>
                                <GenderSelect placeholder="Gender" className={`form-select ${form.gender.error && "is-invalid"}`} type="text" value={form.gender.value} name="gender" id="gender" onChange={(e) => handleChange(e.currentTarget)} />
                                <div className="invalid-feedback">{form.gender.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="marital_status">
                                    Marital status {form.marital_status.required && <span className="text-danger">*</span>}
                                </label>
                                <MaritalSelect
                                    placeholder="Marital status"
                                    className={`form-select ${form.marital_status.error && "is-invalid"}`}
                                    type="text"
                                    value={form.marital_status.value}
                                    name="marital_status"
                                    id="marital_status"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.marital_status.error}</div>
                            </div>
                            {form.gender.value == "Female" && (form.marital_status.value == "Married" || form.marital_status.value == "Widow" || form.marital_status.value == "Divorcee") && (
                                <div className="col-md-3">
                                    <label className="form-label" htmlFor="husband_name">
                                        Husband{"'"}s Name {form.husband_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="Husband's Name"
                                        className={`form-control ${form.husband_name.error && "is-invalid"}`}
                                        type="text"
                                        value={form.husband_name.value}
                                        name="husband_name"
                                        id="husband_name"
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />
                                    <div className="invalid-feedback">{form.husband_name.error}</div>
                                </div>
                            )}
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="father_name">
                                    Father{"'"}s Name {form.father_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Father's Name"
                                    className={`form-control ${form.father_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.father_name.value}
                                    name="father_name"
                                    id="father_name"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.father_name.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="monthly_family_income">
                                    Monthly Family Income {form.monthly_family_income.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Monthly Family Income"
                                    className={`form-control ${form.monthly_family_income.error && "is-invalid"}`}
                                    type="text"
                                    value={form.monthly_family_income.value}
                                    name="monthly_family_income"
                                    id="monthly_family_income"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.monthly_family_income.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="certified_by">
                                    Certificate By {form.certified_by.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Certificate By"
                                    className={`form-control ${form.certified_by.error && "is-invalid"}`}
                                    type="text"
                                    value={form.certified_by.value}
                                    name="certified_by"
                                    id="certified_by"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.certified_by.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="designation">
                                    Designation {form.designation.required && <span className="text-danger">*</span>}
                                </label>
                                <DesignationSelect
                                    placeholder="Designation"
                                    className={`form-select ${form.designation.error && "is-invalid"}`}
                                    type="text"
                                    value={form.designation.value}
                                    name="designation"
                                    id="designation"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.designation.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="collected_by">
                                    Collected By {form.collected_by.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Collected By"
                                    className={`form-control ${form.collected_by.error && "is-invalid"}`}
                                    type="text"
                                    value={form.collected_by.value}
                                    name="collected_by"
                                    id="collected_by"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    onBlur={async (e) => {
                                        try {
                                            const d = await fetcher(`/chk_arn_sloca/${e.currentTarget.value || 1}`);
                                            setCollectedByName({ name: d.fullname, error: null });
                                        } catch (error) {
                                            setCollectedByName({ name: null, error: `${error.message} ${e.target.value}` });
                                            handleChange({ name: "collected_by", value: "" });
                                        }
                                    }}
                                />
                                <div className="invalid-feedback">{collectedByName.error ? collectedByName.error : "Required field"}</div>

                                {collectedByName.name && <div className="form-text">{collectedByName.name}</div>}
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="swasthyasathi">
                                    Swasthya Sathi Card {form.swasthyasathi.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Swasthya Sathi Card"
                                    className={`form-control ${form.swasthyasathi.error && "is-invalid"}`}
                                    type="text"
                                    value={form.swasthyasathi.value}
                                    name="swasthyasathi"
                                    id="swasthyasathi"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.swasthyasathi.error}</div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label" htmlFor="nominee_name">
                                    Nominee Name {form.nominee_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Nominee Name"
                                    className={`form-control ${form.nominee_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.nominee_name.value}
                                    name="nominee_name"
                                    id="nominee_name"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.nominee_name.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="nominee_mobile">
                                    Nominee Mobile {form.nominee_mobile.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="Nominee Mobile"
                                    className={`form-control ${form.nominee_mobile.error && "is-invalid"}`}
                                    type="text"
                                    value={form.nominee_mobile.value}
                                    name="nominee_mobile"
                                    id="nominee_mobile"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.nominee_mobile.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label" htmlFor="nominee_aadhaar">
                                    Nominee Aadhar {form.nominee_aadhaar.required && <span className="text-danger">*</span>}
                                </label>
                                {/* <input placeholder="Aadhar Number" className={`form-control ${form.aadhar.error && "is-invalid"}`} type="text" value={form.aadhar.value} name="aadhar" id="aadhar" onChange={(e) => handleChange(e.currentTarget)} /> */}

                                <input
                                    placeholder="Aadhaar"
                                    className={`form-control ${form.nominee_aadhaar.error ? "is-invalid" : form.nominee_aadhaar?.success && "is-valid"}`}
                                    type="text"
                                    name="nominee_aadhaar"
                                    value={form.nominee_aadhaar.value}
                                    id="aadhar"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                        nomineeAadhaarHandler(e.currentTarget.value);
                                    }}
                                />
                                <div id="Feedback" className={form.nominee_aadhaar.error ? "invalid-feedback" : form.nominee_aadhaar?.success ? "valid-feedback" : ""}>
                                    {form.nominee_aadhaar.error ? form.nominee_aadhaar.error : form.nominee_aadhaar?.success && "Aadhaar Checked"}
                                </div>
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="covered_under">Covered Under Employees Provident Fund and Miscellaneous Provisions Act, 1952 & ESI Act, 1948 {form.covered_under.required && <span className="text-danger">*</span>}</label>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        value="Yes"
                                        checked={form.covered_under.value == "Yes" ? true : false}
                                        onChange={() => handleChange({ name: "covered_under", value: "Yes" })}
                                        className={`form-check-input ${form.covered_under.error && "is-invalid"}`}
                                        id="covered_under_yes"
                                        name="radio-stacked"
                                        required={form.covered_under.required}
                                    />
                                    <label className="form-check-label" htmlFor="covered_under_yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        checked={form.covered_under.value == "No" ? true : false}
                                        value="No"
                                        type="radio"
                                        className={`form-check-input ${form.covered_under.error && "is-invalid"}`}
                                        onChange={() => handleChange({ name: "covered_under", value: "No" })}
                                        id="covered_under_no"
                                        name="radio-stacked"
                                        required={form.covered_under.required}
                                    />
                                    <label className="form-check-label" htmlFor="covered_under_no">
                                        No
                                    </label>
                                    <div className="invalid-feedback">{form.covered_under.error}</div>
                                </div>
                            </div>
                            {form.covered_under.value === "Yes" ? (
                                        <>
                                            <div className="col-md-3">
                                                <label className="form-label" htmlFor="esi_no">
                                                    ESI No. {form.esi_no.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    placeholder="ESI No."
                                                    className={`form-control ${form.esi_no.error && "is-invalid"}`}
                                                    type="text"
                                                    value={form.esi_no.value}
                                                    name="esi_no"
                                                    id="esi_no"
                                                    onChange={(e) => handleChange(e.currentTarget)}
                                                />
                                                <div className="invalid-feedback">${form.esi_no.error}</div>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label" htmlFor="pf_no">
                                                    PF No. {form.pf_no.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    placeholder="PF No."
                                                    className={`form-control ${form.pf_no.error && "is-invalid"}`}
                                                    type="text"
                                                    value={form.pf_no.value}
                                                    name="pf_no"
                                                    id="pf_no"
                                                    onChange={(e) => handleChange(e.currentTarget)}
                                                />
                                                <div className="invalid-feedback">${form.pf_no.error}</div>
                                            </div>
                                        </>
                                    ) : ("")}
                        </div>
                        <div className="pt-2">
                            <button className="btn btn-success btn-sm " type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Save Draft & Proceed"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BasicNomineeInformation;
