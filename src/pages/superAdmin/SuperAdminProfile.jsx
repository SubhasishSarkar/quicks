import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import userSlice from "../../store/slices/userSlice";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import SuperAdminViewDeatils from "../../features/SuperAdminViewDeatils";
import { fetcher } from "../../utils";

function SuperAdminProfile() {
    const { id, profile } = useSelector((state) => state.user.user);
    const { error, data, isFetching } = useQuery(["/super/admin/", id], () => fetcher(`/super/admin/${id}`), { enabled: id ? true : false });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Profile", url: "/profile/" + profile }));
    }, [profile]);

    return (
        <div>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {data && <SuperAdminViewDeatils data={data?.superAdmin} />}
        </div>
    );
}

export default SuperAdminProfile;
