import React from "react";
import { useParams } from "react-router";
import SLOProfilePage from "../../features/profilePages/SLOProfilePage";
import ImwProfilePage from "../../features/profilePages/ImwProfilePage";
import AlcProfilePage from "../../features/profilePages/AlcProfilePage";
import DlcProfilePage from "../../features/profilePages/DlcProfilePage";
import SuperAdminProfilePage from "../../features/profilePages/SuperAdminProfilePage";

const ProfilePage = () => {
    const { roleName } = useParams();
    return (
        <>
            {["CEO"].includes(roleName) && <SLOProfilePage />}
            {roleName === "inspector" && <ImwProfilePage />}
            {roleName === "ALC" && <AlcProfilePage />}
            {roleName === "DLC" && <DlcProfilePage />}
            {roleName === "SUPER ADMIN" && <SuperAdminProfilePage />}
        </>
    );
};

export default ProfilePage;
