import React from "react";
import { Link } from "react-router-dom";

const PayInSlipStatus = ({ status, payInSlipId }) => {
    const action = {
        view: {
            button: (
                <button type="button" className="btn btn-sm btn-primary " style={{ fontSize: 13, marginRight: "3px" }}>
                    <Link className="dropdown-item" to={`/form4/view-pay-in-slip-final-preview/${payInSlipId}`} style={{ textDecoration: "none" }}>
                        <i className="fa-solid fa-binoculars"></i> View
                    </Link>
                </button>
            ),
        },
    };
    switch (status) {
        case 2:
            return <>{action.view.button}</>;
        case 1:
            return (
                <>
                    <span className="badge bg-success rounded-pill">Committed</span>
                </>
            );
        case 0:
            return (
                <>
                    <span className="badge bg-primary rounded-pill">Incomplete</span>
                </>
            );
    }
};

export default PayInSlipStatus;
