import moment from "moment";
import React from "react";

const workerFullForm = (name) => {
    switch (name) {
        case "ow":
            return "Other Worker";
        case "tw":
            return "Transport Worker";
        case "cw":
            return "Construction Worker";
    }
};

const BasicInformation = ({ data }) => {
    console.log("finalBasic",data)
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-user-check p-2"></i>Basic Information
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row ">
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Registration Type : </span>
                            {data?.registration_type}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Category of Worker Type :</span> {workerFullForm(data?.cat_worker_type)}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Registration Date : </span> {data?.registration_date}
                        </div>

                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">First Name : </span> {data?.fname}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Middle Name : </span> {data?.mname}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Last Name : </span>
                            {data?.lname}
                        </div>

                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Date Of Birth : </span> {moment(data?.dob).format("DD-MM-YYYY")}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Email : </span> {data?.email}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Mobile No : </span>
                            {data?.mobile}
                        </div>

                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Aadhar : </span> {data?.aadhar}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Epic : </span> {data?.epic}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Caste : </span>
                            {data?.caste}
                        </div>

                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Religion : </span> {data?.religion}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Gender : </span> {data?.gender}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Marital Status : </span>
                            {data?.marital_status}
                        </div>

                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Husband Name : </span> {data?.husband_name}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Father Name : </span> {data?.father_name}
                        </div>
                        {/* <div className="col-md-4 mb-2">
                                <span className="fw-semibold">Mother Name : </span>
                                {data?.mother_name}
                            </div> */}

                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Monthly Family Income : </span> {data?.monthly_family_income}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Certified By : </span> {data?.certified_by}
                        </div>
                        <div className="col-md-4 mb-2">
                            <span className="fw-semibold">Designation : </span>
                            {data?.designation}
                        </div>
                        <div className="col-md-12">
                            <span className="fw-semibold">Covered Under Employees Provident Fund and Miscellaneous Provisions Act, 1952 & ESI Act, 1948 : </span>
                            {data?.covered_under}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BasicInformation;
