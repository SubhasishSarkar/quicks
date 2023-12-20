import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { useSelector } from "react-redux";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import GPWardSelect from "../../../components/select/GPWardSelect";
import { updater } from "../../../utils";

const AddressUpdate = ({ handleClose, encId, updateWant, forNoLoading }) => {
    const user = useSelector((state) => state.user.user);

    const [form, validator] = useValidate({
        block: { value: "", validate: "required" },
        gpWard: { value: "", validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validator.validate()) return toast.error("Please enter a valid number");
        const data = validator.generalize();
        if (encId) {
            mutate(
                {
                    url: `/update_erronous_address_by_inspector`,
                    body: { block_code: data.block, gp_code: data.gpWard, application_id: encId },
                },
                {
                    onSuccess(data, variables, context) {
                        handleClose(true);
                        toast.success(data.msg);
                    },
                    onError(error, variables, context) {
                        toast.error(error.msg);
                    },
                }
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div>
                    <label className="form-control-label" htmlFor="bankIfscCode">
                        Block {form.block.required && <span className="text-danger">*</span>}
                    </label>
                    <BMCNameSelect
                        className={`form-select`}
                        id="block"
                        name="block"
                        required={form.block.required}
                        value={form.block.value}
                        onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                        subDivision={user?.subDivision}
                    />
                    <div className="invalid-feedback">{form.block.error}</div>
                </div>
                <div>
                    <label htmlFor="gpWard" className="form-label">
                        GP / Ward {form.gpWard.required && <span className="text-danger">*</span>}
                    </label>
                    <GPWardSelect
                        className={`form-select ${form.gpWard.error && "is-invalid"}`}
                        id="gpWard"
                        name="gpWard"
                        required={form.gpWard.required}
                        value={form.gpWard.value}
                        onChange={(e) => handleChange({ name: "gpWard", value: e.currentTarget.value })}
                        block={form.block.value}
                    />
                    <div className="invalid-feedback">{form.gpWard.error}</div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-success btn-sm mt-3" disabled={isLoading}>
                            {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button type="button" className="btn btn-primary btn-sm mt-3" disabled={forNoLoading} onClick={() => updateWant("No")}>
                            {forNoLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Not under my RLO
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddressUpdate;
