import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import { useNavigate } from "react-router";
import sloImg from "../../../public/assets/icons8-user-94.png";
import imwImg from "../../../public/assets/icons8-administrator-male-94.png";
import ckcoImg from "../../../public/assets/icons8-customer-insights-manager-94.png";
import addUserIcon from "../../../public/assets/icons8-natural-user-interface-2-94.png";
import AlcClaimChart from "../../components/charts/ALC/AlcClaimChart";
import AlcRegCountChart from "../../components/charts/ALC/AlcRegCountChart";
import AllWorkerCount from "./AllWorkerCount";

const AlcDashboard = () => {
    const { data, isLoading } = useQuery(["alc-dashboard-user-count"], () => fetcher(`/alc-dashboard-user-count`));
    const navigate = useNavigate();

    return (
        <>
            <AllWorkerCount />
            <div className="row mb-2">
                <div className="col-md-6 PieChart mb-3">
                    <AlcClaimChart />
                </div>
                <div className="col-md-6 BarChart">
                    <AlcRegCountChart />
                </div>
            </div>
            <div className="row mb-2" style={{ opacity: "85%", position: "relative", bottom: "17px" }}>
                <div className="col-md-3 mb-2">
                    <div className="card shadow border-0" style={{ background: "#8fbc8fe0", cursor: "pointer" }} onClick={() => navigate("/alc-user-management/slo-ca-list")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img src={sloImg} alt="" width={50} height={50} />
                                </div>
                                <div className="col-md-8">
                                    <span className="badge text-gray-800 fw-bolder text-uppercase w-100 fs-6" style={{ textAlign: "start" }}>
                                        Total SLO/CA
                                    </span>
                                    <span className="badge text-gray-800 fs-6">
                                        {isLoading && <i className="fa-solid fa-hourglass-half fa-spin"></i>} {data && data?.slo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-2">
                    <div className="card shadow border-0" style={{ background: "rgb(159 0 255 / 41%)", cursor: "pointer" }} onClick={() => navigate("/alc-user-management/imw-list")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img src={imwImg} alt="" width={50} height={50} />
                                </div>
                                <div className="col-md-8">
                                    <span className="badge text-gray-800 fw-bolder text-uppercase w-100 fs-6" style={{ textAlign: "start" }}>
                                        Total IMW
                                    </span>
                                    <span className="badge text-gray-800 fs-6">
                                        {isLoading && <i className="fa-solid fa-hourglass-half fa-spin"></i>} {data && data?.imw}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-2">
                    <div className="card shadow border-0" style={{ background: "#6495edd1", cursor: "pointer" }} onClick={() => navigate("/alc-user-management/ckco-list")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img src={ckcoImg} alt="" width={50} height={50} />
                                </div>
                                <div className="col-md-8">
                                    <span className="badge text-gray-800 fw-bolder text-uppercase w-100 fs-6" style={{ textAlign: "start" }}>
                                        Total CKCO
                                    </span>
                                    <span className="badge text-gray-800 fs-6">
                                        {isLoading && <i className="fa-solid fa-hourglass-half fa-spin"></i>} {data && data?.ckco}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-2">
                    <div className="card shadow border-0" style={{ background: "#9acd328a", cursor: "pointer" }} onClick={() => navigate("/alc-user-management/add-user")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img src={addUserIcon} alt="" width={50} height={50} />
                                </div>
                                <div className="col-md-8">
                                    <span className="badge text-gray-800 fw-bolder text-uppercase w-100 mt-2 fs-6" style={{ textAlign: "start" }}>
                                        Add New User
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlcDashboard;
