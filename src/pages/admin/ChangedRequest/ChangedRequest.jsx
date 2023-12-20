import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChangedOptionSelect from "../../../features/changedRequest/ChangedOptionSelect";
import { useValidate } from "../../../hooks";
import { fetcher } from "../../../utils";
import ChangedRequestEntry from "../../../features/changedRequest/ChangedRequestEntry";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";

const ChangedRequest = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const [next, setNext] = useState(false);
    const [checkedValue, setCheckedValue] = useState();

    let [searchParams] = useSearchParams();
    const applicationIdFromVerhoff = searchParams.get("applicationId");
    const detailsIdFromVerhoff = searchParams.get("detailsId");
    const crFieldsFromVerhoff = searchParams.get("cr_fields");
    const verhoffDataJson = { appId: applicationIdFromVerhoff, detailId: detailsIdFromVerhoff, crFields: crFieldsFromVerhoff };

    const { data, isFetching, error } = useQuery(["changed-request-search-ssin", searchQuery], () => fetcher("/changed-request-search-ssin?" + searchQuery), { retry: false, refetchOnWindowFocus: false, enabled: searchQuery ? true : false });

    const [form, validator] = useValidate({
        ssin: { value: "", validate: "required|number|length:12" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchQuery(urlSearchParams.toString());
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Changed Request", url: "" }));
    }, []);

    const clearParams = () => {
        validator.reset();
        form.ssin.value = "";
        setSearchQuery();
    };

    return (
        <>
            {applicationIdFromVerhoff ? (
                <ChangedRequestEntry arrData={checkedValue} verhoffData={verhoffDataJson} />
            ) : next ? (
                <ChangedRequestEntry arrData={checkedValue} verhoffData="" />
            ) : (
                <>
                    <div className="card datatable-box mb-4">
                        <form noValidate onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-control-label" htmlFor="ssin">
                                            SSIN {form.ssin.required && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            id="ssin"
                                            name="ssin"
                                            className={`form-control ${form.ssin.error && "is-invalid"}`}
                                            onChange={(e) => {
                                                handleChange(e.currentTarget);
                                            }}
                                            value={form.ssin.value}
                                            required={form.ssin.required}
                                        />
                                        <div id="Feedback" className="invalid-feedback">
                                            {form.ssin.error}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-grid d-md-flex justify-content-md-end ">
                                    <button className="btn btn-success btn-sm mb-2" type="submit" disabled={isFetching || data?.cr_fields}>
                                        {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Search
                                    </button>
                                    {(data || error) && (
                                        <button className="btn btn-warning btn-sm mb-2" type="button" style={{ marginLeft: "4px" }} onClick={() => clearParams()}>
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <ChangedOptionSelect
                            crData={data}
                            onSuccess={(data) => {
                                setCheckedValue(data);
                                setNext(true);
                            }}
                            isFetching={isFetching}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default ChangedRequest;
