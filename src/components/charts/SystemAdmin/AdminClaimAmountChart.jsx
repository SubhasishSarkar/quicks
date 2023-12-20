import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../../utils";
import ErrorAlert from "../../list/ErrorAlert";
import LoadingSpinner from "../../list/LoadingSpinner";
import { Doughnut } from "react-chartjs-2";
import { enableQueryOnMount } from "../../../data";

const AdminClaimAmountChart = () => {
    const { data, isFetching, error } = useQuery(["system-admin-disbursed-claim-amount-and-count"], () => fetcher(`/system-admin-disbursed-claim-amount-and-count`), { ...enableQueryOnMount });

    const ifNOData = ["0", "0", "0", "0", "0"];

    const [first, setFirst] = useState();

    useEffect(() => {
        let arrCount = "";
        if (data) {
            arrCount = data.map((item) => {
                return item.count;
            });
            setFirst(arrCount);
        }
    }, [data]);

    const bgColor = ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)", "#d709a9"];

    const dataJson = {
        labels: "",
        datasets: [
            {
                //label: ["Pending", "Rectification", "Rec. Reject", "Rejected", "Approved"],
                data: first ? first : ifNOData,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)", "#d709a9"],
                // borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 0.5,
            },
        ],
    };

    return (
        <>
            <div className="card border-0 mb-3" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                <div className="card-header bg-light border-0 text-dark d-flex justify-content-md-center p-1 fw-semibold">Disbursed Claims Count</div>
                <div className="card-body">
                    <div className="d-flex justify-content-md-center">
                        {error && <ErrorAlert error={error} />}
                        {isFetching && <LoadingSpinner />}
                    </div>

                    <div className="row">
                        <div className="col-md-5">
                            <div className="d-flex justify-content-md-center p-0" style={{ position: "relative", bottom: "10px", width: "100%" }}>
                                {data && <Doughnut data={dataJson} width={100} height={100} />}
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="d-flex justify-content-md-start">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <table className="table table-hover border-0">
                                            {data && (
                                                <div className="text-center">
                                                    <div className="row ">
                                                        {data?.map((item, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <div className="col btn" style={{ background: bgColor[index], fontSize: "13.5px" }}>
                                                                        {item.type_of_claim} : <span className="badge bg-light text-dark">{item.count}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminClaimAmountChart;
