import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ data }) => {
    return (
        <>
            <Doughnut data={data} width={100} height={100} />
        </>
    );
};

export default DoughnutChart;
