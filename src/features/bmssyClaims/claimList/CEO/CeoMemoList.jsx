import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { downloadFile, fetcher } from "../../../../utils";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import Pagination from "../../../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const CeoMemoList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [show, setShow] = useState();
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    const { error, data, isFetching } = useQuery(["ceo-generated-memo-list", searchParams.toString()], () => fetcher(`/ceo-generated-memo-list?${searchParams.toString()}`), { enabled: true });

    const bankMemoDetailsDownload = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/memo-no-generate-excel-bank-advice?id=${id}`, "DEATH BENEFIT BANK ADVICE" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            console.error(error);
        }
    };
    const bankMemoDisabilityDetailsDownload = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/memo-no-generate-disability-excel-bank-advice?id=${id}`, "DISABILITY BENEFIT BANK ADVICE" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            toast.error(error);
            console.error(error);
        }
    };
    const memoNoGenerateExcelRlo = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/memo-no-generate-excel-rlo?id=${id}`, "DEATH BENEFIT ORDER TO RLO" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            toast.error(error);
            console.error(error);
        }
    };
    const memoNoGenerateDisabilityExcelRlo = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/memo-no-generate-disability-excel-rlo?id=${id}`, "DISABILITY BENEFIT ORDER TO RLO" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            toast.error(error);
            console.error(error);
        }
    };
    return (
        <>
            <div className="card datatable-box mb-4">
                <div className="card-body">
                    {isFetching && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}

                    {data && (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col">SL No.</th>
                                            <th scope="col">Memo No.</th>
                                            <th scope="col">Download Bank Advice</th>
                                            <th scope="col">Download Order To RLO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data?.map((item, index) => {
                                            return (
                                                <tr key={index} data-enc-id={item.enc_id}>
                                                    <td>{data?.from + index}</td>
                                                    <td>{item.fund_requirment_id}</td>
                                                    <td>
                                                        {item?.type_of_claim != 2 && (
                                                            <button className="btn btn-success btn-sm" onClick={() => bankMemoDetailsDownload(item?.id)} disabled={show ? true : false}>
                                                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Bank Memo
                                                            </button>
                                                        )}
                                                        {item?.type_of_claim === 2 && (
                                                            <button className="btn btn-success btn-sm" onClick={() => bankMemoDisabilityDetailsDownload(item?.id)} disabled={show ? true : false}>
                                                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Disability Claim Bank Memo
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item?.type_of_claim != 2 && (
                                                            <button className="btn btn-success btn-sm" onClick={() => memoNoGenerateExcelRlo(item?.id)} disabled={show ? true : false}>
                                                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Order To RLO
                                                            </button>
                                                        )}
                                                        {item?.type_of_claim === 2 && (
                                                            <button className="btn btn-success btn-sm" onClick={() => memoNoGenerateDisabilityExcelRlo(item?.id)} disabled={show ? true : false}>
                                                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Disability Order To RLO
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CeoMemoList;
