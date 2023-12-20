import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../../hooks";
import { downloadFile, fetcher } from "../../../../utils";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import noDataFound from "../../../../../public/assets/no_data.png";
import { useSearchParams } from "react-router-dom";

const DsReportPF = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [downloadSearchParams, setDownloadSearchParams] = useState();
    const [searchPassbook, setSearchPassbook] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar District wise Report", url: "" }));
    }, []);

    const today = moment().format("YYYY-MM-DD");

    const [form, validator] = useValidate({
        subDate: { value: today, validate: "required" },
    });

    const { error, data, isFetching } = useQuery(["duare-sarkar-districtwise-report", searchParams.toString()], () => fetcher(`/duare-sarkar-districtwise-report?${searchParams.toString()}`), {
        enabled: searchPassbook == 1 ? true : false,
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setSearchPassbook(0);
        setSearchParams();
        setDownloadSearchParams();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchPassbook(1);
        setSearchParams(searchParams);
    };

    const DownloadPaymentFile = async () => {
        setDownloadSearchParams(1);
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const formDataParams = `subDate=${formData.subDate}`;
        try {
            const docData = await downloadFile("/duare-sarkar-districtwise-report-excel/?" + formDataParams, "DUARE SARKAR DISTRICT WISE REPORT.xlsx");
            if (docData.status === false) toast.error("Unable to download excel");
            setDownloadSearchParams();
        } catch (error) {
            toast.error(error.message);
            setDownloadSearchParams();
        }
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
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
                                        max={today}
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
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                <i className="fa-solid fa-magnifying-glass"></i> {isFetching ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "View"}
                            </button>
                        </div>
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-primary btn-sm" type="button" onClick={DownloadPaymentFile} disabled={downloadSearchParams}>
                                {downloadSearchParams && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                <i className="fa-regular fa-pen-to-square"></i> Generate Excel
                            </button>
                        </div>
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-danger btn-sm" onClick={handleReset}>
                                <i className="fa-solid fa-backward"></i> Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {data && searchPassbook == 1 && (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No</th>
                                        <th>District Name</th>
                                        <th>Application Received at camp (till date)</th>
                                        <th>Application under process for verification /other process</th>
                                        <th>Application Rejected (till date)</th>
                                        <th>Service Delivered (till date)</th>
                                        <th>SMS/Subhecha Barta Delivered (till date)</th>
                                    </tr>
                                </thead>
                                {isFetching && <LoadingSpinner />}
                                {data && data?.data_Set.rows?.length > 0 ? (
                                    <>
                                        <tbody>
                                            {data?.data_Set?.rows?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.district_name}</td>
                                                        <td>{item.total}</td>
                                                        <td>0</td>
                                                        <td>0</td>
                                                        <td>{item.total}</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </>
                                ) : (
                                    data && (
                                        <tbody>
                                            <tr>
                                                <td colSpan={6} align="center">
                                                    <img src={noDataFound} alt="" style={{ height: "105%", width: "14%" }} />
                                                    <i className="fa-regular fa-face-sad-tear"></i> <span>NO DATA FOUND!</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DsReportPF;
