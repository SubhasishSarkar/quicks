import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetcher } from "../../../utils";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { toast } from "react-toastify";

const AadharRectificationForm = ({ handleClose, encId, ssin }) => {
    const [applicationId, setApplicationId] = useState();
    const [loading, setLoading] = useState();
    const query = useQueryClient();

    useEffect(() => {
        setApplicationId(encId);
    }, [encId]);

    const { error, data, isLoading } = useQuery(["get-data-for-aadhar-rectification", applicationId], () => fetcher(`/get-data-for-aadhar-rectification?appId=${applicationId}`), { enabled: applicationId ? true : false });

    const { mutate } = useMutation((encId) => fetcher(`/tagged-aadhar-with-ssin?appId=${encId}`));
    const clickYes = (encId) => {
        setLoading(encId);
        mutate(encId, {
            onSuccess(data, variables, context) {
                toast.success(data.msg);
                query.invalidateQueries("get-aadhar-list");
                handleClose(true);
                setLoading();
            },
            onError(error, variables, context) {
                toast.error(error.message);
                handleClose(true);
                setLoading();
            },
        });
    };

    return (
        <>
            {error && <ErrorAlert />}
            {isLoading && <LoadingSpinner />}
            {data && (
                <>
                    <ul className="list-group mb-4">
                        <li className="list-group-item d-flex  align-items-center">
                            <p className="lh-1 text-nowrap mb-0 text-dark">Registration No : {data?.registration_no}</p>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <p className="lh-1 text-nowrap mb-0 text-dark">Registration Date : {data?.registration_date}</p>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <p className="lh-1 text-nowrap mb-0 text-dark">SSIN : {data?.ssin_no}</p>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <p className="lh-1 text-nowrap mb-0 text-dark">Aadhar : {data?.aadhar}</p>
                        </li>
                    </ul>
                    {data?.status.trim() === "DA" ? (
                        <div className="card">
                            <div className="card-body">
                                <h6>
                                    <p className="lh-base  mb-0 text-dark text-break">Do You Want To Tag Aadhaar Number With This SSIN ?</p>
                                </h6>
                            </div>
                            <div className="card-footer">
                                <div className="btn-toolbar d-flex justify-content-end">
                                    <div className="btn-group me-2" role="group" aria-label="First group">
                                        <button type="button" className="btn btn-success btn-sm" onClick={() => clickYes(encId)} disabled={loading === encId ? true : false}>
                                            {loading === encId ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-thumbs-up"></i>} YES
                                        </button>
                                    </div>
                                    <div className="btn-group me-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-danger btn-sm" disabled={loading === encId ? true : false} onClick={() => handleClose(true)}>
                                            <i className="fa-solid fa-thumbs-down"></i> NO
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <h6>
                                    <p className="lh-1 text-nowrap mb-0 text-dark text-break">{data?.status.trim() === "SA" && "SSIN tagged with this aadhar as same person."}</p>
                                    <p className="lh-1 text-nowrap mb-0 text-dark text-break">{data?.status.trim() === "TA" && "Aadhar number is tagged with this SSIN."}</p>
                                    <p className="lh-1 text-nowrap mb-0 text-dark text-break">{data?.status.trim() === "TDA" && "Please select your preference (same or different person) from list."}</p>
                                </h6>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default AadharRectificationForm;
