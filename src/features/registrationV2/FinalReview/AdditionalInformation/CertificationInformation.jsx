import React from "react";

const CertificationInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-briefcase p-2"></i>Certification Details
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">{["cw"].includes(data?.workerDetails?.cat_worker_type) ? "Form-27 Under BOCW Certified By : " : "Certified By : "} </span> {data?.certified_by_edist ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Designation : </span> {data?.designation_edistrict ?? ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificationInformation;
