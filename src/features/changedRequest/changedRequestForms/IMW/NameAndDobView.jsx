import { useQuery } from "@tanstack/react-query";
import React from "react";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";

const NameAndDobView = ({ data, form, handleChange }) => {
    const { data: approvedSelectedData, error, isFetching } = useQuery(["get-approved-check-fields", data?.encCrId], () => fetcher(`/get-approved-check-fields?id=${data?.encCrId}`), { enabled: data ? true : false });
    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}

            <div className="table-responsive">
                <table className="table table-bordered table-sm table-hover">
                    <thead>
                        <tr>
                            <th colSpan="3">
                                <span className="font-monospace text-danger text-wrap lh-1 text-center fs-6">Change Of Date Of Birth Should Be Done In Trams of Memo No.106/EST/LC Dated:07-02-23</span>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col">Fields Name</th>
                            <th scope="col">Previously Approved Data</th>
                            <th scope="col">Changed Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{data?.approved_name}</td>
                            <td>{data?.cr_name}</td>
                        </tr>
                        <tr>
                            <th>Date Of Birth</th>
                            <td>{data?.approved_dob}</td>
                            <td>{data?.cr_dob}</td>
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
                                    checked={approvedSelectedData.includes("nameAndDate") ? true : form.radioCrName.value == "accept" ? true : false}
                                    className={`form-check-input ${form.radioCrName.error && "is-invalid"}`}
                                    id="radioStackedSsin"
                                    name="radioCrName"
                                    onChange={() => handleChange({ name: "radioCrName", value: "accept" })}
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
                                    checked={approvedSelectedData.includes("nameAndDate") === false && data?.status === "A" ? true : form.radioCrName.value == "notAccept" ? true : false}
                                    className={`form-check-input ${form.radioCrName.error && "is-invalid"}`}
                                    id="radioStackedReg"
                                    name="radioCrName"
                                    onChange={() => handleChange({ name: "radioCrName", value: "notAccept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioStackedReg">
                                    <h6>Not Accept</h6>
                                </label>
                                {/* <div className="invalid-feedback">{form.radioCrName.error}</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NameAndDobView;
