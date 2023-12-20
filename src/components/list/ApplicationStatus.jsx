import React from "react";

const ApplicationStatus = ({ status }) => {
    let newStatus = "";

    switch (status) {
        case "0":
            newStatus = <span className="badge text-bg-warning rounded-pill">Pending</span>;
            break;
        case "B":
            newStatus = <span className="badge text-bg-warning rounded-pill">Back For Correction</span>;
            break;
        case "-1":
            newStatus = <span className="badge text-bg-warning rounded-pill">Pending</span>;
            break;
        case "A":
            newStatus = <span className="badge bg-success rounded-pill">Approved</span>;
            break;
        case "S":
            newStatus = <span className="badge bg-primary rounded-pill">Submitted</span>;
            break;
        case "I":
            newStatus = <span className="badge bg-secondary rounded-pill">Form 1 Pending</span>;
            break;
        case "R":
            newStatus = <span className="badge bg-danger rounded-pill">Rejected</span>;
            break;
        case "SA":
            newStatus = <span className="badge bg-warning rounded-pill">Tagged as Same Aadhar</span>;
            break;
        case "OA":
            newStatus = <span className="badge bg-warning rounded-pill">Other Person Aadhar</span>;
            break;
        case "DA":
            newStatus = <span className="badge bg-warning rounded-pill">Duplicate Aadhaar</span>;
            break;

        default:
            newStatus = "INACTIVE";
            break;
    }
    return <>{newStatus}</>;
};

export default ApplicationStatus;
