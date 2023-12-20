import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { SearchBeneficiaryStatus } from "./SearchBeneficiaryStatus";

const SearchBeneficiaryResult = ({ data }) => {
    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {data && (
                <div className="card datatable-box mb-4">
                    <div className="card-body">
                        <div style={{ overflow: "auto" }} className="table-container">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>Sl.No</th>
                                        <th>Name</th>
                                        <th>Father/ Husband Name</th>
                                        <th>SSIN</th>
                                        <th>Registration No.</th>
                                        <th>Aadhar</th>
                                        <th>DOB</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={wrapStyle}>{1 + index}</td>
                                                <td style={wrapStyle}>{item.name}</td>
                                                <td style={wrapStyle}>{item.husband_name ? item.husband_name : item.father_name}</td>
                                                <td style={wrapStyle}>{item.ssin_no}</td>
                                                <td style={wrapStyle}>{item.reg_number}</td>
                                                <td style={wrapStyle}>{item.aadhar}</td>
                                                <td style={wrapStyle}>{moment(item.dob).format("DD-MM-YYYY")}</td>
                                                <td>
                                                    <SearchBeneficiaryStatus status={item.status} />
                                                </td>
                                                <td style={wrapStyle}>
                                                    {item.backlog === 0 ? (
                                                        <button className="btn btn-sm btn-success">
                                                            <Link to={"/beneficiary-details/" + item.slug + "/" + (item.is_active === 1 ? "bmssy" : "ssy")} style={{ textDecoration: "none", color: "#fff" }}>
                                                                View
                                                            </Link>
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-success">
                                                            <Link to={"/back-log-data-details/" + item.slug} style={{ textDecoration: "none", color: "#fff" }}>
                                                                View
                                                            </Link>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchBeneficiaryResult;
