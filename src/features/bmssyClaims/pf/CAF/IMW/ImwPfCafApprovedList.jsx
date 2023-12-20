import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetcher } from "../../../../../utils";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import Pagination from "../../../../../components/Pagination";
import NoDataFound from "../../../../../components/list/NoDataFound";

const ImwPfCafApprovedList = () => {
    const cafClaimType = "Approved";
    const [searchParams, setSearchParams] = useSearchParams({ cafClaimType });
    const { error, data, isFetching } = useQuery(["get-pf-caf-claim-list", searchParams.toString()], () => fetcher(`/get-pf-caf-claim-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && data?.data.length > 0 ? (
                <div style={{ overflow: "auto" }} className="table-container table-responsive">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Beneficiary Name</th>
                                <th>SSIN</th>
                                <th>Registration Number</th>
                                <th>Registration Date</th>
                                <th>Application Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>{data?.from + index}</td>
                                        <td style={wrapStyle}>{item.name}</td>
                                        <td style={wrapStyle}>{item.ssin}</td>
                                        <td style={wrapStyle}>{item.reg_no}</td>
                                        <td style={wrapStyle}>{item.reg_date}</td>
                                        <td style={wrapStyle}>{item.created_date}</td>
                                        <td style={wrapStyle}>
                                            <button className="btn btn-sm btn-success">
                                                <Link to={"/claim/Imw-pf-caf-details/" + item.enc_caf_claim_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                    View
                                                </Link>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <NoDataFound />
            )}
            <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
        </>
    );
};

export default ImwPfCafApprovedList;
