import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";

const Updated = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { isFetching, data,isLoading, error } = useQuery(["update-registration-date-list", searchParams.toString()], () => fetcher(`/update-registration-date-list?${searchParams.toString()}`));
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

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
            field: "registration_no",
            headerName: "Registration Number",
        },
        {
            field: "old_reg_date",
            headerName: "OLD Registration Date",
        },
        {
            field: "registration_date",
            headerName: "Updated Registration Date",
        },
    ];


    const searchOptions = [
        {'value':'ssin_no','name':'SSIN'},
        { 'value':'registration_no','name':'Registration No.'}
    ]

    return (
        <>
            <ControlledIMWApplicationListFilter  isFetching={isFetching} isLoading={isLoading} searchOptions = {searchOptions}/>
            <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default Updated;
