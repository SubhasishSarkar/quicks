import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { fetcher, updater } from "../../utils";
import { useValidate } from "../../hooks";
import moment from "moment";
import LoadingOverlay from "../../components/LoadingOverlay";
import WorkerTypeSelect from "../../components/select/WorkerTypeSelect";
import SelectSubWorkType from "../../components/select/SelectSubWorkType";
import CWSelect from "../../components/select/CWSelect";
import TWSelect from "../../components/select/TWSelect";
import SelfEmployedSelect from "../../components/select/SelfEmployedSelect";
import UnOrganisedIndustriesSelect from "../../components/select/UnOrganisedIndustriesSelect";
import RationSelect from "../../components/select/RationSelect";
import ReligionSelect from "../../components/select/ReligionSelect";
import GenderSelect from "../../components/select/GenderSelect";
import MaritalSelect from "../../components/select/MaritalSelect";
import DesignationSelect from "../../components/select/DesignationSelect";
import CastSelect from "../../components/select/CastSelect";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import { toast } from "react-toastify";

const FormBenBasicDetailsCorrection = ({ data, isFetching }) => {
    const [collectedByName, setCollectedByName] = useState({ name: null, error: null });
    const dispatch = useDispatch();
    const { id } = useParams();
    const applicationId = id;

    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Basic Details Correction By CMS", url: "" }));
    }, []);

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const [form, validator] = useValidate(
        {
            cat_worker_type: { value: "", validate: "required" },
            sub_cat_name: { value: "", validate: "required" },
            worker_type: { value: "", validate: "required" },
            other_worker_name: { value: "", validate: "required" },
            fname: { value: "", validate: "onlyAlphabets" },
            mname: { value: "", validate: "onlyAlphabets" },
            lname: { value: "", validate: "onlyAlphabets" },
            dob: { value: "", validate: "" },
            email: { value: "", validate: "email" },
            mobile: { value: "", validate: "indianPhone" },
            aadhar: { value: "", validate: "number|length:12" },
            epic: { value: "", validate: "" },
            caste: { value: "", validate: "" },
            ration_card_type: { value: "", validate: "" },
            ration_card: { value: "", validate: "" },
            religion: { value: "", validate: "" },
            gender: { value: "", validate: "" },
            marital_status: { value: "", validate: "" },
            father_name: { value: "", validate: "onlyAlphabets" },
            husband_name: { value: "", validate: "" },
            mother_name: { value: "", validate: "" },
            monthly_family_income: { value: "", validate: "number" },
            certified_by: { value: "", validate: "onlyAlphabets" },
            designation: { value: "", validate: "" },
            collected_by: { value: "", validate: "" },
            swasthyasathi: { value: "", validate: "" },
            covered_under: { value: "", validate: "" },
            ssin: { value: "", validate: "required" },
            registration_no: { value: "", validate: "" },
            registration_date: { value: "", validate: "" },
            nominee_name: { value: "", validate: "onlyAlphabets" },
            nominee_mobile: { value: "", validate: "indianPhone" },
            nominee_aadhaar: { value: "", validate: "" },
            new_caf: { value: "", validate: "" },
        },
        data,
        true
    );

    const minDate = moment().format("2001-01-01");

    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name, setState) => {});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return toast.error("Please fill of all required field");
        const data = validator.generalize();
        mutate(
            { url: `/form_ben_details_correction_cms_insert?id=${applicationId}`, body: data },
            {
                onSuccess(data, variables, context) {
                    toast.success("Successfully update basic details");
                },
                onError(error, variables, context) {
                    console.error(error);
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

    return (
        <>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="card-body">
                    {isFetching && <LoadingOverlay />}

                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="ssin" className="form-label">
                                SSIN <span className="text-danger">*</span>
                            </label>
                            <input placeholder="SSIN" disabled={true} className={`form-control ${form.ssin.error && "is-invalid"}`} type="text" value={form.ssin.value} name="ssin" id="ssin" onChange={(e) => handleChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.ssin.error}</div>
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
                                onChange={(e) =>
                                    handleChange({
                                        name: "registration_date",
                                        value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                    })
                                }
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

                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
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
                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
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
                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
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
                                <div className="invalid-feedback">Please provide a valid Sub Category.</div>
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
                                <div className="invalid-feedback">Please provide a valid Other Sub Category Name.</div>
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
                                Date of Birth (Age limit 18 to 60) {form.dob.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Date of Birth"
                                className={`form-control ${form.dob.error && "is-invalid"}`}
                                type="date"
                                value={form.dob.value}
                                name="dob"
                                id="dob"
                                disabled={true}
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
                            <input
                                placeholder="Mobile Number"
                                className={`form-control ${form.mobile.error && "is-invalid"}`}
                                type="text"
                                value={form.mobile.value}
                                name="mobile"
                                id="mobile"
                                onChange={(e) => handleChange(e.currentTarget)}
                                disabled={true}
                            />
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
                                disabled={true}
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
                            <input placeholder="Epic Card" className={`form-control ${form.epic.error && "is-invalid"}`} type="text" value={form.epic.value} name="epic" id="epic" onChange={(e) => handleChange(e.currentTarget)} disabled={true} />
                            <div className="invalid-feedback">Please provide a Epic no.</div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" htmlFor="caste">
                                Caste {form.caste.required && <span className="text-danger">*</span>}
                            </label>
                            <CastSelect placeholder="Caste" className={`form-select ${form.caste.error && "is-invalid"}`} type="text" value={form.caste.value} name="caste" id="caste" onChange={(e) => handleChange(e.currentTarget)} />
                            <div className="invalid-feedback">{form.caste.error}</div>
                        </div>
                        <div className="col-md-3">
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
                            <div className="invalid-feedback">Please provide a valid Other Sub Category Name.</div>
                        </div>
                        <div className="col-md-3">
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
                            <div className="invalid-feedback">Please provide a Ration Card / Khadya Sathi No.</div>
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
                        {form.gender.value == "Female" && form.marital_status.value == "Married" && (
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
                            <div className="invalid-feedback">Please provide a Designation Name.</div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" htmlFor="collected_by">
                                Collected By {form.collected_by.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Collected By"
                                disabled={true}
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
                            <div className="invalid-feedback">Please provide a Swasthya Sathi Card no.</div>
                        </div>
                        {data?.new_caf === 1 && (
                            <>
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
                                    <div className="invalid-feedback">Please provide a Nominee Name.</div>
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
                            </>
                        )}

                        <div className="col-md-12 mb-3">
                            <div className="card">
                                <div className="card-body">
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
                                        <div className="invalid-feedback">More example invalid feedback text</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button className="btn btn-success" type="submit" disabled={isLoading}>
                            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-floppy-disk"></i>} Save Draft & Proceed
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default FormBenBasicDetailsCorrection;
