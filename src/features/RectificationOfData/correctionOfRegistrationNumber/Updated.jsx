import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import { useSearchParams } from "react-router-dom";
import TableList from "../../../components/table/TableList";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";

const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "full_name",
        headerName: "Beneficiary Name",
    },
    {
        field: "ssin_no",
        headerName: "SSIN",
    },
    {
        field: "old_registration_number",
        headerName: "Old Registration No.",
    },
    {
        field: "registration_no",
        headerName: "Rectified Registration No.",
    },
];

const Updated = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isFetching, data, error, isLoading } = useQuery(["get-updated-registration-number", searchParams.toString()], () => fetcher(`/get-updated-registration-number?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };


    const searchOptions = [
        {'value':'ssin_no','name':'SSIN'},
        { 'value':'registration_no','name':'Registration No.'}
    ]

    return (
        <>
            <ControlledIMWApplicationListFilter  isFetching={isFetching} isLoading={isLoading}  searchOptions = {searchOptions}/>
            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default Updated;
