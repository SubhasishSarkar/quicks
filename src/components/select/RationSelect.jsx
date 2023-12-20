import React from "react";

const RationSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {["AAY", "THH", "STHH", "RKSY-I", "RKSY-II"].map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default RationSelect;
