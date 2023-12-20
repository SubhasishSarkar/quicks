import moment from "moment";
import React from "react";

const DependentInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-users-rectangle p-2"></i>Dependent Information
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>Sl.No</th>
                                        <th>Dependent Name</th>
                                        <th>Relationship/ Other Relationship</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.dependent.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{1 + index}</td>
                                                <td>{item.depedent_name}</td>
                                                <td>{item.depedent_relationship}</td>
                                                <td>{item.depedent_gender}</td>
                                                <td>
                                                    {moment(item.depedent_dob).format("DD-MM-YYYY")} ({item.depedent_age})
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DependentInformation;
