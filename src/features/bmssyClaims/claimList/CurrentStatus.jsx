import React from "react";
import { Badge } from "react-bootstrap";

const CurrentStatus = ({ claimStatus }) => {
    const badgeStyle = {
        letterSpacing: "1px",
        fontFamily: "system-ui",
    };
    return (
        <>
            <div>
                {parseInt(claimStatus) === 1 && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Pending at IMW
                    </Badge>
                )}

                {(parseInt(claimStatus) === 2 || parseInt(claimStatus) === 6) && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Pending at ALC
                    </Badge>
                )}

                {parseInt(claimStatus) === 3 && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Pending at DLC
                    </Badge>
                )}

                {parseInt(claimStatus) === 4 && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Pending at CEO
                    </Badge>
                )}

                {parseInt(claimStatus) === 5 && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Pending at CFCO
                    </Badge>
                )}

                {parseInt(claimStatus) === 7 && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Send Back to SLO
                    </Badge>
                )}

                {parseInt(claimStatus) === 8 && (
                    <Badge pill bg="warning" text="dark" style={badgeStyle}>
                        Send Back to IMW
                    </Badge>
                )}

                {parseInt(claimStatus) === 10 && (
                    <Badge pill bg="danger" style={badgeStyle}>
                        Recommended to Rejection
                    </Badge>
                )}

                {parseInt(claimStatus) === 12 && (
                    <Badge pill bg="success" style={badgeStyle}>
                        Approved by Board
                    </Badge>
                )}

                {parseInt(claimStatus) === 13 && (
                    <Badge pill bg="success" style={badgeStyle}>
                        Fund released by ALC
                    </Badge>
                )}

                {parseInt(claimStatus) === 11 && (
                    <Badge pill bg="danger" style={badgeStyle}>
                        Rejected
                    </Badge>
                )}
            </div>
        </>
    );
};

export default CurrentStatus;
