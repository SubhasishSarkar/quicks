import React from "react";
import { Outlet } from "react-router";
import "../scss/style.scss";
import IndexFooter from "./IndexFooter";
import IndexHeader from "./IndexHeader";

const HomeLayout = () => {
    return (
        <>
            <IndexHeader />
            <Outlet />
            <IndexFooter />
        </>
    );
};

export default HomeLayout;
