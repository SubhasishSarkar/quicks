import { useQuery } from "@tanstack/react-query";
import React from "react";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { fetcher } from "../../../utils";

const ClaimRemarkStatus = ({ id }) => {
    const { error, data, isFetching } = useQuery(["get-claim-remarks-details", id], () => fetcher(`/get-claim-remarks-details?id=${id}`), { enabled: id ? true : false });

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card datatable-box shadow mt-2">
                    <div className="card-header">Remarks Details</div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                        <th>Exception Remarks</th>
                                        <th>Remark By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{index + 1}</td>
                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{item.date}</td>
                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{item.application_status}</td>
                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{item.forward_note}</td>
                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{item.exception_remark}</td>
                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{item.fullname}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClaimRemarkStatus;
