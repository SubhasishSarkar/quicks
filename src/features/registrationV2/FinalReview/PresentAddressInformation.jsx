import React from "react";

const PresentAddressInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-location-pin p-2"></i>Present Address Information
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">District : </span> {data?.present_district_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Suv Division : </span> {data?.present_subdivision_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Block : </span> {data?.present_block_mun_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">GP/Ward : </span>
                            <span style={{ textTransform: "capitalize" }}>{data?.present_gp_ward_name}</span>
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Police Station : </span> {data?.present_ps_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Post Office : </span> {data?.present_po_name}
                        </div>
                        <div className="col-md-12">
                            <span className="fw-semibold">Address : </span> {data?.present_address_line1}, {data?.present_gp_ward_name}, {data?.present_block_mun_name}, {data?.present_subdivision_name}, {data?.present_district_name},
                            {data?.present_pincode}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PresentAddressInformation;
