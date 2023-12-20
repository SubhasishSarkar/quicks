import React from "react";

const MaritalSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {["Married", "Unmarried", "Widow", "Divorcee"].map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default MaritalSelect;
