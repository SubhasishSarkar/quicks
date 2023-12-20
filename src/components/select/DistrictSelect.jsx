import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const DistrictSelect = ({ ...rest }) => {
    const {
        isError,
        error,
        isFetching,
        data: d,
    } = useQuery(["district"], () => fetcher("/district"), {
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });
    if (isError) return <p color="orange">{error.message}</p>;
    if (isFetching) return <p color="orange">loading...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {d?.map((item) => (
                <option value={item.district_code} key={item.district_code}>
                    {item.district_name}
                </option>
            ))}
            {rest.option_all == "true" ? <option value="0">ALL</option> : ""}
        </select>
    );
};

export default DistrictSelect;
