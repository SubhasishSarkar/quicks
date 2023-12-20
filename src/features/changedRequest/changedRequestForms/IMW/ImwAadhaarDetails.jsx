import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../../utils";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../components/list/ErrorAlert";

const ImwAadhaarDetails = ({ data, form, handleChange }) => {
    const { data: approvedSelectedData, error, isFetching } = useQuery(["get-approved-check-fields", data?.encCrId], () => fetcher(`/get-approved-check-fields?id=${data?.encCrId}`), { enabled: data ? true : false });
    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}

            <div style={{ overflow: "auto" }} className="table-container table-responsive">
                <table className="table table-bordered table-sm table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Fields Name</th>
                            <th scope="col">Previously Approved Data</th>
                            <th scope="col">Changed Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Aadhaar No.</th>
                            <td style={wrapStyle}>{data?.approved_aadhar_number}</td>
                            <td style={wrapStyle}>{data?.cr_aadhar_number}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
                                    checked={approvedSelectedData?.includes("aadharNumber") ? true : form.radioCrAadhaar.value == "accept" ? true : false}
                                    className={`form-check-input ${form.radioCrAadhaar.error && "is-invalid"}`}
                                    id="radioStackedSsin"
                                    name="radioCrAadhaar"
                                    onChange={() => handleChange({ name: "radioCrAadhaar", value: "accept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioStackedSsin">
                                    <h6>Accept</h6>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input
                                    value="notAccept"
                                    type="radio"
                                    checked={approvedSelectedData.includes("aadharNumber") === false && data?.status === "A" ? true : form.radioCrAadhaar.value == "notAccept" ? true : false}
                                    className={`form-check-input ${form.radioCrAadhaar.error && "is-invalid"}`}
                                    id="radioStackedReg"
                                    name="radioCrAadhaar"
                                    onChange={() => handleChange({ name: "radioCrAadhaar", value: "notAccept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioStackedReg">
                                    <h6>Not Accept</h6>
                                </label>
                                {/* <div className="invalid-feedback">{form.radioCrAadhaar.error}</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImwAadhaarDetails;
