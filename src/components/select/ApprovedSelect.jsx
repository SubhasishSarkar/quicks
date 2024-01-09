import React from "react";

const ApprovedSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="" disabled>
                Select One
            </option>

            <option value="all">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
        </select>
    );
};

export default ApprovedSelect;
