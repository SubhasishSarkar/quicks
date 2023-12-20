import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const GPWardSelect = ({ block, basedOnUser = false, ...rest }) => {
    const queryClient = useQueryClient();
    const {
        isError,
        error,
        isFetching,
        data: d,
    } = useQuery(["gp-ward", block], () => fetcher(`/gp-ward?block_code=${block}${basedOnUser ? "&basedOnUser=true" : ""}`), {
        // keepPreviousData: true,
        // cacheTime: Infinity,
        // refetchOnWindowFocus: false,
        // refetchOnMount: false,
        // staleTime: Infinity,
        enabled: block ? true : false,
    });

    if (block == "") {
        queryClient.invalidateQueries(["gp-ward", block]);
    }
    if (isError) return <p color="orange">{error.message}</p>;
    if (isFetching) return <p color="orange">Select Block/Municipality/Corporation...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="" disabled>
                Select One
            </option>
            {d?.map((item) => (
                <option value={item.gp_ward_code} key={item.gp_ward_code}>
                    {item.gp_ward_name.charAt(0).toUpperCase() + item.gp_ward_name.slice(1)}
                </option>
            ))}
            {d && rest.option_all == "true" ? <option value="0">ALL</option> : ""}
        </select>
    );
};

export default GPWardSelect;
