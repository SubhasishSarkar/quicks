import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import List from "./List";

const RejectList = ({ gpFilterAddOn }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [fetchAgain, setFetchAgain] = useState(0);

    const { isLoading, isFetching, error, data, refetch } = useQuery(["imw-application-list", "reject-list", searchParams.toString()], () => fetcher(`/imw-application-list/reject?${searchParams.toString()}`), {
        enabled: true,
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Application List", url: "/application-list/reject", subTitle: "Reject Application List", subUrl: "" }));
    }, []);

    // Use useEffect to refetch when fetchAgain changes
    useEffect(() => {
        const fetchData = async () => {
            setSearchParams("gpWardCode=" + fetchAgain);
            await refetch();
        };
        fetchData();
    }, [fetchAgain, refetch]);

    return <List data={data} isLoading={isLoading} isFetching={isFetching} error={error} setFetchAgain={setFetchAgain} gpFilterAddOn={gpFilterAddOn} />;
};

export default RejectList;
