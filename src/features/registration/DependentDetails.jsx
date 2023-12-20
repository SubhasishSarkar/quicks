import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import GenderSelect from "../../components/select/GenderSelect";
import RelationSelect from "../../components/select/RelationSelect";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";
import { disableQuery } from "../../data";
import LoadingOverlay from "../../components/LoadingOverlay";
const DependentDetails = ({ nextStep, prevStep }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const { data, isFetching } = useQuery(["caf-registration-preview", "dependent-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=dependent-details`), {
        ...disableQuery,
        enabled: application_id ? true : false,
    });
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const [list, setList] = useState([]);
    const [added, setAdded] = useState(false);

    const [form, validator] = useValidate({
        name: { value: "", validate: "onlyAlphabets|required" },
        relationship: { value: "", validate: "required" },
        relationship_name: { value: "", validate: "onlyAlphabets" },
        gender: { value: "", validate: "required" },
        date_of_birth: { value: "", validate: "required" },
        age: { value: "", validate: "required" },
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
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const handleAdd = () => {
        if (!validator.validate()) return;
        const data = validator.generalize();
        data["id"] = Math.random();
        setList((state) => [...state, data]);
        setAdded(true);
        validator.setState((state) => {
            state.name.value = "";
            state.relationship.value = "";
            state.relationship_name.value = "";
            state.gender.value = "";
            state.date_of_birth.value = "";
            state.age.value = "";
            return { ...state };
        });
    };

    const handleRemove = (id) => {
        setList((state) => [...state.filter((item) => item.id !== id)]);
    };

    useEffect(() => {
        if (list.length > 0) {
            setAdded(true);
        } else {
            setAdded(false);
        }
    });

    useEffect(() => {
        if (data?.length) {
            setList(data.map((item) => ({ ...item, id: Math.random() })));
        }
    }, [data?.length]);

    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "nominee-details", application_id], {
                exact: true,
            });
        };
    }, [application_id, query]);

    const handleSubmit = () => {
        if (application_id) {
            //const dependent = Object.assign({}, list);
            //const finalList = dependent[0];
            mutate(
                {
                    url: "/caf-registration?type=dependent-details&id=" + application_id,
                    body: { dependent: list },
                    //body: finalList,
                },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        nextStep(5);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };

    return (
        <>
            {isFetching && <LoadingOverlay />}
            <div className="card">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-2">
                            <label htmlFor="bank_name" className="form-label">
                                Dependent Name {form.name.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                className={`form-control ${form.name.error && "is-invalid"}`}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Dependent Name"
                                required={form.name.required}
                                value={form.name.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">{form.name.error}</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_name" className="form-label">
                                Relationship {form.relationship.required && <span className="text-danger">*</span>}
                            </label>
                            <RelationSelect
                                className={`form-select ${form.relationship.error && "is-invalid"}`}
                                type="text"
                                id="relationship"
                                name="relationship"
                                placeholder="Relationship"
                                required={form.relationship.required}
                                value={form.relationship.value}
                                autoComplete="off"
                                onChange={(e) => handleChange(e.currentTarget)}
                            />
                            <div className="invalid-feedback">{form.relationship.error}</div>
                        </div>
                        {form.relationship.value === "Other" && (
                            <div className="col-md-2">
                                <label htmlFor="bank_name" className="form-label">
                                    Relationship Name {form.relationship_name.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    className={`form-control ${form.relationship_name.error && "is-invalid"}`}
                                    type="text"
                                    id="relationship_name"
                                    name="relationship_name"
                                    placeholder="Relationship Name"
                                    required={form.relationship_name.required}
                                    value={form.relationship_name.value}
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.relationship_name.error}</div>
                            </div>
                        )}
                        <div className="col-md-2">
                            <label htmlFor="bank_name" className="form-label">
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
                            <div className="invalid-feedback">{form.gender.error}</div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="bank_name" className="form-label">
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
                            <label htmlFor="bank_name" className="form-label">
                                Nominee Age {form.age.required && <span className="text-danger">*</span>}
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
                            <div className="invalid-feedback">{form.age.error}</div>
                        </div>
                        <div className="col-md-2">
                            <div className="d-grid mt-2 d-md-flex justify-content-md-start">
                                <button type="submit" className="btn btn-success btn-sm mt-3" disabled={isLoading} onClick={handleAdd}>
                                    <i className="fa-solid fa-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {added && (
                <div className="card mt-2">
                    <div className="card-body">
                        <div className="card-title">
                            <h5>Dependent Details Breakdown</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Nominee Name</th>
                                        <th>Relationship</th>
                                        <th>Other Relationship</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                        <th>Age</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, index) => (
                                        <tr key={index}>
                                            <td>{1 + index}</td>
                                            <td>{item.name}</td>
                                            <td>{item.relationship}</td>
                                            <td>{item.relationship_name}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.date_of_birth}</td>
                                            <td>{item.age}</td>
                                            <td className="text-center">
                                                <i className="fa fa-trash text-danger" onClick={() => handleRemove(item.id)} />
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
            )}
        </>
    );
};

export default DependentDetails;
