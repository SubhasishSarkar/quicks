import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
const CWSelect = ({ ...rest }) => {
    const {
        isError,
        error,
        isLoading,
        data: d,
    } = useQuery(["construction-worker"], () => fetcher("/type-of-workers-and-categories?worker_type=cw"), {
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });
    if (isError) return <p color="orange">{error.message}</p>;
    if (isLoading) return <p color="orange">loading...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {d?.map((item) => (
                <option value={item.worker_type} key={item.worker_type}>
                    {item.worker_details}
                </option>
            ))}
        </select>
    );
};

export default CWSelect;
