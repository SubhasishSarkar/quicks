import React from "react";

const SelectSubWorkType = ({ ...rest }) => {
    return (
        <>
            <select aria-label="Default select example" {...rest}>
                <option value="">Select One</option>
                {[
                    { value: "Unorganised Industries", label: "Unorganised Industries" },
                    { value: "Self Employed", label: "Self Employed" },
                ].map((item, index) => (
                    <option value={item?.value} key={index}>
                        {item?.label}
                    </option>
                ))}
            </select>
        </>
    );
};

export default SelectSubWorkType;
