import ImwClaimChart from "../../components/charts/IMW/ImwClaimChart";
import ImwRectificationChart from "../../components/charts/IMW/ImwRectificationChart";
import AllWorkerCount from "./AllWorkerCount";

const ImwDashboard = () => {
    return (
        <>
            <AllWorkerCount />
            <div className="row">
                <div className="col-md-6">
                    <ImwClaimChart />
                </div>
                <div className="col-md-6">
                    <ImwRectificationChart />
                </div>
            </div>
        </>
    );
};

export default ImwDashboard;
