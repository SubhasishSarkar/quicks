import React, { memo } from "react";
import ErrorAlert from "../list/ErrorAlert";
import LoadingSpinner from "../list/LoadingSpinner";
import Pagination from "../Pagination";
import NoDataFound from "../../components/list/NoDataFound";

function TableList(props) {
    const { isLoading, error, data, tableHeader, disablePagination = false, pageLimit, handlePagination, errorMessage = "" } = props;

    return (
        <>
            {/* <div className="card">
                <div className="card-body"> */}
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {!isLoading &&
                // data should be an object with key as data and value as an array of objects. Eg : { data: [{},{},{},.....]}
                (data?.data?.length > 0 ? (
                    <>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-striped">
                                <thead>
                                    <tr>
                                        {tableHeader.map((col, index) => {
                                            return (
                                                <th key={index} scope="col" style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                    {col.headerName}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <tr key={item?.id ?? index}>
                                                {tableHeader.map((col, indexCol) => {
                                                    if (col.field === 0) {
                                                        //if field = 0 then indexing
                                                        return <td key={indexCol}>{handlePagination ? data.from + index : 1 + index}</td>;
                                                    } else if (col.renderHeader && col.field !== 1) {
                                                        //if renderHeader function is present then param will be the one given in field
                                                        return <td key={indexCol}>{col.renderHeader({ [col.field]: item[col.field] })}</td>;
                                                    } else if (col.renderHeader && col.field === 1) {
                                                        //if field = 1 then it should have renderHeader function and param will be the entire object
                                                        return <td key={indexCol}>{col.renderHeader({ ...item })}</td>;
                                                    }
                                                    return (
                                                        <td key={indexCol} style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                                            {item[col.field]}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : errorMessage ? (
                    errorMessage
                ) : (
                    <NoDataFound />
                ))}
            {/* </div> */}
            {/* <div className="card-footer">{!disablePagination && !isLoading && data?.data.length > 0 ? <Pagination data={data} onLimitChange={handlePagination} limit={pageLimit} /> : ""}</div> */}
            {!disablePagination && (
                // <div className="card-footer">
                <Pagination data={data} onLimitChange={handlePagination} limit={pageLimit} />
                // </div>
            )}
            {/* </div> */}
        </>
    );
}

export default memo(TableList);
