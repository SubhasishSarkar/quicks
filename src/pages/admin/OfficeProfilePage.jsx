import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetcher } from "../../utils";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const OfficeProfilePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Office Profile Details", url: "" }));
    }, []);

    const { data, isLoading, error } = useQuery(["/get-alc-office-profile-data"], () => fetcher(`/get-alc-office-profile-data`));

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <>
                    <div className="card datatable-box border-0">
                        <div className="card-body">
                            <div className="card-text mb-6">
                                <div className="row">
                                    <div className="col-md-4 mb-2">
                                        <ol className="list-group user_profile">
                                            <li className="list-group-item d-flex justify-content-center">
                                                <div className="justify-content-end">
                                                    <i className="fa-solid fa-people-group" style={{ fontSize: "22px", letterSpacing: "6px", color: "#198754" }}></i> Other Worker
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank Name :<div className="fw-bold">{data?.other.cat_others_bank_name ? data?.other.cat_others_bank_name : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank IFSC :<div className="fw-bold">{data?.other.others_ifsc ? data?.other.others_ifsc : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank A/C Number :<div className="fw-bold">{data?.other.others_bank_account ? data?.other.others_bank_account : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    TAN :<div className="fw-bold">{data?.other.others_tan ? data?.other.others_tan : "-"}</div>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <ol className="list-group user_profile">
                                            <li className="list-group-item d-flex justify-content-center">
                                                <div className="justify-content-end">
                                                    <i className="fa-solid fa-person-digging " style={{ fontSize: "22px", letterSpacing: "6px", color: "#dc3545" }}></i> Construction Worker
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank Name :<div className="fw-bold">{data?.other.cons_bank_name ? data?.other.cons_bank_name : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank IFSC :<div className="fw-bold">{data?.other.cons_ifsc ? data?.other.cons_ifsc : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank A/C Number :<div className="fw-bold">{data?.other.cons_bank_account ? data?.other.cons_bank_account : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    TAN :<div className="fw-bold">{data?.other.cons_tan ? data?.other.cons_tan : "-"}</div>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <ol className="list-group user_profile">
                                            <li className="list-group-item d-flex justify-content-center">
                                                <i className="fa-solid fa-truck-front d-flex justify-content-md-center" style={{ fontSize: "22px", letterSpacing: "6px", color: "#ffc107" }}></i>Transport Worker
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank Name :<div className="fw-bold">{data?.other.trns_bank_name ? data?.other.trns_bank_name : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank IFSC :<div className="fw-bold">{data?.other.trans_ifsc ? data?.other.trans_ifsc : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    Bank A/C Number :<div className="fw-bold">{data?.other.trans_bank_account ? data?.other.trans_bank_account : "-"}</div>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    TAN :<div className="fw-bold">{data?.other.trans_tan ? data?.other.trans_tan : "-"}</div>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default OfficeProfilePage;
