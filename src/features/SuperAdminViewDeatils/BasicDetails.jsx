import moment from "moment";
import React from "react";

function BasicDetails({ data }) {
    return (
        <div className="scroll--simple " style={{ maxHeight: "400px", overflowX: "clip", overflowY: "auto" }}>
            <div className="row">
                <div className="col-md-4 col-mb-1">
                    <div className="card mb-3 text-bg-light border-info " style={{ marginTop: "7px" }}>
                        <div className="section_title">
                            <strong>Profile Picture</strong>
                        </div>
                        <div className="card-body">
                            <div className=" mb-0" style={{ fontWeight: "500" }}>
                                <img src={data.imageUrl} alt="profile" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8 col-mb-1">
                    <div className="card mb-3 text-bg-light border-info " style={{ marginTop: "7px" }}>
                        <div className="section_title">
                            <strong>Personal Information</strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0" style={{ fontWeight: "500" }}>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Name :</b> {data?.name ?? ""}
                                </span>

                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Date of Birth :</b> {moment(data?.dateOfBirth).format("DD-MM-YYYY") ?? ""}
                                </span>

                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Aadhaar :</b> {data.aadharNo ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Address :</b> {data.address ?? ""}
                                </span>

                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Email :</b> {data.email ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Mobile :</b> {data.mobile ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3 text-bg-light border-info " style={{ marginTop: "7px" }}>
                        <div className="section_title">
                            <strong>Employment Information</strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0" style={{ fontWeight: "500" }}>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Role :</b> {data.role ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Profile :</b> {data?.profile ?? ""}
                                </span>

                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Created by (ID) :</b> {data.createdBy ?? ""}
                                    {`(${data.createdById ?? ""})`}
                                </span>

                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Status :</b> {data.status ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Approved :</b> {data?.approved ? "Yes" : "No" ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Date of joining :</b> {moment(data.dateOfJoining).format("DD-MM-YYYY") ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BasicDetails;
