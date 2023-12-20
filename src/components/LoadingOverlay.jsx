import React from "react";

const LoadingOverlay = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 99, background: "rgba(0, 0, 0, .3)" }}>
            <div className="d-flex justify-content-center ">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
