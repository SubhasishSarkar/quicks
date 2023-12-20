import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher, updater } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";
import ActionModalPage from "../ActionModalPage";
import NoDataFound from "../../../components/list/NoDataFound";

const AadharRectificationPendingList = () => {
    const type = "Pending";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const query = useQueryClient();
    const { error, data, isLoading } = useQuery(["get-aadhar-list", searchParams.toString()], () => fetcher(`/get-aadhar-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();
    const [loading, setLoading] = useState();
    const [backLoading, setBackLoading] = useState();

    const { mutate: checkClaim } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const showModal = (id, isActive, SSIN, name) => {
        const body = { application_id: id, ssin: SSIN };
        setLoading(id);
        checkClaim(
            { url: `/check_claim_and_changedRequest_exist`, body: body },
            {
                onSuccess(data, variables, context) {
                    console.log(data);
                    if (!data.status) {
                        setShow(true);
                        setEncId(id);
                        setIsActive(isActive);
                        setSsin(SSIN);
                        setBenName(name);
                        setLoading();
                    } else {
                        toast.error(data.msg);
                        setLoading();
                    }
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    setLoading();
                },
            }
        );
    };

    const { mutate } = useMutation((appId) => fetcher(`/revert-back-in-old-status?appId=${appId}`));
    const clickBack = (appId) => {
        setBackLoading(appId);
        mutate(appId, {
            onSuccess(data, variables, context) {
                toast.success(data.msg);
                query.invalidateQueries("get-aadhar-list");
                handleClose(true);
                setBackLoading();
            },
            onError(error, variables, context) {
                toast.error(error.message);
                handleClose(true);
                setBackLoading();
            },
        });
    };

    const { mutate: mutateForSamePerson } = useMutation((appId) => fetcher(`/choose-same-person?appId=${appId}`));
    const clickSamePerson = (appId) => {
        setBackLoading(appId + "SAME");
        mutateForSamePerson(appId, {
            onSuccess(data, variables, context) {
                toast.success(data.msg);
                query.invalidateQueries("get-aadhar-list");
                handleClose(true);
                setBackLoading();
            },
            onError(error, variables, context) {
                toast.error(error.message);
                handleClose(true);
                setBackLoading();
            },
        });
    };

    const { mutate: mutateForDifferentPerson } = useMutation((appId) => fetcher(`/choose-different-person?appId=${appId}`));
    const clickDifferentPerson = (appId) => {
        setBackLoading(appId + "Different");
        mutateForDifferentPerson(appId, {
            onSuccess(data, variables, context) {
                toast.success(data.msg);
                query.invalidateQueries("get-aadhar-list");
                handleClose(true);
                setBackLoading();
            },
            onError(error, variables, context) {
                toast.error(error.message);
                handleClose(true);
                setBackLoading();
            },
        });
    };

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {!isLoading && data?.data?.length === undefined && <NoDataFound />}
            {data && (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm table-hover">
                        <thead>
                            <tr>
                                <th scope="col" width="5%">
                                    SL No.
                                </th>
                                <th scope="col" width="30%">
                                    Aadhar No.
                                </th>
                                <th scope="col">SSIN & Beneficiary Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{data?.from + index}</td>
                                        <td>
                                            <button type="button" className="btn btn-sm">
                                                {item.aadhar} <span className="badge text-bg-primary">{item.count}</span>
                                            </button>
                                        </td>
                                        <td>
                                            {item.list?.list.map((item, index, array) => {
                                                return (
                                                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" key={index}>
                                                        <div className="btn-group me-2 mb-2" role="group" aria-label="First group">
                                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => showModal(item.appId, item.isActive, item.ssin, item.name)} disabled={loading === item.appId ? true : false}>
                                                                {loading === item.appId && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} {item.ssin}
                                                            </button>
                                                        </div>
                                                        <div className="btn-group me-2 mb-2" role="group" aria-label="Second group">
                                                            <button type="button" className="btn btn-light btn-sm" disabled>
                                                                {item.name}
                                                            </button>
                                                        </div>
                                                        <div className="btn-group me-2 mb-2" role="group" aria-label="Second group">
                                                            {item.status === "SA" && (
                                                                <small className="d-inline-flex px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                                                                    SSIN tagged with aadhar as same person.
                                                                </small>
                                                            )}
                                                            {item.status === "TA" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-warning btn-sm"
                                                                        onClick={() => clickBack(item.appId)}
                                                                        disabled={backLoading === item.appId ? true : backLoading === item.appId + "SAME" ? true : backLoading === item.appId + "Different" ? true : false}
                                                                    >
                                                                        {backLoading === item.appId ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-backward"></i>} Back
                                                                    </button>
                                                                    <small className="d-inline-flex px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">Aadhar is tagged with SSIN.</small>
                                                                </>
                                                            )}
                                                            {item.status === "TDA" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success btn-sm"
                                                                        disabled={backLoading === item.appId ? true : backLoading === item.appId + "SAME" ? true : false}
                                                                        onClick={() => clickSamePerson(item.appId)}
                                                                    >
                                                                        {backLoading === item.appId + "SAME" ? (
                                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                        ) : (
                                                                            <i className="fa-solid fa-people-arrows"></i>
                                                                        )}{" "}
                                                                        Same Person
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm"
                                                                        disabled={backLoading === item.appId ? true : backLoading === item.appId + "Different" ? true : false}
                                                                        onClick={() => clickDifferentPerson(item.appId)}
                                                                    >
                                                                        {backLoading === item.appId + "Different" ? (
                                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                        ) : (
                                                                            <i className="fa-solid fa-person-walking-arrow-right"></i>
                                                                        )}{" "}
                                                                        Different Person
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {data?.data?.length > 0 && <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
            <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} actionTabType="aadharRectification" handleClose={handleClose} />
        </>
    );
};

export default AadharRectificationPendingList;
