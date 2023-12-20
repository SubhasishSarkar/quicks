import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetcher } from "../../utils";

import ErrorAlert from "../../components/list/ErrorAlert";

const year_arr = ["2001-02", "2002-03", "2003-04", "2004-05", "2005-06", "2006-07", "2007-08", "2008-09", "2009-10", "2010-11", "2011-12", "2012-13", "2013-14", "2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20"];

const year_key_arr = {
    "2001-2002": 0,
    "2002-2003": 1,
    "2003-2004": 2,
    "2004-2005": 3,
    "2005-2006": 4,
    "2006-2007": 5,
    "2007-2008": 6,
    "2008-2009": 7,
    "2009-2010": 8,
    "2010-2011": 9,
    "2011-2012": 10,
    "2012-2013": 11,
    "2013-2014": 12,
    "2014-2015": 13,
    "2015-2016": 14,
    "2016-2017": 15,
    "2017-2018": 16,
    "2018-2019": 17,
    "2019-2020": 18,
};

const MatrixInputSize = ({ data, matrixSize, setMatrix, ssy_closing_amt }) => {
    const [calMatrix, setCalMatrix] = useState(Array.from({ length: matrixSize.rows }, () => Array.from({ length: 21 }, () => null)));
    //let stYear = data.ssy_closing_year != "" ? year_key_arr[String(data.ssy_closing_year)] : year_key_arr[String(data.bssy_closing_year)];
    let stYear = year_key_arr[String(data.bssy_closing_year)];
    const handleChange = (row, column, event) => {
        setOutResult();
        let copy = [...calMatrix];
        if (row == 0 && column == 1) {
            setOpeningAmount(event.target.value);
        }
        if (column == 15) {
            if (copy[row][column] == null || copy[row][column] == 0) {
                copy[row][column] = 1;
            } else {
                copy[row][column] = 0;
            }
        } else {
            copy[row][column] = +event.target.value;
        }

        setCalMatrix(copy);
    };

    const [searchNewParams, setSearchNewParams] = useState();

    const [openingAmount, setOpeningAmount] = useState(ssy_closing_amt);
    const [outResult, setOutResult] = useState();

    const { error, data: mydata, isFetching } = useQuery(["pfcalculation-formula", searchNewParams], () => fetcher(`/pfcalculation-formula?${searchNewParams}&ssy_closing_amt=${ssy_closing_amt}`), { enabled: searchNewParams ? true : false });

    let matrix = Array(matrixSize.rows);
    for (let i = 0; i < matrixSize.rows; i++) {
        matrix[i] = new Array(matrixSize.columns).fill(0);
        matrix[0][1] = ssy_closing_amt;
    }

    const handleSubmit = (event) => {
        const params = new URLSearchParams();
        params.set("gridData", calMatrix);
        params.set("rownum", data.rownum);
        params.set("lastnum", data.lastnum);
        params.set("start_dt", data.start_dt);
        params.set("end_dt", data.end_dt);
        params.set("last_month", data.last_month);
        params.set("start_month", data.start_month);
        setSearchNewParams(params.toString());
        setOutResult(1);
    };

    return (
        <>
            {matrix &&
                matrix.map((row, indexRow = 1) => {
                    return (
                        <tr key={indexRow}>
                            {row.map((item, indexColumn = 1) => {
                                return (
                                    <td key={indexRow + " " + indexColumn} id={indexRow + " " + indexColumn}>
                                        {indexColumn == 0 ? (
                                            year_arr[parseInt(stYear) + indexRow + 1]
                                        ) : indexColumn == 15 ? (
                                            // <input type="button" key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value="click" className="btn btn-success btn-sm" />
                                            <input type="checkbox" key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} value="0" />
                                        ) : indexRow == 0 && indexColumn == 1 ? (
                                            <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} value={openingAmount} />
                                        ) : mydata ? (
                                            indexColumn == 20 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value={mydata.closing_arr[indexRow]} disabled />
                                            ) : indexColumn == 1 && indexRow != 0 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value={mydata.closing_arr[indexRow - 1]} disabled />
                                            ) : indexColumn == 17 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value={mydata.excess_arr[indexRow]} disabled />
                                            ) : indexColumn == 16 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value={mydata.net_arr[indexRow]} disabled />
                                            ) : indexColumn == 18 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value={mydata.total_arr[indexRow]} disabled />
                                            ) : indexColumn == 19 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} value={mydata.interest_arr[indexRow]} disabled />
                                            ) : indexColumn > data.last_month && indexRow == matrixSize.rows - 1 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} disabled />
                                            ) : indexColumn <= data.start_month && indexColumn > 2 && indexRow == 0 ? (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} value="-" disabled />
                                            ) : (
                                                <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} />
                                            )
                                        ) : indexColumn > 15 || (indexColumn == 1 && indexRow != 0) ? (
                                            <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} disabled />
                                        ) : indexColumn > data.last_month && indexRow == matrixSize.rows - 1 ? (
                                            <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} value="-" disabled />
                                        ) : indexColumn <= data.start_month && indexColumn > 2 && indexRow == 0 ? (
                                            <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} value="-" disabled />
                                        ) : (
                                            <input type="text" className={`form-control`} key={indexRow + " " + indexColumn} name={indexRow + "," + indexColumn} onChange={(e) => handleChange(indexRow, indexColumn, e)} />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            <tr>
                <td colSpan="21">
                    {/*  {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}{" "} */}
                    <input type="button" className="btn btn-success btn-sm mt-2" onClick={handleSubmit} value="Calculate" disabled={isFetching} />
                </td>
            </tr>
            {outResult && mydata && (
                <>
                    <tr>
                        <td colSpan="21">
                            <b>NET PF AMOUNT (UPTO 31st MARCH 2020) : {mydata.data}</b>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="21">
                            <b>NET EXCESS (UPTO 31st MARCH 2020) : {mydata.excess}</b>
                        </td>
                    </tr>
                </>
            )}

            {error && (
                <tr>
                    <td colSpan="21">
                        <ErrorAlert error={error} />
                    </td>
                </tr>
            )}
        </>
    );
};

export default MatrixInputSize;
