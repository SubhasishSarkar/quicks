import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { downloadFile, fetcher } from "../../../../../utils";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import TableList from "../../../../../components/table/TableList";

const CwAdviceList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const type = "cw";
    const { error, data, isFetching } = useQuery(["alc-advice-list", type], () => fetcher(`/alc-advice-list?type=${type}`));
    const [loading, setLoading] = useState();
    const [show, setShow] = useState();

    const bankAdviceDownload = async (id) => {
        try {
            setLoading(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel?id=${id}&type=${type}`, "DEATH BENEFIT BANK ADVICE " + id + ".xlsx");
            if (doc === false) toast.error("Unable to death benefit bank");
            setLoading();
        } catch (error) {
            toast.error(error);
        }
    };

    const bankAdviceDownloadPF = async (id) => {
        try {
            setLoading(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel-pf?id=${id}&type=${type}`, "DEATH BENEFIT BANK ADVICE " + id + ".xlsx");

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
    const benefitDetailsDownloadPFNominee = async (id) => {
        try {
            setShow(id);
            const doc = await downloadFile(`/rlo-claim-advice-list-generate-excel-nominee-cw?id=${id}&type=${type}`, "DEATH BENEFIT DETAILS ADVICE-" + id + ".xlsx");
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
                            <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownload(item?.id)} disabled={loading ? true : false}>
                                {loading === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""}
                                Death Claim Bank Advice
                            </button>
                        )}

                        {item?.type_of_claim === 3 && (
                            <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownloadPF(item?.id)} disabled={loading ? true : false}>
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
                            <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownload(item?.id)} disabled={show ? true : false}>
                                {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Death Claim Benefit Details
                            </button>
                        )}

                        {item?.type_of_claim === 3 && (
                            <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownloadPFNominee(item?.id)} disabled={show ? true : false}>
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

            {/* {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data.data?.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Advice No.</th>
                                <th>Date</th>
                                <th>Download Excel</th>
                                <th>Download Excel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.fund_requirment_id}</td>
                                        <td>{item?.created_date}</td>
                                        <td>
                                            {item?.type_of_claim === 1 && (
                                                <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownload(item?.id)} disabled={loading ? true : false}>
                                                    {loading === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""}
                                                    Death Bank Advice
                                                </button>
                                            )}

                                            {item?.type_of_claim === 3 && (
                                                <button className="btn btn-success btn-sm" onClick={() => bankAdviceDownloadPF(item?.id)} disabled={loading ? true : false}>
                                                    {loading === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""}
                                                    PF IFMS List
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            {item?.type_of_claim === 1 && (
                                                <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownload(item?.id)} disabled={show ? true : false}>
                                                    {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Benefit Details
                                                </button>
                                            )}

                                            {item?.type_of_claim === 3 && (
                                                <button className="btn btn-success btn-sm" onClick={() => benefitDetailsDownloadPFNominee(item?.id)} disabled={show ? true : false}>
                                                    {show === item?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} PF Claim Benefit Details
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <NoDataFound />
            )} */}
        </>
    );
};

export default CwAdviceList;
