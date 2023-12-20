import React from "react";

const WorkerTypeSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="null">Select One</option>
            {rest.option_all == "true" ? <option value="ALL">ALL</option> : ""}
            <option value="ow">Other Worker</option>
            <option value="cw">Construction Worker</option>
            <option value="tw">Transport Worker</option>
        </select>
    );
};

export default WorkerTypeSelect;
