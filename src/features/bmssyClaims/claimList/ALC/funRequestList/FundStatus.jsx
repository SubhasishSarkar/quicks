import React from "react";
import { Badge } from "react-bootstrap";

const FundStatus = ({ status, advice }) => {
    return (
        <>
            <div>
                {parseInt(status) === 1 && (
                    <Badge pill bg="warning" text="dark">
                        Pending at DLC
                    </Badge>
                )}

                {parseInt(status) === 2 && (
                    <Badge pill bg="warning" text="dark">
                        Pending at BOARD
                    </Badge>
                )}

                {parseInt(status) === 3 && (
                    <Badge pill bg="warning" text="dark">
                        Pending at CF&CAO
                    </Badge>
                )}

                {parseInt(status) === 4 && parseInt(advice) === 0 && (
                    <Badge pill bg="success">
                        Fund Released by BOARD
                    </Badge>
                )}

                {parseInt(status) === 4 && parseInt(advice) != 0 && (
                    <Badge pill bg="success">
                        Benefit disbursed
                    </Badge>
                )}
            </div>
        </>
    );
};

export default FundStatus;
