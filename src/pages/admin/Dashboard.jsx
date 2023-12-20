/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import AlcDashboard from "../../features/Dashboard/AlcDashboard";
import ImwDashboard from "../../features/Dashboard/ImwDashboard";
import SystemAdminDashboard from "../../features/Dashboard/SystemAdminDashboard";
import SloDashboard from "../../features/Dashboard/SloDashboard";

const Dashboard = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Dashboard", url: "" }));
    }, []);

    return (
        <>
            {/* <AnnouncementBar type={"success"} message={"Server will be down for 10 days"} /> */}

            {(user?.role === "SLO" || user?.role === "collectingagent" || user?.role === "otherserviceprovider") && <SloDashboard />}
            {user?.role === "ALC" && <AlcDashboard />}
            {user.role === "inspector" && <ImwDashboard />}
            {user?.role === "SUPER ADMIN" && <SystemAdminDashboard />}
        </>
    );
};

export default Dashboard;
