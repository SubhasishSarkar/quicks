import React, { useEffect, useState } from "react";
import { useValidate } from "../../../hooks";
import { blankOpenFile } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

function AccountStatementOld() {
    const dispatch = useDispatch();
    //const [searchParams, setSearchParams] = useState("");
    const [genLoading, setGenLoading] = useState(false);
    const [form, validator] = useValidate({
        search_type: { value: "", validate: "required" },
        ssin_no: { value: "", validate: "required" },
    });

    useEffect(() => {
        dispatch(setPageAddress({ title: "Account Statement", url: "" }));
    }, []);

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validator.validate()) return;
            setGenLoading(true);
            const formPdfData = validator.generalize();
            const urlSearchPdfParams = new URLSearchParams(formPdfData);
            await blankOpenFile("/account-statement-pdf-view?" + urlSearchPdfParams.toString());
            setGenLoading(false);
        } catch (error) {
            setGenLoading(false);
            console.error(error);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
    };

    return (
        <>
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="search_type">
                                    Select Search By {form.search_type.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    name="search_type"
                                    id="search_type"
                                    className={`form-select ${form.search_type.error && "is-invalid"}`}
                                    value={form.search_type.value}
                                    required={form.search_type.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                >
                                    <option value="">-Select-</option>
                                    <option value="ssin">SSIN</option>
                                    <option value="reg">Registration Number</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    {form.search_type.error}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="ssin_no">
                                    SSIN {form.ssin_no.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="ssin_no"
                                    name="ssin_no"
                                    className={`form-control ${form.ssin_no.error && "is-invalid"}`}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.ssin_no.value}
                                    required={form.ssin_no.required}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.ssin_no.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex gap-2">
                            &nbsp;
                            <button className="btn btn-success btn-sm" type="submit" disabled={genLoading}>
                                {genLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                <i className="fa-regular fa-pen-to-square"></i> Generate Account Statement
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={handleReset}>
                                <i className="fa-solid fa-backward"></i> Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AccountStatementOld;
