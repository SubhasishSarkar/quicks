import React, { useEffect, useState } from "react";

const WorkerDetails = ({ arrData }) => {
    const arrWorkerData = arrData?.workerDetails;
    const [WorkerType, setWorkerType] = useState();

    useEffect(() => {
        if (arrWorkerData.length === 0) {
            if (arrData?.details?.cat_worker_type != "") {
                switch (arrData?.details?.cat_worker_type) {
                    case "tw":
                        setWorkerType("Transport Worker");
                        break;
                    case "cw":
                        setWorkerType("Construction Worker");
                        break;
                    case "ow":
                        setWorkerType("Other Worker");
                        break;

                    default:
                        break;
                }
            }
        }
    }, [arrWorkerData]);

    return (
        <>
            <div className="card mb-3 text-bg-light border-info" style={{ marginTop: "8px" }}>
                <div className="card-body">
                    <div className="ben_details_section mb-1" style={{ fontWeight: "500" }}>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Category of Worker :</b> {!WorkerType ? (arrWorkerData ? arrWorkerData?.cat_name : "") : WorkerType}
                        </span>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Worker Type Name :</b> {arrWorkerData.length != 0 ? (arrWorkerData ? arrWorkerData?.sub_cat_name : "") : "N/A"}
                        </span>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Occupation :</b> {arrWorkerData.length != 0 ? (arrWorkerData ? arrWorkerData?.worker_details : "") : "N/A"}
                        </span>

                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Monthly Family Income :</b> {arrWorkerData.length != 0 ? (arrWorkerData ? arrWorkerData?.monthly_family_income : "") : "N/A"}
                        </span>
                    </div>
                    <span style={{ fontSize: "14px" }}>
                        <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Covered Under Employees Provident Fund and Miscellaneous Provisions Act, 1952 & ESI Act, 1948 :</b>{" "}
                        {arrWorkerData.length != 0 ? (arrWorkerData ? arrWorkerData?.covered_under : "") : "N/A"}
                    </span>
                </div>
            </div>
        </>
    );
};

export default WorkerDetails;
