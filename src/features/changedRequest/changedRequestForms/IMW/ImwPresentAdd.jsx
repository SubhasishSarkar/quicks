import React, { useEffect, useState } from "react";

const ImwPresentAdd = ({ newData, oldData }) => {
    const [bmcType, setBmcType] = useState();
    useEffect(() => {
        const dataBmcOld = oldData[0]?.block_type;
        const dataBmcNew = newData[0]?.block_type;
        if (newData && oldData) {
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
    }, [newData, oldData]);
    return (
        <>
            <h5 className="card-title text-center mb-1 text-dark">Present Address</h5>
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
                            <th>District</th>
                            <td>{oldData[0]?.district}</td>
                            <td>{newData[0]?.district}</td>
                        </tr>
                        <tr>
                            <th>Sub Division</th>
                            <td>{oldData[0]?.subdivision}</td>
                            <td>{newData[0]?.subdivision}</td>
                        </tr>
                        <tr>
                            <th>Block/Municipality/Corporation</th>
                            <td>{oldData[0]?.block}</td>
                            <td>{newData[0]?.block}</td>
                        </tr>
                        <tr>
                            <th>Block/Municipality/Corporation Type</th>
                            <td>{bmcType}</td>
                            <td>{bmcType}</td>
                        </tr>
                        <tr>
                            <th>Gp/Ward</th>
                            <td>{oldData[0]?.gp}</td>
                            <td>{newData[0]?.gp}</td>
                        </tr>
                        <tr>
                            <th>Pin Code </th>
                            <td>{oldData[0]?.pin}</td>
                            <td>{newData[0]?.pin}</td>
                        </tr>
                        <tr>
                            <th>Post Office</th>
                            <td>{oldData[0]?.po}</td>
                            <td>{newData[0]?.po}</td>
                        </tr>
                        <tr>
                            <th> Police Station</th>
                            <td>{oldData[0]?.ps}</td>
                            <td>{newData[0]?.ps}</td>
                        </tr>
                        <tr>
                            <th> House No./Name of the Village/Street/Road</th>
                            <td>{oldData[0]?.hvsr}</td>
                            <td>{newData[0]?.hvsr}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ImwPresentAdd;
