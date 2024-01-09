import React from "react";

const StatusSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="" disabled>
                Select One
            </option>
            <option value="all">All</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
            <option value="dismiss">Dismiss</option>
        </select>
    );
};

export default StatusSelect;
