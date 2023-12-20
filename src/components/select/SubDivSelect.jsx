import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const SubDivSelect = ({ districtCode, ...rest }) => {
    const {
        isError,
        error,
        isFetching,
        data: d,
    } = useQuery(["subdivision", districtCode], () => fetcher("/subdivision?district_code=" + districtCode), {
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        enabled: districtCode ? true : false,
    });
    if (isError) return <p color="orange">{error.message}</p>;
    if (isFetching) return <p color="orange">Select District...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>

            {d?.map((item) => (
                <option value={item.subdivision_code} key={item.subdivision_code}>
                    {item.subdivision_name}
                </option>
            ))}
            {d && rest.option_all == "true" ? <option value="0">ALL</option> : ""}
        </select>
    );
};

export default SubDivSelect;
