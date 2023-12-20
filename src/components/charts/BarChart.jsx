import { Bar } from "react-chartjs-2";

export const BarChart = ({ data }) => {
    return (
        <>
            <Bar data={data} width={100} height={100} />
        </>
    );
};
