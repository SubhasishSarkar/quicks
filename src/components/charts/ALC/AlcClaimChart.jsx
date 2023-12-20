import React, { useState } from "react";
import LoadingSpinner from "../../list/LoadingSpinner";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

const AlcClaimChart = () => {
    const [pieValue, setPieValue] = useState("year");

    const handleChange = (evt) => {
        setPieValue(evt);
    };
    const { data: pieData, isLoading: pieLoading } = useQuery(["pie-chart-data", pieValue], () => fetcher(`/pie-chart-data?type=${pieValue}`));
    const ifNOData = ["0", "0", "0", "0", "0"];

    const pieDataJson = {
        labels: "",
        datasets: [
            {
                //label: ["Pending", "Rectification", "Rec. Reject", "Rejected", "Approved"],
                data: pieData ? pieData : ifNOData,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)"],
                borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 1.5,
            },
        ],
    };

    return (
        <>
            <div className="card mb-3 border-0" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                <div className="card-body">
                    <div className="row justify-content-between">
                        <div className="card-text">
                            <div className="row">
                                {pieLoading && <LoadingSpinner />}
                                {pieData && (
                                    <div className="row">
                                        <div className="col-md-6 pie-chat">
                                            <div className="mt-3">
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item border-0">
                                                        <div className="row">
                                                            <div className="col-md-7 fw-semibold fs-6 text-primary">
                                                                <i className="fa-solid fa-chart-pie"></i> Claims Chart
                                                            </div>
                                                            <div className="col-md-5">
                                                                <div className="form-group">
                                                                    <select
                                                                        id="type_of_Claim"
                                                                        name="type_of_Claim"
                                                                        className="form-select border-rounded"
                                                                        value={pieValue}
                                                                        onChange={(e) => {
                                                                            handleChange(e.currentTarget.value);
                                                                        }}
                                                                    >
                                                                        <option value="year">This Year</option>
                                                                        <option value="month">This Month</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item border-0">
                                                        <Link to="/claim/list?type=Pending" style={{ textDecoration: "none" }}>
                                                            <div className="row">
                                                                <div className="col-md-8 text-dark fw-semibold">
                                                                    <i className="fa-solid fa-square" style={{ color: "rgb(132 80 245)" }}></i> Pending
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[0]}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    <li className="list-group-item border-0">
                                                        <Link to="/claim/list?type=Back+For+Rectification" style={{ textDecoration: "none" }}>
                                                            <div className="row">
                                                                <div className="col-md-8 text-dark fw-semibold">
                                                                    <i className="fa-solid fa-square" style={{ color: "#31d2f2" }}></i> Rectification
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[1]}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    <li className="list-group-item border-0">
                                                        <Link to="/claim/list?type=Recommended+to+Rejection" style={{ textDecoration: "none" }}>
                                                            <div className="row">
                                                                <div className="col-md-8 text-dark fw-semibold">
                                                                    <i className="fa-solid fa-square" style={{ color: "rgb(237 195 67)" }}></i> Rec. Reject
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[2]}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    <li className="list-group-item border-0">
                                                        <Link to="/claim/list?type=Rejected" style={{ textDecoration: "none" }}>
                                                            <div className="row">
                                                                <div className="col-md-8 text-dark fw-semibold">
                                                                    <i className="fa-solid fa-square" style={{ color: "rgb(213 84 84)" }}></i> Rejected
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[3]}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    <li className="list-group-item border-0">
                                                        <Link to="/claim/list?type=Approved" style={{ textDecoration: "none" }}>
                                                            <div className="row">
                                                                <div className="col-md-8 text-dark fw-semibold">
                                                                    <i className="fa-solid fa-square" style={{ color: "rgb(60 183 109)" }}></i> Approved
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[4]}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {pieData?.every((item) => item === "0") ? (
                                                <div style={{ marginTop: 10, width: "235px", height: "232px", borderRadius: "50%", display: "inline-block", border: "1px solid red" }}>
                                                    <h2 style={{ textAlign: "center", marginTop: 82, padding: 20 }}>No Data Found in this {pieValue}</h2>
                                                </div>
                                            ) : (
                                                <div style={{ height: "40vh", position: "relative", top: "30px" }}>{pieData && <Pie data={pieDataJson} width={100} height={100} />}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlcClaimChart;
