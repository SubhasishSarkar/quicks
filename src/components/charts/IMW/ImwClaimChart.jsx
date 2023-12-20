import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import ErrorAlert from "../../list/ErrorAlert";
import LoadingSpinner from "../../list/LoadingSpinner";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

const ImwClaimChart = () => {
    const { data: claimData, isLoading: claimDataLoading, error: claimDataError } = useQuery(["imw-claim-pie-chart-data"], () => fetcher(`/imw-claim-pie-chart-data`));
    const ifClaimNOData = ["0", "0", "0", "0", "0"];

    const claimDataJson = {
        labels: "",
        datasets: [
            {
                //label: ["Pending", "Rectification", "Rec. Reject", "Rejected", "Approved"],
                data: claimData ? claimData : ifClaimNOData,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)"],
                borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 1.5,
            },
        ],
    };
    return (
        <>
            {" "}
            <div className="card border-0" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)", height: "100%" }}>
                <div className="card-body">
                    <div className="d-flex justify-content-md-center">{claimDataError && <ErrorAlert error={claimDataError} />}</div>
                    <div className="card-title mb-3">
                        <div className="row">
                            <div className="col-md-6">
                                <i className="fa-solid fa-chart-pie"></i> Claim Chart
                                {/* <small className="text-muted">(Current Year Only)</small> */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 ">
                            {claimDataLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <div style={{ height: "35vh", position: "relative" }}>
                                    <Pie data={claimDataJson} />
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-center">
                                <small className="text-muted">Click below to go directly</small>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item border-0">
                                    <Link to="/claim/list?type=Pending" style={{ textDecoration: "none" }}>
                                        <div className="row">
                                            <div className="col-md-8 text-dark fw-semibold">
                                                <i className="fa-solid fa-square" style={{ color: "rgb(132 80 245)" }}></i> Pending
                                            </div>
                                            <div className="col-md-4">
                                                <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{claimData && claimData[0]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="list-group-item border-0">
                                    <Link to="/claim/list?type=Forwarded+To+ALC" style={{ textDecoration: "none" }}>
                                        <div className="row">
                                            <div className="col-md-8 text-dark fw-semibold">
                                                <i className="fa-solid fa-square" style={{ color: "#31d2f2" }}></i> Forw. To ALC
                                            </div>
                                            <div className="col-md-4">
                                                <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{claimData && claimData[1]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="list-group-item border-0">
                                    <Link to="/claim/list?type=Sent+Back+To+SLO" style={{ textDecoration: "none" }}>
                                        <div className="row">
                                            <div className="col-md-8 text-dark fw-semibold">
                                                <i className="fa-solid fa-square" style={{ color: "rgb(237 195 67)" }}></i> Back To SLO
                                            </div>
                                            <div className="col-md-4">
                                                <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{claimData && claimData[2]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="list-group-item border-0">
                                    <Link to="/claim/list?type=Sent+Back+From+ALC" style={{ textDecoration: "none" }}>
                                        <div className="row">
                                            <div className="col-md-8 text-dark fw-semibold">
                                                <i className="fa-solid fa-square" style={{ color: "rgb(213 84 84)" }}></i> Back From ALC
                                            </div>
                                            <div className="col-md-4">
                                                <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{claimData && claimData[3]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="list-group-item border-0">
                                    <div className="row">
                                        <div className="col-md-8 text-dark fw-semibold">
                                            <i className="fa-solid fa-square" style={{ color: "rgb(60 183 109)" }}></i> Approved
                                        </div>
                                        <div className="col-md-4">
                                            <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{claimData && claimData[4]}</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImwClaimChart;
