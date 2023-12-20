import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { downloadFile, fetcher } from "../../../../../utils";
import { toast } from "react-toastify";
import TableList from "../../../../../components/table/TableList";
import { useSearchParams } from "react-router-dom";

const WorkerTypeBasedAdviceList = ({ type }) => {
    const [searchParams, setSearchParams] = useSearchParams({ type: type });
    const { error, data, isFetching } = useQuery(["alc-advice-list", searchParams.toString()], () => fetcher(`/alc-advice-list?${searchParams.toString()}`));
    const [loading, setLoading] = useState();
    const [show, setShow] = useState();

    const bankAdviceDownload = async (id) => {
        try {
            setLoading(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel?id=${id}&type=${type}`, "DEATH BENEFIT BANK ADVICE " + id + ".xlsx");

            if (doc === false) toast.error("Unable to death benefit bank");
            if (doc.status === false) toast.error(doc.message.message);
            setLoading();
        } catch (error) {
            toast.error(error);
        }
    };
    const bankAdviceDownloadPF = async (id) => {
        try {
            setLoading(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel-pf?id=${id}&type=${type}`, "PF BENEFIT BANK ADVICE " + id + ".xlsx");

            if (doc === false) toast.error("Unable to death benefit bank");
            if (doc.status === false) toast.error(doc.message.message);
            setLoading();
        } catch (error) {
            toast.error(error);
        }
    };
    const bankAdviceDownloadDisability = async (id) => {
        try {
            setLoading(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel-disability?id=${id}&type=${type}`, "DISABILITY BENEFIT BANK ADVICE " + id + ".xlsx");

            if (doc === false) toast.error("Unable to death benefit bank");
            if (doc.status === false) toast.error(doc.message.message);
            setLoading();
        } catch (error) {
            toast.error(error);
        }
    };

    const benefitDetailsDownload = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel-nominee?id=${id}&type=${type}`, "DEATH BENEFIT DETAILS ADVICE-" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            console.error(error);
        }
    };
    const benefitDetailsDownloadRloDisability = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/rlo-claim-advicelist-generate-excel-disability?id=${id}&type=${type}`, "DISABILITY BENEFIT DETAILS ADVICE-" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            console.error(error);
        }
    };

    const benefitDetailsDownloadPFNominee = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/rlo-claim-advicelist-generate-excel-nominee-pf-ow?id=${id}&type=${type}`, "PF BENEFIT DETAILS ADVICE-" + id + ".xlsx");

            if (doc === false) toast.error("Unable to download pdf");
            setShow();
        } catch (error) {
            setShow();
            console.error(error);
        }
    };
    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "fund_requirment_id",
            headerName: "Advice Number",
        },
        {
            field: "created_date",
            headerName: "Date",
        },
        {
            field: 1,
            headerName: "Download Excel",
            renderHeader: (item) => {
                return (
                    <>
                        {item?.type_of_claim === 1 && (
                            <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownload(item?.id)} disabled={loading === item?.id ? true : false}>
                                {loading === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""}
                                Death Claim Bank Advice
                            </button>
                        )}

                        {item?.type_of_claim === 2 && (
                            <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownloadDisability(item?.id)} disabled={loading === item?.id ? true : false}>
                                {loading === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""}
                                Disability Claim Bank Advice
                            </button>
                        )}

                        {item?.type_of_claim === 3 && (
                            <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownloadPF(item?.id)} disabled={loading === item?.id ? true : false}>
                                {loading === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""}
                                PF IFMS List
                            </button>
                        )}
                    </>
                );
            },
        },
        {
            field: 1,
            headerName: "Download Excel",
            renderHeader: (item) => {
                return (
                    <>
                        {item?.type_of_claim === 1 && (
                            <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownload(item?.id)} disabled={show === item?.id ? true : false}>
                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Death Claim Benefit Details
                            </button>
                        )}

                        {item?.type_of_claim === 2 && (
                            <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownloadRloDisability(item?.id)} disabled={show === item?.id ? true : false}>
                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Disability Benefit Details
                            </button>
                        )}

                        {item?.type_of_claim === 3 && (
                            <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownloadPFNominee(item?.id)} disabled={show === item?.id ? true : false}>
                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} PF Claim Benefit Details
                            </button>
                        )}
                    </>
                );
            },
        },
    ];

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    return (
        <>
            <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default WorkerTypeBasedAdviceList;
