import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import DistrictSelect from "../../../components/select/DistrictSelect";
import { useValidate } from "../../../hooks";
import SubDivSelect from "../../../components/select/SubDivSelect";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import GPWardSelect from "../../../components/select/GPWardSelect";
import { downloadFile } from "../../../utils";

const BackLogDataReport = () => {
    const [loading, setLoading] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Backlog (CAF Not Updated) Data Report", url: "" }));
    }, []);
    const user = useSelector((state) => state.user.user);
    const [form, validator] = useValidate({
        district: { value: user?.district, validate: "required" },
        subdivision: { value: user?.subDivision, validate: "required" },
        block: { value: "", validate: "required" },
        gp_ward: { value: "", validate: "" },
    });
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const queryData = `district=${formData.district}&subdivision=${formData.subdivision}&block=${formData.block}&gp_ward=${formData.gp_ward}`;

        try {
            setLoading(true);
            await downloadFile("/download-backlog-data-report?" + queryData, "Back-log-data-report.xlsx");
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div className="card datatable-box mb-4">
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
                                    disabled
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-control-label" htmlFor="subdivision">
                                    Sub-Division {form.subdivision.required && <span className="text-danger">*</span>}
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
                                    disabled
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
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="form-group">
                            <div className="d-grid d-md-flex justify-content-md-end">
                                <button className="btn btn-success btn-sm" type="submit" disabled={loading}>
                                    {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Download
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BackLogDataReport;
