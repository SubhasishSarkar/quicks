import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetcher } from "../../../../utils";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../components/list/ErrorAlert";

const ImwBankView = ({ data, form, handleChange }) => {
    const { data: approvedSelectedData, error, isFetching } = useQuery(["get-approved-check-fields", data?.encCrId], () => fetcher(`/get-approved-check-fields?id=${data?.encCrId}`), { enabled: data ? true : false });
    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}

            <div className="table-responsive">
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
                            <th>IFSC Code</th>
                            <td>{data?.approved_bank_ifsc_code}</td>
                            <td>{data?.cr_bank_ifsc_code}</td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>{data?.approved_bank_name}</td>
                            <td>{data?.approved_bank_name}</td>
                        </tr>
                        <tr>
                            <th>Branch Name</th>
                            <td>{data?.approved_bank_branch_name}</td>
                            <td>{data?.cr_bank_branch_name}</td>
                        </tr>
                        <tr>
                            <th>District Name</th>
                            <td>{data?.approved_district_name}</td>
                            <td>{data?.cr_district_name}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{data?.approved_bank_location}</td>
                            <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{data?.cr_bank_location}</td>
                        </tr>
                        <tr>
                            <th>Account no</th>
                            <td>{data?.bank_account_no}</td>
                            <td>{data?.cr_bank_account_no}</td>
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
                                    checked={approvedSelectedData.includes("bankDetails") ? true : form.radioCrBank.value == "accept" ? true : false}
                                    className={`form-check-input ${form.radioCrBank.error && "is-invalid"}`}
                                    id="radioStackedSsin"
                                    name="radioCrBank"
                                    onChange={() => handleChange({ name: "radioCrBank", value: "accept" })}
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
                                    checked={approvedSelectedData.includes("bankDetails") === false && data?.status === "A" ? true : form.radioCrBank.value == "notAccept" ? true : false}
                                    className={`form-check-input ${form.radioCrBank.error && "is-invalid"}`}
                                    id="radioStackedReg"
                                    name="radioCrBank"
                                    onChange={() => handleChange({ name: "radioCrBank", value: "notAccept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioStackedReg">
                                    <h6>Not Accept</h6>
                                </label>
                                {/* <div className="invalid-feedback">{form.radioCrBank.error}</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImwBankView;
