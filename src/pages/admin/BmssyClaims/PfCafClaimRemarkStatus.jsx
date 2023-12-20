import { useQuery } from "@tanstack/react-query";
import React from "react";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { fetcher } from "../../../utils";

const PfCafClaimRemarkStatus = ({ id }) => {
    const { error, data, isFetching } = useQuery(["get-pf-caf-claim-remarks-details", id], () => fetcher(`/get-pf-caf-claim-remarks-details?id=${id}`), { enabled: id ? true : false });

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card datatable-box mt-2">
                    <div className="card-body">
                        <div className="card-title">Remarks Details </div>
                        <div className="table-responsive mb-2">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                        <th>Current Position</th>
                                        <th>Remark By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data?.from + index}</td>
                                                <td>{item.date}</td>
                                                <td>{item.application_status}</td>
                                                <td>{item.forward_note}</td>
                                                <td>{item.current_position}</td>
                                                <td>{item.fullname}</td>
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

export default PfCafClaimRemarkStatus;
