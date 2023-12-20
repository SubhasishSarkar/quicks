import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../../utils";
import LoadingSpinner from "../../list/LoadingSpinner";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";
import { enableQueryOnMount } from "../../../data";
import AllWorkerCount from "../../../features/Dashboard/AllWorkerCount";

const WestBengalMapWiseData = ({ districtId, districtName, setDistrictId }) => {
    //pie chart
    const { data: pieData, isLoading: pieLoading, refetch: pieRefetch } = useQuery(["admin-claim-count-chart-data", districtId], () => fetcher(`/admin-claim-count-chart-data?disCode=${districtId}`), { ...enableQueryOnMount });
    const ifNOData = ["0", "0", "0", "0", "0"];
    const pieDataJson = {
        labels: "",
        datasets: [
            {
                //label: ["Pending", "Rectification", "Rec. Reject", "Rejected", "Approved"],
                data: pieData ? pieData : ifNOData,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)"],
                // borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 0.5,
            },
        ],
    };

    //polar chart
    const { data, isFetching, refetch: polarRefetch } = useQuery(["system-admin-disbursed-claim-amount-and-count", districtId], () => fetcher(`/system-admin-disbursed-claim-amount-and-count?disCode=${districtId}`), { ...enableQueryOnMount });
    const ifNODataForAmount = ["0", "0", "0", "0", "0"];
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

    const dataJson = {
        labels: "",
        datasets: [
            {
                //label: ["Pending", "Rectification", "Rec. Reject", "Rejected", "Approved"],
                data: first ? first : ifNODataForAmount,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)", "#d709a9"],
                // borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 0.5,
            },
        ],
    };

    //doughnut chart
    const {
        data: rectificationData,
        isFetching: rectificationLoading,
        refetch: doughnutRefetch,
    } = useQuery(["system-admin-rectification-countable-data", districtId], () => fetcher(`/system-admin-rectification-countable-data?disCode=${districtId}`), {
        ...enableQueryOnMount,
    });
    const ifNODataForRectification = ["0", "0", "0", "0", "0"];
    const dataArray = rectificationData ? [rectificationData[0]?.regNoOwCount, rectificationData[0]?.regDateCwTwCount, rectificationData[0]?.regDateOwCount, rectificationData[0]?.workerTypeCount, rectificationData[0]?.addressCount] : [];
    const dataTable = {
        labels: "",
        datasets: [
            {
                data: rectificationData ? dataArray : ifNODataForRectification,
                backgroundColor: ["rgb(132 80 245)", "#31d2f2", "rgb(237 195 67)", "rgb(213 84 84)", "rgb(60 183 109)"],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        const fetchData = async () => {
            await pieRefetch();
            await polarRefetch();
            await doughnutRefetch();
        };
        fetchData();
    }, [districtId, pieRefetch, polarRefetch, doughnutRefetch]);

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <div className="card" style={{ boxShadow: "0px 4px 29px 5px rgba(0,0,0,0.1)" }}>
                        <div className="card-body">
                            <table className="table table-sm table-borderless">
                                {pieLoading && <LoadingSpinner />}
                                {pieData && (
                                    <tbody>
                                        <tr>
                                            <td colSpan={3}>
                                                Total Claims Count of <span className="px-1 text-success bg-success bg-opacity-10  rounded-2">{districtName ? districtName : "ALL DISTRICT"} </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={6}>{pieData && <Pie data={pieDataJson} width={100} height={100} />}</td>
                                        </tr>
                                        <tr>
                                            <td>Approved</td>
                                            <td>{pieData && pieData[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>Disbursed</td>
                                            <td>{pieData && pieData[1]}</td>
                                        </tr>
                                        <tr>
                                            <td>Generated Memo</td>
                                            <td>{pieData && pieData[2]}</td>
                                        </tr>
                                        <tr>
                                            <td>Generated Release</td>
                                            <td>{pieData && pieData[3]}</td>
                                        </tr>
                                        <tr>
                                            <td>Generated Advice</td>
                                            <td>{pieData && pieData[4]}</td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="table-responsive shadow">
                        <table className="table table-bordered table-sm">
                            {rectificationLoading && <LoadingSpinner />}
                            {rectificationData && (
                                <tbody>
                                    <tr>
                                        <th colSpan={3}>
                                            Total Pending Rectification of <span className="px-1 text-success bg-success bg-opacity-10  rounded-2">{districtName ? districtName : "ALL DISTRICT"}</span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th rowSpan={6}>{PolarArea && <PolarArea data={dataTable} width={100} height={100} />}</th>
                                    </tr>
                                    <tr>
                                        <th> Registration Number (OW)</th>
                                        <td>{dataArray[0]}</td>
                                    </tr>
                                    <tr>
                                        <th> Registration Date (OW)</th>
                                        <td>{dataArray[1]}</td>
                                    </tr>
                                    <tr>
                                        <th> Worker Type</th>
                                        <td>{dataArray[2]}</td>
                                    </tr>
                                    <tr>
                                        <th> Registration Date (CW/TW)</th>
                                        <td>{dataArray[3]}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{dataArray[4]}</td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="table-responsive shadow">
                        <table className="table table-bordered table-sm">
                            {isFetching && <LoadingSpinner />}
                            {data && (
                                <tbody>
                                    <tr>
                                        <th colSpan={3}>
                                            Disbursed Claims Count of <span className="px-1 text-success bg-success bg-opacity-10  rounded-2">{districtName ? districtName : "ALL DISTRICT"}</span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th rowSpan={7}>{pieData && <Doughnut data={dataJson} width={100} height={100} />}</th>
                                    </tr>
                                    {data?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <th>{item.type_of_claim}</th>
                                                <td>{item.count}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>

                <div className="col-md-6">
                    <AllWorkerCount districtId={districtId} setDistrictId={setDistrictId} />
                </div>
            </div>
        </>
    );
};

export default WestBengalMapWiseData;
