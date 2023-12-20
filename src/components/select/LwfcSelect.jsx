import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const LwfcSelect = ({ rloCode, ...rest }) => {
    const queryClient = useQueryClient();
    const {
        isError,
        error,
        isFetching,
        data: d,
    } = useQuery(["bmssy-lwfc", rloCode], () => fetcher(`/lwfc?rlo_code=${rloCode}`), {
        /* keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,*/
        enabled: rloCode ? true : false,
    });
    if (rloCode == "") {
        queryClient.invalidateQueries(["bmssy-lwfc", rloCode]);
    }
    if (isError) return <p color="orange">{error.message}</p>;
    if (isFetching) return <p color="orange">Select RLO...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select LWFC</option>
            {d?.map((item) => (
                <option value={item.lwfc_code} key={item.lwfc_code}>
                    {item.block_mun_name}
                </option>
            ))}
            {d && rest.option_all == "true" ? <option value="0">ALL</option> : ""}
        </select>
    );
};

export default LwfcSelect;
