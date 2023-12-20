import React, { useEffect } from "react";
import SearchForRenewal from "./SerachForRenewal";
// import { useMutation } from "@tanstack/react-query";
// import { updater } from "../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import TW from "./TW";
import { useSearchParams } from "react-router-dom";
function RenewalEDistrict() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isFetching, error } = useQuery(["renew-e-district", searchParams.toString()], () => fetcher(`/renew-e-district/?${searchParams.toString()}`), {
        enabled: searchParams.has("searchBy") && searchParams.has("searchValue") ? true : false,
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Renew E District", url: "" }));
    }, []);
    const handleSubmit = (data) => {
        setSearchParams({
            searchBy: data.radiostacked,
            searchValue: data.ssin_reg,
        });
    };
    console.log(data, error);
    return (
        <div>
            <SearchForRenewal handleSubmit={handleSubmit} isLoading={isFetching} />

            {error ? <>{error.message}</> : data ? <TW data={data} /> : ""}
        </div>
    );
}

export default RenewalEDistrict;
