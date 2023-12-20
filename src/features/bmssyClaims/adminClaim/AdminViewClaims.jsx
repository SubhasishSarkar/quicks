import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";

const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "id",
        headerName: "Claim Id",
    },
    {
        field: "claim_for",
        headerName: "Claim For",
    },
    {
        field: "benefit_name",
        headerName: "Claim Type",
    },
    {
        field: "added_by",
        headerName: "Added By",
    },
    {
        field: "nominee_name",
        headerName: "Nominee Name",
    },
    {
        field: "nominee_mobile",
        headerName: "Nominee Mobile",
    },
    {
        field: "nominee_aadhaar",
        headerName: "Nominee Aadhaar",
    },
    {
        field: 1,
        headerName: "Nominee Bank",
        renderHeader: ({ nominee_bank_ifsc, nominee_bank_account }) => {
            return (
                <>
                    <strong>IFSC :</strong> {nominee_bank_ifsc}
                    <br />
                    <strong>Ac/No :</strong> {nominee_bank_account}
                </>
            );
        },
    },
    {
        field: "date_of_death",
        headerName: "Date of death",
    },
    {
        field: "approved_amount",
        headerName: "Approved amount",
    },
    {
        field: "approve_share",
        headerName: "Approved share (%)",
    },
];

function AdminViewClaims({ applicationId }) {
    const { data, isLoading, isFetching, error } = useQuery(["benapplicationAdminViewClaimDetails", applicationId], () => fetcher(`/benapplicationAdminViewClaimDetails/${applicationId}`), {
        enabled: applicationId ? true : false,
    });

    return (
        <>
            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} disablePagination={true} />
        </>
    );
}

export default AdminViewClaims;
