import React from "react";
import Skateboarding from "/assets/Skateboarding.gif";

const mainContainerStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
};

const imageStyle = {
    animation: "flipLeftToRight 2s ease-in-out infinite",
    transformOrigin: "center",
};


const MainLoader = () => {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div style={mainContainerStyle}>
                    <img src={Skateboarding} alt="Loader" style={imageStyle} height="65" width="50" />
                </div>
            </div>
        </>
    );
};

export default MainLoader;
