import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => {
    return (
        <>
            <Pie data={data} width={100} height={100} />
        </>
    );
};

export default PieChart;
