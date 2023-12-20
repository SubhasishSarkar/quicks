import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useValidate } from "../../../hooks";
import { fetcher, searchParamsToObject } from "../../../utils";
import EditUserDataModal from "./EditUserDataModal";
import UsersManagementListFilter from "./UsersManagementListFilter";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import TableList from "../../../components/table/TableList";

const CkcoList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "CKCO List", url: "" }));
    }, []);
    const userType = "CKCO";
    const [searchParams, setSearchParams] = useSearchParams({ userType });
    const createdBy = searchParams.get("createdBy" || "");
    searchParams.set("createdBy", createdBy ? createdBy : "");
    const { isLoading, isFetching, error, data } = useQuery(["users-management-list", searchParams.toString()], () => fetcher(`/users-management-list?${searchParams.toString()}`));

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
    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "name",
            headerName: "Username",
        },
        {
            field: "fullname",
            headerName: "Name",
        },
        {
            field: "employee_id",
            headerName: "Employee ID",
        },
        {
            field: "user_place",
            headerName: "Area",
        },
        {
            field: "mobile",
            headerName: "Mobile",
        },

        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => openEditModal(props.encUserId, props.name, props.employee_id)}>
                        <i className="fa-solid fa-user-pen"></i> Edit User
                    </button>
                );
            },
        },
    ];
    console.log(data);
    return (
        <>
            <UsersManagementListFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} />

            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
            {userId && <EditUserDataModal lgShow={lgShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
        </>
    );
};

export default CkcoList;
