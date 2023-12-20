import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { fetcher } from "../../../../utils";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import NoDataFound from "../../../../components/list/NoDataFound";

const DsCAFInfoList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { error, data, isLoading } = useQuery(["duare-sarkar-caf-update-list", searchParams.toString()], () => fetcher(`/duare-sarkar-caf-update-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [show, setShow] = useState(false);
    const [dsId, setDsId] = useState();
    const [name, setName] = useState();
    const handleClose = () => setShow(false);

    const openModal = (id, name) => {
        setShow(true);
        setDsId(id);
        setName(name);
    };

    const { error: detailsError, data: detailsData, isLoading: detailsLoading } = useQuery(["duare-sarkar-caf-ben-details", dsId], () => fetcher(`/duare-sarkar-caf-ben-details?id=${dsId}`), { enabled: dsId ? true : false });

    const badge = {
        fontSize: "13px",
        fontFamily: "monospace",
        letterSpacing: "2px",
    };
    const labelS = {
        fontSize: "16px",
        margin: "7px",
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar CAF Updated List", url: "" }));
    }, []);

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card datatable-box mb-4">
                    <div className="card-body">
                        {data?.data.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>SL No.</th>
                                            <th>DS Registration Number</th>
                                            <th>DS Registration Date</th>
                                            <th>Aadhaar No.</th>
                                            <th>Mobile No.</th>
                                            <th>Beneficiary Name</th>
                                            <th>DS CAF Updated Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{data?.from + index}</td>
                                                    <td>{item.ds_reg_no}</td>
                                                    <td>{item.ds_reg_date}</td>
                                                    <td>{item.aadhaar_no}</td>
                                                    <td>{item.mobile}</td>
                                                    <td>{item.beneficiary_name}</td>
                                                    <td>{item.created_date}</td>
                                                    <td>
                                                        <button type="button" className="btn btn-sm btn-primary" onClick={() => openModal(item.id, item.beneficiary_name)}>
                                                            Check
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                            </div>
                        ) : (
                            <NoDataFound />
                        )}
                    </div>
                </div>
            )}

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Duare Sarkar CAF Update Details of <b style={{ color: "#5092ed" }}>{name}</b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailsLoading && <LoadingSpinner />}
                    {detailsError && <ErrorAlert error={detailsError} />}
                    {detailsData && (
                        <>
                            <div className="row">
                                <div className="col-md-12">
                                    <label style={labelS}>
                                        Status :{" "}
                                        <b>
                                            {detailsData?.status.trim() === "A" && (
                                                <Badge style={badge} bg="success">
                                                    Approved
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {detailsData?.status.trim() === "S" && (
                                                <Badge style={badge} bg="secondary">
                                                    Submitted
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {detailsData?.status.trim() === "B" && (
                                                <Badge style={badge} bg="primary">
                                                    Back For Correction
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {detailsData?.status.trim() === "R" && (
                                                <Badge style={badge} bg="danger">
                                                    Rejected
                                                </Badge>
                                            )}
                                        </b>
                                        <b>
                                            {(detailsData?.status.trim() === "0" || detailsData?.status.trim() === "P" || detailsData?.status.trim() === "-1" || detailsData?.status.trim() === "I") && (
                                                <Badge style={badge} bg="warning" text="dark">
                                                    Pending
                                                </Badge>
                                            )}
                                        </b>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-solid fa-image-portrait"></i> DS Registration No : <b>{detailsData?.ds_reg_no}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-regular fa-calendar-days"></i> DS Registration Date : <b>{detailsData?.ds_reg_date}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-regular fa-id-card"></i> Aadhar No : <b>{detailsData?.aadhaar_no}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-solid fa-mobile-screen-button"></i> Mobile No : <b>{detailsData?.mobile}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-solid fa-house-chimney-crack"></i> District : <b>{detailsData?.district_name}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-solid fa-house-circle-check"></i> Sub Division : <b>{detailsData?.subdivision_name}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-solid fa-house-chimney-window"></i> Block : <b>{detailsData?.block_mun_name}</b>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelS}>
                                        <i className="fa-solid fa-house-chimney-user"></i> Gp/Ward : <b>{detailsData?.gp_ward_name}</b>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DsCAFInfoList;
