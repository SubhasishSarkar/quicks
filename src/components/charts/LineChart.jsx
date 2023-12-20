import React from "react";
// import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import LoadingSpinner from "../list/LoadingSpinner";
import ErrorAlert from "../list/ErrorAlert";
import { disableQuery } from "../../data";

const get_all_dates = (year, month) => {
    let monthIndex = month - 1;
    let names = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let date = new Date(year, monthIndex, 1);
    let result = [];
    while (date.getMonth() == monthIndex) {
        result.push(date.getDate() + "-" + names[date.getDay()]);
        date.setDate(date.getDate() + 1);
    }
    return result;
};

const LineChart = ({ lineValue }) => {
    const {
        error,
        data: tblData,
        isLoading,
    } = useQuery(["line-chart-data", lineValue], () => fetcher(`/line-chart-data?type=${lineValue}`), {
        ...disableQuery,
    });

    let labels = "";
    if (lineValue === "year") {
        labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    } else if (lineValue === "month") {
        labels = get_all_dates(new Date().getFullYear(), new Date().getMonth() + 1);
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Total registration in your RLO on this " + lineValue,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: tblData,
            },
        ],
    };

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            <div>{tblData && <Line data={data} />}</div>
        </>
    );
};

export default LineChart;
