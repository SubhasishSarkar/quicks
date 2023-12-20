import moment from "moment";
import React from "react";
import { Table } from "react-bootstrap";

const ApprovedBenRemarks = ({ arrRemarksData }) => {
    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {arrRemarksData && (
                <div style={{ overflow: "auto" }} className="table-container">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sl.No</th>
                                <th>Date</th>
                                <th>Remarks</th>
                                <th>Status</th>
                                <th>Remark By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrRemarksData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>{index + 1}</td>
                                        <td>{moment(item.remark_date).format("DD-MM-YYYY")}</td>
                                        <td style={wrapStyle}>{item.remarks}</td>
                                        {item.remark_status === "A" ? (
                                            <td style={wrapStyle}>
                                                <span className="badge text-bg-success">Approved</span>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        {item.remark_status === "S" ? (
                                            <td style={wrapStyle}>
                                                <span className="badge text-bg-warning">Pending</span>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        {item.remark_status === "B" ? (
                                            <td style={wrapStyle}>
                                                <span className="badge text-bg-warning">Back For Rectification</span>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        {item.remark_status === "R" ? (
                                            <td style={wrapStyle}>
                                                <span className="badge text-bg-danger">Rejected</span>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        {item.remark_status === "0" ? (
                                            <td style={wrapStyle}>
                                                <span className="badge text-bg-primary">Incomplete</span>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        <td style={wrapStyle}>
                                            {item.remark_by_name} {item.remark_by_hrms_employee_id ? "(" + item.remark_by_hrms_employee_id + ")" : ""}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
        </>
    );
};

export default ApprovedBenRemarks;
