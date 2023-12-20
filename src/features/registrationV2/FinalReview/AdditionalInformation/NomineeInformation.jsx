import React from "react";

const NomineeInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-briefcase p-2"></i>Pension Nominee Details
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">Name : </span> {data?.nominee_name ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Gender : </span> {data?.gender ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Date of Birth : </span> {data?.dob ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Relation : </span> {data?.relationship ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Address : </span> {data?.nominee_address ?? ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NomineeInformation;
