import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApplicationStatusWiseLink from "../../components/list/ApplicationStatusWiseLink ";
import { fetcher } from "../../utils";
import ControlledIMWApplicationListFilter from "./IMWApplicationListFilter";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import TableList from "../../components/table/TableList";

const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "application_id",
        headerName: "Application No.",
    },
    {
        field: "registration_no",
        headerName: "Registration No.",
    },
    {
        field: "approval_date",
        headerName: "Registration Date",
    },
    {
        field: "ssin_no",
        headerName: "SSIN",
    },
    {
        field: 1,
        headerName: "Beneficiary Name",
        renderHeader: (item) => {
            return `${item.fname} ${item.mname ? " " + item.mname : ""} ${item.lname ? " " + item.lname : ""}`;
        },
    },
    {
        field: "mobile",
        headerName: "Mobile",
    },

    {
        field: "gp_ward_name",
        headerName: "GP/Ward Name",
    },
    {
        field: 1,
        headerName: "Action",
        renderHeader: (props) => {
            return <ApplicationStatusWiseLink item={props} />;
        },
    },
];
const SSYApprovedList = ({ type }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const { isLoading, isFetching, error, data } = useQuery(["imw-application-list", "ssyApproved", searchParams.toString()], () => fetcher(`/imw-application-list/ssyApproved?${searchParams.toString()}`), {
        enabled: true,
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Application List", url: "/application-list/ssyApproved", subTitle: "SSY Approved Application List", subUrl: "" }));
    }, []);

    return (
        <>
            <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} type={type} />
            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};
export default SSYApprovedList;
