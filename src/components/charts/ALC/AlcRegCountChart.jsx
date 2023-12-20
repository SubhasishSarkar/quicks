import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetcher } from "../../../utils";
import LoadingSpinner from "../../list/LoadingSpinner";
import ErrorAlert from "../../list/ErrorAlert";
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const AlcRegCountChart = () => {
    const [lineValue] = useState("year");
    const { error, data, isLoading } = useQuery(["line-chart-data", lineValue], () => fetcher(`/line-chart-data?type=${lineValue}`));

    const barDataJson = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "Total registration in your RLO on this year",
                backgroundColor: "rgb(280, 99, 132)",
                borderColor: "rgb(280, 99, 155)",
                data: data,
            },
        ],
    };

    return (
        <>
            <div className="card border-0" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                <div className="card-body">
                    <div className="card-text">
                        <div>
                            {isLoading && <LoadingSpinner />}
                            {error && <ErrorAlert error={error} />}
                            <div style={{ height: "35vh" }}>{data && <Bar data={barDataJson} />}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlcRegCountChart;
