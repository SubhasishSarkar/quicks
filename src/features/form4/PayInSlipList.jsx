import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorAlert from "../../components/list/ErrorAlert";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { fetcher } from "../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const PayInSlipList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isFetching, error, isLoading } = useQuery(["form4-get-pay-in-slip-list"], () => fetcher(`/form4-get-pay-in-slip-list`));

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Pay In Slip List", url: "" }));
    }, []);

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    if (error) {
        return <ErrorAlert error={error} />;
    }

    
    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {isFetching || isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="card datatable-box shadow mb-4">
                    <div className="card-body">
                        {data && (
                            <>
                                <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                    <table className="table table-bordered table-sm table-hover">
                                        <thead>
                                            <tr className="table-active" align="center">
                                                <th scope="col">SL.No.</th>
                                                <th scope="col">Bank IFSC</th>
                                                <th scope="col">Bank Name</th>
                                                <th scope="col">Bank A/C No</th>
                                                <th scope="col">Deposit Amount</th>
                                                <th scope="col">ARN Number</th>
                                                <th scope="col">ARN Name</th>
                                                <th scope="col">Deposit Date</th>
                                                <th scope="col">Created Date</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td style={wrapStyle}>{index + 1}</td>
                                                        <td style={wrapStyle}>{item.bank_ifsc}</td>
                                                        <td style={wrapStyle}>{item.bank_name}</td>
                                                        <td style={wrapStyle}>{item.bank_ac_no}</td>
                                                        <td style={wrapStyle}>{item.deposit_amount}</td>
                                                        <td style={wrapStyle}>{item.arn_number}</td>
                                                        <td style={wrapStyle}>{item.arn_name}</td>
                                                        <td style={wrapStyle}>{item.deposit_date}</td>
                                                        <td style={wrapStyle}>{item.created_date_time}</td>
                                                        <td style={wrapStyle}>
                                                            <button className="btn btn-sm py-0 px-1 " style={{ fontSize: 14 }}>
                                                                <Link to={`/form4/pay-in-slip-entry/${item.slug}`} style={{ textDecoration: "none" }}>
                                                                    <i className="fa-sharp fa-solid fa-eye"></i> Edit
                                                                </Link>
                                                            </button>

                                                            <button className="btn btn-sm py-0 px-1 " style={{ fontSize: 14 }}>
                                                                <Link to={`/form4/form-four-entry/${item.slug}`} style={{ textDecoration: "none" }}>
                                                                    <i className="fa-sharp fa-solid fa-eye"></i> Form4 Entry
                                                                </Link>
                                                            </button>
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
            )}
        </>
    );
};

export default PayInSlipList;
