import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import OfflineClaimEntryForm from "../../../features/offlineClaim/OfflineClaimEntryForm";
import { useValidate } from "../../../hooks";
import { fetcher } from "../../../utils";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import BoardSelect from "../../../components/select/BoardSelect";

const OfflineClaimEntry = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching, error } = useQuery(["offline-claim-search-ssin", searchQuery], () => fetcher("/offline-claim-search-ssin?" + searchQuery), { retry: false, refetchOnWindowFocus: false, enabled: searchQuery ? true : false });
    const [form, validator] = useValidate({
        board_name: { value: "", validate: "required" },
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
        dispatch(setPageAddress({ title: "Offline Claim Entry", url: "" }));
    }, []);
    return (
        <>
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="board_name">
                                        Select Board Name {form.board_name.required && <span className="text-danger">*</span>}
                                    </label>
                                    <BoardSelect
                                        className={`form-select ${form.board_name.error && "is-invalid"}`}
                                        id="board_name"
                                        name="board_name"
                                        value={form.board_name.value}
                                        onChange={(e) => {
                                            handleChange({ name: "board_name", value: e.currentTarget.value });
                                        }}
                                    />
                                    {/* <select
                                        name="board_name"
                                        id="board_name"
                                        className={`form-select ${form.board_name.error && "is-invalid"}`}
                                        value={form.board_name.value}
                                        required={form.board_name.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    >
                                        <option value="">-Select-</option>
                                        <option value="WBUSWWB">WBUSWWB</option>
                                        <option value="BOCW">BOCW</option>
                                        <option value="WBTWSSS">WBTWSSS</option>
                                    </select> */}
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.board_name.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="ssin">
                                        SSIN {form.ssin.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="ssin"
                                        name="ssin"
                                        className={`form-control ${form.ssin.error && "is-invalid"}`}
                                        value={form.ssin.value}
                                        required={form.ssin.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.ssin.error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            {!data && (
                                <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                    {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Go Next
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            {error && <ErrorAlert error={error} />}
            {data && <OfflineClaimEntryForm data={data} boardName={form.board_name.value} />}
        </>
    );
};

export default OfflineClaimEntry;
