import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";
import { Badge } from "react-bootstrap";

const ImwNomineeView = ({ data, form, handleChange }) => {
    const {
        data: nomineeData,
        error: nomineeError,
        isFetching: nomineeFetch,
    } = useQuery(["previous-nominee-list", data?.encAppId, data?.encCrId], () => fetcher(`/previous-nominee-list?id=${data?.encAppId}&crId=${data?.encCrId}`), { enabled: data ? true : false });

    const { data: approvedSelectedData } = useQuery(["get-approved-check-fields", data?.encCrId], () => fetcher(`/get-approved-check-fields?id=${data?.encCrId}`), { enabled: data ? true : false });

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {nomineeFetch && <LoadingSpinner />}
            {nomineeError && <ErrorAlert error={nomineeError} />}
            {nomineeData && (
                <div style={{ overflow: "auto" }} className="table-container">
                    <table className="table table-bordered table-sm table-hover">
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Nominee Name</th>
                                <th>Relationship</th>
                                <th>Share</th>
                                <th>Gender</th>
                                <th>DOB (Age)</th>
                                <th>Bank Details</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nomineeData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>{1 + index}</td>
                                        <td style={wrapStyle}>{item.nominee_name}</td>
                                        {item.nominee_relationship === "Other" && (
                                            <td style={wrapStyle}>
                                                {item.nominee_relationship} ({item.other_name})
                                            </td>
                                        )}
                                        {item.nominee_relationship != "Other" && <td style={wrapStyle}>{item.nominee_relationship}</td>}
                                        <td style={wrapStyle}>{item.nominee_share}</td>
                                        <td style={wrapStyle}>{item.nominee_gender}</td>
                                        <td style={wrapStyle}>
                                            {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                        </td>
                                        <td style={wrapStyle}>
                                            <div className="fw-semibold" style={{ fontSize: "11px" }}>
                                                Account No : {item.nominee_bank_account_no} <br />
                                                IFSC : {item.nominee_bank_ifsc_code} <br />
                                                Bank Name : {item.nominee_bank_name} <br />
                                                Branch Name : {item.nominee_bank_branch_name}
                                            </div>
                                        </td>
                                        {item?.approvedCrDetailsFrom === "log" ? (
                                            <td>
                                                {(item.new_status.trim() === "A" || item.new_status.trim() === "0" || item.new_status === null) && (
                                                    <>
                                                        <span className="badge rounded-pill text-bg-success">{approvedSelectedData?.length > 0 ? "Previously Approved" : "Current Approved"} </span>
                                                        <br />
                                                        {item.is_deleted === true && <span className="badge rounded-pill text-bg-danger">Request To Delete</span>}
                                                    </>
                                                )}
                                                {approvedSelectedData?.length > 0
                                                    ? item.new_status.trim() === "S" && (
                                                          <>
                                                              <span className="badge rounded-pill text-bg-warning mb-1">Changed Request</span>
                                                              <br />
                                                              <span className="badge rounded-pill text-bg-success">Current Approved</span>
                                                          </>
                                                      )
                                                    : item.new_status.trim() === "S" && <span className="badge rounded-pill text-bg-warning">Changed Request</span>}
                                            </td>
                                        ) : (item.flag_status.trim() === "R" || item.flag_status.trim() === "0") && item.new_status.trim() != "D" ? (
                                            <td>
                                                {item.is_deleted === true ? (
                                                    <>
                                                        <Badge bg="success">Previously Approved</Badge> <Badge bg="danger">Inactive</Badge>
                                                    </>
                                                ) : (
                                                    <Badge bg="success">Current Approved</Badge>
                                                )}
                                            </td>
                                        ) : item.new_status.trim() === "D" && (item.flag_status.trim() === "R" || item.flag_status.trim() === "0") ? (
                                            <td>
                                                <Badge bg="success">Previously Approved</Badge>
                                            </td>
                                        ) : item.new_status.trim() === "S" && item.flag_status.trim() === "CR" ? (
                                            <td>
                                                <Badge bg="warning" text="dark">
                                                    Change Request
                                                </Badge>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {approvedSelectedData && (
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <h6>Select your preference :</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check mb-2">
                                <input
                                    type="radio"
                                    value="accept"
                                    checked={approvedSelectedData.includes("nomineeDetails") ? true : form.radioCrNominee.value == "accept" ? true : false}
                                    className={`form-check-input ${form.radioCrNominee.error && "is-invalid"}`}
                                    id="radioNomineeYes"
                                    name="radioCrNominee"
                                    onChange={() => handleChange({ name: "radioCrNominee", value: "accept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioNomineeYes">
                                    <h6>Accept</h6>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input
                                    value="notAccept"
                                    type="radio"
                                    checked={approvedSelectedData.includes("nomineeDetails") === false && data?.status === "A" ? true : form.radioCrNominee.value == "notAccept" ? true : false}
                                    className={`form-check-input ${form.radioCrNominee.error && "is-invalid"}`}
                                    id="radioNomineeNo"
                                    name="radioCrNominee"
                                    onChange={() => handleChange({ name: "radioCrNominee", value: "notAccept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioNomineeNo">
                                    <h6>Not Accept</h6>
                                </label>
                                {/* <div className="invalid-feedback">{form.radioCrNominee.error}</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImwNomineeView;
