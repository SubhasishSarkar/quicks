import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetcher, searchParamsToObject, updater } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { toast } from "react-toastify";

const CommissionGovGrantCheckInspector = ({ checkVerify, handleBack }) => {
    const [searchParams, setSearchParams] = useState(`id=${checkVerify}`);
    const [checkboxDeSelect, setCheckboxDeSelect] = useState(true);
    const [checkboxSelect, setCheckboxSelect] = useState([]);
    const [checkedState, setCheckedState] = useState([]);
    const [reason, setReason] = useState();
    const [submitClick, setSubmitClick] = useState(false);
    const queryClient = useQueryClient();

    const { status, isLoading, error, data: newData, isFetching } = useQuery(["commission-check-inspector", searchParams], () => fetcher(`/commission-check-inspector?${searchParams}`));
    useEffect(() => {
        if (status === "success") {
            setCheckedState(new Array(newData.data_Set?.data.length).fill(true));
            setCheckboxSelect(newData?.data_Set?.data?.map((item) => item.id));
        }
    }, [status, newData]);

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));

        setCheckedState(updatedCheckedState);
    };

    const handleMassClick = (e) => {
        const updatedCheckedState = checkedState.map((item, index) => e.currentTarget.checked);
        setCheckboxDeSelect(!checkboxDeSelect);
        setCheckedState(updatedCheckedState);
    };
    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleCheckReject = (e) => {
        e.preventDefault();
        setSubmitClick(true);
        mutate(
            { url: `/commission-check-inspector-post`, body: { checkboxSelect: checkboxSelect, checkedState: checkedState, pid: checkVerify, reason: reason } },
            {
                onSuccess(data) {
                    toast.success("COMMISSION SUCCESSFULLY REJECTED");
                    setSubmitClick(false);
                    queryClient.invalidateQueries(["commission-check-inspector", searchParams]);
                },
                onError(error) {
                    toast.error(error.message);
                    setSubmitClick(false);
                },
            }
        );
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            <div className="card datatable-box mb-4">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-3">
                            <button type="button" className="btn btn btn-danger" onClick={() => handleBack()}>
                                <i className="fa-solid fa-arrow-left"></i> BACK
                            </button>
                        </div>
                        <div className="col-md-9" style={{ fontSize: "20px" }}>
                            <b>
                                <i
                                    className="fa-solid fa-user-tie"
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "8px",
                                        borderRadius: "19px",
                                        color: "black",
                                        marginRight: "7px",
                                    }}
                                ></i>
                            </b>
                            VERIFY GOVERNMENT GRANT COMMISSION OF {newData && newData.data_Set?.data.length > 0 && newData?.data_Set?.data[0].collected_by_arn}
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {(isLoading || isFetching) && <LoadingSpinner />}
                    {newData && (
                        <>
                            {error && <ErrorAlert error={error} />}
                            <div className="table-responsive" style={{ position: "relative", overflow: "hidden" }}>
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input type="checkbox" checked={checkboxDeSelect} className="form_check" onChange={(e) => handleMassClick(e)} />
                                            </th>
                                            <th>SSIN</th>
                                            <th>Beneficiary Name</th>
                                            <th>No. of entry in passbook</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newData?.data_Set?.data?.map((item, index) => {
                                            return (
                                                <tr key={index} data-enc-id={item.enc_application_id}>
                                                    <td style={wrapStyle}>
                                                        {item.is_verified == "Y" && <input type="checkbox" id={`custom-checkbox-${index}`} name="massCheck" value={item.id} checked={checkedState[index]} onChange={() => handleOnChange(index)} />}
                                                        {item.is_verified == "N" && <span className="btn btn-sm btn-danger">REJECTED</span>}
                                                    </td>
                                                    <td style={wrapStyle}>{item.ssin_no}</td>
                                                    <td style={wrapStyle}>{item.beneficiary_name}</td>
                                                    <td style={wrapStyle}>{item.num_entry}</td>
                                                    <td style={wrapStyle}>{item.total_amount}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {newData?.data_Set?.links && (
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="d-inline-flex mb-3 px-2 py-1 fw-semibold text-secondary bg-opacity-20 ">
                                        Showing {newData?.data_Set?.from} to {newData?.data_Set?.to} of {newData?.data_Set?.total_records} Entries
                                    </small>
                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                        <nav>
                                            <ul className="pagination pagination-sm mb-0">
                                                {newData?.data_Set?.links?.map((item, index) => (
                                                    <li className={`page-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`} key={index}>
                                                        <a
                                                            href={item.query}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSearchParams(item.query.split("?")[1]);
                                                            }}
                                                            className="page-link"
                                                        >
                                                            {item.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <select
                                            className="form-select form-select-sm"
                                            value={searchParamsToObject(new URLSearchParams(searchParams)).limit}
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                const params = new URLSearchParams(searchParams);
                                                params.set("limit", value);
                                                e.preventDefault();
                                                setSearchParams(params.toString());
                                            }}
                                        >
                                            <option value="15">15</option>
                                            <option value="30">30</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            {newData && (
                                <>
                                    <div>
                                        <textarea rows="5" cols="50" onChange={(e) => setReason(e.currentTarget.value)}></textarea>
                                        <br />
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-success mt-2"
                                            disabled={submitClick}
                                            onClick={(evt) => {
                                                const confirmBox = window.confirm("ARE YOU SURE TO REJECT UNCHECKED ENTRY/ENTRIES? ONCE REJECTED USER WOULD NOT GET COMMISSION ON REJECTED/UNCHECKED ENTRY/ENTRIES.");
                                                if (confirmBox === true) {
                                                    handleCheckReject(evt);
                                                }
                                            }}
                                        >
                                            {submitClick ? ".....Loading" : "SUBMIT"}
                                        </button>
                                    </div>
                                    <br />
                                    <br />
                                    <h6 style={{ fontFamily: "monospace", color: "#f90606" }}>
                                        <span className="badge text-bg-danger">NOTE:</span>
                                        <ul>
                                            <li>If you want to deduct commission for any particular entry please uncheck it.</li>
                                            <li>User would not get any commission on rejected/unchecked entries.</li>
                                        </ul>
                                    </h6>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommissionGovGrantCheckInspector;
