import React, { useEffect } from "react";
import ErrorAlert from "../../components/list/ErrorAlert";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import { enableQueryOnMount } from "../../data";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/list/LoadingSpinner";

const AllWorkerCount = ({ districtId, setDistrictId }) => {
    const user = useSelector((state) => state.user.user);

    const setDistrictData = () => {
        setDistrictId(0);
    };

    const cwBack = {
        background: "linear-gradient(83deg,  rgb(241 243 243 / 93%) 10%, rgba(253,29,29,0.8547794117647058) 100%)",
        border: "none",
    };
    const twBack = {
        background: "linear-gradient(83deg, rgb(241 243 243 / 93%) 10%, rgba(253,187,45,1) 100%)",
        border: "none",
    };
    const owBack = {
        background: "linear-gradient(83deg, rgb(241 243 243 / 93%) 10%, rgba(22,187,6,1) 100%)",
        border: "none",
    };

    const { error, data, isLoading, refetch } = useQuery(["get-total-worker-count", districtId], () => fetcher(`/get-total-worker-count?disCode=${districtId}`), { ...enableQueryOnMount });

    useEffect(() => {
        const fetchData = async () => {
            await refetch();
        };
        fetchData();
    }, [districtId, refetch]);

    return (
        <>
            {error && <ErrorAlert error={error} />}

            {user.role === "SUPER ADMIN" && (
                <>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <ol className="list-group user_profile" style={{ width: "90%" }}>
                                <li className="list-group-item ">
                                    Construction Worker : {data && data?.total_cw} {isLoading && <LoadingSpinner />}
                                </li>
                                <li className="list-group-item ">
                                    Transport Worker : {data && data?.total_tw} {isLoading && <LoadingSpinner />}
                                </li>
                                <li className="list-group-item ">
                                    Other Worker : {data && data?.total_ow} {isLoading && <LoadingSpinner />}
                                </li>
                            </ol>
                        </div>
                        <div className="col-md-12">
                            <button className="btn btn-sm btn-primary" type="button" disabled={districtId === 0 ? true : false} onClick={() => setDistrictData()}>
                                Show All District Data
                            </button>
                        </div>
                    </div>
                </>
            )}

            {user.role != "SUPER ADMIN" && (
                <div className="row mb-2" style={{ opacity: "85%" }}>
                    <div className="col-md-4 mb-3">
                        <div className="card shadow h-100 py-2" style={cwBack}>
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col-md-3">
                                        <i className="fa-solid fa-person-digging fa-3x text-danger"></i>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="col-md-12">
                                            <div className="badge text-bg-transparent text-dark fs-6 ">Construction Worker</div>
                                        </div>
                                        <div className="badge text-bg-transparent text-dark fs-6">
                                            {isLoading && <i className="fa-solid fa-hourglass-half fa-spin"></i>}
                                            {data && data?.total_cw}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card shadow h-100 py-2" style={twBack}>
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col-md-3">
                                        <i className="fas fa-bus-alt fa-3x text-warning"></i>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="col-md-12">
                                            <div className="badge text-bg-transparent text-dark fs-6 ">Transport Worker</div>
                                        </div>
                                        <div className="badge text-bg-transparent text-dark fs-6">
                                            {isLoading && <i className="fa-solid fa-hourglass-half fa-spin"></i>}
                                            {data && data?.total_tw}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card shadow h-100 py-2" style={owBack}>
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col-md-3">
                                        <i className="fa-solid fa-people-group fa-3x text-success"></i>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="col-md-12">
                                            <div className="badge text-bg-transparent text-dark fs-6 ">Other Worker</div>
                                        </div>
                                        <div className="badge text-bg-transparent text-dark fs-6">
                                            {isLoading && <i className="fa-solid fa-hourglass-half fa-spin"></i>}
                                            {data && data?.total_ow}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllWorkerCount;
