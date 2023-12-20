import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../utils";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import NomineeStatusForCr from "./NomineeStatusForCr";

const NomineeForm = ({ applicationId, nomineeParentCallBack }) => {
    const sendData = (item, label) => {
        nomineeParentCallBack({ ...item, label: label });
    };

    const { error, data, isFetching } = useQuery(["previous-nominee-list", applicationId], () => fetcher(`/previous-nominee-list?id=${applicationId}`));

    const { mutate } = useMutation((urlQueryParams) => fetcher(`/cr-remove-nominee?${urlQueryParams}`));
    const query = useQueryClient();

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [removeId, setRemoveId] = useState();
    const [removePid, setRemovePid] = useState();
    const [nomineeStatus, setNomineeStatus] = useState();
    const [confirmTitle, setConfirmTitle] = useState();

    const removeNominee = (nomineeId, parentId, status, msg) => {
        setOpenConfirm(true);
        setRemoveId(nomineeId);
        setRemovePid(parentId);
        setNomineeStatus(status);
        setConfirmTitle(msg);
    };

    const handleConfirm = () => {
        const urlQueryParams = `id=${removeId}&parent=${removePid}&status=${nomineeStatus}`;
        mutate(urlQueryParams, {
            onSuccess(data, variables, context) {
                setOpenConfirm(false);
                query.invalidateQueries("previous-nominee-list");
                toast.success(data.msg);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const { mutate: activeNomineeMutate } = useMutation((activeNomineeUrlQueryParams) => fetcher(`/active-approved-nominee?${activeNomineeUrlQueryParams}`));
    const activeNominee = (id) => {
        const activeNomineeUrlQueryParams = `id=${id}`;
        activeNomineeMutate(activeNomineeUrlQueryParams, {
            onSuccess(data, variables, context) {
                setOpenConfirm(false);
                query.invalidateQueries("previous-nominee-list");
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
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title={confirmTitle} />}
            <div className="card mb-3">
                <div className="section_title">
                    <strong>Nominee</strong>
                </div>
                <div className="card-body">
                    {isFetching && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <div style={{ overflow: "auto" }} className="table-container">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Nominee Name</th>
                                        <th>Relationship / Other Relationship</th>
                                        <th>Share</th>
                                        <th>Gender</th>
                                        <th>DOB (Age)</th>
                                        <th>Bank Details</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={wrapStyle}>{1 + index}</td>
                                                <td style={wrapStyle}>{item.nominee_name}</td>
                                                {item.nominee_relationship === "Other" && (
                                                    <td style={wrapStyle}>
                                                        {item.nominee_relationship} : {item.other_name}
                                                    </td>
                                                )}
                                                {item.nominee_relationship != "Other" && <td style={wrapStyle}>{item.nominee_relationship}</td>}
                                                <td style={wrapStyle}>{item.nominee_share}</td>
                                                <td style={wrapStyle}>{item.nominee_gender}</td>
                                                <td style={wrapStyle}>
                                                    {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                                </td>
                                                <td style={wrapStyle}>
                                                    Account No : {item.nominee_bank_account_no} <br />
                                                    IFSC : {item.nominee_bank_ifsc_code} <br />
                                                    Bank Name : {item.nominee_bank_name} <br />
                                                    Branch Name :{item.nominee_bank_branch_name}
                                                </td>

                                                <td style={wrapStyle}>
                                                    <NomineeStatusForCr item={item} />
                                                </td>

                                                {item.new_status.trim() === "A" && (
                                                    <td style={wrapStyle}>
                                                        {item.is_deleted === true ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    type="button"
                                                                    style={{ marginLeft: "3px" }}
                                                                    onClick={() => {
                                                                        activeNominee(item.nominee_id);
                                                                    }}
                                                                >
                                                                    Revert Back
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="d-flex">
                                                                    <button
                                                                        className="btn btn-sm btn-success"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            sendData(item, "Edit Nominee");
                                                                        }}
                                                                        disabled={item.flag_status.trim() === "0"}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        type="button"
                                                                        style={{ marginLeft: "3px" }}
                                                                        onClick={() => {
                                                                            removeNominee(item.nominee_id, "", item.status, "Are you sure? You want delete this approved nominee.");
                                                                        }}
                                                                        disabled={item.flag_status.trim() === "0"}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                )}
                                                {item.new_status.trim() === "S" && (
                                                    <td style={wrapStyle}>
                                                        <div className="btn-group">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeNominee(item.nominee_id, item.modify_parent_id, item.status, "Are you sure? You want to delete this nominee entry?")}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                                {/* {item.new_status.trim() === "D" && (item.flag_status.trim() === "R" || item.flag_status.trim() === "0") ? (
                                                    <td>
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-sm btn-success" disabled>
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.new_status.trim() === "S" && item.flag_status.trim() === "CR" ? (
                                                    <td>
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeNominee(item.nominee_id, item.modify_parent_id, "Are you sure? You want to delete this nominee entry?")}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                ) : (
                                                    ""
                                                )} */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                    sendData({ encAppId: applicationId }, "Add Nominee");
                                }}
                                disabled={data && Number(data[0]?.shareCount) >= 100 ? true : false}
                            >
                                Add New Nominee
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NomineeForm;
