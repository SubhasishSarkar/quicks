import React from "react";

const BoardSelect = ({ ...rest }) => {
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            <option value="WBUSWWB">WBUSWWB</option>
            <option value="BOCW">BOCW</option>
            <option value="WBTWSSS">WBTWSSS</option>
        </select>
    );
};

export default BoardSelect;
