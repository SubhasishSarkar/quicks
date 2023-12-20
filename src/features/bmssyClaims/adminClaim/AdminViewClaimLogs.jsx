import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import NoDataFound from "../../../components/list/NoDataFound";

const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "fdate",
        headerName: "Date",
    },
    {
        field: "status",
        headerName: "Status",
    },
    {
        field: "remarks",
        headerName: "Remark",
    },
    {
        field: "exception_remark",
        headerName: "Exceptional remark",
    },
    {
        field: "actionby",
        headerName: "Action taken by",
    },
];

function AdminViewClaimLogs({ applicationId }) {
    const { data, isLoading, isFetching, error } = useQuery(["benapplicationAdminViewClaimLog", applicationId], () => fetcher(`/benapplicationAdminViewClaimLog/${applicationId}`), {
        enabled: applicationId ? true : false,
    });

    return (
        <>
            {(isFetching || isLoading) && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {!(isFetching || isLoading) &&
                (data?.data?.length > 0 ? (
                    data?.data?.map((item) => {
                        return (
                            <>
                                <div className="card p-2 mb-2">
                                    <strong>Claim Id: {item.claimId}</strong>
                                    <div>
                                        <TableList data={{ data: [...item.statusDetails] }} isLoading={isLoading || isFetching} error={error} tableHeader={columns} disablePagination={true} />
                                    </div>
                                </div>
                            </>
                        );
                    })
                ) : (
                    <NoDataFound />
                ))}
        </>
    );
}

export default AdminViewClaimLogs;
