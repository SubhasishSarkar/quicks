import React from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

const DeathAlive = ({ ...rest }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id") || "";

    const ClickHandler = (ev) => {
        if (ev === "2") {
            navigate(`/caf/registration?application_id=${application_id}`);
        }
    };
    //don't change alive value from option
    return (
        <>
            <select
                aria-label="Default select example"
                {...rest}
                onClick={(ev) => {
                    ClickHandler(ev.currentTarget.value);
                }}
            >
                <option value="">Select one</option>
                <option value="1">Death</option>
                <option value="2">Alive</option>
            </select>
        </>
    );
};

export default DeathAlive;
