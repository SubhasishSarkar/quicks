import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import DistrictSelect from "../../../components/select/DistrictSelect";
import { useValidate } from "../../../hooks";
import SubDivSelect from "../../../components/select/SubDivSelect";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "../../../utils";
import BoardSelect from "../../../components/select/BoardSelect";
import moment from "moment";

const OfflineClaimMisReport = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Offline Claim MIS Report", url: "" }));
    }, []);
    const [searchParams, setSearchParams] = useSearchParams();

    const [form, validator] = useValidate(
        {
            district: { value: "", validate: "required" },
            subdivision: { value: "", validate: "required" },
            board: { value: "", validate: "required" },
            dateType: { value: "", validate: "required" },
            dateTo: { value: "", validate: "required|maxDate" },
            dateFrom: { value: "", validate: "required|maxDate" },
        },
        searchParamsToObject(searchParams)
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const clearParams = () => {
        setSearchParams();

        form.district.value = "";
        form.subdivision.value = "";
        form.board.value = "";
        form.dateType.value = "";
        form.dateTo.value = "";
        form.dateFrom.value = "";

        form.district.error = "";
        form.subdivision.error = "";
        form.board.error = "";
        form.dateType.error = "";
        form.dateTo.error = "";
        form.dateFrom.error = "";
    };
    return (
        <>
            <form noValidate className="filter_box" onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="district">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="subdivision">
                                    Subdivision {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    value={form.subdivision.value}
                                    onChange={(e) => {
                                        handleChange({ name: "subdivision", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">Please select sub division</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="board">
                                    Board {form.board.required && <span className="text-danger">*</span>}
                                </label>
                                <BoardSelect
                                    className={`form-select ${form.board.error && "is-invalid"}`}
                                    id="board"
                                    name="board"
                                    value={form.board.value}
                                    onChange={(e) => {
                                        handleChange({ name: "board", value: e.currentTarget.value });
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    Please select board
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="dateType">
                                    Date Type {form.dateType.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    name="dateType"
                                    id="dateType"
                                    className={`form-select ${form.dateType.error && "is-invalid"}`}
                                    value={form.dateType.value}
                                    required={form.dateType.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                >
                                    <option value="">-Select-</option>
                                    <option value="Advice Date">Advice Date</option>
                                    <option value="Submitted Date">Submitted Date</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    Please select type of date
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="dateFrom">
                                    Date From {form.dateFrom.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="dateFrom"
                                    name="dateFrom"
                                    className={`form-control ${form.dateFrom.error && "is-invalid"}`}
                                    value={form.dateFrom.value}
                                    required={form.dateFrom.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    max={moment().format("YYYY-MM-DD")}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.dateFrom.error}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="dateTo">
                                    To Date {form.dateTo.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="dateTo"
                                    name="dateTo"
                                    className={`form-control ${form.dateTo.error && "is-invalid"}`}
                                    value={form.dateTo.value}
                                    required={form.dateTo.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    max={moment().format("YYYY-MM-DD")}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.dateTo.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="justify-content-md-end d-md-flex gap-2">
                            <button type="submit" className="btn btn-success btn-sm">
                                <i className="fa-solid fa-download"></i> Download
                            </button>
                            <button type="button" className="btn btn-warning btn-sm" onClick={() => clearParams()}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default OfflineClaimMisReport;
