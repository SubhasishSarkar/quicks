import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import SloCaList from "../../../features/alcUserManagement/SloCaList";

const AlcSloCaList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "SLO CA List", url: "" }));
    }, []);
    return (
        <>
            <SloCaList />
        </>
    );
};

export default AlcSloCaList;
