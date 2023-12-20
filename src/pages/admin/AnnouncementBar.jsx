import React from "react";

function AnnouncementBar({ type, message }) {
    const style = {
        common: {
            fontSize: "17px",
            fontWeight: "400",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
        },
        primary: {
            color: "#084298",
            backgroundColor: "#cfe2ff",
        },
        error: {
            color: "#842029",
            backgroundColor: "#f5c2c7",
        },
        success: {
            color: "#0f5132",
            backgroundColor: "#d1e7dd",
        },
    };

    return (
        <>
            <div
                className="alert"
                style={{
                    ...style.common,
                    ...(type ? style[type] : style.primary),
                }}
            >
                <i className="fa-solid fa-bullhorn fa-fade"></i> {message}
            </div>
        </>
    );
}

export default AnnouncementBar;
