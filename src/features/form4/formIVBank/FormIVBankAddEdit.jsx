import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetcher, updater } from "../../../utils";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { useValidate } from "../../../hooks";
import AsyncSelect from "../../../components/select/AsyncSelect";
import { toast } from "react-toastify";

const FormIVBankAddEdit = ({ id, modalTitle, setModalShow }) => {
    const { error, data, isFetching } = useQuery(["get-formIV-bank-data-by-id", id], () => fetcher(`/get-formIV-bank-data-by-id?id=${id}`), { enabled: id ? true : false });

    const [form, validator] = useValidate(
        {
            ifsc: { value: "", validate: "required" },
            name: { value: "", validate: "required" },
            branch: { value: "", validate: "required" },
            location: { value: "", validate: "required" },
            account_no: { value: "", validate: "required|number" },
            id: { value: id ? id : "", validate: "" },
        },
        data,
        true
    );

    useEffect(() => {
        if (modalTitle === "Add New Bank") {
            validator.setState((state) => {
                form.ifsc.value = "";
                form.name.value = "";
                form.branch.value = "";
                form.location.value = "";
                form.account_no.value = "";
                return { ...state };
            });
        }
    }, [id, modalTitle]);

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const query = useQueryClient();
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/add-edit-formIV-bank`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.message);
                    query.invalidateQueries("form-IV-bank-list");
                    setModalShow(false);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.name.value = item.bank_name || "";
            state.branch.value = item.branch_name || "";
            state.location.value = item.branch_address || "";

            state.name.error = form.name.value ? null : true;
            state.branch.error = form.branch.value ? null : true;
            state.location.error = form.location.value ? null : true;

            return { ...state };
        });
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}

            <div className="card datatable-box mb-4">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="ifsc">
                                        IFSC {form.ifsc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <AsyncSelect
                                        className={form.ifsc.error && "is-invalid"}
                                        loadOptions={async (value) => {
                                            try {
                                                const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                                return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                            } catch (error) {
                                                return [];
                                            }
                                        }}
                                        onItemSubmit={autoPopulate}
                                        id="ifsc"
                                        value={form.ifsc.value}
                                        onChange={(value) => handleChange({ name: "ifsc", value: value })}
                                    />

                                    <div id="Feedback" className="invalid-feedback">
                                        {form.ifsc.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="name">
                                        Name {form.name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`form-control ${form.name.error && "is-invalid"}`}
                                        value={form.name.value}
                                        required={form.name.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.name.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="branch">
                                        Branch {form.branch.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="branch"
                                        name="branch"
                                        className={`form-control ${form.branch.error && "is-invalid"}`}
                                        value={form.branch.value}
                                        required={form.branch.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.branch.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="location">
                                        Location {form.location.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        className={`form-control ${form.location.error && "is-invalid"}`}
                                        value={form.location.value}
                                        required={form.location.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.location.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="account_no">
                                        Account No. {form.account_no.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="account_no"
                                        name="account_no"
                                        className={`form-control ${form.account_no.error && "is-invalid"}`}
                                        value={form.account_no.value}
                                        required={form.account_no.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.account_no.error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormIVBankAddEdit;
