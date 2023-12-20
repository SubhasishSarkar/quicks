import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const BMCNameSelect = ({ subDivision,basedOnUser=false, ...rest }) => {
    const {
        isError,
        error,
        isFetching,
        data: d,
    } = useQuery(["bmssy-block", subDivision], () => fetcher(`/block?subdivision_code=${subDivision}${basedOnUser?'&basedOnUser=true':''}`), {
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        enabled: subDivision ? true : false,
    });
    if (isError) return <p color="orange">{error.message}</p>;
    if (isFetching) return <p color="orange">Select Sub Division...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="" disabled>
                Select One
            </option>
            {d?.map((item) => (
                <option value={item.block_code} key={item.block_code}>
                    {item.block_mun_name}
                </option>
            ))}
            {d && rest.option_all == "true" ? <option value="0">ALL</option> : ""}
        </select>
    );
};

export default BMCNameSelect;
