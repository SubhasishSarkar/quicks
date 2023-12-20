import React from "react";

const StateSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            <option value="1">West Bengal</option>
        </select>
    );
};

export default StateSelect;
