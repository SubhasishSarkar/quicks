import React from "react";
import wbMapImage from "/assets/admin_logo.png";

const mainContainerStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
};

const imageStyle = {
    animation: "flipLeftToRight 2s ease-in-out infinite",
    transformOrigin: "center",
};

// const flipLeftToRightKeyframes = {
//     "0%": {
//         transform: "scaleX(1)",
//     },
//     "50%": {
//         transform: "scaleX(-1)",
//     },
//     "100%": {
//         transform: "scaleX(1)",
//     },
// };

const MainLoader = () => {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div style={mainContainerStyle}>
                    <img src={wbMapImage} alt="Loader" style={imageStyle} height="65" width="50" />
                </div>
            </div>
        </>
    );
};

export default MainLoader;
