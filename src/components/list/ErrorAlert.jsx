import React from "react";

const ErrorAlert = ({ error }) => {
    const style = {
        color: "#8c0404",
        fontSize: "17px",
        fontWeight: "400",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            <div className="alert alert-danger" role="alert" style={style}>
                <i className="fa-solid fa-circle-exclamation"></i> {error.message}
            </div>
        </>
    );
};

export default ErrorAlert;
