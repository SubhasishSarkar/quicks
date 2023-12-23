import React, { useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import SideBar from "./SideBar";

import "../../scss/dashboard.scss";
import "../../scss/claimPages.scss";
import "../../scss/style.scss";
import useDeviceDetector, { isMobile } from "../../hooks/DeviceDetector";
import MobileHamburgerMenu from "./MobileHamburgerMenu";
import Footer from "./Footer";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const deviceType = useDeviceDetector();
    const isMobileDevice = isMobile(deviceType);

    const handleIsOpen = () => {
        setIsOpen((prev) => !prev);
    };

    if (isMobileDevice) {
        return (
            <div className="wrapper">
                <SideBar isOpen={isOpen} handleIsOpen={setIsOpen} />
                <div id="content">
                    <Header />
                    <Outlet />
                    <Footer />
                </div>
                <MobileHamburgerMenu handleToggle={handleIsOpen} isOpen={isOpen} />
            </div>
        );
    }

    return (
        <div className="wrapper">
            <SideBar />
            <div id="content">
                <Header />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;
