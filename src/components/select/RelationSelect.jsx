import React from "react";

const relationOptionsDefault = ["Father", "Mother", "Spouse", "Son", "Daughter", "Other"]

const RelationSelect = ({  relationOptions = relationOptionsDefault,...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {relationOptions.map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default RelationSelect;
