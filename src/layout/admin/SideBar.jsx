import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import useDeviceDetector, { isMobile } from "../../hooks/DeviceDetector";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import quicksLogo from "../../../public/assets/Logo1.png";
const links = [
    {
        link: "/dashboard",
        label: "Dashboard",
        icon: "fa-solid fa-house-chimney",
        access: ["*"],
    },
    {
        link: "/super-admin-list",
        label: "Super Admin List",
        icon: "fa-solid fa-database",
        access: ["CEO"],
    },
    {
        link: "/change-password",
        label: "Change Password",
        icon: "fa-solid fa-house-chimney",
        access: ["CEO"],
    },
];

const SideBar = ({ isOpen: isOpenMobile, handleIsOpen: handleIsOpenMobile }) => {
    const [toggle, setToggle] = useState();
    const deviceType = useDeviceDetector();
    const isMobileDevice = isMobile(deviceType);

    const toggleClass = () => {
        toggle ? setToggle(false) : setToggle(true);
    };
    const user = useSelector((state) => state.user.user);
    const [show, setShow] = useState(-1);

    useEffect(() => {
        const concernedElement = document.getElementById("sidebar");
        const handleOutsideClick = (e) => {
            if (!concernedElement.contains(e.target)) {
                if (isOpenMobile) {
                    handleIsOpenMobile();
                }
            }
        };

        if (isMobileDevice && isOpenMobile) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isMobileDevice, isOpenMobile]);

    const getClassNames = () => {
        if (isMobileDevice && isOpenMobile) return "sidebar_mobile_active scroll--main";
        else if (isMobileDevice && !isOpenMobile) return "sidebar_mobile";
        else if (!isMobileDevice && toggle) return "sidebar_desktop scroll--main active";
        else if (!isMobileDevice && !toggle) return "sidebar_desktop scroll--main";
    };

    return (
        <div className="sidebar_wrapper" style={isMobileDevice ? { position: "absolute" } : { position: "relative" }}>
            {deviceType && (
                <nav
                    id="sidebar"
                    className={getClassNames()}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <div className="sidebar-header bmssy-logo">
                            <img src={quicksLogo} alt="logo" />
                            {/* <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
                                        <h1 style={{ color: "#d7e3dc" }}>QUICKS</h1>
                                    </NavLink> */}

                            {/* <div>
                                <p className="lh-1 font-monospace text-muted" style={{ fontSize: "11px", display: "flex", cursor: "pointer" }}>
                                    ADMIN PANEL
                                </p>
                            </div> */}
                        </div>

                        <ul className="list-unstyled components">
                            {links
                                .filter((item) => item.access.includes("*") || item.access.includes(user.role))
                                .map((item, index) => {
                                    if (item.links) {
                                        return toggle ? (
                                            <MenuDropDown item={item} setShow={setShow} show={show} index={index} role={user.role} key={index} tooltip />
                                        ) : (
                                            <MenuDropDown item={item} setShow={setShow} show={show} index={index} role={user.role} key={index} />
                                        );
                                    } else {
                                        return toggle ? (
                                            <li key={index}>
                                                <OverlayTrigger placement="bottom" overlay={<Tooltip>{item.label}</Tooltip>}>
                                                    <NavLink to={item.link}>
                                                        {item.icon && <i className={item.icon}></i>}
                                                        <span>
                                                            {item.label} <span style={{ fontSize: "12px", color: "#afdb99" }}>{item.subLabel}</span>
                                                        </span>
                                                    </NavLink>
                                                </OverlayTrigger>
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                <NavLink to={item.link}>
                                                    {item.icon && <i className={item.icon}></i>}
                                                    <span>
                                                        {item.label} <span style={{ fontSize: "12px", color: "#afdb99" }}>{item.subLabel}</span>
                                                    </span>
                                                </NavLink>
                                            </li>
                                        );
                                    }
                                })}
                        </ul>
                    </div>
                    {deviceType === "Desktop" && (
                        <div
                            className=" "
                            style={{
                                display: "flex",
                                justifyContent: "end",
                            }}
                        >
                            <button
                                type="button"
                                id="sidebarCollapse"
                                className="toggle_menu toggle-menu-custom"
                                onClick={() => toggleClass()}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "30px",
                                    width: "30px",
                                    color: "rgb(0, 24, 72)",
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                            >
                                <i className="fa-solid fa-circle-chevron-left "></i>
                                <i className="fa-solid fa-circle-chevron-right"></i>
                                {/* <i className="fas fa-align-left text-dark"></i>
                                <i className="fa-solid fa-xmark"></i> */}
                            </button>
                        </div>
                    )}
                </nav>
            )}
            <div id="overlay_sidebar" style={isOpenMobile ? { display: "block" } : { display: "none" }}></div>
        </div>
    );
};

export default SideBar;

const MenuDropDown = ({ item, setShow, show, index, role, tooltip, ...rest }) => {
    return (
        <>
            <li {...rest}>
                {tooltip ? (
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>{item.label}</Tooltip>}>
                        <a
                            href={item.link}
                            onClick={(e) => {
                                e.preventDefault();
                                setShow((s) => {
                                    if (s == index) return -1;
                                    else return index;
                                });
                            }}
                            className="d-flex align-item-center justify-content-between"
                        >
                            <div>
                                {item.icon && <i className={item.icon}></i>}
                                <span>
                                    {item.label} <span style={{ fontSize: "10px", color: "#afdb99" }}>{item.subLabel}</span>
                                </span>
                            </div>
                            {show == index ? <i className="fa-solid fa-sort-down"></i> : <i className="fa-solid fa-sort-down fa-rotate-270"></i>}
                        </a>
                    </OverlayTrigger>
                ) : (
                    <a
                        href={item.link}
                        onClick={(e) => {
                            e.preventDefault();
                            setShow((s) => {
                                if (s == index) return -1;
                                else return index;
                            });
                        }}
                        className="d-flex align-item-center justify-content-between"
                    >
                        <div>
                            {item.icon && <i className={item.icon}></i>}
                            <span>
                                {item.label} <span style={{ fontSize: "10px", color: "#afdb99" }}>{item.subLabel}</span>
                            </span>
                        </div>
                        {show == index ? <i className="fa-solid fa-sort-down"></i> : <i className="fa-solid fa-sort-down fa-rotate-270"></i>}
                    </a>
                )}

                {show == index && (
                    <ul className="list-unstyled show sub-menu">
                        {item.links
                            .filter((item) => item.access.includes("*") || item.access.includes(role))
                            .map((subItem, index) => (
                                <li key={index} className="my-1">
                                    {tooltip ? (
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>{subItem.label}</Tooltip>}>
                                            <NavLink to={item.link + "/" + subItem.link}>
                                                <span>{subItem.label}</span> <span style={{ fontSize: "10px", color: "#afdb99" }}>{subItem.subLabel}</span>
                                            </NavLink>
                                        </OverlayTrigger>
                                    ) : (
                                        <NavLink to={item.link + "/" + subItem.link}>
                                            <span>{subItem.label}</span> <span style={{ fontSize: "10px", color: "#afdb99" }}>{subItem.subLabel}</span>
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                    </ul>
                )}
            </li>
        </>
    );
};
