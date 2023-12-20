import React from "react";

function MobileHamburgerMenu({ handleToggle, isOpen }) {
    const style = {
        position: "fixed",
        right: "20px",
        bottom: "20px",
    };
    const styledButton = {
        borderRadius: "50%",
        border: "navajowhite",
        boxShadow: "2px 2px 3px #999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30px",
        width: "30px",
        color: "white",
        backgroundColor: "#001848",
    };
    return (
        <div className="hamburger_menu_wrapper" style={{ ...style }}>
            <button
                onClick={() => {
                    handleToggle();
                }}
                style={{ ...styledButton }}
            >
                {isOpen ? <i className="fa fa-times" aria-hidden="true"></i> : <i className="fa-solid fa-bars"></i>}
            </button>
        </div>
    );
}

export default MobileHamburgerMenu;
