import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import WorkerTypeSelect from "../../../../components/select/WorkerTypeSelect";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import RloSelect from "../../../../components/select/RloSelect";
import LwfcSelect from "../../../../components/select/LwfcSelect";
import { useValidate } from "../../../../hooks";
import { downloadFile } from "../../../../utils";
import { toast } from "react-toastify";

const MisReport = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim MIS Report", url: "" }));
    }, []);

    const user = useSelector((state) => state.user.user);
    const [form, validator] = useValidate({
        district: { value: user?.district, validate: "required" },
        rlo_code: { value: user?.rloCode, validate: "required" },
        workerType: { value: "", validate: "required" },
        claimType: { value: "", validate: "required" },
        fromDate: { value: "", validate: "required" },
        toDate: { value: "", validate: "required" },
        lwfcCode: { value: user?.lwfcCode, validate: "required" },
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
        const formDataParams = `workerType=${formData.workerType}&claimType=${formData.claimType}&fromDate=${formData.fromDate}&toDate=${formData.toDate}&district=${formData.district}&rloCode=${formData.rlo_code}&lwfcCode=${formData.lwfcCode}`;

        const excel = await downloadFile("/rlo-mis-report-download?" + formDataParams, "RLO MIS Report.xlsx");
        if (excel === false) toast.error("Unable to download RLO MIS Report");
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
                                    Worker Type <span className="text-danger">*</span>
                                </label>
                                <WorkerTypeSelect className={`form-select ${form.workerType.error && "is-invalid"}`} id="workerType" required="" onChange={(e) => handleChange({ name: "workerType", value: e.currentTarget.value })} />

                                <div className="invalid-feedback">{form.workerType.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    Claim Type <span className="text-danger">*</span>
                                </label>
                                <select aria-label="Default select example" className={`form-select ${form.claimType.error && "is-invalid"}`} id="claimType" onChange={(e) => handleChange({ name: "claimType", value: e.currentTarget.value })}>
                                    <option value="">Select One</option>
                                    <option value="1">Death</option>
                                    <option value="2">Disability</option>
                                    <option value="3">Pf</option>
                                    <option value="0">All</option>
                                </select>
                                <div className="invalid-feedback">{form.claimType.error}</div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="fromDate">
                                        From Submitted Date
                                    </label>
                                    <input
                                        type="date"
                                        id="fromDate"
                                        className={`form-control ${form.fromDate.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange({ name: "fromDate", value: e.currentTarget.value });
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
                                        To Submitted Date
                                    </label>
                                    <input
                                        type="date"
                                        id="toDate"
                                        className={`form-control ${form.toDate.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange({ name: "toDate", value: e.currentTarget.value });
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.toDate.error}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    District <span className="text-danger">*</span>
                                </label>
                                <DistrictSelect className={`form-select `} id="district" disabled required="" value={form.district.value} onChange={(e) => handleChange({ name: "district" })} />

                                <div className="invalid-feedback"></div>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    RLO <span className="text-danger">*</span>
                                </label>
                                <RloSelect className={`form-select `} disabled id="rlo_code" required="" value={form.rlo_code.value} districtCode={form.district.value} onChange={(e) => handleChange({ name: "rlo_code" })} />

                                <div className="invalid-feedback"></div>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="status" className="form-control-label">
                                    LWFC <span className="text-danger">*</span>
                                </label>
                                <LwfcSelect
                                    className={`form-select ${form.lwfcCode.error && "is-invalid"} `}
                                    disabled={user?.rid === 7 ? true : false}
                                    option_all="true"
                                    id="lwfcCode"
                                    rloCode={form.rlo_code.value}
                                    value={form.lwfcCode.value}
                                    onChange={(e) => handleChange({ name: "lwfcCode", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.lwfcCode.error}</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end gap-2">
                            <button className="btn btn-success btn-sm " type="submit" disabled={loading ? true : false}>
                                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} MIS CLAIM EXCEL DOWNLOAD
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default MisReport;
