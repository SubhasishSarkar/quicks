import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../../hooks";
import { downloadFile } from "../../../../utils";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import SubDivSelect from "../../../../components/select/SubDivSelect";
import ErrorAlert from "../../../../components/list/ErrorAlert";

const DsBlockwiseReport = () => {
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Blockwise Report DS(8)", url: "" }));
    }, []);

    const [form, validator] = useValidate({
        district: { value: "", validate: "required" },
        subdivision: { value: "", validate: "" },
        subDate: { value: "", validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        setLoading(true);
        const formData = validator.generalize();
        const formDataParams = `district=${formData.district}&subDate=${formData.subDate}&subdivision=${formData.subdivision}`;
        const res = await downloadFile("/duare-sarkar-blockwise-report-pf?" + formDataParams, "Duare Sarkar Block Wise Report PF.xlsx");
        if (res.status === false) {
            setError(res.message);
        }

        setLoading(false);
    };
    return (
        <>
            {error && <ErrorAlert error={error} />}
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="district" className="form-control-label">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    required={form.district.required}
                                    value={form.district.value}
                                    onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })}
                                    option_all="true"
                                />

                                <div className="invalid-feedback">{form.district.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="subdivision" className="form-control-label">
                                    Sub Division {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    required={form.subdivision.required}
                                    value={form.subdivision.value}
                                    onChange={(e) => handleChange({ name: "subdivision", value: e.currentTarget.value })}
                                    districtCode={form.district.value}
                                    option_all="true"
                                />
                                <div className="invalid-feedback">{form.subdivision.error}</div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="subDate">
                                        Date {form.subDate.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="subDate"
                                        name="subDate"
                                        className={`form-control ${form.subDate.error && "is-invalid"}`}
                                        value={form.subDate.value}
                                        required={form.subDate.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.subDate.error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-success btn-sm" type="submit" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                <i className="fa-regular fa-pen-to-square"></i> Generate Excel
                            </button>
                        </div>
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-warning btn-sm" onClick={handleReset}>
                                <i className="fa-solid fa-backward"></i> Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DsBlockwiseReport;
