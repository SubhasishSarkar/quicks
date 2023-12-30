import React from "react";
import { useParams } from "react-router";
import SuperAdminProfile from "./superAdmin/SuperAdminProfile";

const config = {
    "super admin": <SuperAdminProfile />,
};
function Profile() {
    const { role } = useParams();

    return <>{config[role]}</>;
}

export default Profile;
