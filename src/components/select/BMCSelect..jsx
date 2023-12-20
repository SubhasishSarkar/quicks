import React from "react";

const BMCSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            <option value="B">Block</option>
            <option value="M">Municipality</option>
            <option value="C">Corporation</option>
        </select>
    );
};

export default BMCSelect;
