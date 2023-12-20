import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetcher, updater } from "../../utils";
import moment from "moment";
import { toast } from "react-toastify";
import { RegistrationContext } from "./RegistrationForm";
import LoadingOverlay from "../../components/LoadingOverlay";

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

const FinalReview = ({ isActive }) => {
    const { isDirty } = useContext(RegistrationContext);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const {
        data,
        refetch,
        isLoading: isLoadingData,
        isFetching,
    } = useQuery(["caf-registration-preview", "final-submit", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=final-submit`), {
        //...disableQuery,
        enabled: application_id && isActive ? true : false,
    });

    console.log("finalReview", data);

    const finalBtnFunc = (datax) => {
        const docLength = datax?.registration_type !== "NEW" && (datax?.is_ndf === 0 || datax?.is_ndf === null) ? 6 : 5;
        console.log("docLength", docLength);
        if (docLength === 6) {
            if (Object.keys(datax.documents).length < 5) return true;
            else if (Object.keys(datax.documents).length === 5 && Object.keys(datax).includes("Epic")) return true;
            return false;
        } else if (docLength === 5) {
            if (Object.keys(datax.documents).length < 4) return true;
            else if (Object.keys(datax.documents).length === 4 && Object.keys(datax).includes("Epic")) return true;
            return false;
        }

        if (datax?.status) {
            if (datax.status != "0") return true;
            else if (datax.status == "0") return false;
        }
    };

    useEffect(() => {
        if (data && !isLoadingData && !isFetching) {
            const result = finalBtnFunc(data);
            setDisable(result);
        }
    }, [data, isLoadingData, isFetching]);

    useEffect(() => {
        console.log(isActive);
        if (isActive) refetch();
    }, [isActive]);

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const handleSubmit = () => {
        if (application_id) {
            mutate(
                {
                    url: "/caf-registration?type=final-submit&id=" + application_id,
                    body: { finalSubmit: data },
                },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        navigate(`/caf/form1upload/${application_id}`);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                    },
                }
            );
        }
    };

    const sectionRef = useRef(null);

    useEffect(() => {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }, [isActive]);

    return (
        <>
            {isFetching && <LoadingOverlay />}
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
                                <span className="fw-semibold">Registration Date : </span>
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

            <div className="card datatable-box mb-2">
                <div className="card-header py-1">
                    <h5 className="m-0">
                        <i className="fa-solid fa-user-group p-2"></i>Nominee Information
                    </h5>
                </div>
                <div className="card-body">
                    <div className="card-text">
                        <div className="row">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>Sl.No</th>
                                            <th>Nominee Name</th>
                                            <th>Relationship</th>
                                            <th>Share</th>
                                            <th>Gender</th>
                                            <th>DOB (Age)</th>
                                            <th>Bank Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.nominee.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{1 + index}</td>
                                                    <td>{item.nominee_name}</td>
                                                    <td>{item.nominee_relationship}</td>
                                                    <td>{item.nominee_share}</td>
                                                    <td>{item.nominee_gender}</td>
                                                    <td>
                                                        {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                                    </td>
                                                    <td>
                                                        Account No : {item.nominee_bank_account_no} <br />
                                                        IFSC : {item.nominee_bank_ifsc_code} <br />
                                                        Bank Name : {item.nominee_bank_name} <br />
                                                        Branch Name :{item.nominee_bank_branch_name}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card datatable-box mb-2">
                <div className="card-header py-1">
                    <h5 className="m-0">
                        <i className="fa-solid fa-users-rectangle p-2"></i>Dependent Information
                    </h5>
                </div>
                <div className="card-body">
                    <div className="card-text">
                        <div className="row">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>Sl.No</th>
                                            <th>Dependent Name</th>
                                            <th>Relationship/ Other Relationship</th>
                                            <th>Gender</th>
                                            <th>DOB</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.dependent.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{1 + index}</td>
                                                    <td>{item.depedent_name}</td>
                                                    <td>{item.depedent_relationship}</td>
                                                    <td>{item.depedent_gender}</td>
                                                    <td>
                                                        {moment(item.depedent_dob).format("DD-MM-YYYY")} ({item.depedent_age})
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-grid d-md-flex justify-content-md-end" ref={sectionRef}>
                <button className="btn btn-success" type="submit" disabled={isLoading || isLoadingData || disable || isDirty} onClick={handleSubmit}>
                    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-coins"></i>} Final Submit
                </button>
            </div>
        </>
    );
};

export default FinalReview;
