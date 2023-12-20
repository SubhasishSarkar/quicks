import React from "react";

const NatureOfDeathSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select</option>
            <option value="3">Natural</option>
            <option value="4">Accidental</option>
        </select>
    );
};

export default NatureOfDeathSelect;
