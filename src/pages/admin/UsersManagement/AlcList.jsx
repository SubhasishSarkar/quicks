import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import NoDataFound from "../../../components/list/NoDataFound";
import Pagination from "../../../components/Pagination";
import { useValidate } from "../../../hooks";
import { fetcher, searchParamsToObject } from "../../../utils";
import EditUserDataModal from "./EditUserDataModal";
import UsersManagementListFilter from "./UsersManagementListFilter";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const AlcList = () => {
    const userType = "ALC";
    const [searchParams, setSearchParams] = useSearchParams({ userType });
    const createdBy = searchParams.get("createdBy" || "");
    searchParams.set("createdBy", createdBy ? createdBy : "");
    const { isFetching, error, data } = useQuery(["users-management-list", searchParams.toString()], () => fetcher(`/users-management-list?${searchParams.toString()}`), { enabled: searchParams.toString() ? true : false });
    const [lgShow, setLgShow] = useState(false);
    const [userId, setUserId] = useState();
    const [otherData, setOtherData] = useState();

    const [newPageAddress, setNewPageAddress] = useState("ALC List");
    useEffect(() => {
        if (data?.data[0].createdByDetails) {
            setNewPageAddress("ALC List of " + data?.data[0].createdByDetails);
        } else {
            setNewPageAddress("ALC List");
        }
    }, [data]);

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const openEditModal = (id, name, empId) => {
        setLgShow(true);
        setUserId(id);
        setOtherData(name + " (" + empId + ")");
    };
    const handleClose = () => setLgShow(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: newPageAddress, url: "" }));
    }, [newPageAddress]);
    return (
        <>
            {error && <ErrorAlert error={error} />}

            <div className="card datatable-box mb-2">
                {/* <div className="card-header py-3">
                    <h5 className="m-0 font-weight-bold text-white">ALC List </h5>
                </div> */}
                <div className="card-body">
                    {isFetching && <LoadingSpinner />}
                    {data && (
                        <>
                            <UsersManagementListFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} />
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
                                            <th>Action</th>
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
                                                    <td>{item.mobile} </td>
                                                    <td>
                                                        <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                                            <div className="btn-group me-2 mb-2" role="group" aria-label="First group">
                                                                <button type="button" className="btn btn-sm btn-primary" onClick={() => openEditModal(item.encUserId, item.name, item.employee_id)}>
                                                                    Edit User
                                                                </button>
                                                            </div>
                                                            <div className="btn-group" role="group" aria-label="Second group">
                                                                <Link to={"/users-management/imw-list?createdBy=" + item.encUserId} style={{ textDecoration: "none", color: "#010101" }}>
                                                                    <button type="button" className="btn btn-sm btn-info">
                                                                        View IMW List
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {userId && <EditUserDataModal lgShow={lgShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
                        </>
                    )}
                    {!isFetching && data?.data.length === 0 && <NoDataFound />}
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </div>
            </div>
        </>
    );
};

export default AlcList;
