import React, { useEffect, useState } from "react";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import DistrictSelect from "../../../components/select/DistrictSelect";
import GPWardSelect from "../../../components/select/GPWardSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import { useValidate } from "../../../hooks";
import { downloadFile } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const CountWiseReport = () => {
    const [form, validator] = useValidate({
        district: { value: "", validate: "required" },
        countWise: { value: "", validate: "required" },
        subdivision: { value: "", validate: "" },
        block: { value: "", validate: "" },
        gp_ward: { value: "", validate: "" },
        worker_type: { value: "", validate: "" },
    });
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "countWise":
                    setState((state) => {
                        if (value === "Worker Type") {
                            state.worker_type.required = true;
                            state.worker_type.validate = "required";
                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        } else {
                            state.worker_type.required = false;
                            state.worker_type.validate = "";
                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const [loading, setLoading] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const queryData = `district=${formData.district}&countWise=${formData.countWise}&subdivision=${formData.subdivision}&block=${formData.block}&gp_ward=${formData.gp_ward}&worker_type=${formData.worker_type}`;

        try {
            setLoading(true);
            await downloadFile("/download-count-wise-report?" + queryData, "Count Wise Report.xlsx");
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Count Wise Report Download", url: "" }));
    }, []);
    return (
        <>
            <div className="card datatable-box ">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="district">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    option_all="true"
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="subdivision">
                                    Subdivision {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    value={form.subdivision.value}
                                    option_all="true"
                                    onChange={(e) => {
                                        handleChange({ name: "subdivision", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">Please select sub division</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="block">
                                    Block/Municipality/Corporation {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    option_all="true"
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subdivision.value}
                                />
                                <div className="invalid-feedback">Please select B/M/C</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="gp_ward" className="form-control-label">
                                    GP / Ward {form.gp_ward.required && <span className="text-danger">*</span>}
                                </label>
                                <GPWardSelect
                                    className={`form-select ${form.gp_ward.error && "is-invalid"}`}
                                    id="gp_ward"
                                    name="gp_ward"
                                    option_all="true"
                                    required={form.gp_ward.required}
                                    value={form.gp_ward.value}
                                    onChange={(e) => handleChange({ name: "gp_ward", value: e.currentTarget.value })}
                                    block={form.block.value}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="countWise">
                                    Select Report For {form.countWise.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    className={`form-select ${form.countWise.error && "is-invalid"}`}
                                    id="countWise"
                                    name="countWise"
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    value={form.countWise.value}
                                    required={form.countWise.required}
                                >
                                    <option value="0">-Select-</option>
                                    <option value="Worker Type">Worker Type</option>
                                    <option value="Gender">Gender</option>
                                    <option value="Caste">Caste</option>
                                    <option value="Religion">Religion</option>
                                    <option value="Marital status">Marital status</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    {form.countWise.error}
                                </div>
                            </div>
                            {form.countWise.value === "Worker Type" && (
                                <div className="col-md-3 mb-3">
                                    <label className="form-control-label" htmlFor="worker_type">
                                        Select Worker Type {form.worker_type.required && <span className="text-danger">*</span>}
                                    </label>
                                    <select
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        id="worker_type"
                                        name="worker_type"
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.worker_type.value}
                                        required={form.worker_type.required}
                                    >
                                        <option value="">-Select-</option>
                                        <option value="ow">Others Worker</option>
                                        <option value="cw">Construction Worker</option>
                                        <option value="tw">Transport Worker</option>
                                    </select>
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.worker_type.error}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={loading}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Download
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CountWiseReport;
