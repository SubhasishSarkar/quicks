import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const DependentForm = ({ applicationId, dependentParentCallBack }) => {
    const { error, data, isFetching } = useQuery(["previous-dependent-list", applicationId], () => fetcher(`/previous-dependent-list?id=${applicationId}`));

    //For delete Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [dependentId, setDependentId] = useState();
    const [parentId, setParentId] = useState();

    const sendData = (item, label) => {
        dependentParentCallBack({ ...item, label: label });
    };

    const { mutate } = useMutation((urlQueryParams) => fetcher(`/cr-remove-dependent?${urlQueryParams}`));
    const query = useQueryClient();

    const removeDependent = (dependentId, parentId) => {
        setOpenConfirm(true);
        setDependentId(dependentId);
        setParentId(parentId);
    };

    const handleConfirm = () => {
        setOpenConfirm(false);
        const urlQueryParams = `id=${dependentId}&parent=${parentId}`;
        mutate(urlQueryParams, {
            onSuccess(data, variables, context) {
                query.invalidateQueries("previous-dependent-list");
                toast.success(data.msg);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="Are you sure, you want to delete this dependent entry?" />}
            <div className="card">
                <div className="section_title">
                    <strong>Dependent</strong>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        {isFetching && <LoadingSpinner />}
                        {error && <ErrorAlert error={error} />}
                        {data?.length > 0 && (
                            <div  style={{ overflow: "auto",marginTop: "10px" }} className="table-container table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>SL No.</th>
                                            <th>Dependent Name</th>
                                            <th>Relationship : Other Relationship Name</th>
                                            <th>Gender</th>
                                            <th>DOB</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={wrapStyle}>{index + 1} </td>
                                                    <td style={wrapStyle}>{item.depedent_name} </td>
                                                    {item.depedent_relationship === "Other" && (
                                                        <td style={wrapStyle}>
                                                            {item.depedent_relationship} : {item.other_name}
                                                        </td>
                                                    )}
                                                    {item.depedent_relationship != "Other" && <td style={wrapStyle}>{item.depedent_relationship}</td>}

                                                    <td style={wrapStyle}>{item.depedent_gender} </td>
                                                    <td style={wrapStyle}>{item.depedent_dob} </td>

                                                    <td style={wrapStyle}>
                                                        {item.flag_status.trim() === "R" && item.status.trim() != "D" ? <span style={{ color: "rgb(65 180 3)" }}>Approved</span> : ""}
                                                        {item.status.trim() === "D" && item.flag_status.trim() === "R" ? <span style={{ color: "rgb(65 180 3)" }}>Previously Approve</span> : ""}
                                                        {item.status.trim() === "S" && item.flag_status.trim() === "CR" ? <span style={{ color: "rgb(65 180 3)" }}>Changed</span> : ""}
                                                    </td>

                                                    {item.status.trim() === "A" ? (
                                                        <td style={wrapStyle}>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                type="button"
                                                                onClick={() => {
                                                                    sendData(item, "Edit Dependent");
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {item.status.trim() === "D" && item.flag_status.trim() === "R" ? (
                                                        <td style={wrapStyle}>
                                                            <div className="btn-group">
                                                                <button type="button" className="btn btn-sm btn-success" disabled>
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {item.status.trim() === "S" && item.flag_status.trim() === "CR" ? (
                                                        <td style={wrapStyle}>
                                                            <div className="btn-group">
                                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeDependent(item.dependent_id, item.modify_parent_id)}>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            type="button"
                            className={data?.length > 0 ? "btn btn-sm btn-success" : "btn  btn-success"}
                            onClick={() => {
                                sendData({ encAppId: applicationId }, "Add New Dependent");
                            }}
                        >
                            Add New Dependent
                        </button>
                    </h5>
                </div>
            </div>
        </>
    );
};

export default DependentForm;
