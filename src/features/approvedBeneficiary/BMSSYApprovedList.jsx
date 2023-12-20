import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import ControlledIMWApplicationListFilter from "../IMWApplicationList/IMWApplicationListFilter";
import TableList from "../../components/table/TableList";
import ApplicationStatusWiseLink from "../../components/list/ApplicationStatusWiseLink ";

const namePattern = /^[a-zA-Z ]+(\.|')?[a-zA-Z ]+(\.|')?/;
const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "ssin_no",
        headerName: "SSIN",
    },
    {
        field: "registration_no",
        headerName: "Registration No",
    },
    {
        field: "registration_date",
        headerName: "Registration Date",
    },
    {
        field: "fullname",
        headerName: "Beneficiary Name",
    },

    {
        field: 1,
        headerName: "Fathers / Husband Name",
        renderHeader: (item) => {
            return (
                <>
                    {item.husband_name && item.husband_name !== "N/A" && namePattern.test(item.husband_name) && item.husband_name?.trim() !== "." ? (
                        <>
                            <span className="badge text-bg-light me-1">Husband:</span>
                            {item.husband_name}
                        </>
                    ) : (
                        <>
                            <span className="badge text-bg-light me-1">Father:</span>
                            {item.father_name}
                        </>
                    )}
                </>
            );
        },
    },
    {
        field: "gp_ward_name",
        headerName: "GP/Ward",
    },
    {
        field: "mobile",
        headerName: "Mobile",
    },
    {
        field: 1,
        headerName: "Action",
        renderHeader: (props) => {
            return <ApplicationStatusWiseLink item={props} />;
        },
    },
];

const BMSSYApprovedList = () => {
    const type = "bmssy";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { isLoading, error, data, isFetching } = useQuery(["approved-beneficiary", searchParams.toString()], () => fetcher(`/approved-beneficiary?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "BMSSY Approved Beneficiary List", url: "" }));
    }, []);
    return (
        <>
            <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />
            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default BMSSYApprovedList;
