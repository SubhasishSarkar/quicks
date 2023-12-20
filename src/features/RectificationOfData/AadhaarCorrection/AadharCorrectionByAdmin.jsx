import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";
import TableList from "../../../components/table/TableList";
import { useSearchParams } from "react-router-dom";

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
        headerName: "Reg. No",
    },
    {
        field: "name",
        headerName: "Name",
    },
    {
        field: "mobile",
        headerName: "Mobile",
    },
    {
        field: "dob",
        headerName: "DOB",
    },
    {
        field: "aadhar",
        headerName: "AADHAAR",
    },
    {
        field: "name_collection",
        headerName: "Sent to ARN",
    },
    {
        field: 1,
        headerName: "Action",
        renderHeader: (props) => {
            return (
                <button
                    className="btn btn-sm btn-success"
                    onClick={() => {
                        console.log(props);
                    }}
                >
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <i className="fa-solid fa-retweet"></i> Rectify
                </button>
            );
        },
    },
];

const AadharCorrectionByAdmin = () => {
    const [searchParams] = useSearchParams(true);

    const { isFetching, data, error, isLoading } = useQuery([`get_aadhar_correction_log`], () => fetcher(`/get_aadhar_correction_log`));
    const {
        isFetching: isFetching1,
        data: data1,
        error: error1,
    } = useQuery([`get_aadhar_correction_log`, searchParams.toString()], () => fetcher(`/get_aadhar_correction_log?${searchParams.toString()}`), {
        enabled: searchParams.get("searchVal") ? true : false,
    });

    return (
        <>
            <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />
            <div className="card-nav-tabs pt-2">{data1 && <TableList data={data1} isLoading={isFetching1} error={error1} disablePagination tableHeader={columns} />}</div>

            <div className="card-nav-tabs pt-2">
                <TableList data={data} isLoading={isLoading || isFetching} error={error} disablePagination tableHeader={columns} />
            </div>
        </>
    );
};

export default AadharCorrectionByAdmin;
