import moment from "moment";
import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { disableQuery } from "../../../data";
import { fetcher } from "../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const BacklogDataDetails = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["back-log-data-details", id], () => fetcher(`/back-log-data-details/${id}`), { ...disableQuery });
    const arrData = data?.data;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Backlog Beneficiary List", url: "/back-log-data-list", subTitle: "Beneficiary Details" }));
    }, []);
    const point = {
        fontSize: "7px",
        position: "relative",
        bottom: "3.5px",
        color: "#0a66f5",
    };
    return (
        <>
            {isFetching && (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error.message}
                </div>
            )}
            {data && (
                <>
                    <div className="row">
                        <div className="col">
                            <div className="card-nav-tabs mb-4">
                                <Tabs>
                                    <Tab eventKey="0" title="Basic Details" disabled="">
                                        <div style={{ maxHeight: "400px", overflowX: "clip", overflowY: "auto", "-webkit-overflow-scrolling": "touch" }}>
                                            <div className="container">
                                                <div className="row row-cols-3">
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> SSIN :{" "}
                                                        </b>
                                                        {arrData ? arrData?.ssin_number : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Worker Type :{" "}
                                                        </b>
                                                        {arrData ? arrData?.worker_type : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Registration Number :{" "}
                                                        </b>
                                                        {arrData ? arrData?.reg_number : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Registration Date :{" "}
                                                        </b>
                                                        {arrData ? moment(arrData?.registration_date).format("DD-MM-YYYY") : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Name :{" "}
                                                        </b>
                                                        {arrData ? arrData?.name : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Father Name :{" "}
                                                        </b>
                                                        {arrData ? arrData?.father_name : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Husband Name :{" "}
                                                        </b>
                                                        {arrData ? arrData?.husband_name : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Date Of Birth (Age) :{" "}
                                                        </b>
                                                        {arrData ? moment(arrData?.dob).format("DD-MM-YYYY") : " "} ({arrData ? Math.floor(moment(new Date()).diff(moment(arrData?.dob), "years", true)) : ""})
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Gender :{" "}
                                                        </b>
                                                        {arrData ? arrData?.gender : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Epic Number :{" "}
                                                        </b>
                                                        {arrData ? arrData?.epic_card : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Aadhaar Number :{" "}
                                                        </b>
                                                        {arrData ? arrData?.aadhar_number : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Marital Status :{" "}
                                                        </b>
                                                        {arrData ? arrData?.maritial_status : ""}
                                                    </div>
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Caste :{" "}
                                                        </b>
                                                        {arrData ? arrData?.religion : ""}
                                                    </div>
                                                </div>
                                                <div className="row row-cols-1">
                                                    <div className="col">
                                                        <b>
                                                            <i className="fa-solid fa-circle" style={point}></i> Permanent Address :{" "}
                                                        </b>
                                                        {arrData ? arrData?.address : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default BacklogDataDetails;
