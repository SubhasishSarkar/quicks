import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../../hooks";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import SubDivSelect from "../../../../components/select/SubDivSelect";
import BMCNameSelect from "../../../../components/select/BMCNameSelect";
import GPWardSelect from "../../../../components/select/GPWardSelect";
import { downloadFile } from "../../../../utils";

const DsSummaryReport = () => {
    // eslint-disable-next-line no-unused-vars
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar Summary Report", url: "" }));
    }, []);

    const user = useSelector((state) => state.user.user);

    const [form, validator] = useValidate({
        district: { value: user.role === "SUPER ADMIN" ? "" : user?.district, validate: "required" },
        sub_division: { value: user.role === "SUPER ADMIN" ? "" : user?.subDivision, validate: "" },
        block: { value: "", validate: "" },
        gpWard: { value: "", validate: "" },
        fromDate: { value: "", validate: "required" },
        toDate: { value: "", validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const [loading, setLoading] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        setLoading(true);
        const formData = validator.generalize();
        const formDataParams = `block=${formData.block}&district=${formData.district}&fromDate=${formData.fromDate}&gpWard=${formData.gpWard}&sub_division=${formData.sub_division}&toDate=${formData.toDate}`;
        downloadFile("/duare-sarkar-summary-report-download?" + formDataParams, "Duare Sarkar Summary Report.xlsx");
        setLoading();
    };

    return (
        <>
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    disabled={user.role != "SUPER ADMIN" ? true : false}
                                    required={form.district.required}
                                    value={form.district.value}
                                    onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })}
                                />

                                <div className="invalid-feedback">{form.district.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    Sub Division {form.sub_division.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.sub_division.error && "is-invalid"}`}
                                    id="sub_division"
                                    name="sub_division"
                                    disabled={user.role != "SUPER ADMIN" ? true : false}
                                    required={form.sub_division.required}
                                    value={form.sub_division.value}
                                    onChange={(e) => handleChange({ name: "sub_division", value: e.currentTarget.value })}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">{form.sub_division.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    Block {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.sub_division.value}
                                />
                                <div className="invalid-feedback">{form.block.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="gpWard">
                                    GP/Ward {form.gpWard.required && <span className="text-danger">*</span>}
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
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="fromDate">
                                        From Submitted Date {form.fromDate.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="fromDate"
                                        name="fromDate"
                                        className={`form-control ${form.fromDate.error && "is-invalid"}`}
                                        value={form.fromDate.value}
                                        required={form.fromDate.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.fromDate.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="toDate">
                                        To Submitted Date {form.toDate.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="toDate"
                                        name="toDate"
                                        className={`form-control ${form.toDate.error && "is-invalid"}`}
                                        value={form.toDate.value}
                                        required={form.toDate.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.toDate.error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Generate Excel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DsSummaryReport;
