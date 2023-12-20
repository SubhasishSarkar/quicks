import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher, searchParamsToObject } from "../../utils";
import PostingAreaAllotment from "./PostingAreaAllotment";
import EditUserDetailsModal from "./EditUserDetailsModal";
import EditUserPasswordModal from "./EditUserPasswordModal";
import UsersManagementListFilter from "../../pages/admin/UsersManagement/UsersManagementListFilter";
import { useValidate } from "../../hooks";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";

const UserList = ({ type }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, error, data } = useQuery(["service-provider-list", searchParams.toString()], () => fetcher(`/service-provider-list?${searchParams.toString()}`));
    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const [lgShow, setLgShow] = useState(false);
    const [psShow, setPsShow] = useState(false);
    const [userId, setUserId] = useState();
    const [otherData, setOtherData] = useState();
    const [postingAreaShow, setPostingAreaShow] = useState(0);
    const [motherBlock, setMotherBlock] = useState();
    useEffect(() => {
        setPostingAreaShow(0);
        validator.reset();
    }, [type]);

    const openEditModal = (id, name, empId) => {
        setLgShow(true);
        setPsShow(false);
        setUserId(id);
        setOtherData(name + " (" + empId + ")");
    };

    const openSecondEditModal = (id, name, empId) => {
        setPsShow(true);
        setLgShow(false);
        setUserId(id);
        setOtherData(name + " (" + empId + ")");
    };

    const handleClose = () => {
        setLgShow(false);
        setPsShow(false);
    };
    const handleModify = (encId, employee_id, block_code) => {
        setPostingAreaShow(encId);
        setMotherBlock(block_code);
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        searchParams.set("page", 1);
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {postingAreaShow == 0 && (
                <>
                    <UsersManagementListFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} />

                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <div className="card datatable-box mb-4">
                            <div className="card-body">
                                <div  style={{ overflow: "auto" }} className="table-container">
                                    <table className="table table-bordered table-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th>SL No.</th>
                                                <th>ARN</th>
                                                <th>Role</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Mobile</th>
                                                {type == 2 && <th>Status</th>}
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data &&
                                                data?.data?.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td  style={wrapStyle}>{data?.from + index}</td>
                                                            <td  style={wrapStyle}>{item.name}</td>
                                                            <td  style={wrapStyle}>{item.usr_type}</td>
                                                            <td  style={wrapStyle}>{item.fullname}</td>
                                                            <td  style={wrapStyle}>{item.mail != "" && item.mail != "null" ? item.mail : "Not Updated"}</td>
                                                            <td  style={wrapStyle}>{item.mobile != "" && item.mobile != "null" ? item.mobile : "Not Updated"}</td>
                                                            {type == 1 && (
                                                                <td  style={wrapStyle} className="text-center">
                                                                    <button type="button" className="btn btn-sm btn-success" onClick={() => handleModify(item.encuserid, item.employee_id, item.block_code)}>
                                                                        <i className="fa-solid fa-plus-minus"></i> ADD/MODIFY
                                                                    </button>
                                                                </td>
                                                            )}
                                                            {type == 2 && (
                                                                <>
                                                                    <td  style={wrapStyle}>{item.status == "0" ? "BLOCKED" : "ACTIVE"}</td>
                                                                    <td className="text-center"  style={wrapStyle}>
                                                                        <button type="button" className="btn btn-sm btn-success" onClick={() => openSecondEditModal(item.encuserid, item.fullname, item.employee_id)} style={{ marginRight: "3px" }}>
                                                                            <i className="fa-solid fa-user-lock"></i> RESET PASSWORD
                                                                        </button>

                                                                        <button type="button" className="btn btn-sm btn-warning" onClick={() => openEditModal(item.encuserid, item.fullname, item.employee_id)}>
                                                                            <i className="fa-regular fa-pen-to-square"></i> EDIT INFO
                                                                        </button>
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />

                                {userId && lgShow && <EditUserDetailsModal lgShow={lgShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
                                {userId && psShow && <EditUserPasswordModal psShow={psShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
                            </div>
                        </div>
                    )}
                    {/* </div>
                </div> */}

                    {userId && lgShow && <EditUserDetailsModal lgShow={lgShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
                    {userId && psShow && <EditUserPasswordModal psShow={psShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
                </>
            )}
            {postingAreaShow != 0 && <PostingAreaAllotment encId={postingAreaShow} setPostingAreaShow={setPostingAreaShow} motherBlock={motherBlock} />}
        </>
    );
};

export default UserList;
