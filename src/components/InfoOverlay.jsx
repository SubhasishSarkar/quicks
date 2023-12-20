import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const InfoOverlay = ({ info }) => {
    return (
        <>
            <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-disabled">{info}</Tooltip>}>
                <i className="fa-solid fa-circle-question info_overlay"></i>
            </OverlayTrigger>
        </>
    );
};

export default InfoOverlay;
