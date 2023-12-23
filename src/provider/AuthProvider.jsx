import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/slices/userSlice";
import MainLoader from "../components/MainLoader";

const AuthProvider = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("quicks_token");
            if (!user && token) {
                console.log("DDDD",token)
                setError(null);
                setLoading(true);
                try {
                    const res = await fetch(process.env.APP_BASE_API + "/super/admin/me", {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        dispatch(login({ ...data.superAdmin, token: token }));
                    } else {
                        const data = await res.json();
                        throw Error(data.message);
                    }
                } catch (error) {
                    dispatch(logout());
                    setLoading(false);
                    setError(error.message);
                }
            }
        })();
    }, [dispatch, user]);

    if (localStorage.getItem("quicks_token"))
        if (user) return <Outlet />;
        // if (user) return <MainLoader />;
        else if (loading)
            return (
                <MainLoader/>
            );
        else if (error) return <Navigate to="/login" state={{ from: location }} />;
        else
            return (
                <MainLoader/>
            );
    else return <Navigate to="/login" state={{ from: location }} />;
};

export default AuthProvider;
