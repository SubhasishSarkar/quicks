import { useQuery } from "@tanstack/react-query";
import { fetcher, downloadFile, searchParamsToObject } from "../../../utils";
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useSearchParams } from "react-router-dom";
import PaginationType2 from "../../../components/PaginationType2";

const CommissionClaimAdviceList = ({ workerType }) => {
    const [searchParams, setSearchParams] = useSearchParams(`worker_type=${workerType}`);
    const { isLoading, error, data } = useQuery(["claim-view-advice-list", searchParams.toString()], () => fetcher(`/claim-view-advice-list?${searchParams.toString()}`));

    const [loading, setLoading] = useState();
    const [orderToRloLoading, setOrderToRloLoading] = useState();
    const [orderbankLoading, setOrderbankLoading] = useState();
    const DownloadPaymentFile = async (receipt_id) => {
        setLoading(receipt_id);
        try {
            const docData = await downloadFile("/claim-payment-adv-details-excel/" + receipt_id, "PAYMENT DETAILS.xlsx");
            if (docData.status === false) toast.error("Unable to download excel");
            setLoading();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const DownloadAdviceFile = async (receipt_id) => {
        setOrderToRloLoading(receipt_id);
        try {
            const docData = await downloadFile("/claim-payment-adv-excel/" + receipt_id + "/1", "BANK ADVICE.xlsx");
            if (docData.status === false) toast.error("Unable to download excel");
            setOrderToRloLoading();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const DownloadTdsFile = async (receipt_id) => {
        setOrderbankLoading(receipt_id);
        try {
            const docData = await downloadFile("/claim-payment-advTds-excel/" + receipt_id + "/2", "BANK ADVICE WITH TDS.xlsx");
            if (docData.status === false) toast.error("Unable to download excel");
            setOrderbankLoading();
        } catch (error) {
            toast.error(error.message);
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
                <div className="table-responsive" style={{ position: "relative", overflow: "auto" }}>
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>SNO</th>
                                <th>Advice Number</th>
                                <th>Advice Date</th>
                                <th>Worker Type</th>
                                <th>Net Amount</th>
                                <th>Download Payment Details</th>
                                <th>Download Bank Advice</th>
                                <th>Download Bank Advice with TDS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data_Set?.data?.map((item, index) => {
                                return (
                                    <tr key={index} data-enc-id={item.id}>
                                        <td style={wrapStyle}>{data?.data_Set?.from + index}</td>
                                        <td style={wrapStyle}>{item.advice_no}</td>
                                        <td style={wrapStyle}>{item.fdate}</td>
                                        <td style={wrapStyle}>{item.worker_type}</td>
                                        <td style={wrapStyle}>
                                            <i className="fa-solid fa-indian-rupee-sign"></i> {item.net_amt}
                                        </td>
                                        <td style={wrapStyle}>
                                            {loading != item.receipt_id ? (
                                                <button className="btn btn-secondary btn-sm mt-2" type="button" onClick={() => DownloadPaymentFile(item.receipt_id)}>
                                                    Payment Details
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-secondary btn-sm mt-2">
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Payment Details
                                                </button>
                                            )}
                                        </td>
                                        <td style={wrapStyle}>
                                            {orderToRloLoading != item.receipt_id ? (
                                                <button className="btn btn-primary btn-sm mt-2" type="button" onClick={() => DownloadAdviceFile(item.receipt_id)}>
                                                    Bank Advice
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-primary btn-sm mt-2">
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Bank Advice
                                                </button>
                                            )}
                                        </td>
                                        <td style={wrapStyle}>
                                            {orderbankLoading != item.receipt_id ? (
                                                <button className="btn btn-success btn-sm mt-2" type="button" onClick={() => DownloadTdsFile(item.receipt_id)}>
                                                    Bank Advice with TDS
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-success btn-sm mt-2">
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Bank Advice with TDS
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {data?.data_Set?.links && <PaginationType2 data={data?.data_Set} setSearchParams={setSearchParams} searchParamsToObject={searchParamsToObject} searchParams={searchParams} />}
                </div>
            </form>
        </>
    );
};

export default CommissionClaimAdviceList;
