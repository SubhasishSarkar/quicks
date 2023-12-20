import { useQuery } from "@tanstack/react-query";
import React from "react";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";

const ImwDependentView = ({ data }) => {
    const { error: dependentError, data: dependentData, isFetching: dependentFetch } = useQuery(["previous-dependent-list", data?.encAppId], () => fetcher(`/previous-dependent-list?id=${data?.encAppId}`), { enabled: data ? true : false });
    return (
        <>
            <h5 className="card-title text-center mb-1 text-dark">Dependent </h5>
            {dependentFetch && <LoadingSpinner />}
            {dependentError && <ErrorAlert error={dependentError} />}
            {dependentData && (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm table-hover">
                        <thead>
                            <tr className="table-active" align="center">
                                <th>SL No.</th>
                                <th>Dependent Name</th>
                                <th>Relationship</th>
                                <th>Gender</th>
                                <th>DOB</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dependentData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1} </td>
                                        <td>{item.depedent_name} </td>
                                        {item.depedent_relationship === "Other" && (
                                            <td>
                                                {item.depedent_relationship} ({item.other_name})
                                            </td>
                                        )}
                                        {item.depedent_relationship != "Other" && <td>{item.depedent_relationship}</td>}

                                        <td>{item.depedent_gender} </td>
                                        <td>{item.depedent_dob} </td>
                                        {item.flag_status.trim() === "R" && item.status.trim() != "D" ? <td style={{ color: "rgb(65 180 3)" }}> Approved </td> : ""}
                                        {item.status.trim() === "D" && item.flag_status.trim() === "R" ? <td style={{ color: "rgb(65 180 3)" }}> Previously Approve </td> : ""}
                                        {item.status.trim() === "S" && item.flag_status.trim() === "CR" ? <td style={{ color: "rgb(65 180 3)" }}> Changed </td> : ""}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ImwDependentView;
