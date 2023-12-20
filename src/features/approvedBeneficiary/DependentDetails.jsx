import moment from "moment";
import React from "react";
import NoDataFound from "../../components/list/NoDataFound";

const DependentDetails = ({ arrData }) => {
    const arrDependent = arrData?.dependent;

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            <div style={{ overflow: "auto" }} className="table-container">
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
                    {arrDependent.length > 0 ? (
                        <tbody>
                            {arrDependent.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>{index + 1}</td>
                                        <td style={wrapStyle}>{item.dependent_name}</td>
                                        <td style={wrapStyle}>{item.dependent_relation}</td>
                                        <td style={wrapStyle}>{item.dependent_gender}</td>
                                        <td style={wrapStyle}>{moment(item.dependent_dob).format("DD-MM-YYYY")}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="5">
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

export default DependentDetails;
