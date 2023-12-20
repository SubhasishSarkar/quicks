import React from "react";

const PaymentInformation = ({ data }) => {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-briefcase p-2"></i>Payment Details
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <div className="col-md-4">
                            <span className="fw-semibold">Book No. : </span> {data?.book_no ?? ""}
                        </div>
                        <div className="col-md-4">
                            <span className="fw-semibold">Receipt No. : </span> {data?.receipt_no ?? ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentInformation;
