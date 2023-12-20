import React from "react";

const ReligionSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {["Hindu", "Islam", "Christian", "Sikh", "Parsi", "Others"].map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default ReligionSelect;
