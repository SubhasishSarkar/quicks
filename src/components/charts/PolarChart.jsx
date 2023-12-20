import React from "react";
import { PolarArea } from "react-chartjs-2";

const PolarChart = ({ data }) => {
    return (
        <>
            <PolarArea data={data} width={100} height={100} />
        </>
    );
};

export default PolarChart;
