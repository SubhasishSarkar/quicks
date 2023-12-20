import React, { useState } from "react";
import LoadingSpinner from "../../list/LoadingSpinner";
import ErrorAlert from "../../list/ErrorAlert";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import { enableQueryOnMount } from "../../../data";

const AdminRegCountChart = () => {
    const [lineValue] = useState("year");
    const { data, isFetching, error } = useQuery(["system-admin-registration-countable-data", lineValue], () => fetcher(`/system-admin-registration-countable-data?type=${lineValue}`), { ...enableQueryOnMount });

    const registrationDataTable = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "Total registration in this year",
                backgroundColor: "rgb(280, 99, 132)",
                borderColor: "rgb(280, 99, 155)",
                data: data,
            },
        ],
    };
    return (
        <>
            <div className="card border-0 mb-3" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                <div className="card-body">
                    {isFetching && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}
                    <div style={{ height: "33.5vh" }}>{data && <Bar data={registrationDataTable} />}</div>
                </div>
            </div>
        </>
    );
};

export default AdminRegCountChart;
