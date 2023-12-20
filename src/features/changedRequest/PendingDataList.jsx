import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import ErrorAlert from "../../components/list/ErrorAlert";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import NoDataFound from "../../components/list/NoDataFound";
import ControlledIMWApplicationListFilter from "../IMWApplicationList/IMWApplicationListFilter";

const PendingDataList = () => {
    const listType = "pending";
    const [searchParams, setSearchParams] = useSearchParams({ listType });
    const { error, data, isLoading,isFetching } = useQuery(["changed-request-list", searchParams.toString()], () => fetcher(`/changed-request-list?${searchParams.toString()}`));
    const user = useSelector((state) => state.user.user);
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const searchOptions = [
        { value: "ssin", name: "SSIN" },
        { value: "cr_num", name: "Changed Request Number" },
    ];


    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && data?.data.length > 0 && (
                <>
                   <ControlledIMWApplicationListFilter isLoading={isLoading} isFetching={isFetching} searchOptions={searchOptions}/>
                    <div style={{ overflow: "auto" }} className="table-container table-responsive">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th width="5%">Changed Request Number</th>
                                    <th width="5%">Number Of Request</th>
                                    <th>SSIN Number</th>
                                    <th>Beneficiary Name</th>
                                    <th>Submitted Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={wrapStyle}>{data?.from + index}</td>
                                            <td style={wrapStyle}>{item.cr_id}</td>
                                            <td style={wrapStyle}>{item.cr_fields.split(",").length}</td>
                                            <td style={wrapStyle}>{item.ssin}</td>
                                            <td style={wrapStyle}>{item.approved_name}</td>
                                            <td style={wrapStyle}>{item.created_date}</td>
                                            <td style={wrapStyle}>Pending</td>
                                            <td style={wrapStyle}>
                                                <button className="btn btn-sm btn-success">
                                                    {(["SLO", "collectingagent", "otherserviceprovider"].includes(user.role) || user.role == "CA" || user.role == "DEO") && (
                                                        <Link to={"/change-request/final-review/" + item.enc_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                            View
                                                        </Link>
                                                    )}
                                                    {user.role === "inspector" && (
                                                        <Link to={"/change-request/imw-view-details/" + item.enc_cr_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                            View
                                                        </Link>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </>
            )}
            {!isFetching && data?.data.length === 0 && <NoDataFound />}
        </>
    );
};

export default PendingDataList;
