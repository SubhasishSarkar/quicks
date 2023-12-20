import React from "react";

const BankInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-2">
                <h5 className="m-0">
                    <i className="fa-solid fa-building-columns p-2"></i>Bank Information
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">Name : </span> {data?.bank_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Location : </span> {data?.bank_location}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Branch : </span> {data?.bank_branch_name}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">IFSC :</span>
                            {data?.bank_ifsc_code}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Account No : </span> {data?.bank_account_no}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankInformation;
