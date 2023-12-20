import { useQuery } from "@tanstack/react-query";
import React from "react";
import Select from "react-select";
import { fetcher } from "../../utils";

const MultiSelect = ({ block, setGpwardArr }) => {
    const { data: d } = useQuery(["gp-ward", block], () => fetcher(`/gp-ward?block_code=${block}`), {
        enabled: block ? true : false,
        keepPreviousData: true,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
    });

    const handleChangeGp = (evt) => {
        let optionsGp = [];
        evt?.forEach((item) => optionsGp.push(item.value));
        setGpwardArr(optionsGp);
    };
    let options = [];

    d &&
        d?.map((item, id) =>
            options.push({
                label: item.gp_ward_name,
                value: item.gp_ward_code,
            })
        );

    return <>{options && <Select isMulti defaultValue={[]} name="gp_ward_code_array[]" options={options} className="basic-multi-select" classNamePrefix="select" onChange={(arr) => handleChangeGp(arr)} />}</>;
};

export default MultiSelect;
