import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ErrorAlert from "../../components/list/ErrorAlert";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import PanAadhaar from "./PanAadhaar";

const SLOProfilePage = () => {
    const { data, isFetching, error } = useQuery(["get-profile-page-data"], () => fetcher(`/get-profile-page-data`));
    const [form, validator] = useValidate(
        {
            full_name: { value: "", validate: "required" },
            arn: { value: "", validate: "required" },
            mobile: { value: "", validate: "required|number|length:10" },
            mail: { value: "", validate: "required|email" },
            post: { value: "", validate: "required" },
            pan: { value: "", validate: "required" },
            pan_aadhaar_linked_doc: { value: "", validate: "required" },
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

    const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.user);
    useEffect(() => {
        dispatch(setPageAddress({ title: "Profile", url: "" }));
    }, []);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {!isFetching && data && (
                <div className="card datatable-box mb-4">
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-9">
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
                                                    disabled={data?.full_name ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.full_name.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="arn">
                                                    ARN {form.arn.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="arn"
                                                    name="arn"
                                                    className={`form-control ${form.arn.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.arn.value}
                                                    required={form.arn.required}
                                                    disabled={data?.arn ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.arn.error}
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
                                                <label className="form-control-label" htmlFor="post">
                                                    Post {form.post.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="post"
                                                    name="post"
                                                    className={`form-control ${form.post.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.post.value}
                                                    required={form.post.required}
                                                    disabled={data?.post ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.post.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="pan">
                                                    PAN Number {form.pan.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="pan"
                                                    name="pan"
                                                    className={`form-control ${form.pan.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.pan.value}
                                                    required={form.pan.required}
                                                    disabled={data?.pan ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.pan.error}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-control-label" htmlFor="post">
                                        Pan aadhaar linked document {form.pan_aadhaar_linked_doc.required && <span className="text-danger">*</span>}
                                    </label>
                                    <PanAadhaar data={{ pan_aadhaar_linked_doc: form.pan_aadhaar_linked_doc.value }} handleChange={handleChange} />
                                    {form.pan_aadhaar_linked_doc.error && (
                                        <div
                                            style={{
                                                width: "100%",
                                                marginZTop: "0.25rem",
                                                fontSize: "0.875em",
                                                color: "#dc3545",
                                            }}
                                        >
                                            Upload the required document
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="col-md-12">
                                <div className="d-grid  d-md-flex justify-content-md-end">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default SLOProfilePage;
