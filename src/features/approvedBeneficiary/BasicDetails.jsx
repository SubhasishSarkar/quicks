import moment from "moment";
import React from "react";

const BasicDetails = ({ arrData, showNominee = false, newType, certifiedBy, designation }) => {
    const arrDetails = arrData?.details;
    const workerDetails = arrData?.workerDetails;
    const arrPermanentAddress = arrData?.permanentAddress;
    const arrPresentAddress = arrData?.presentAddress;

    return (
        <>
            <div className="scroll--simple " style={{ maxHeight: "400px", overflowX: "clip", overflowY: "auto" }}>
                <div className="card mb-3 text-bg-light border-info " style={{ marginTop: "7px" }}>
                    <div className="section_title">
                        <strong>Personal Information</strong>
                    </div>
                    <div className="card-body">
                        <div className="ben_details_section mb-0" style={{ fontWeight: "500" }}>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Name :</b> {arrDetails ? arrDetails?.fullname : ""}
                            </span>

                            {arrDetails?.gender.trim() === "Female" && arrDetails?.marital_status.trim() === "Married" ? (
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Husband Name :</b> {arrDetails ? arrDetails?.husband_name : ""}
                                </span>
                            ) : (
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Father Name :</b> {arrDetails ? arrDetails?.father_name : ""}
                                </span>
                            )}
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Date Of Birth (Age) :</b> {arrDetails ? moment(arrDetails?.dob).format("DD-MM-YYYY") : " "} (
                                {arrDetails ? Math.floor(moment(new Date()).diff(moment(arrDetails?.dob), "years", true)) : ""})
                            </span>

                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Gender :</b> {arrDetails ? arrDetails?.gender : ""}
                            </span>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Epic Number :</b> {arrDetails ? arrDetails?.epic : ""}
                            </span>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Aadhaar Number :</b> {arrDetails ? arrDetails?.aadhar : ""}
                            </span>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Email :</b> {arrDetails ? arrDetails?.email : ""}
                            </span>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Mobile :</b> {arrDetails ? arrDetails?.mobile : ""}
                            </span>

                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Marital Status :</b> {arrDetails ? arrDetails?.marital_status : ""}
                            </span>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Caste :</b> {arrDetails ? arrDetails?.caste : ""}
                            </span>
                            <span>
                                <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Religion :</b> {arrDetails ? arrDetails?.religion : ""}
                            </span>
                        </div>
                    </div>

                    {newType === "bmssy" ? (
                        <div className="card-footer text-bg-light border-info">
                            <div style={{ fontSize: "14px" }}>
                                <>
                                    <span style={{ fontWeight: "500" }}>BM-SSY Certified By :</span> <span className="badge rounded-pill text-bg-primary">{certifiedBy} </span>
                                    <span className="badge rounded-pill text-bg-secondary">{designation}</span>
                                </>
                            </div>
                        </div>
                    ) : (
                        " "
                    )}
                </div>

                {(arrDetails?.ssin_no > 0 || (arrDetails?.registration_no && ["ow"].includes(workerDetails?.cat_worker_type))) && (
                    <div className="card mb-3 text-bg-light border-info">
                        <div className="section_title">
                            <strong> BM-SSY </strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0">
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> SSIN :</b> {arrDetails?.ssin_no > 0 ? arrDetails?.ssin_no : ""}
                                </span>
                                {["ow"].includes(workerDetails?.cat_worker_type) && (
                                    <span>
                                        <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Registration No. :</b> {arrDetails?.registration_no}
                                    </span>
                                )}
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Registration Date :</b> {arrDetails?.ssin_no > 0 ? moment(arrDetails?.registration_date).format("DD-MM-YYYY") : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {["tw", "cw"].includes(workerDetails?.cat_worker_type) && arrDetails?.registration_no && (
                    <div className="card mb-3 text-bg-light border-info">
                        <div className="section_title">
                            <strong>
                                {["cw"].includes(workerDetails?.cat_worker_type) && "BOCW"} {["tw"].includes(workerDetails?.cat_worker_type) && "WBTWSSS"}
                            </strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0">
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Registration No. :</b>
                                    {arrDetails?.registration_no}
                                </span>
                                {arrDetails?.e_district_reg_date && ["tw", "cw"].includes(workerDetails?.cat_worker_type) && arrDetails?.registration_type.trim() === "NEW" && (
                                    <span>
                                        <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Registration Date :</b> {arrDetails?.e_district_reg_date}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="card mb-3 text-bg-light border-info">
                    <div className="section_title">
                        <strong> Permanent Address </strong>
                    </div>
                    <div className="card-body">
                        <div className="ben_address_details_section mb-0">
                            <span style={{ fontWeight: "450" }}>
                                {arrPermanentAddress?.permanent_address_line1}, {arrPermanentAddress?.gp_ward_name}, {arrPermanentAddress?.block_mun_name},{arrPermanentAddress?.subdivision_name}, {arrPermanentAddress?.district_name} P.S:
                                {arrPermanentAddress?.ps_name}, P.O: {arrPermanentAddress?.po_name}, Pin: {arrPermanentAddress?.permanent_pincode}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card mb-1 text-bg-light border-info">
                    <div className="section_title">
                        <strong>Present Address</strong>
                    </div>
                    <div className="card-body">
                        <div className="ben_address_details_section mb-0">
                            <span style={{ fontWeight: "450" }}>
                                {arrPresentAddress?.present_address_line1}, {arrPresentAddress?.gp_ward_name}, {arrPresentAddress?.block_mun_name},{arrPresentAddress?.subdivision_name}, {arrPresentAddress?.district_name} P.S:
                                {arrPresentAddress?.ps_name}, P.O: {arrPresentAddress?.po_name}, Pin: {arrPresentAddress?.present_pincode}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BasicDetails;
