import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../utils";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import ProfilePicture from "./ProfilePicture";

const DlcProfilePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Profile Details", url: "" }));
    }, []);

    const { data, isFetching, error } = useQuery(["get-profile-page-data"], () => fetcher(`/get-profile-page-data`));

    const [form, validator] = useValidate(
        {
            full_name: { value: "", validate: "required" },
            employeeId: { value: "", validate: "required" },
            mobile: { value: "", validate: "required|number|length:10" },
            mail: { value: "", validate: "required|email" },
            designation: { value: "", validate: "required" },
            location: { value: "", validate: "required" },
            profile_photo: { value: "", validate: "" },
        },
        data,
        true
    );
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const query = useQueryClient();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/update-user-profile`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data?.msg);
                    query.invalidateQueries("get-profile-page-data");
                },
                onError(error, variables, context) {
                    toast.error(data?.error);
                },
            }
        );
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="row">
                    <div className="col-md-2 mb-2">
                        <ProfilePicture data={data} />
                    </div>

                    <div className="col-md-10 mb-2">
                        <div className="card datatable-box">
                            <form noValidate onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="full_name">
                                                    Full Name {form.full_name.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="full_name"
                                                    name="full_name"
                                                    className={`form-control ${form.full_name.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.full_name.value}
                                                    required={form.full_name.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.full_name.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="employeeId">
                                                    Employee Id {form.employeeId.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="employeeId"
                                                    name="employeeId"
                                                    className={`form-control ${form.employeeId.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.employeeId.value}
                                                    required={form.employeeId.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.employeeId.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="mobile">
                                                    Mobile {form.mobile.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="mobile"
                                                    name="mobile"
                                                    className={`form-control ${form.mobile.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.mobile.value}
                                                    required={form.mobile.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.mobile.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="mail">
                                                    Email {form.mail.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="mail"
                                                    name="mail"
                                                    className={`form-control ${form.mail.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.mail.value}
                                                    required={form.mail.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.mail.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="designation">
                                                    Designation {form.designation.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="designation"
                                                    name="designation"
                                                    className={`form-control ${form.designation.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.designation.value}
                                                    required={form.designation.required}
                                                    disabled={data?.designation ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.designation.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="location">
                                                    Location {form.location.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    name="location"
                                                    className={`form-control ${form.location.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.location.value}
                                                    required={form.location.required}
                                                    disabled={data?.location ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.location.error}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="d-md-flex justify-content-md-end">
                                        <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                            {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DlcProfilePage;
