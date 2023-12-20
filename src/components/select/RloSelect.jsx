import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const RloSelect = ({ districtCode, ...rest }) => {
    const queryClient = useQueryClient();

    const {
        isError,
        error,
        isFetching,
        data: d,
    } = useQuery(["rlo", districtCode], () => fetcher("/rlo?district_code=" + districtCode), {
        /*keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,*/
        enabled: districtCode ? true : false,
    });
    if (districtCode == "") {
        queryClient.invalidateQueries(["rlo", districtCode]);
    }
    if (isError) return <p color="orange">{error.message}</p>;
    if (isFetching) return <p color="orange">Select District...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select RLO</option>

            {d?.map((item) => (
                <option value={item.rlo_code} key={item.rlo_code}>
                    {item.subdivision_name}
                </option>
            ))}
            {d && rest.option_all == "true" ? <option value="0">ALL</option> : ""}
        </select>
    );
};

export default RloSelect;
