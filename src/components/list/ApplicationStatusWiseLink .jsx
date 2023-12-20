import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { downloadFile } from "../../utils";
import Badge from "react-bootstrap/Badge";
import moment from "moment";

const ApplicationStatusWiseLink = ({ item }) => {
    const [loading, setLoading] = useState();
    const DownloadPassbook = async () => {
        setLoading(item.enc_application_id);
        try {
            const doc = await downloadFile("/passbook-download/" + item.enc_application_id, "passbook.pdf");
            if (doc === false) toast.error("Unable to download pdf");
            setLoading();
        } catch (error) {
            console.error(error);
        }
    };

    const DownloadSMC = async () => {
        setLoading(item.enc_application_id + "_SMC");
        try {
            const doc = await downloadFile("/passbook-SMC/" + item.enc_application_id, "SMC.pdf");
            if (doc === false) toast.error("Unable to download pdf");
            setLoading();
        } catch (error) {
            console.error(error);
        }
    };

    const ViewType = item.is_active === 1 ? "/bmssy" : "/ssy";
    let editLink = "registration";
    if (item.registration_type === "OLD" && item.new_caf === 1) {
        editLink = "nominee-update";
    }
    const actions = {
        edit: {
            button: (
                <button type="button" className="btn btn-sm btn-warning" style={{ fontSize: 13, marginRight: "3px" }}>
                    <Link className="dropdown-item" to={"/caf/" + editLink + "/?application_id=" + item.enc_application_id} style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-edit"></i> Edit
                    </Link>
                </button>
            ),
        },
        formUpload: {
            button: (
                <button type="button" className="btn btn-sm btn-secondary" style={{ fontSize: 13, marginRight: "3px" }}>
                    <Link className="dropdown-item" to={"/caf/formupload/" + item.enc_application_id} style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-cloud-upload"></i> Upload Form1
                    </Link>
                </button>
            ),
        },
        view: {
            button: (
                <button type="button" className="btn btn-sm btn-primary " style={{ fontSize: 13, marginRight: "3px" }}>
                    <Link className="dropdown-item" to={"/beneficiary-details/" + item.enc_application_id + ViewType} style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-binoculars"></i> View
                    </Link>
                </button>
            ),
        },
        smc: {
            button: (
                <button type="button" className="btn btn-sm btn-info btn-outline-dark" onClick={() => DownloadSMC(item.enc_application_id)} style={{ textDecoration: "none", fontSize: 13, marginRight: "3px" }}>
                    {loading === item.enc_application_id + "_SMC" ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} SMC
                </button>
            ),
        },
        passbook: {
            button: (
                <button type="button" className="btn btn-sm btn-info btn-outline-dark " onClick={() => DownloadPassbook(item.enc_application_id)} style={{ textDecoration: "none", fontSize: 13, marginRight: "3px" }}>
                    {loading === item.enc_application_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} Passbook
                </button>
            ),
        },
        inactive: {
            button: (
                <Badge bg="warning" text="dark">
                    Inactive
                </Badge>
            ),
        },
        inProcess: {
            button: (
                <Badge bg="default" text="dark">
                    UNDER PROCESS
                </Badge>
            ),
        },
    };

    const status = item.status.trim();

    switch (status) {
        case "0":
            return actions.edit.button;
        case "B":
            return actions.edit.button;
        case "-1":
            return actions.edit.button;
        case "SA":
            return actions.view.button;
        case "I":
            return actions.formUpload.button;
        case "A":
            return (
                <>
                    {moment(moment().format("YYYY-MM-DD")).isAfter(item?.approval_date) ? (
                        <>
                            {actions.view.button} {actions.smc.button} {actions.passbook.button}
                        </>
                    ) : (
                        <>{actions.inProcess.button}</>
                    )}
                </>
            );
        case "DA":
            return (
                <>
                    {actions.view.button} {actions.smc.button} {actions.passbook.button}
                </>
            );
        case "SSDA":
            return (
                <>
                    {actions.view.button} {actions.smc.button} {actions.passbook.button}
                </>
            );
        case "OA":
            return (
                <>
                    {actions.view.button} {actions.smc.button} {actions.passbook.button}
                </>
            );
        case "TA":
            return (
                <>
                    {actions.view.button} {actions.smc.button} {actions.passbook.button}
                </>
            );
        case "TDA":
            return (
                <>
                    {actions.view.button} {actions.smc.button} {actions.passbook.button}
                </>
            );

        case "S":
            return actions.view.button;
        case "R":
            return actions.view.button;
        case "D":
            return actions.view.button;
        default:
            return actions.inactive.button;
    }
};

export default ApplicationStatusWiseLink;
