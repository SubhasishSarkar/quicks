import React from "react";
import UserList from "../../../components/UserList";
import RegistrationForm from "../../../features/registration/RegistrationForm";

const Registration = () => {
    return (
        <>
            <RegistrationForm />
            <UserList />
        </>
    );
};

export default Registration;
