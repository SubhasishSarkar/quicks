import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../../../utils";

const ImwPermanentAdd = ({ data, newData, oldData, form, handleChange }) => {
    const { data: approvedSelectedData } = useQuery(["get-approved-check-fields", data?.encCrId], () => fetcher(`/get-approved-check-fields?id=${data?.encCrId}`), { enabled: data ? true : false });

    const [bmcType, setBmcType] = useState();
    useEffect(() => {
        const dataBmcOld = data?.permanentAddressOld[0].block_type;
        const dataBmcNew = data?.permanentAddressNew[0].block_type;
        if (data) {
            switch (dataBmcOld || dataBmcNew) {
                case "B":
                    setBmcType("Block");
                    break;
                case "M":
                    setBmcType("Municipal");
                    break;

                case "C":
                    setBmcType("Corporation");
                    break;

                default:
                    break;
            }
        }
    }, [data]);

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
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
                            <th>District</th>
                            <td>{oldData[0]?.district}</td>
                            <td>{newData[0]?.district}</td>
                        </tr>
                        <tr>
                            <th>Sub Division</th>
                            <td style={wrapStyle}>{oldData[0]?.subdivision}</td>
                            <td style={wrapStyle}>{newData[0]?.subdivision}</td>
                        </tr>
                        <tr>
                            <th>Block/Municipality/Corporation</th>
                            <td style={wrapStyle}>{oldData[0]?.block}</td>
                            <td style={wrapStyle}>{newData[0]?.block}</td>
                        </tr>
                        <tr>
                            <th>Block/Municipality/Corporation Type</th>
                            <td style={wrapStyle}>{bmcType}</td>
                            <td style={wrapStyle}>{bmcType}</td>
                        </tr>
                        <tr>
                            <th>Gp/Ward</th>
                            <td style={wrapStyle}>{oldData[0]?.gp}</td>
                            <td style={wrapStyle}>{newData[0]?.gp}</td>
                        </tr>
                        <tr>
                            <th>Pin Code </th>
                            <td style={wrapStyle}>{oldData[0]?.pin}</td>
                            <td style={wrapStyle}>{newData[0]?.pin}</td>
                        </tr>
                        <tr>
                            <th>Post Office</th>
                            <td style={wrapStyle}>{oldData[0]?.po}</td>
                            <td style={wrapStyle}>{newData[0]?.po}</td>
                        </tr>
                        <tr>
                            <th> Police Station</th>
                            <td style={wrapStyle}>{oldData[0]?.ps}</td>
                            <td style={wrapStyle}>{newData[0]?.ps}</td>
                        </tr>
                        <tr>
                            <th> House No./Name of the Village/Street/Road</th>
                            <td style={wrapStyle}>{oldData[0]?.hvsr}</td>
                            <td style={wrapStyle}>{newData[0]?.hvsr}</td>
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
                                    checked={approvedSelectedData.includes("parmanentAddress") ? true : form.radioCrPerAdd.value == "accept" ? true : false}
                                    className={`form-check-input ${form.radioCrPerAdd.error && "is-invalid"}`}
                                    id="radioAddressYes"
                                    name="radioCrPerAdd"
                                    onChange={() => handleChange({ name: "radioCrPerAdd", value: "accept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioAddressYes">
                                    <h6>Accept</h6>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-check">
                                <input
                                    value="notAccept"
                                    type="radio"
                                    checked={approvedSelectedData.includes("parmanentAddress") === false && data?.status === "A" ? true : form.radioCrPerAdd.value == "notAccept" ? true : false}
                                    className={`form-check-input ${form.radioCrPerAdd.error && "is-invalid"}`}
                                    id="radioAddressNo"
                                    name="radioCrPerAdd"
                                    onChange={() => handleChange({ name: "radioCrPerAdd", value: "notAccept" })}
                                    disabled={data?.status === "A" ? true : false}
                                />
                                <label className="form-check-label" htmlFor="radioAddressNo">
                                    <h6>Not Accept</h6>
                                </label>
                                {/* <div className="invalid-feedback">{form.radioCrPerAdd.error}</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImwPermanentAdd;
