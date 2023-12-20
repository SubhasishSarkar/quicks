import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetcher } from "../../utils";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import { toast } from "react-toastify";

const Form4EntryList = ({ slip_id, parentCallback, district_code }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { error, data, isFetching, isLoading } = useQuery(["form4-get-pay-in-slip-entry", slip_id], () => fetcher(`/form4-get-pay-in-slip-entry?slip_id=${slip_id}`), {
        enabled: slip_id ? true : false,
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Pay In Slip List", url: "" }));
    }, []);

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    useEffect(() => {
        if (!isLoading) {
            parentCallback(data);
        }
    }, [data, isLoading]);

    const { mutate } = useMutation((urlQueryParams) => fetcher(`/form-four-entry-delete?${urlQueryParams}`));
    const query = useQueryClient();
    const deleteEntry = (id, district_code) => {
        const status = window.confirm("Are you sure to delete?");
        if (status) {
            const urlQueryParams = `id=${id}&district_code=${district_code}`;
            mutate(urlQueryParams, {
                onSuccess(data) {
                    query.invalidateQueries("form-four-entry-delete");
                    toast.success(data.message);
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        }
    };

    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <>
                    <div style={{ overflow: "auto" }} className="table-container table-responsive">
                        <table className="table table-bordered table-sm table-hover">
                            <thead>
                                <tr className="table-active" align="center">
                                    <th>SL.No.</th>
                                    <th>SSIN</th>
                                    <th>Reg No.</th>
                                    <th>Name</th>
                                    <th>Book No</th>
                                    <th>Receipt No</th>
                                    <th>Amount</th>
                                    <th>Transaction Type</th>
                                    <th>Financial Year</th>
                                    <th>Contribution Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.pay_in_slip_entry.map((item, index) => {
                                    return (
                                        <tr key={index} align="center">
                                            <td style={wrapStyle}>{index + 1}</td>
                                            <td style={wrapStyle}>{item.ssin_no}</td>
                                            <td style={wrapStyle}>{item.registration_no}</td>
                                            <td style={wrapStyle}>{item.beneficiary_name}</td>
                                            <td style={wrapStyle}>{item.book_no}</td>
                                            <td style={wrapStyle}>{item.receipt_no}</td>
                                            <td style={wrapStyle}>{item.contribution_amount}</td>
                                            <td style={wrapStyle}>{item.txn_type}</td>
                                            <td style={wrapStyle}>{item.financial_year}</td>
                                            <td style={wrapStyle}>{item.contribution_date}</td>
                                            <td style={wrapStyle}>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteEntry(item.id, district_code)}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="d-grid mt-2 d-md-flex justify-content-md-center">
                            <label>Total Amount - {data.amount.amount ? data.amount.amount : 0}</label>
                        </div>
                    </div>
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </>
            )}
        </>
    );
};

export default Form4EntryList;
