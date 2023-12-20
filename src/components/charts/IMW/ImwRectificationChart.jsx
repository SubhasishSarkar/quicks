import React from "react";
import { fetcher } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import ErrorAlert from "../../list/ErrorAlert";
import LoadingSpinner from "../../list/LoadingSpinner";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";

const ImwRectificationChart = () => {
    const { data, error, isLoading } = useQuery(["imw-rectification-pie-chart-data"], () => fetcher(`/imw-rectification-pie-chart-data`));

    const dataArray = data ? [data[0]?.regNoOwCount, data[0]?.regDateCwTwCount, data[0]?.regDateOwCount, data[0]?.workerTypeCount, data[0]?.addressCount] : [];

    const ifNOData = ["0", "0", "0", "0", "0"];

    const chartData = {
        labels: "",
        datasets: [
            {
                data: data ? dataArray : ifNOData,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)"],
                borderWidth: 1,
            },
        ],
    };
    return (
        <>
            <div className="card border-0" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                <div className="card-body">
                    <div className="d-flex justify-content-md-center">
                        {error && <ErrorAlert error={error} />}
                        {isLoading && <LoadingSpinner />}
                    </div>
                    <div className="card-title mb-4">
                        <div className="row">
                            <div className="col-md-6">
                                <i className="fa-solid fa-chart-pie"></i> Rectification Pending
                            </div>
                            <div className="col-md-6">
                                <small className="text-muted">Click below buttons to go directly</small>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-start">
                                <div style={{ width: "100%", position: "relative", bottom: "15px" }}>
                                    <Doughnut data={chartData} width={100} height={100} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-start">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <Link to="/rectification/registration-number" style={{ textDecoration: "none" }}>
                                            <button type="button" className="btn position-relative text-light" style={{ fontSize: "14px", background: "rgb(132 80 245)" }}>
                                                Registration Number (OW)
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[0]}</span>
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="col-12">
                                        <Link to="/rectification/registration-date" style={{ textDecoration: "none" }}>
                                            <button type="button" className="btn position-relative text-dark" style={{ fontSize: "14px", background: "rgb(237 195 67)" }}>
                                                Registration Date (OW)
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[2]}</span>
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="col-12">
                                        <Link to="/rectification/worker-type" style={{ textDecoration: "none" }}>
                                            <button type="button" className="btn position-relative text-light" style={{ fontSize: "14px", background: "rgb(213 84 84)" }}>
                                                Worker Type
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[3]}</span>
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="col-12">
                                        <Link to="/rectification/registration-date-cw-tw" style={{ textDecoration: "none" }}>
                                            <button type="button" className="btn position-relative text-dark" style={{ fontSize: "14px", background: "#31d2f2" }}>
                                                Registration Date (CW/TW)
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[1]}</span>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="col-12">
                                        <Link to="/rectification/address-rectification" style={{ textDecoration: "none" }}>
                                            <button type="button" className="btn position-relative text-dark" style={{ fontSize: "14px", background: "rgb(60 183 109)" }}>
                                                Address
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[4]}</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImwRectificationChart;
