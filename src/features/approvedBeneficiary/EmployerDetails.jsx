import React from "react";
import NoDataFound from "../../components/list/NoDataFound";

const EmployerDetails = ({ data }) => {
    if (!data) {
        return <p>Something Error </p>;
    }
    let employerDetails = [];
    const nomineeDetails = data.nomineeDetailsPension;
    const receiptDetails = data.receiptDetails;
    const details = data.details;
    employerDetails = data.employerDetails;
    let twWorkerDetails = [];
    twWorkerDetails = data.twWorkerDetails;

    if (!employerDetails && ["cw"].includes(data?.workerDetails?.cat_worker_type)) {
        return <NoDataFound />;
    }

    if (twWorkerDetails && ["tw"].includes(data?.workerDetails?.cat_worker_type)) {
        return <NoDataFound />;
    }
    return (
        <>
            <div className="scroll--simple " style={{ maxHeight: "350px", overflowX: "clip", overflowY: "auto" }}>
                {["cw"].includes(data?.workerDetails?.cat_worker_type) && (
                    <div className="card mb-3 text-bg-light border-info" style={{ marginTop: "8px" }}>
                        <div className="section_title">
                            <strong> Employment Details </strong>
                        </div>
                        {employerDetails.map((item, index) => (
                            <div key={index}>
                                <div className="card-body">
                                    <div className="ben_details_section mb-1" style={{ fontWeight: "500" }}>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Employer Name :</b> {item?.employers_name ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Employer Address :</b> {item?.employer_address ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Institute Registration Number :</b> {item?.registration_no_of_institute ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Workplace Details :</b> {item?.workplace_details ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Nature of Job :</b> {item?.nature_of_job ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Start Date :</b> {item?.start_date ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Working Days :</b> {item?.day_count ?? ""}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> End Date :</b> {item?.end_date ?? ""}
                                        </span>

                                        <span>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Remarks :</b> {item?.remarks ?? ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {twWorkerDetails && ["tw"].includes(data?.workerDetails?.cat_worker_type) && (
                    <div className="card mb-3 text-bg-light border-info" style={{ marginTop: "8px" }}>
                        <div className="section_title">
                            <strong> Worker Details </strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0">
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Name of Worker:</b> {twWorkerDetails?.name_of_worker ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Nature of vechicle :</b> {twWorkerDetails?.nature_of_vechicle ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b>Nature of duties :</b> {twWorkerDetails?.nature_of_duties ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {nomineeDetails && (
                    <div className="card mb-3 text-bg-light border-info" style={{ marginTop: "8px" }}>
                        <div className="section_title">
                            <strong> Pension Nominee Details </strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0">
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Name :</b> {nomineeDetails?.nominee_name ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Gender :</b> {nomineeDetails?.gender ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Date of Birth :</b> {nomineeDetails?.dob ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Relation :</b> {nomineeDetails?.relationship ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Address :</b> {nomineeDetails?.nominee_address ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {receiptDetails && (
                    <div className="card mb-3 text-bg-light border-info">
                        <div className="section_title">
                            <strong> Payment Details </strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0">
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Book No. :</b> {receiptDetails?.book_no ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Receipt No. :</b> {receiptDetails?.receipt_no ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {details && (
                    <div className="card mb-3 text-bg-light border-info">
                        <div className="section_title">
                            <strong> Certification Details </strong>
                        </div>
                        <div className="card-body">
                            <div className="ben_details_section mb-0">
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> {["cw"].includes(data?.workerDetails?.cat_worker_type) ? "Form-27 Under BOCW Certified By" : "Form-1 Under WBTWSSS Certified By"} :</b>{" "}
                                    {details?.certified_by_edist ?? ""}
                                </span>
                                <span>
                                    <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Designation :</b> {details?.designation_edistrict ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default EmployerDetails;
