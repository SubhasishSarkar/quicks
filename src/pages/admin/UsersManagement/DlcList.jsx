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

const DlcList = () => {
    const userType = "DLC";
    const [searchParams, setSearchParams] = useSearchParams({ userType });
    const { isFetching, error, data } = useQuery(["users-management-list", searchParams.toString()], () => fetcher(`/users-management-list?${searchParams.toString()}`));

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

    const [lgShow, setLgShow] = useState(false);
    const [userId, setUserId] = useState();
    const [otherData, setOtherData] = useState();

    const openEditModal = (id, name, empId) => {
        setLgShow(true);
        setUserId(id);
        setOtherData(name + " (" + empId + ")");
    };
    const handleClose = () => setLgShow(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "DLC List", url: "" }));
    }, []);
    return (
        <>
            {error && <ErrorAlert error={error} />}

            <div className="card datatable-box mb-2">
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
                                                            <div className="btn-group me-2" role="group" aria-label="Second group">
                                                                <button type="button" className="btn btn-sm btn-info" style={{ height: "32px" }}>
                                                                    <Link to={"/users-management/alc-list?createdBy=" + item.encUserId} style={{ textDecoration: "none", color: "#010101" }}>
                                                                        View ALC List
                                                                    </Link>
                                                                </button>
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

export default DlcList;
