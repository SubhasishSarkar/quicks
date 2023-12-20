import React, { useEffect } from "react";
import UserList from "../../../features/alcUserManagement/UserList";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const AlcServiceProviderList = ({ type, typename }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: typename, url: "" }));
    }, [type]);

    return (
        <>
            <UserList type={type} />
        </>
    );
};

export default AlcServiceProviderList;
