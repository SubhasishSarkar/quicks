import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { disableQuery } from "../../data";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";
import moment from "moment";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import RelationSelect from "../../components/select/RelationSelect";
import GenderSelect from "../../components/select/GenderSelect";
import AsyncSelect from "../../components/select/AsyncSelect";
import DistrictSelect from "../../components/select/DistrictSelect";
import { RegistrationContext } from "./RegistrationForm";
const bankDetailsErrorHandler = (value, state) => {
    if (value) {
        //bank_ifsc
        state.bank_ifsc.validate = "required";
        state.bank_ifsc.required = true;
        //bank_name
        state.bank_name.validate = "required";
        state.bank_name.required = true;
        //bank_branch_name
        state.bank_branch_name.validate = "required";
        state.bank_branch_name.required = true;
        //bank_district_name
        state.bank_district_name.validate = "required";
        state.bank_district_name.required = true;
        // bank_location
        state.bank_location.validate = "required";
        state.bank_location.required = true;
        //bank_account_no
        state.bank_account_no.validate = "bankAccount|number|required";
        state.bank_account_no.required = true;
    } else {
        //bank_ifsc
        state.bank_ifsc.validate = "";
        state.bank_ifsc.value = "";
        state.bank_ifsc.required = false;
        state.bank_ifsc.error = null;
        //bank_name
        //bank_name
        state.bank_name.value = "";
        state.bank_name.validate = "";
        state.bank_name.required = false;
        state.bank_name.error = null;
        //bank_branch_name
        state.bank_branch_name.value = "";
        state.bank_branch_name.validate = "";
        state.bank_branch_name.required = false;
        state.bank_branch_name.error = null;
        //bank_district_name
        state.bank_district_name.value = "";
        state.bank_district_name.validate = "";
        state.bank_district_name.required = false;
        state.bank_district_name.error = null;
        // bank_location
        state.bank_location.value = "";
        state.bank_location.validate = "";
        state.bank_location.required = false;
        state.bank_location.error = null;
        //bank_account_no
        state.bank_account_no.value = "";
        state.bank_account_no.validate = "";
        state.bank_account_no.error = null;
        state.bank_account_no.required = false;
    }
    return { ...state };
};

const NomineeDetailsForm = ({ nextStep, prevStep }) => {
    const { setIsDirty } = useContext(RegistrationContext);
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const { isFetching, data } = useQuery(["caf-registration-preview", "nominee-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=nominee-details`), {
        ...disableQuery,
        enabled: application_id ? true : false,
    });
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const [list, setList] = useState([]);
    const [share, setShare] = useState(100);
    const [added, setAdded] = useState(false);
    const [form, validator] = useValidate({
        nominee_name: { value: "", validate: "onlyAlphabets|required", error: null },
        relationship: { value: "", validate: "required", error: null },
        relationship_name: { value: "", validate: "", error: null },
        share: { value: "", validate: "required|min:1", error: null },
        gender: { value: "", validate: "required", error: null },
        date_of_birth: { value: "", validate: "required", error: null },
        age: { value: "", validate: "required", error: null },
        bank_ifsc: { value: "", validate: "", error: null },
        bank_name: { value: "", validate: "", error: null },
        bank_branch_name: { value: "", validate: "", error: null },
        bank_district_name: { value: "", validate: "", error: null },
        bank_location: { value: "", validate: "", error: null },
        bank_account_no: { value: "", validate: "bankAccount|number", error: null },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "relationship":
                    setState((state) => {
                        if (value === "Other") {
                            state.relationship_name.validate = "onlyAlphabets|required";
                            state.relationship_name.required = true;
                        } else {
                            state.relationship_name.value = "";
                            state.relationship_name.validate = "";
                            state.relationship_name.required = false;
                        }

                        return { ...state };
                    });
                    break;
                case "bank_ifsc":
                    setState((state) => {
                        return { ...bankDetailsErrorHandler(value, state) };
                    });
                    break;
                case "bank_name":
                    setState((state) => {
                        return { ...bankDetailsErrorHandler(value, state) };
                    });
                    break;
                case "bank_branch_name":
                    setState((state) => {
                        return { ...bankDetailsErrorHandler(value, state) };
                    });
                    break;
                case "bank_district_name":
                    setState((state) => {
                        return { ...bankDetailsErrorHandler(value, state) };
                    });
                    break;
                case "bank_location":
                    setState((state) => {
                        return { ...bankDetailsErrorHandler(value, state) };
                    });
                    break;
                case "bank_account_no":
                    setState((state) => {
                        return { ...bankDetailsErrorHandler(value, state) };
                    });
                    break;
                case "date_of_birth":
                    setState((state) => {
                        if (value) {
                            let currentDate = moment().format("YYYY-MM-DD");
                            if (state.date_of_birth.value > currentDate) {
                                state.date_of_birth.error = "Please provide a valid Date of Birth";
                            }
                            state.age.value = moment().diff(value, "years", false);
                            state.age.error = null;
                        } else state.age.value = null;

                        return { ...state };
                    });

                    break;
                case "age":
                    setState((state) => {
                        if (value > 120) {
                            state.date_of_birth.error = "Please provide a valid Date of Birth";
                        } else if (value < 0) {
                            state.date_of_birth.error = "Please provide a valid Date of Birth";
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const handleSubmit = () => {
        if (share !== 0) {
            toast.error(`Share ${share}% is remaining`);
            return;
        }

        if (application_id) {
            //const nominee = Object.assign({}, list);
            //const finalList = nominee[0];
            mutate(
                {
                    url: "/caf-registration?type=nominee-details&id=" + application_id,
                    body: { nominee: list },
                    //body: finalList,
                },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        nextStep(4);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };

    const handleAdd = () => {
        if (!validator.validate()) return;
        if (share - form.share.value < 0) {
            validator.validOnChange({ name: "share", value: null }, (value, name, setState) => {
                setState((prev) => {
                    prev.share.error = "Share must be smaller or equal " + share;
                    return { ...prev };
                });
            });
            return;
        }
        const data = validator.generalize();
        data["id"] = Math.random();
        data["date_of_birth"] = moment(data["date_of_birth"]).format("YYYY-MM-DD");
        setShare((state) => state - data.share);
        setList((state) => [...state, data]);
        setAdded(true);
        validator.setState((state) => {
            state.nominee_name.value = "";
            state.relationship.value = "";
            state.relationship_name.value = "";
            state.share.value = "";
            state.gender.value = "";
            state.date_of_birth.value = "";
            state.age.value = "";
            state.bank_ifsc.value = "";
            state.bank_name.value = "";
            state.bank_branch_name.value = "";
            state.bank_district_name.value = "";
            state.bank_location.value = "";
            state.bank_account_no.value = "";

            //bank_ifsc
            state.bank_ifsc.validate = "";
            state.bank_ifsc.required = false;
            state.bank_ifsc.error = null;
            //bank_name
            state.bank_name.validate = "";
            state.bank_name.required = false;
            state.bank_name.error = null;
            //bank_branch_name
            state.bank_branch_name.validate = "";
            state.bank_branch_name.required = false;
            state.bank_branch_name.error = null;
            //bank_district_name
            state.bank_district_name.validate = "";
            state.bank_district_name.required = false;
            state.bank_district_name.error = null;
            // bank_location
            state.bank_location.validate = "";
            state.bank_location.required = false;
            state.bank_location.error = null;
            //bank_account_no
            state.bank_account_no.validate = "";
            state.bank_account_no.error = null;
            state.bank_account_no.required = false;

            return { ...state };
        });
    };
    const handleRemove = (id, share_nominee) => {
        setList((state) => [...state.filter((item) => item.id !== id)]);
        if (share + parseFloat(share_nominee) === 100) {
            setAdded(false);
        }
        setShare((state) => state + parseFloat(share_nominee));
    };

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.bank_name.value = item.bank_name || "";
            state.bank_name.error = null;
            state.bank_branch_name.value = item.branch_name || "";
            state.bank_branch_name.error = null;
            state.bank_district_name.value = item.dist_code || "";
            state.bank_district_name.error = null;
            state.bank_location.value = item.branch_address || "";
            state.bank_location.error = null;
            return { ...state };
        });
    };

    useEffect(() => {
        if (data?.length) {
            setList(data.map((item) => ({ ...item, id: Math.random() })));
            let totalShare = Object.values(data).reduce((t, { share }) => t + share, 0);
            setShare(100 - totalShare);
        }
    }, [data?.length]);

    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "nominee-details", application_id], {
                exact: true,
            });
        };
    }, [application_id, query]);

    useEffect(() => {
        if (share !== 0) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [share]);

    return (
        <>
            {isFetching && <LoadingOverlay />}

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-2 mb-1">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="ds_reg_no">
                                    Nominee Name {form.nominee_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.nominee_name.error && "is-invalid"}`}
                                    type="text"
                                    id="nominee_name"
                                    name="nominee_name"
                                    required={form.nominee_name.required}
                                    value={form.nominee_name.value}
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">Please enter Nominee Name.</div>
                            </div>
                        </div>

                        <div className="col-md-2 mb-1">
                            <label htmlFor="relationship" className="form-control-label">
                                Relationship {form.relationship.required && <span className="text-danger">*</span>}
                            </label>
                            <RelationSelect
                                className={`form-select ${form.relationship.error && "is-invalid"}`}
                                type="text"
                                id="relationship"
                                name="relationship"
                                required={form.relationship.required}
                                value={form.relationship.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please select Relationship.</div>
                        </div>
                        {form.relationship.value === "Other" && (
                            <div className="col-md-2 mb-1">
                                <label htmlFor="relationship_name" className="form-control-label">
                                    Relationship Name {form.relationship_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.relationship_name.error && "is-invalid"}`}
                                    type="text"
                                    id="relationship_name"
                                    name="relationship_name"
                                    required={form.relationship_name.required}
                                    value={form.relationship_name.value}
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">Please enter Relationship Name.</div>
                            </div>
                        )}
                        <div className="col-md-2 mb-1">
                            <label htmlFor="share" className="form-control-label">
                                {`Share(Remaining ${share}%)`} {form.share.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                className={`form-control ${form.share.error && "is-invalid"}`}
                                type="number"
                                min={1}
                                max={100}
                                step="1"
                                id="share"
                                name="share"
                                required={form.share.required}
                                value={form.share.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">{form.share.error}</div>
                        </div>
                        <div className="col-md-2 mb-1">
                            <label htmlFor="gender" className="form-control-label">
                                Gender {form.gender.required && <span className="text-danger">*</span>}
                            </label>
                            <GenderSelect
                                className={`form-select ${form.gender.error && "is-invalid"}`}
                                type="text"
                                id="gender"
                                name="gender"
                                required={form.gender.required}
                                value={form.gender.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please select Gender.</div>
                        </div>
                        <div className="col-md-2 mb-1">
                            <label htmlFor="date_of_birth" className="form-control-label">
                                Date of Birth {form.date_of_birth.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                className={`form-control ${form.date_of_birth.error && "is-invalid"}`}
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                required={form.date_of_birth.required}
                                value={form.date_of_birth.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                autoComplete="off"
                                onBlur={(e) => handleChange({ name: "age", value: moment().diff(e.currentTarget.value, "years", false) })}
                            />
                            <div className="invalid-feedback">{form.date_of_birth.error}</div>
                        </div>
                        <div className="col-md-2 mb-1">
                            <label htmlFor="age" className="form-control-label">
                                Age {form.age.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                disabled
                                className={`form-control ${form.age.error && "is-invalid"}`}
                                type="number"
                                id="age"
                                name="age"
                                required={form.age.required}
                                value={form.age.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please enter your age.</div>
                        </div>

                        <div className="row">
                            <div className="col-md-2 mb-1">
                                <label htmlFor="bank_ifsc" className="form-control-label">
                                    Bank IFSC Code {form.bank_ifsc.required && <span className="text-danger">*</span>}
                                </label>
                                <AsyncSelect
                                    className={form.bank_ifsc.error && "is-invalid"}
                                    loadOptions={async (value) => {
                                        try {
                                            const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                            return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }}
                                    onItemSubmit={autoPopulate}
                                    id="bank_ifsc"
                                    value={form.bank_ifsc.value}
                                    autoComplete="off"
                                    onChange={(value) => handleChange({ name: "bank_ifsc", value: value })}
                                />
                                <div className="invalid-feedback">Please enter Bank Ifsc no.</div>
                            </div>

                            <div className="col-md-2 mb-1">
                                <label htmlFor="bank_name" className="form-control-label">
                                    Bank Name {form.bank_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.bank_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.bank_name.value}
                                    name="bank_name"
                                    id="bank_name"
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}

                                    // required={form.bank_name.required}
                                />
                                <div className="invalid-feedback">Please enter Bank Name.</div>
                            </div>
                            <div className="col-md-2 mb-1">
                                <label htmlFor="bank_branch_name" className="form-control-label">
                                    Bank Branch Name {form.bank_branch_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.bank_branch_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.bank_branch_name.value}
                                    name="bank_branch_name"
                                    id="bank_branch_name"
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}

                                    // required={form.bank_branch_name.required}
                                />
                                <div className="invalid-feedback">Please enter Bank Branch Name.</div>
                            </div>
                            <div className="col-md-2 mb-1">
                                <label htmlFor="bank_district_name" className="form-control-label">
                                    Bank District Name {form.bank_district_name.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.bank_district_name.error && "is-invalid"}`}
                                    label="Bank District Name"
                                    value={form.bank_district_name.value}
                                    autoComplete="off"
                                    onChange={(e) => handleChange({ name: "bank_district_name", value: e.currentTarget.value })}
                                    // required={form.bank_district_name.required}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>
                            <div className="col-md-2 mb-1">
                                <label htmlFor="bank_location" className="form-control-label">
                                    Bank Location {form.bank_location.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.bank_location.error && "is-invalid"}`}
                                    type="text"
                                    value={form.bank_location.value}
                                    name="bank_location"
                                    id="bank_location"
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}

                                    // required={form.bank_location.required}
                                />
                                <div className="invalid-feedback">Please enter Bank Location.</div>
                            </div>
                            <div className="col-md-2 mb-1">
                                <label htmlFor="bank_account_no" className="form-control-label">
                                    Bank Account No. {form.bank_account_no.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.bank_account_no.error && "is-invalid"}`}
                                    type="text"
                                    value={form.bank_account_no.value}
                                    name="bank_account_no"
                                    id="bank_account_no"
                                    onChange={(e) => handleChange(e.currentTarget)}

                                    // required={form.bank_account_no.required}
                                />
                                <div className="invalid-feedback">{form.bank_account_no.error}</div>
                            </div>
                        </div>
                    </div>
                </div>
             
                        <div className="card-footer">
                        { share === 100 && (
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button type="submit" className="btn btn-success btn-sm" disabled={isLoading} onClick={handleAdd}>
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                        </div>
                         )}
                    </div>
               
            

                {(added || share < 100) && (
                    <div className="card-body">
                        <div className="card-title">
                            <h6 className="mb-2 d-flex justify-content-md-center">Nominee Details Breakdown</h6>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Nominee Name</th>
                                        <th>Relationship</th>
                                        <th>Other Relationship</th>
                                        <th>Share</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                        <th>Age</th>
                                        <th>IFSC</th>
                                        <th>Bank Name</th>
                                        <th>Branch Name</th>
                                        <th>Account no.</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, index) => (
                                        <tr key={index}>
                                            <td>{1 + index}</td>
                                            <td>{item.nominee_name}</td>
                                            <td>{item.relationship}</td>
                                            <td>{item.relationship_name}</td>
                                            <td>{item.share}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.date_of_birth}</td>
                                            <td>{item.age}</td>
                                            <td>{item.bank_ifsc}</td>
                                            <td>{item.bank_name}</td>
                                            <td>{item.bank_branch_name}</td>
                                            <td>{item.bank_account_no}</td>
                                            <td className="text-center">
                                                <i className="fa fa-trash text-danger" onClick={() => handleRemove(item.id, item.share)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button className="btn btn-success btn-sm" type="submit" disabled={isLoading} onClick={handleSubmit}>
                            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-floppy-disk"></i>} Save Draft & Proceed
                        </button>
                    </div>
                </div>
                    </div>
                )}
            
            </div>

            {/* <div className="card mb-2">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-2">
                            <label htmlFor="nominee_name" className="form-label">
                                Nominee Name {form.nominee_name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                className={`form-control ${form.nominee_name.error && "is-invalid"}`}
                                type="text"
                                id="nominee_name"
                                name="nominee_name"
                                
                                required={form.nominee_name.required}
                                value={form.nominee_name.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please enter Nominee Name.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="relationship" className="form-label">
                                Relationship {form.relationship.required && <span className="text-danger">*</span>}
                            </label>
                            <RelationSelect
                                className={`form-select ${form.relationship.error && "is-invalid"}`}
                                type="text"
                                id="relationship"
                                name="relationship"
                                
                                required={form.relationship.required}
                                value={form.relationship.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please select Relationship.</div>
                        </div>
                        {form.relationship.value === "Other" && (
                            <div className="col-md-2">
                                <label htmlFor="relationship_name" className="form-label">
                                    Relationship Name {form.relationship_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.relationship_name.error && "is-invalid"}`}
                                    type="text"
                                    id="relationship_name"
                                    name="relationship_name"
                                    
                                    required={form.relationship_name.required}
                                    value={form.relationship_name.value}
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">Please enter Relationship Name.</div>
                            </div>
                        )}
                        <div className="col-md-2">
                            <label htmlFor="share" className="form-label">
                                {`Share(Remaining ${share}%)`} {form.share.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                className={`form-control ${form.share.error && "is-invalid"}`}
                                type="number"
                                min={1}
                                max={100}
                                step="1"
                                id="share"
                                name="share"
                                
                                required={form.share.required}
                                value={form.share.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">{form.share.error}</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="gender" className="form-label">
                                Gender {form.gender.required && <span className="text-danger">*</span>}
                            </label>
                            <GenderSelect
                                className={`form-select ${form.gender.error && "is-invalid"}`}
                                type="text"
                                id="gender"
                                name="gender"
                                placeholder="Gender"
                                required={form.gender.required}
                                value={form.gender.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please select Gender.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="date_of_birth" className="form-label">
                                Date of Birth {form.date_of_birth.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                className={`form-control ${form.date_of_birth.error && "is-invalid"}`}
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                placeholder="DOB"
                                required={form.date_of_birth.required}
                                value={form.date_of_birth.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                autoComplete="off"
                                onBlur={(e) => handleChange({ name: "age", value: moment().diff(e.currentTarget.value, "years", false) })}
                            />
                            <div className="invalid-feedback">{form.date_of_birth.error}</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="age" className="form-label">
                                Age {form.age.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                disabled
                                className={`form-control ${form.age.error && "is-invalid"}`}
                                type="number"
                                id="age"
                                name="age"
                                placeholder="Enter you age"
                                required={form.age.required}
                                value={form.age.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">Please enter your age.</div>
                        </div>

                        <div className="col-md-2">
                            <label htmlFor="bank_ifsc" className="form-label">
                                Bank IFSC Code {form.bank_ifsc.required && <span className="text-danger">*</span>}
                            </label>
                            <AsyncSelect
                                className={form.bank_ifsc.error && "is-invalid"}
                                loadOptions={async (value) => {
                                    try {
                                        const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                        return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                    } catch (error) {
                                        return [];
                                    }
                                }}
                                onItemSubmit={autoPopulate}
                                id="bank_ifsc"
                                value={form.bank_ifsc.value}
                                autoComplete="off"
                                onChange={(value) => handleChange({ name: "bank_ifsc", value: value })}
                                placeholder="Bank IFSC"
                            />
                            <div className="invalid-feedback">Please enter Bank Ifsc no.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_name" className="form-label">
                                Bank Name {form.bank_name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Name "
                                className={`form-control ${form.bank_name.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_name.value}
                                name="bank_name"
                                id="bank_name"
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}

                                // required={form.bank_name.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Name.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_branch_name" className="form-label">
                                Bank Branch Name {form.bank_branch_name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Branch Name"
                                className={`form-control ${form.bank_branch_name.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_branch_name.value}
                                name="bank_branch_name"
                                id="bank_branch_name"
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}

                                // required={form.bank_branch_name.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Branch Name.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_district_name" className="form-label">
                                Bank District Name {form.bank_district_name.required && <span className="text-danger">*</span>}
                            </label>
                            <DistrictSelect
                                className={`form-select ${form.bank_district_name.error && "is-invalid"}`}
                                placeholder="Bank District Name"
                                label="Bank District Name"
                                value={form.bank_district_name.value}
                                autoComplete="off"
                                onChange={(e) => handleChange({ name: "bank_district_name", value: e.currentTarget.value })}
                                // required={form.bank_district_name.required}
                            />
                            <div className="invalid-feedback">Please select district</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_location" className="form-label">
                                Bank Location {form.bank_location.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Location"
                                className={`form-control ${form.bank_location.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_location.value}
                                name="bank_location"
                                id="bank_location"
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}

                                // required={form.bank_location.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Location.</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_account_no" className="form-label">
                                Bank Account No. {form.bank_account_no.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                placeholder="Bank Account No."
                                className={`form-control ${form.bank_account_no.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_account_no.value}
                                name="bank_account_no"
                                id="bank_account_no"
                                onChange={(e) => handleChange(e.currentTarget)}

                                // required={form.bank_account_no.required}
                            />
                            <div className="invalid-feedback">{form.bank_account_no.error}</div>
                        </div>
                    </div>
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button type="submit" className="btn btn-success btn-sm mt-3" disabled={isLoading} onClick={handleAdd}>
                            <i className="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>

            {(added || share < 100) && (
                <div className="card" style={{ position: "relative" }}>
                    <div className="card-body">
                        <div className="card-title">
                            <h5>Nominee Details Breakdown </h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Nominee Name</th>
                                        <th>Relationship</th>
                                        <th>Other Relationship</th>
                                        <th>Share</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                        <th>Age</th>
                                        <th>IFSC</th>
                                        <th>Bank Name</th>
                                        <th>Branch Name</th>
                                        <th>Account no.</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, index) => (
                                        <tr key={index}>
                                            <td>{1 + index}</td>
                                            <td>{item.nominee_name}</td>
                                            <td>{item.relationship}</td>
                                            <td>{item.relationship_name}</td>
                                            <td>{item.share}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.date_of_birth}</td>
                                            <td>{item.age}</td>
                                            <td>{item.bank_ifsc}</td>
                                            <td>{item.bank_name}</td>
                                            <td>{item.bank_branch_name}</td>
                                            <td>{item.bank_account_no}</td>
                                            <td className="text-center">
                                                <i className="fa fa-trash text-danger" onClick={() => handleRemove(item.id, item.share)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success" type="submit" disabled={isLoading} onClick={handleSubmit}>
                                {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-floppy-disk"></i>} Save Draft & Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </>
    );
};

export default NomineeDetailsForm;
