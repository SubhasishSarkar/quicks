import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import NoDataFound from "../../../components/list/NoDataFound";
import Pagination from "../../../components/Pagination";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const AddlcList = () => {
    const userType = "ADDLC";
    const [searchParams, setSearchParams] = useSearchParams({ userType });
    const { isFetching, error, data } = useQuery(["users-management-list", searchParams.toString()], () => fetcher(`/users-management-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "ADDLC List", url: "" }));
    }, []);

    return (
        <>
            {error && <ErrorAlert error={error} />}

            <div className="card datatable-box mb-2">
                <div className="card-body">
                    {isFetching && <LoadingSpinner />}
                    {data && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL.No.</th>
                                        <th>Username</th>
                                        <th>Name</th>
                                        <th>Employee ID</th>
                                        <th>Area</th>
                                        <th>Mobile</th>
                                        {/* <th>Action</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data?.from + index}</td>
                                                <td>{item.name}</td>
                                                <td>{item.fullname}</td>
                                                <td>{item.employee_id}</td>
                                                <td>{item.user_place}</td>
                                                <td>{item.mobile}</td>
                                                {/* <td>Edit</td> */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!isFetching && data?.data.length === 0 && <NoDataFound />}
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </div>
            </div>
        </>
    );
};

export default AddlcList;
