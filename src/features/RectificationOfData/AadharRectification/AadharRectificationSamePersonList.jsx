import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import NoDataFound from "../../../components/list/NoDataFound";
import Pagination from "../../../components/Pagination";

const AadharRectificationSamePersonList = () => {
    const type = "Same";
    const [searchParams, setSearchParams] = useSearchParams({ type });

    const { error, data, isLoading } = useQuery(["get-aadhar-list", searchParams.toString()], () => fetcher(`/get-aadhar-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {!isLoading && data?.data?.length === undefined && <NoDataFound />}
            {data && (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm table-hover">
                        <thead>
                            <tr>
                                <th scope="col" width="5%">
                                    SL No.
                                </th>
                                <th scope="col" width="30%">
                                    Aadhar No.
                                </th>
                                <th scope="col">SSIN & Beneficiary Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{data?.from + index}</td>
                                        <td>
                                            <button type="button" className="btn btn-sm">
                                                {item.aadhar} <span className="badge text-bg-primary">{item.count}</span>
                                            </button>
                                        </td>
                                        <td>
                                            {item.list?.list.map((item, index) => {
                                                return (
                                                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" key={index}>
                                                        <div className="btn-group me-2 mb-2" role="group" aria-label="First group">
                                                            <button type="button" className="btn btn-primary btn-sm">
                                                                {item.ssin}
                                                            </button>
                                                        </div>
                                                        <div className="btn-group me-2 mb-2" role="group" aria-label="Second group">
                                                            <button type="button" className="btn btn-light btn-sm" disabled>
                                                                {item.name}
                                                            </button>
                                                        </div>
                                                        <div className="btn-group me-2 mb-2" role="group" aria-label="Second group">
                                                            {item.status === "A" && (
                                                                <button type="button" className="btn btn-success btn-sm">
                                                                    <i className="fa-solid fa-person-circle-check"></i> Approved
                                                                </button>
                                                            )}
                                                            {item.status === "SA" && (
                                                                <>
                                                                    <button type="button" className="btn btn-warning btn-sm">
                                                                        <i className="fa-solid fa-people-arrows"></i> Same Person
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {data?.data?.length > 0 && <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
        </>
    );
};

export default AadharRectificationSamePersonList;
