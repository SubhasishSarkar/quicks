import React from "react";

const GenderSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {["Female", "Male", "Other"].map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default GenderSelect;
