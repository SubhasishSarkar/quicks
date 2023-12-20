import moment from "moment";
import React from "react";

const NomineeInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-user-group p-2"></i>Nominee Information
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
                                        <th>Nominee Name</th>
                                        <th>Relationship</th>
                                        <th>Share</th>
                                        <th>Gender</th>
                                        <th>DOB (Age)</th>
                                        <th>Bank Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.nominee.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{1 + index}</td>
                                                <td>{item.nominee_name}</td>
                                                <td>{item.nominee_relationship}</td>
                                                <td>{item.nominee_share}</td>
                                                <td>{item.nominee_gender}</td>
                                                <td>
                                                    {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                                </td>
                                                <td>
                                                    Account No : {item.nominee_bank_account_no} <br />
                                                    IFSC : {item.nominee_bank_ifsc_code} <br />
                                                    Bank Name : {item.nominee_bank_name} <br />
                                                    Branch Name :{item.nominee_bank_branch_name}
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

export default NomineeInformation;
