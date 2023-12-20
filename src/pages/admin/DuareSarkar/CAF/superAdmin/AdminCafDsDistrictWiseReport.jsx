import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../../store/slices/headerTitleSlice";
import { useValidate } from "../../../../../hooks";
import { downloadFile, fetcher } from "../../../../../utils";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import { toast } from "react-toastify";

const AdminCafDsDistrictWiseReport = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar District Wise Report (CAF)", url: "" }));
    }, []);

    const [form, validator] = useValidate({
        date: { value: "", validate: "required|maxDate" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const [loading, setLoading] = useState();

    const [totalItemCount, setTotalItemCount] = useState(0);
    const [totalPendingCount, setTotalPendingCount] = useState(0);
    const [totalRejectCount, setTotalRejectCount] = useState(0);
    const [totalApprovedCount, setTotalApprovedCount] = useState(0);

    // const { data, isFetching, error } = useQuery(["ds-district-wise-data", searchQuery], () => fetcher("/ds-district-wise-data?" + searchQuery), { enabled: searchQuery ? true : false });

    const { data, isFetching, error } = useQuery(
        ["ds-district-wise-data", searchQuery],
        async () => {
            const result = await fetcher("/ds-district-wise-data?" + searchQuery);

            if (result) {
                const totalCount = result.reduce((sum, item) => parseInt(sum) + parseInt(item.count), 0);
                const totalPendingCount = result.reduce((sum, item) => parseInt(sum) + parseInt(item.total_pending), 0);
                const totalRejectCount = result.reduce((sum, item) => parseInt(sum) + parseInt(item.total_reject), 0);
                const totalApprovedCount = result.reduce((sum, item) => parseInt(sum) + parseInt(item.total_approved), 0);

                setTotalItemCount(totalCount);
                setTotalPendingCount(totalPendingCount);
                setTotalRejectCount(totalRejectCount);
                setTotalApprovedCount(totalApprovedCount);
            }
            return result;
        },
        { enabled: searchQuery ? true : false }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchQuery(urlSearchParams.toString());
    };

    const clearParams = () => {
        validator.reset();
        setSearchQuery();
        form.date.value = "";
    };

    const downloadReport = async (date) => {
        setLoading(true);
        const report = await downloadFile(`/ds-district-wise-report-download?date=${date}`, "Duare Sarkar District Wise Report.xlsx");
        if (!report) toast.error("Something wrong! Please try again latter.");
        setLoading();
    };

    return (
        <>
            <div className="card mb-3">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="date">
                                    Select Date {form.date.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    className={`form-control ${form.date.error && "is-invalid"}`}
                                    value={form.date.value}
                                    required={form.date.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    max={moment().format("YYYY-MM-DD")}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.date.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <div className="d-flex gap-2">
                                <button className="btn btn-success btn-sm" type="submit" disabled={isFetching || data}>
                                    {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Show Report
                                </button>
                                <button className="btn btn-warning btn-sm" type="button" disabled={isFetching} onClick={clearParams}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card">
                    <>
                        <div className="card-header border-0 bg-light text-dark">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-md-center ">
                                        <button className="btn btn-warning " onClick={() => downloadReport(form.date.value)}>
                                            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-download"></i>} Download Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm ">
                                    <thead>
                                        <tr style={{ backgroundColor: "var(--blue-300)" }}>
                                            <th className="text-dark text-center">SL No.</th>
                                            <th className="text-dark text-center">District Name</th>
                                            <th className="text-dark text-center" style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                Application Received at camp (till date)
                                            </th>
                                            <th className="text-dark text-center" style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                Application under process for verification /other process
                                            </th>
                                            <th className="text-dark text-center" style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                Application Rejected (till date)
                                            </th>
                                            <th className="text-dark text-center" style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                Service Delivered (till date)
                                            </th>
                                            <th className="text-dark text-center" style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                SMS/Subhecha Barta Delivered (till date)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-light text-center " style={{ backgroundColor: "var(--gray)" }}>
                                                        {index + 1}
                                                    </td>
                                                    <td className="text-light " style={{ backgroundColor: "var(--gray)" }}>
                                                        {item.district_name}
                                                    </td>
                                                    <td className="text-light text-center " style={{ backgroundColor: "var(--gray)" }}>
                                                        {item.count}
                                                    </td>
                                                    <td className="text-light text-center " style={{ backgroundColor: "var(--gray)" }}>
                                                        {item.total_pending}
                                                    </td>
                                                    <td className="text-light text-center" style={{ backgroundColor: "var(--gray)" }}>
                                                        {item.total_reject}
                                                    </td>
                                                    <td className="text-light text-center " style={{ backgroundColor: "var(--gray)" }}>
                                                        {item.total_approved}
                                                    </td>
                                                    <td className="text-light text-center " style={{ backgroundColor: "var(--gray)" }}>
                                                        {item.total_approved}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <th colSpan="2" className="text-dark bg-primary text-center">
                                            Total
                                        </th>
                                        <th className="bg-secondary text-light text-center ">{totalItemCount}</th>
                                        <th className="bg-warning text-dark text-center ">{totalPendingCount}</th>
                                        <th className="bg-danger text-light text-center ">{totalRejectCount}</th>
                                        <th className="bg-success text-light text-center ">{totalApprovedCount}</th>
                                        <th className="bg-success text-light text-center ">{totalApprovedCount}</th>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </>
                </div>
            )}
        </>
    );
};

export default AdminCafDsDistrictWiseReport;
