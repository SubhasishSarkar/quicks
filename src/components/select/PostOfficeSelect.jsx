import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";

const PostOfficeSelect = ({ pincode, ...rest }) => {
    const {
        isError,
        error,
        // isLoading,
        data: d,
    } = useQuery(["postoffice", pincode], () => fetcher(`/postoffice?pincode=${pincode}`), {
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        enabled: pincode ? true : false,
    });
    if (isError) return <p color="orange">{error.message}</p>;
    // if (isLoading) return <p color="orange">loading...</p>;
    return (
        <select aria-label="Default select example" {...rest}>
            <option value="">Select One</option>
            {d?.map((item) => (
                <option value={item?.id} key={item?.id}>
                    {item?.po_name}
                </option>
            ))}
        </select>
    );
};

export default PostOfficeSelect;
