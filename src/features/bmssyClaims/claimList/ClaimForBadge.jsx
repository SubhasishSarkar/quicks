import React from "react";
import { Badge } from "react-bootstrap";

const ClaimForBadge = ({ claimFor, benefitName }) => {
    console.log(claimFor);
    const addDots = {
        whiteSpace: "nowrap",
        width: "18em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginBottom: "-5px",
    };
    return (
        <>
            <div>
                {claimFor === "DISABILITY" && (
                    <>
                        <Badge pill bg="primary" style={{ marginRight: "2px" }}>
                            DISABILITY
                        </Badge>{" "}
                        {benefitName && (
                            <Badge pill bg="info" text="dark" style={addDots}>
                                {benefitName}
                            </Badge>
                        )}
                    </>
                )}
                {claimFor === "DEATH" && (
                    <>
                        <Badge pill bg="danger" style={{ marginRight: "2px" }}>
                            DEATH
                        </Badge>{" "}
                        {benefitName && (
                            <Badge pill bg="info" text="dark">
                                {benefitName}
                            </Badge>
                        )}
                    </>
                )}
                {(claimFor === "PF" || claimFor === "pf") && (
                    <>
                        <Badge pill bg="warning" text="dark" style={{ marginRight: "2px" }}>
                            PF
                        </Badge>{" "}
                        {benefitName && (
                            <Badge pill bg="info" text="dark">
                                {benefitName}
                            </Badge>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default ClaimForBadge;
