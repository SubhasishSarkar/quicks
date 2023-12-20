import React from "react";
import { useValidate } from "../../hooks";
import { CheckBox } from "../../components/form/checkBox";
import { useMutation } from "@tanstack/react-query";
import { Humanize, fetcher } from "../../utils";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/list/LoadingSpinner";

const ChangedOptionSelect = ({ crData, onSuccess, isFetching }) => {
    const { mutate, isLoading } = useMutation((searchQuery) => fetcher("/changed-request-select-option?" + searchQuery));

    const [form, validator] = useValidate({
        crOption: { value: [], validate: "required" },
        application_id: { value: crData?.application_id, validate: "" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        mutate(urlSearchParams.toString(), {
            onSuccess(data, variables, context) {
                onSuccess(data);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const benViewDetails = (appId, isActive) => {
        const url = `/beneficiary-details/${appId}/${isActive === 1 ? "bmssy" : "ssy"}`;
        window.open(url, "_blank", "noreferrer");
    };

    const url = "https://bmssy.wblabour.gov.in/" + crData?.benData?.photo;

    return (
        <>
            <div className="card datatable-box mb-4">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className="card-title mb-4">
                                    <h6>
                                        <i className="fa-solid fa-user"></i> Check Beneficiary Details
                                    </h6>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-md-4 text-center mb-2">{isFetching ? <LoadingSpinner /> : <img src={url} alt="" width="70% " loading="eager" className="cr_ben_img" />}</div>
                                        <div className="col-md-6">
                                            <p className="text-dark lh-1">Name : {crData?.benData?.name}</p>
                                            <p className="text-dark lh-1">Worker : {crData?.benData?.worker === "ow" ? "Other Worker" : crData?.benData?.worker === "cw" ? "Construction Worker" : "Transport Worker"}</p>
                                            <p className="text-dark lh-1">Registration Date : {crData?.benData?.regDate}</p>
                                            <p className="text-dark lh-1">Aadhaar Number : {crData?.benData?.aadhar}</p>
                                            <button className="btn btn-sm btn-primary" type="button" onClick={() => benViewDetails(crData?.benData?.encAppId, crData?.benData?.isActive)}>
                                                View All Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card-title mb-4">
                                    <h6>
                                        <i className="fa-solid fa-circle-check"></i> Please select which ones you wants to change
                                    </h6>
                                    {!crData?.cr_fields?.includes("name_and_DOB") && (
                                        <p className="text-wrap fw-normal lh-1  font-monospace" style={{ color: "#ff0000c4" }}>
                                            <i className="fa-solid fa-circle-exclamation"></i> Name and dob was already applied
                                        </p>
                                    )}
                                </div>

                                <div className="col-12">
                                    <CheckBox.Group
                                        value={form.crOption.value}
                                        onChange={(value) => {
                                            handleChange({ name: "crOption", value: [...value] });
                                        }}
                                        className="cr_option_group mb-2"
                                    >
                                        {crData?.cr_fields.map((item, index, array) => {
                                            return (
                                                <div key={index} className="form-check">
                                                    <div className="cr_option_check">
                                                        <CheckBox className={`form-check-input  ${form.crOption.error && "is-invalid"}`} role="switch" value={item} id={item} required={form.crOption.required} />
                                                        <label className="form-check-label" htmlFor={item}>
                                                            {index + 1 + ". " + Humanize(item)}
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CheckBox.Group>

                                    {form.crOption.error && (
                                        <div className="option_no_select_err">
                                            <i className="fa-solid fa-triangle-exclamation"></i> Please select which ones you want to change.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="d-grid d-md-flex justify-content-md-end">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Go Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChangedOptionSelect;
