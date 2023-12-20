import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../../utils";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useEffect, useState } from "react";

const CommissionGovGrantForm = ({ workerType }) => {
    const workerTypeShort = ["ow", "cw", "tw"];
    const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const { isLoading, error, data } = useQuery(["commission-gov-grant", workerType, searchParams], () => fetcher(`/commission-gov-grant?${searchParams}`));
    const queryClient = useQueryClient();
    const { mutate, isFetching } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e, workerType, i, id) => {
        if (i > 0) throw error("SEQUENCE HAS BEEN BROKEN");
        e.preventDefault();
        mutate(
            { url: `/commission-gov-grant`, body: { workerType, i, id } },
            {
                onSuccess(data) {
                    toast.success("MONTHLY COMMISSION SUCCESSFULLY SUBMITTED");
                    queryClient.invalidateQueries(["commission-gov-grant", workerType, searchParams]);
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
                    <div className="card datatable-box">
                        <div className="card-header" style={{ background: "var(--cyan-700)" }}>GOVERNMENT GRANT REPORT</div>
                        <div className="card-body">
                            <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                <table className="table pretty  table-bordered table-sm table-hover custom-table">
                                    <thead>
                                        <tr className="text-center" style={{ background: "var(--gray-300)" }}>
                                            <th>Sl.No.</th>
                                            <th>Claim ID</th>
                                            <th>Month-Year</th>
                                            <th>No. of entry in portal</th>
                                            <th>Commission for entry in portal in Rs.</th>
                                            <th>No. of entry in passbook</th>
                                            <th>Commission for entry in passbook in Rs.</th>
                                            <th>Total Amount</th>
                                            <th>Submitted On</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <LoadingSpinner />}
                                        {data &&
                                            data?.dataResult?.data?.length > 0 &&
                                            data?.dataResult?.data?.map((item, i) => {
                                                return (
                                                    <tr key={i} className="table-sm align-middle small">
                                                        <td style={wrapStyle}>{data?.dataResult?.from + i}</td>
                                                        <td style={wrapStyle}>{item.id}</td>
                                                        <td style={wrapStyle}>
                                                            {monthFull[item.month - 1]}-{item.year}
                                                        </td>
                                                        <td style={wrapStyle}>{item.added_count}</td>
                                                        <td style={wrapStyle}>{item.added_amt}</td>
                                                        <td style={wrapStyle}>{item.collected_count}</td>
                                                        <td style={wrapStyle}>{item.collected_amt}</td>
                                                        <td style={wrapStyle}>{item.total_amt}</td>
                                                        <td style={wrapStyle}>{item.submited_dt}</td>
                                                        <td style={wrapStyle}>
                                                            {item.status == "P" && "Pending"}
                                                            {item.status == "S" && "Pending at IMW"}
                                                            {item.status == "V" && "Pending at ALC"}
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
                    <div className="card datatable-box">
                        <div className="card-header" style={{ background: "var(--pink-700)" }}>
                            PENDING GOVERNMENT GRANT
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table pretty  table-bordered table-sm table-hover custom-table-two">
                                    <thead>
                                        <tr className="text-center" style={{ background: "var(--gray-300)" }}>
                                            <th>Sl.No.</th>
                                            <th>Month-Year</th>
                                            <th>No. of entry in portal</th>
                                            <th>Commission for entry in portal in Rs.</th>
                                            <th>No. of entry in passbook</th>
                                            <th>Commission for entry in passbook in Rs.</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && <p>Loading...</p>}
                                        {data &&
                                            data?.data?.length > 0 &&
                                            data?.data.map((item, i) => {
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
                                                        <td style={wrapStyle}>{item.total_amt}</td>
                                                        <td style={wrapStyle}>Pending</td>
                                                        <td style={wrapStyle}>
                                                            {i == 0 && (
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={(e) => {
                                                                        const confirmBox = window.confirm(
                                                                            "I do hereby declare that I have updated Passbook of all the beneficiaries for whom the above commission is being claimed and the claims are being raised only against the approved beneficiaries."
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

                    <br />
                    <br />
                    <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                        <span className="badge text-bg-danger">NOTE:</span>
                        <ul>
                            <li>Check and submit your commission for government grant for approval.</li>
                            <li>Check and Update Bank Details and Pan Number</li>
                            <li>IF PAN NUMBER IS NOT UPDATED THEN 20% TDS WILL BE DEDUCTED</li>
                        </ul>
                    </h6>
                </>
            )}
        </>
    );
};

export default CommissionGovGrantForm;
