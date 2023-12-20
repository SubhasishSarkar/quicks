import React, { useState } from "react";
import MatrixInputSize from "./MatrixInputSize";

const PfCalculate = ({ data }) => {
    const [matrixSize, setMatrixSize] = useState({
        rows: parseInt(data.lastnum) - parseInt(data.rownum),
        columns: 21,
    });

    return (
        <>
            <div className="table-responsive">
                <br />
                {data.ssy_closing_year != "" && (
                    <table className="table pretty table-bordered table-sm table-hover custom-table " style={{ width: "30%" }} align="center">
                        <thead>
                            <tr align="center">
                                <th className="sorting" colSpan="6">
                                    SSY CLOSING DETAILS
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr align="center">
                                <td>
                                    <strong>BENEFICIARY NAME</strong>
                                </td>
                                <td>
                                    <strong>CLOSING YEAR</strong>
                                </td>
                                <td>
                                    <strong>BALANCE</strong>
                                </td>
                            </tr>
                            <tr align="center">
                                <td>{data.fullname}</td>
                                <td>{data.ssy_closing_year}</td>

                                <td>{data.ssy_closing_amt}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

            <div className="table-responsive">
                <form>
                    <table className="table pretty  table-bordered table-sm table-hover custom-table">
                        <thead>
                            <tr>
                                <th width="6%">FIN YEAR</th>
                                <th width="4%">OPENING</th>
                                <th width="4%">ACTUAL CON</th>
                                <th>APR</th>
                                <th>MAY</th>
                                <th>JUN</th>
                                <th>JUL</th>
                                <th>AUG</th>
                                <th>SEP</th>
                                <th>OCT</th>
                                <th>NOV</th>
                                <th>DEC</th>
                                <th>JAN</th>
                                <th>FEB</th>
                                <th>MAR</th>
                                {/*  <th>CLICK TO COPY</th>
                                <th>NET BEN CON</th>
                                <th>EXCESS AMOUNT</th>
                                <th>TOTAL DEPOSIT INCLUDING GOV CON</th>
                                <th>INTEREST EARNED DURING THAT YEAR</th>
                                <th>CLOSING AMOUNT</th> */}
                                <th>CLICK</th>
                                <th>NET</th>
                                <th>EXCESS</th>
                                <th>TOTAL</th>
                                <th>INTEREST</th>
                                <th>CLOSING</th>
                            </tr>
                        </thead>
                        <tbody>
                            <MatrixInputSize data={data} matrixSize={matrixSize} setMatrixSize={(object) => setMatrixSize(object)} ssy_closing_amt={data.ssy_closing_amt} />
                        </tbody>
                    </table>
                </form>
            </div>

            <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                <span className="badge text-bg-danger">NOTE:</span> CLICK CHECKBOX : IF BENEFICIARY CONTRIBUTION AFTER 10th OF MARCH OF THAT FINANCIAL YEAR
            </h6>
        </>
    );
};

export default PfCalculate;
