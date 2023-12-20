import React from "react";

const SchemeSelect = ({ id, item, searchHistory }) => {
    const handleSchemeChange = (key, value, scheme_value) => {
        searchHistory.set(key, { ...value, scheme: scheme_value });
    };
    return (
        <select
            id={id}
            onChange={(ev) => {
                handleSchemeChange(id, item, ev.currentTarget.value);
            }}
            className="form-select"
        >
            <option value="">Select</option>
            {["SASPFUW", "WBB&OCW", "WBTWSSS"].map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default SchemeSelect;
