import { useQuery } from "@tanstack/react-query";
import { fetcher, searchParamsToObject, downloadFile } from "../../../utils";
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";

const workerTypeShort = ["ow", "cw", "tw"];

const CommissionRegistrationMemoList = ({ workerType }) => {
    const [searchParams, setSearchParams] = useState(`workerType=${workerTypeShort[workerType]}`);
    const { isLoading, error, data } = useQuery(["view-memo-list", workerType, searchParams], () => fetcher(`/view-memo-list?${searchParams}`));

    const [loading, setLoading] = useState();
    const [orderToRloLoading, setOrderToRloLoading] = useState();
    const DownloadFile = async (receipt_id) => {
        setLoading(receipt_id);
        try {
            const docData = await downloadFile("/monthly-payment-memo-excel/" + receipt_id, "Bank Advice.xlsx");
            if (docData === false) toast.error("Unable to download excel");
            setLoading();
        } catch (error) {
            console.error(error.message);
        }
    };

    const DownloadOrderFile = async (receipt_id) => {
        setOrderToRloLoading(receipt_id);
        try {
            const docData = await downloadFile("/monthly-payment-order-to-rlo-excel/" + receipt_id, "Order To RLO.xlsx");
            if (docData === false) toast.error("Unable to download excel");
            setOrderToRloLoading();
        } catch (error) {
            console.error(error.message);
        }
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            <form noValidate>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorAlert error={error} />}
                <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>SNO</th>
                                <th>Memo Number</th>
                                <th>Memo Date</th>
                                <th>Download Bank Advice</th>
                                <th>Download Order To RLO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data_Set?.data?.map((item, index) => {
                                return (
                                    <tr key={index} data-enc-id={item.id}>
                                        <td style={wrapStyle}>{data?.data_Set?.from + index}</td>
                                        <td style={wrapStyle}>{item.memo_no}</td>
                                        <td style={wrapStyle}>{item.fdate}</td>
                                        <td style={wrapStyle}>
                                            {loading != item.receipt_id ? (
                                                <button className="btn btn-danger btn-sm mt-2" type="button" onClick={() => DownloadFile(item.receipt_id)}>
                                                    Bank Advice
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-danger btn-sm mt-2">
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Bank Advice
                                                </button>
                                            )}
                                        </td>
                                        <td style={wrapStyle}>
                                            {orderToRloLoading != item.receipt_id ? (
                                                <button className="btn btn-success btn-sm mt-2" type="button" onClick={() => DownloadOrderFile(item.receipt_id)}>
                                                    Order To RLO
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-success btn-sm mt-2">
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Order To RLO
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {data?.data_Set?.links && (
                    <div className="d-flex justify-content-between align-items-center">
                        <p>
                            Showing <b>{data?.data_Set?.from}</b> to <b>{data?.data_Set?.to}</b> of <b>{data?.data_Set?.total_records}</b> results
                        </p>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    {data?.data_Set?.links?.map((item, index) => (
                                        <li className={`page-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`} key={index}>
                                            <a
                                                href={item.query}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSearchParams(item.query.split("?")[1]);
                                                }}
                                                className="page-link"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <select
                                className="form-select form-select-sm"
                                value={searchParamsToObject(new URLSearchParams(searchParams)).limit}
                                onChange={(e) => {
                                    const value = e.currentTarget.value;
                                    const params = new URLSearchParams(searchParams);
                                    params.set("limit", value);
                                    e.preventDefault();
                                    setSearchParams(params.toString());
                                }}
                            >
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                )}
            </form>
        </>
    );
};

export default CommissionRegistrationMemoList;
