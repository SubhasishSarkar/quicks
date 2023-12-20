import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetcher } from "../../utils";
import NoDataFound from "../../components/list/NoDataFound";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const MergedList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Same Scheme Tagging List", url: "" }));
    }, []);
    const [searchParams, setSearchParams] = useSearchParams();
    const { error, data, isFetching } = useQuery(["get-merged-list", searchParams.toString()], () => fetcher(`/get-merged-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const activeStyle = {
        backgroundColor: "rgb(56 157 101)",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
        color: "#fff",
    };

    const InactiveStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {data?.data &&
                (data?.data?.length == 0 ? (
                    <NoDataFound />
                ) : (
                    <>
                        <div style={{ overflow: "auto" }} className="table-container">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL. No</th>
                                        <th>SSIN</th>
                                        <th>Registration No</th>
                                        <th>Registration Date</th>
                                        <th>Name</th>
                                        <th>DOB</th>
                                        <th>Aadhar</th>
                                        <th>Father Name</th>
                                        <th>Nominee</th>
                                        <th>Worker Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data?.data.map((item, index) => {
                                        let styleNm = item?.status === "TS" ? InactiveStyle : activeStyle;
                                        return (
                                            <>
                                                <tr key={index * 2}>
                                                    <td rowSpan="2" style={InactiveStyle}>
                                                        {data?.paginatedData?.from + index}
                                                    </td>
                                                    <td style={styleNm}>{item?.ssin_no}</td>
                                                    <td style={styleNm}>{item?.registration_no}</td>
                                                    <td style={styleNm}>{item?.registration_date}</td>
                                                    <td style={styleNm}>{item?.name}</td>
                                                    <td style={styleNm}>{item?.dob}</td>
                                                    <td style={styleNm}>{item?.aadhar}</td>
                                                    <td style={styleNm}>{item?.father_name}</td>
                                                    <td style={styleNm}>
                                                        <ul>
                                                            {item?.nominee &&
                                                                item?.nominee.map((n, ind) => {
                                                                    return (
                                                                        <li key={ind} style={styleNm}>
                                                                            {n?.nominee_name}
                                                                        </li>
                                                                    );
                                                                })}
                                                        </ul>
                                                    </td>
                                                    <td style={styleNm}>{item?.cat_worker_type}</td>
                                                    <td style={styleNm}>{item?.status === "TS" ? "Inactive" : "Active"}</td>
                                                </tr>

                                                {item.tagged_list.map((t, indt) => {
                                                    return (
                                                        <tr key={indt}>
                                                            <td style={InactiveStyle}>{t.ssin_no}</td>
                                                            <td style={InactiveStyle}>{t.registration_no}</td>
                                                            <td style={InactiveStyle}>{t.registration_date}</td>
                                                            <td style={InactiveStyle}>{t.name}</td>
                                                            <td style={InactiveStyle}>{t.dob}</td>
                                                            <td style={InactiveStyle}>{t.aadhar}</td>
                                                            <td style={InactiveStyle}>{t.father_name}</td>
                                                            <td style={InactiveStyle}>
                                                                <ul>
                                                                    {t?.nominee &&
                                                                        t?.nominee.map((tn, ind) => {
                                                                            return <li key={ind}>{tn?.nominee_name}</li>;
                                                                        })}
                                                                </ul>
                                                            </td>
                                                            <td>{t.cat_worker_type}</td>
                                                            <td>{t.status === "A" ? "Active" : "Inactive"}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                ))}

            {data?.paginatedData?.total_records > 0 && <Pagination data={data?.paginatedData} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
        </>
    );
};

export default MergedList;
