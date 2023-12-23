import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import { useDispatch, useSelector } from "react-redux";
import { fetcher } from "../../utils";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import SuperAdminViewDeatils from "../../features/SuperAdminViewDeatils";

const SuperAdminViewDetails = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["/super/admin/", id], () => fetcher(`/super/admin/${id}`), { enabled: id ? true : false });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Super Admin List", url: "/super-admin-list", subTitle: "Super Admin Details", subUrl: "" }));
    }, [id]);

    const user = useSelector((state) => state.user.user);

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {data && <SuperAdminViewDeatils data={data?.superAdmin} />}
        </>
    );
};

export default SuperAdminViewDetails;
