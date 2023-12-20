import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { updater } from "../../../utils";

const RegistrationNumberUpdate = ({ encId, handleClose, ssin, registrationNo }) => {
    const [form, validator] = useValidate({
        ssin_no: { value: ssin, validate: "" },
        registration_no: { value: registrationNo, validate: "" },
        updated_registration_number: { value: "", validate: "special_character|number|length:10|required" },
        application_id: { value: encId, validate: "" },
    });
    const query = useQueryClient();

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        if (encId) {
            mutate(
                {
                    url: `/submit-correct-registration-number?id=${encId}`,
                    body: data,
                },
                {
                    onSuccess(data, variables, context) {
                        toast.success("Registration number successfully rectify.");
                        query.invalidateQueries("get-erroneous-registration-number");
                        query.invalidateQueries("get-updated-registration-number");
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
                        <label htmlFor="ssin_no" className="form-label">
                            SSIN
                        </label>
                        <input
                            className={`form-control`}
                            type="text"
                            value={ssin}
                            disabled
                            // onChange={(e) => handleChange(e.currentTarget)}
                            name="ssin_no"
                            id="ssin_no"
                        />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="old_registration_number" className="form-label">
                            Existing Registration Number
                        </label>
                        <input
                            className={`form-control`}
                            type="text"
                            // value={data?.single_registration_data?.registration_no}
                            value={registrationNo}
                            disabled
                            // onChange={(e) => handleChange(e.currentTarget)}
                            name="old_registration_number"
                            id="old_registration_number"
                        />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="updated_registration_number" className="form-label">
                            Correct Registration Number
                        </label>
                        <input
                            placeholder="Correct Registration Number"
                            className={`form-control ${form.updated_registration_number.error && "is-invalid"}`}
                            type="text"
                            value={form.updated_registration_number.value}
                            name="updated_registration_number"
                            id="updated_registration_number"
                            onChange={(e) => handleChange(e.currentTarget)}
                        />
                        <div className="invalid-feedback">{form.updated_registration_number.error}</div>
                    </div>
                </div>
                <button type="submit" className="btn btn-success btn-sm mt-3" disabled={isLoading}>
                    {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update
                </button>
            </form>
        </>
    );
};

export default RegistrationNumberUpdate;
