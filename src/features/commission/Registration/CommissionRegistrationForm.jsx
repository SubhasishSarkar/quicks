import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../../utils";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useEffect, useState } from "react";

const CommissionRegistrationForm = ({ workerType }) => {
    const workerTypeShort = ["ow", "cw", "tw"];

    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);

    const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const { isLoading, error, data } = useQuery(["commission-registration", workerType, searchParams], () => fetcher(`/commission-registration?${searchParams}`));
    const queryClient = useQueryClient();
    const { mutate, isFetching } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e, workerType, i, id) => {
        if (i > 0) throw error("SEQUENCE HAS BEEN BROKEN");
        e.preventDefault();
        mutate(
            { url: `/commission-registration`, body: { workerType, i, id } },
            {
                onSuccess(data) {
                    toast.success("MONTHLY COMMISSION SUCCESSFULLY SUBMITTED");
                    queryClient.invalidateQueries(["commission-registration", workerType, searchParams]);
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
    };

    useEffect(() => {
        setSearchParams(`workerType=${workerTypeShort[workerType]}`);
    }, [workerType]);

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {error ? (
                <ErrorAlert error={error} />
            ) : (
                <>
                    <div className="card shadow">
                        <div className="card-header" style={{ background: "var(--green-700)" }}>
                            MONTHLY COMMISSION REPORT
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm table-hover bg-light custom-table">
                                    <thead>
                                        <tr className="text-center" style={{ background: "var(--gray-300)" }}>
                                            <th>Sl.No.</th>
                                            <th>Month-Year</th>
                                            <th>No. of applications digitised</th>
                                            <th>Commission for digitisation of Form-I @ Rs. 10/-</th>
                                            <th>No. of applications collected</th>
                                            <th>Commission for collection of Form-I @ Rs. 1/-</th>
                                            <th>No. of Pass books & SMCs handed over to the beneficiaries</th>
                                            <th>Commission for generation and handing over of Pass Books & SMCs to the beneficiaries @ Rs. 2/- </th>
                                            <th>Total Amount</th>
                                            <th>Submitted On</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <LoadingSpinner />}
                                        {data &&
                                            data.dataResult.data.length > 0 &&
                                            data.dataResult.data.map((item, i) => {
                                                return (
                                                    <tr key={i} className="table-sm align-middle small">
                                                        <td style={wrapStyle}>{data?.dataResult?.from + i}</td>
                                                        <td style={wrapStyle}>
                                                            {monthFull[item.month - 1]}-{item.year}{" "}
                                                        </td>
                                                        <td style={wrapStyle}>{item.added_count}</td>
                                                        <td style={wrapStyle}>{item.added_amt}</td>
                                                        <td style={wrapStyle}>{item.collected_count}</td>
                                                        <td style={wrapStyle}>{item.collected_amt}</td>
                                                        <td style={wrapStyle}>{item.collected_count}</td>
                                                        <td style={wrapStyle}>{item.delivered_amt}</td>
                                                        <td style={wrapStyle}>{item.added_amt + item.collected_amt + item.delivered_amt}</td>
                                                        <td style={wrapStyle}>{item.submited_dt}</td>
                                                        <td style={wrapStyle}>
                                                            {item.status == "P" && "Pending"}
                                                            {item.status == "S" && "Pending at ALC"}
                                                            {item.status == "F" && "Pending at Board"}
                                                            {item.status == "C" && "Pending at Board"}
                                                            {item.status == "A" && "Pending at Board"}
                                                            {item.status == "M" && "Approved By Board"}
                                                            {item.status == "1" && "Fund Released by ALC"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            {data?.dataResult?.links && (
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="d-inline-flex mb-3 px-2 py-1 fw-semibold text-secondary bg-opacity-20 ">
                                        Showing {data?.dataResult.from} to {data?.dataResult.to} of {data?.dataResult.total_records} Entries
                                    </small>
                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                        <nav>
                                            <ul className="pagination pagination-sm mb-3">
                                                {data?.dataResult.links?.map((item, index) => (
                                                    <li className={`page-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`} key={index}>
                                                        <a
                                                            href={item.query}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSearchParams(item.query.split("?")[1]);
                                                            }}
                                                            className="page-link"
                                                        >
                                                            {item.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <br />
                    <div className="card shadow">
                        <div className="card-header " style={{ background: "var(--orange-700)" }}>
                            PENDING MONTHLY COMMISSION
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm table-hover custom-table-two">
                                    <thead>
                                        <tr className="text-center" style={{ background: "var(--gray-300)" }}>
                                            <th>Sl.No.</th>
                                            <th>Month-Year</th>
                                            <th>No. of applications digitised</th>
                                            <th>Commission for digitisation of Form-I @ Rs. 10/-</th>
                                            <th>No. of applications collected</th>
                                            <th>Commission for collection of Form-I @ Rs. 1/-</th>
                                            <th>No. of Pass books & SMCs handed over to the beneficiaries</th>
                                            <th>Commission for generation and handing over of Pass Books & SMCs to the beneficiaries @ Rs. 2/- </th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data &&
                                            data?.data?.length > 0 &&
                                            data?.data?.map((item, i) => {
                                                return (
                                                    <tr key={i} className="table-sm align-middle small">
                                                        <td style={wrapStyle}>{i + 1}</td>
                                                        <td style={wrapStyle}>
                                                            {monthFull[item.month - 1]}-{item.year}
                                                        </td>
                                                        <td style={wrapStyle}>{item.added_count}</td>
                                                        <td style={wrapStyle}>{item.added_amt}</td>
                                                        <td style={wrapStyle}>{item.collected_count}</td>
                                                        <td style={wrapStyle}>{item.collected_amt}</td>
                                                        <td style={wrapStyle}>{item.collected_count}</td>
                                                        <td style={wrapStyle}>{item.delivered_amt}</td>
                                                        <td style={wrapStyle}>{item.total_amt}</td>
                                                        <td style={wrapStyle}>Pending</td>
                                                        <td style={wrapStyle}>
                                                            {i == 0 && (
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={(e) => {
                                                                        const confirmBox = window.confirm(
                                                                            "I do hereby declare that I have handed over the Pass Book & SMC to all the beneficiaries for whom the above commissions have been claimed and the claims are raised only against the approved beneficiaries."
                                                                        );
                                                                        if (confirmBox === true) {
                                                                            handleSubmit(e, workerType, i, item.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    {isFetching ? "PROCESSING..." : "SUBMIT"}
                                                                </button>
                                                            )}
                                                            {i > 0 && <button className="btn btn-sm btn-warning">PENDING</button>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                        <span className="badge text-bg-danger">NOTE:</span>
                        <ul>
                            <li>Check and submit your monthly performance report for approval.</li>
                            <li>Check and Update Bank Details and Pan Number</li>
                        </ul>
                    </h6>
                </>
            )}
        </>
    );
};

export default CommissionRegistrationForm;
