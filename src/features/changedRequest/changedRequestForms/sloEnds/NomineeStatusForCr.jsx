import React, { useEffect, useState } from "react";

const NomineeStatusForCr = ({ item }) => {
    const [status, setStatus] = useState("");
    const [statusColor, setStatusColor] = useState();

    useEffect(() => {
        if ((item.flag_status.trim() === "R" || item.flag_status.trim() === "0") && item.new_status.trim() != "D" && (item.is_deleted === false || item.is_deleted === null)) {
            setStatusColor("badge rounded-pill text-bg-success");
            setStatus("Current Approved");
        }

        if ((item.flag_status.trim() === "R" || item.flag_status.trim() === "0") && item.new_status.trim() != "D" && item.is_deleted === true) {
            setStatusColor("badge rounded-pill text-bg-danger");
            setStatus("Delete Request");
        }

        if (item.new_status.trim() === "D" && (item.flag_status.trim() === "R" || item.flag_status.trim() === "0")) {
            setStatusColor("badge rounded-pill text-bg-info");
            setStatus("Current Approve");
        }

        if (item.new_status.trim() === "S" && item.flag_status.trim() === "CR") {
            setStatusColor("badge rounded-pill text-bg-warning text-dark");
            setStatus("Changed Request");
        }
    }, [item]);

    return (
        <>
            <span className={statusColor}>{status}</span>
        </>
    );
};

export default NomineeStatusForCr;
