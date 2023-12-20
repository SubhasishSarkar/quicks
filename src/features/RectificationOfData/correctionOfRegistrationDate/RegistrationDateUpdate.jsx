import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { updater } from "../../../utils";

const RegistrationDateUpdate = ({ handleClose, encId, ssin, registrationDate }) => {
    const query = useQueryClient();
    const [form, validator] = useValidate({
        updated_registration_date: { value: "", validate: "required" },
        ssin_no: { value: ssin, validate: "" },
        registration_date: { value: registrationDate, validate: "" },
        application_id: { value: encId, validate: "" },
    });
    useEffect(() => {
        validator.setState((state) => {
            if (encId) {
                state.updated_registration_date.value = "";
            }
            return { ...state };
        });
    }, [encId]);

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "updated_registration_date":
                    setState((state) => {
                        if (value) {
                            var date = moment(value);
                            if (date.isValid() && date > moment(new Date("2017-04-01"))) {
                                state.updated_registration_date.error = "Please enter less then or equal to 31-03-2017";
                            } else if (date < moment(new Date("2000-12-30"))) {
                                state.updated_registration_date.error = "Please enter grater then or equal to 01-01-2001";
                            }
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();

        if (encId) {
            mutate(
                {
                    url: `/wrong-reg-date-updation`,
                    body: data,
                },
                {
                    onSuccess(data, variables, context) {
                        toast.success("Registration date successfully rectified.");
                        query.invalidateQueries("wrong-registration-date-list");
                        query.invalidateQueries("update-registration-date-list");
                        handleClose(true);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                    },
                }
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="row">
                    <div className="col-md-12">
                        <label className="form-label">Existing Registration Date</label>
                        <input className={`form-control`} type="text" value={registrationDate} disabled />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="updated_registration_date" className="form-label">
                            Correct Registration Date
                        </label>
                        <input
                            placeholder="Enter Correct Registration Date"
                            className={`form-control ${form.updated_registration_date.error && "is-invalid"}`}
                            type="date"
                            value={form.updated_registration_date.value}
                            name="updated_registration_date"
                            id="updated_registration_date"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">{form.updated_registration_date.error}</div>
                    </div>
                </div>
                <button type="submit" className="btn btn-success btn-sm mt-3" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Update"}
                </button>
            </form>
        </>
    );
};

export default RegistrationDateUpdate;
