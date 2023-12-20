import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import LoadingSpinner from "../../list/LoadingSpinner";
import { Pie } from "react-chartjs-2";
import { enableQueryOnMount } from "../../../data";

const AdminClaimChart = () => {
    const { data: pieData, isLoading: pieLoading } = useQuery(["admin-claim-count-chart-data"], () => fetcher(`/admin-claim-count-chart-data`), { ...enableQueryOnMount });
    const ifNOData = ["0", "0", "0", "0", "0"];

    const pieDataJson = {
        labels: "",
        datasets: [
            {
                //label: ["Pending", "Rectification", "Rec. Reject", "Rejected", "Approved"],
                data: pieData ? pieData : ifNOData,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)"],
                // borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 0.5,
            },
        ],
    };

    return (
        <>
            <div className="card mb-3 border-0" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                <div className="card-header bg-light border-0 text-dark d-flex justify-content-md-center m-0 fw-semibold">Claims Chart</div>
                <div className="card-body">
                    <div className="row justify-content-between">
                        <div className="row">
                            {pieLoading && <LoadingSpinner />}
                            {pieData && (
                                <>
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col-md-8 text-dark fw-semibold">
                                                        <i className="fa-solid fa-square" style={{ color: "rgb(132 80 245)" }}></i> Approved
                                                    </div>
                                                    <div className="col-md-4">
                                                        <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[0]}</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col-md-8 text-dark fw-semibold">
                                                        <i className="fa-solid fa-square" style={{ color: "#31d2f2" }}></i> Disbursed
                                                    </div>
                                                    <div className="col-md-4">
                                                        <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[1]}</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col-md-8 text-dark fw-semibold">
                                                        <i className="fa-solid fa-square" style={{ color: "rgb(237 195 67)" }}></i> Gen. Memo
                                                    </div>
                                                    <div className="col-md-4">
                                                        <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[2]}</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col-md-8 text-dark fw-semibold">
                                                        <i className="fa-solid fa-square" style={{ color: "rgb(213 84 84)" }}></i> Gen. Release
                                                    </div>
                                                    <div className="col-md-4">
                                                        <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[3]}</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item border-0">
                                                <div className="row">
                                                    <div className="col-md-8 text-dark fw-semibold">
                                                        <i className="fa-solid fa-square" style={{ color: "rgb(60 183 109)" }}></i> Gen. Advice
                                                    </div>
                                                    <div className="col-md-4">
                                                        <span className="badge rounded-pill text-bg-light text-gray-800 fs-6">{pieData && pieData[4]}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex justify-content-md-center p-0" style={{ position: "relative", bottom: "10px", width: "90%" }}>
                                            {pieData && <Pie data={pieDataJson} width={100} height={100} />}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminClaimChart;
