import React, { useState } from "react";
import { toast } from "react-toastify";
import { downloadFile } from "../../utils";

function ApplicationWorkerTypeWiseAcStatement({ item }) {
    const [loading, setLoading] = useState(false);

    const DownloadFormAC = async (e) => {
        e.stopPropagation();
        setLoading(true);
        try {
            const doc = await downloadFile(`/download-e-district-${item.cat_worker_type}-ac-statement/` + item.enc_application_id, `e-district-${item.cat_worker_type}-ac-statement.pdf`);
            if (doc === false) toast.error("Unable to download pdf");
            setLoading();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button className="btn btn-sm btn-secondary" style={{ fontSize: 13, marginRight: "3px" }} onClick={(e) => DownloadFormAC(e)}>
                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} ID Card
            </button>
        </>
    );
}

export default ApplicationWorkerTypeWiseAcStatement;
