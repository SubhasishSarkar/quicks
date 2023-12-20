import React from "react";

const PermanentAddressInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-location-dot p-2"></i>Permanent Address Information
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">District : </span> {data?.permanent_district_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Suv Division : </span> {data?.permanent_subdivision_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Block : </span> {data?.permanent_block_mun_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">GP/Ward : </span> <span style={{ textTransform: "capitalize" }}>{data?.permanent_gp_ward_name}</span>
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Police Station : </span> {data?.permanent_ps_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Post Office : </span> {data?.permanent_po_name}
                        </div>
                        <div className="col-md-12">
                            <span className="fw-semibold">Address : </span> {data?.permanent_address_line1}, {data?.permanent_gp_ward_name}, {data?.permanent_block_mun_name}, {data?.permanent_subdivision_name}, {data?.permanent_district_name},
                            {data?.permanent_pincode}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermanentAddressInformation;
