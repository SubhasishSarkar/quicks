import React from "react";

function OtherInformation({ data }) {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-briefcase p-2"></i>Other Details
                </h5>
            </div>

            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">Status of Transport Worker : </span> {data?.name_of_worker ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Nature of duty : </span> {data?.nature_of_duties ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">nature of vehicle : </span> {data?.nature_of_vechicle ?? ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtherInformation;
