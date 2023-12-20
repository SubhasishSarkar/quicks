import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const PoliceStationSelect = ({ district, ...rest }) => {
    const {
        isError,
        error,
        // isLoading,
        data: d,
    } = useQuery(["police-station", district], () => fetcher(`/police-station?district_code=${district}`), {
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        enabled: district ? true : false,
    });
    if (isError) return <p color="orange">{error.message}</p>;
    // if (isLoading) return <p color="orange">loading...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {d?.map((item) => (
                <option value={item?.ps_code} key={item?.ps_code}>
                    {item?.ps_name}
                </option>
            ))}
        </select>
    );
};

export default PoliceStationSelect;
