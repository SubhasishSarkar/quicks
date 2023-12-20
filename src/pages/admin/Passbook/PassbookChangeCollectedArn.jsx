import React, { useEffect, useState } from "react";
import { useValidate } from "../../../hooks";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../../../utils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import NoDataFound from "../../../components/list/NoDataFound";
import LoadingSpinner from "../../../components/list/LoadingSpinner";

const PassbookChangeCollectedArn = () => {
    const [ssinDetails, setSsinDetails] = useState("");

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Modification of Tagging of Beneficiary with SLO/CA", url: "" }));
    }, []);

    const [form, validator] = useValidate({
        ssin_no: { value: "", validate: "required|number|length:12" },
        new_collected_arn: { value: "", validate: "" },
        application_id: { value: "", validate: "" },
    });
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleChange = (e) => {
        validator.validOnChange(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();

        mutate(
            { url: `/ppu-change-collected-arn`, body: { data } },
            {
                onSuccess(data) {
                    setSsinDetails(data);
                    validator.setState((state) => {
                        state.application_id.value = data.data[0].application_id;
                        state.application_id.error = null;
                        return { ...state };
                    });
                },
                onError(error) {
                    toast.error(error.message);
                    setSsinDetails("");
                    validator.setError(error.message);
                },
            }
        );
    };
    const { mutate: mutateTwo, isLoading: isLoadingNew } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleUpdate = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();

        mutateTwo(
            { url: `/ppu-change-collected-arn-post`, body: { data } },
            {
                onSuccess(data) {
                    toast.success("BENEFICIARY SUCCESSFULLY TAGGED WITH ARN");
                    setSsinDetails("");
                    validator.reset();
                },
                onError(error) {
                    toast.error(error.message);
                    validator.setError(error.message);
                },
            }
        );
    };

    const handleReset = () => {
        setSsinDetails("");
        validator.reset();
    };

    return (
        <>
            <div className="row">
                <div className="col-md-4">
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-body">
                                <div className="col-md-10">
                                    <label className="form-label" htmlFor="ssin_no">
                                        SSIN <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${form.ssin_no.error && "is-invalid"}`}
                                        name="ssin_no"
                                        id="ssin_no"
                                        value={form.ssin_no.value}
                                        required={form.ssin_no.required}
                                        onChange={(e) => handleChange(e.currentTarget)}
                                    />

                                    <div className="invalid-feedback">{form.ssin_no.error}</div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex gap-2">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Search"}
                                    </button>
                                    <button className="btn btn-warning btn-sm" type="button" onClick={handleReset}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {isLoading && <LoadingSpinner />}
                {ssinDetails && (
                    <div className="col-md-8">
                        <div className="card">
                            {ssinDetails && ssinDetails.data.length === 0 ? (
                                <NoDataFound />
                            ) : (
                                <>
                                    <form noValidate onSubmit={handleUpdate}>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>SL No</th>
                                                            <th>SSIN</th>
                                                            <th>Name</th>
                                                            <th>Approved Date</th>
                                                            <th>Presently Tagged (ARN)</th>
                                                            <th>ARN to be tagged with</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr key="1">
                                                            <td>1</td>
                                                            <td>{ssinDetails.ssin_no}</td>
                                                            <td>{ssinDetails.data[0].name}</td>
                                                            <td>{ssinDetails.approval_date}</td>
                                                            <td>{ssinDetails.data[0].pf_collected_by}</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className={`form-control ${form.new_collected_arn.error && "is-invalid"}`}
                                                                    name="new_collected_arn"
                                                                    id="new_collected_arn"
                                                                    value={form.new_collected_arn.value}
                                                                    required={form.new_collected_arn.required}
                                                                    onChange={(e) => handleChange(e.currentTarget)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="btn-group me-2 mb-2">
                                                <button className="btn btn-success btn-sm" type="submit" disabled={isLoadingNew}>
                                                    {isLoadingNew ? "Loading..." : "Update"}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PassbookChangeCollectedArn;
