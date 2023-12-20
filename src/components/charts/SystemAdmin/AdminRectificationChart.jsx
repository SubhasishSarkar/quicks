import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../utils";
import LoadingSpinner from "../../list/LoadingSpinner";
import { PolarArea } from "react-chartjs-2";
import ErrorAlert from "../../list/ErrorAlert";
import { enableQueryOnMount } from "../../../data";

const AdminRectificationChart = () => {
    const { data, isFetching, error } = useQuery(["system-admin-rectification-countable-data"], () => fetcher(`/system-admin-rectification-countable-data`), { ...enableQueryOnMount });

    const ifNOData = ["0", "0", "0", "0", "0"];
    const dataArray = data ? [data[0]?.regNoOwCount, data[0]?.regDateCwTwCount, data[0]?.regDateOwCount, data[0]?.workerTypeCount, data[0]?.addressCount] : [];

    const dataTable = {
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
                <div className="card-header bg-light border-0 text-dark d-flex justify-content-md-center p-1 m-0 fw-semibold">Rectification Pending</div>
                <div className="card-body">
                    <div className="d-flex justify-content-md-center">
                        {error && <ErrorAlert error={error} />}
                        {isFetching && <LoadingSpinner />}
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-start">
                                <div className="d-flex justify-content-md-center p-0" style={{ position: "relative", bottom: "10px", width: "80%" }}>
                                    {data && <PolarArea data={dataTable} width={100} height={100} />}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-start">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <span className="btn position-relative text-light" style={{ fontSize: "14px", cursor: "default", background: "rgb(132 80 245)" }}>
                                            Registration Number (OW)
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[0]}</span>
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        <span className="btn position-relative text-dark" style={{ fontSize: "14px", cursor: "default", background: "rgb(237 195 67)" }}>
                                            Registration Date (OW)
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[2]}</span>
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        <span className="btn position-relative text-light" style={{ fontSize: "14px", cursor: "default", background: "rgb(213 84 84)" }}>
                                            Worker Type
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[3]}</span>
                                        </span>
                                    </div>
                                    <div className="col-12">
                                        <span className="btn position-relative text-dark" style={{ fontSize: "14px", cursor: "default", background: "#31d2f2" }}>
                                            Registration Date (CW/TW)
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[1]}</span>
                                        </span>
                                    </div>

                                    <div className="col-12">
                                        <span className="btn position-relative text-dark" style={{ fontSize: "14px", cursor: "default", background: "rgb(60 183 109)" }}>
                                            Address
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">{dataArray[4]}</span>
                                        </span>
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

export default AdminRectificationChart;
