import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useValidate } from "../../../hooks";
import ErrorAlert from "../../../components/list/ErrorAlert";
import DistrictSelect from "../../../components/select/DistrictSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import GPWardSelect from "../../../components/select/GPWardSelect";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import NoDataFound from "../../../components/list/NoDataFound";
import Pagination from "../../../components/Pagination";
import { downloadFile, fetcher } from "../../../utils";
import WorkerTypeSelect from "../../../components/select/WorkerTypeSelect";
import { toast } from "react-toastify";

const PassbookList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "PF Passbook List", url: "" }));
    }, []);

    const user = useSelector((state) => state.user.user);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchPassbook, setSearchPassbook] = useState();
    const [loading, setLoading] = useState();

    const [form, validator] = useValidate({
        district: { value: user?.role == "inspector" || user?.role == "ALC" ? user?.district : "", validate: "required" },
        subdivision: { value: user?.role == "inspector" || user?.role == "ALC" ? user?.subDivision : "", validate: "" },
        block: { value: "", validate: "" },
        gp_ward: { value: "", validate: "" },
        from_sub_dt: { value: "", validate: "required" },
        to_sub_dt: { value: "", validate: "required" },
        worker_type: { value: "", validate: "" },
        collected_by_arn: { value: "", validate: "" },
        submitted_by_arn: { value: "", validate: "" },
    });

    const { error, data, isFetching } = useQuery(["ppu-passbook-list", searchParams.toString()], () => fetcher(`/ppu-passbook-list?${searchParams.toString()}`), {
        enabled: searchPassbook == 1 ? true : false,
    });

    const DownloadFile = async (e) => {
        e.preventDefault();
        setLoading(1);
        if (!validator.validate()) return;
        const data = validator.generalize();
        try {
            const docData = await downloadFile("/ppu-passbook-list-download/" + JSON.stringify(data), "PF PASSBOOK LIST.xlsx");
            if (docData === false) toast.error("Unable to download excel");
            setLoading();
        } catch (error) {
            toast.error(error.message);
            setLoading();
        }
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setSearchPassbook();
        setSearchParams();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchPassbook(1);
        searchParams.set("page", 1);
        setSearchParams(searchParams);
    };
    return (
        <>
            {error && <ErrorAlert error={error} />}
            <form noValidate onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor="district" className="form-control-label">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    option_all="true"
                                    disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                    required={form.district.required}
                                    value={form.district.value}
                                    onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })}
                                />

                                <div className="invalid-feedback">{form.district.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="subdivision" className="form-control-label">
                                    Sub Division {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    option_all="true"
                                    disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                    required={form.subdivision.required}
                                    value={form.subdivision.value}
                                    onChange={(e) => handleChange({ name: "subdivision", value: e.currentTarget.value })}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">{form.subdivision.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="block" className="form-control-label">
                                    Block {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    // disabled={user?.role == "inspector" ? true : false}
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subdivision.value}
                                    basedOnUser
                                />
                                <div className="invalid-feedback">{form.block.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="gp_ward">
                                    GP/Ward {form.gp_ward.required && <span className="text-danger">*</span>}
                                </label>
                                <GPWardSelect
                                    className={`form-select ${form.gp_ward.error && "is-invalid"}`}
                                    id="gp_ward"
                                    name="gp_ward"
                                    required={form.gp_ward.required}
                                    value={form.gp_ward.value}
                                    onChange={(e) => handleChange({ name: "gp_ward", value: e.currentTarget.value })}
                                    block={form.block.value}
                                    basedOnUser
                                />
                                <div className="invalid-feedback">{form.gp_ward.error}</div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="from_sub_dt">
                                        From (Submit Date) {form.from_sub_dt.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="from_sub_dt"
                                        name="from_sub_dt"
                                        className={`form-control ${form.from_sub_dt.error && "is-invalid"}`}
                                        value={form.from_sub_dt.value}
                                        required={form.from_sub_dt.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.from_sub_dt.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="to_sub_dt">
                                        To (Submit Date) {form.to_sub_dt.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="to_sub_dt"
                                        name="to_sub_dt"
                                        className={`form-control ${form.to_sub_dt.error && "is-invalid"}`}
                                        value={form.to_sub_dt.value}
                                        required={form.to_sub_dt.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.to_sub_dt.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="worker_type" className="form-control-label">
                                    Worker Type
                                </label>
                                <WorkerTypeSelect
                                    className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                    id="worker_type"
                                    required=""
                                    value={form.worker_type.value}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />

                                <div className="invalid-feedback">{form.worker_type.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="collected_by_arn" className="form-control-label">
                                    Entry in Passbook by (ARN)
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${form.collected_by_arn.error && "is-invalid"}`}
                                    name="collected_by_arn"
                                    id="collected_by_arn"
                                    value={form.collected_by_arn.value}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />

                                <div className="invalid-feedback">{form.collected_by_arn.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="submitted_by_arn" className="form-control-label">
                                    Entry in Portal by (ARN)
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${form.submitted_by_arn.error && "is-invalid"}`}
                                    name="submitted_by_arn"
                                    id="submitted_by_arn"
                                    value={form.submitted_by_arn.value}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />

                                <div className="invalid-feedback">{form.submitted_by_arn.error}</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-primary btn-sm" type="submit" disabled={isFetching}>
                                {isFetching ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "View"}
                            </button>
                        </div>
                        <div className="btn-group  me-2 mb-2">
                            {loading != 1 ? (
                                <button className="btn btn-success btn-sm" type="button" onClick={(e) => DownloadFile(e)}>
                                    Generate Excel
                                </button>
                            ) : (
                                <button type="button" className="btn btn-success btn-sm">
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Generate Excel
                                </button>
                            )}
                        </div>
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-warning btn-sm" onClick={handleReset}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <br />
            {searchPassbook == 1 && (
                <div className="card">
                    <div className="card-body">
                        {isFetching && <LoadingSpinner />}
                        {data &&
                            (data?.data_Set.data.length === 0 ? (
                                <NoDataFound />
                            ) : (
                                <>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>SL No</th>
                                                            <th>Submit Date</th>
                                                            <th>SSIN No.</th>
                                                            <th>Aadhaar No</th>
                                                            <th>Entry in Passbook by (ARN)</th>
                                                            <th>Entry in Portal by (ARN)</th>
                                                            <th>Period From</th>
                                                            <th>Period To</th>
                                                            <th>No of Months</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data?.data_Set?.data?.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{data?.data_Set?.from + index}</td>
                                                                    <td>{item.submitted_dt}</td>
                                                                    <td>{item.ssin_no}</td>
                                                                    <td>{item.aadhaar_no}</td>
                                                                    <td>{item.collected_by_arn}</td>
                                                                    <td>{item.submitted_by_arn}</td>
                                                                    <td>{item.period_from}</td>
                                                                    <td>{item.period_to}</td>
                                                                    <td>{item.num_months}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))}

                        {data && data?.data_Set?.data?.length > 0 && <Pagination data={data?.data_Set} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
                    </div>
                </div>
            )}
        </>
    );
};

export default PassbookList;
