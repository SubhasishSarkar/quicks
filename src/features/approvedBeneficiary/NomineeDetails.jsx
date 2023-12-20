import moment from "moment";
import React from "react";
import NoDataFound from "../../components/list/NoDataFound";

const NomineeDetails = ({ arrData }) => {
    const arrNominee = arrData?.nominee;

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            <div style={{ overflow: "auto" }} className="table-container table-responsive">
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
                    {arrNominee.length > 0 ? (
                        <tbody>
                            {arrNominee.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>{index + 1}</td>
                                        <td style={wrapStyle}>{item.nominee_name}</td>
                                        <td style={wrapStyle}>{item.nominee_relationship}</td>
                                        <td style={wrapStyle}>{item.nominee_share}</td>
                                        <td style={wrapStyle}> {item.nominee_gender}</td>
                                        <td style={wrapStyle}>
                                            {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                        </td>
                                        <td style={wrapStyle}>
                                            Account No : {item.nominee_bank_account_no} <br />
                                            IFSC : {item.nominee_bank_ifsc_code} <br />
                                            Bank Name : {item.nominee_bank_name} <br />
                                            Branch Name :{item.nominee_bank_branch_name}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="7">
                                    <NoDataFound />
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        </>
    );
};

export default NomineeDetails;
