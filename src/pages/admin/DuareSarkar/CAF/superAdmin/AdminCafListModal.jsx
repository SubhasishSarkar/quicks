import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Badge, Modal } from "react-bootstrap";
import { fetcher } from "../../../../../utils";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import moment from "moment";

const AdminCafListModal = ({ show, handleClose, idd, aadhar }) => {
    const { data, isFetching, error } = useQuery(["details_of_ds_admin_caf", idd, aadhar], () => fetcher(`/details_of_ds_admin_caf?idd=${idd}&aadhar=${aadhar}`), { enabled: idd ? true : false });

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static" className="confirm_modal">
                {error && <ErrorAlert error={error} />}
                {isFetching && <LoadingSpinner />}
                {data && (
                    <>
                        <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", border: "none" }}>
                            <Modal.Title>
                                Duare Sarkar CAF Update Details of <b style={{ color: "#5092ed" }}>{data?.beneficiary_name}</b>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card shadow">
                                <div className="card-body">
                                    <p className="text-dark fs-6 fw-semibold">
                                        <i className="fa-solid fa-user-tie"></i> Status :{" "}
                                        <b>
                                            {data?.status.trim() === "A" && (
                                                <Badge pill bg="success">
                                                    Approved
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {data?.status.trim() === "S" && (
                                                <Badge pill bg="secondary">
                                                    Submitted
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {data?.status.trim() === "B" && (
                                                <Badge pill bg="primary">
                                                    Back For Correction
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {data?.status.trim() === "R" && (
                                                <Badge pill bg="danger">
                                                    Rejected
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {(data?.status.trim() === "0" || data?.status.trim() === "P" || data?.status.trim() === "-1" || data?.status.trim() === "I") && (
                                                <Badge pill bg="warning" text="dark">
                                                    Pending
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {data?.status.trim() === "DA" && (
                                                <Badge pill bg="warning" text="dark">
                                                    Duplicate Aadhar
                                                </Badge>
                                            )}
                                        </b>
                                    </p>
                                    <p className="text-dark fs-6 fw-semibold">
                                        <i className="fa-solid fa-image-portrait"></i> DS Registration No : <b>{data?.ds_reg_no}</b>
                                    </p>
                                    <p className="text-dark fs-6 fw-semibold">
                                        <i className="fa-regular fa-calendar-days"></i> DS Registration Date : <b>{moment(data?.ds_reg_date).format("DD-MM-YYYY")}</b>
                                    </p>
                                    <div className="ben_details_section">
                                        <p className="text-dark fs-6 fw-semibold">
                                            <i className="fa-regular fa-id-card"></i> Aadhar No : <b>{data?.aadhaar_no}</b>
                                        </p>

                                        <p className="text-dark fs-6 fw-semibold">
                                            <i className="fa-solid fa-mobile-screen-button"></i> Mobile No : <b>{data?.mobile}</b>
                                        </p>

                                        <p className="text-dark fs-6 fw-semibold">
                                            <i className="fa-solid fa-house-chimney-crack"></i> District : <b>{data?.district_name}</b>
                                        </p>

                                        <p className="text-dark fs-6 fw-semibold">
                                            <i className="fa-solid fa-house-circle-check"></i> Sub Division : <b>{data?.subdivision_name}</b>
                                        </p>

                                        <p className="text-dark fs-6 fw-semibold">
                                            <i className="fa-solid fa-house-chimney-window"></i> Block : <b>{data?.block_mun_name}</b>
                                        </p>

                                        <p className="text-dark fs-6 fw-semibold">
                                            <i className="fa-solid fa-house-chimney-user"></i> Gp/Ward : <b>{data?.gp_ward_name}</b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    );
};

export default AdminCafListModal;
