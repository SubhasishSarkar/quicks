import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher, searchParamsToObject } from "../../utils";
import { useSelector } from "react-redux";
import { useValidate } from "../../hooks";
import UsersManagementListFilter from "../../pages/admin/UsersManagement/UsersManagementListFilter";
import TableList from "../../components/table/TableList";

const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "arn",
        headerName: "ARN",
    },
    {
        field: "fullname",
        headerName: "Name",
    },
    {
        field: "rid",
        headerName: "Designation",
        renderHeader: ({ rid }) => {
            switch (rid.toString()) {
                case "13":
                    return "SLO";
                case "22":
                    return "DEO";
                case "23":
                    return "Collecting Agent";
                default:
                    return "";
            }
        },
    },
    {
        field: "mobile",
        headerName: "Mobile",
    },
    {
        field: "block_mun_name",
        headerName: "B/M/C",
    },
    {
        field: "gp_ward_name",
        headerName: "GP/WARD",
    },
];

const SloCaList = () => {
    const user = useSelector((state) => state.user.user);
    const [tableHeader, setTableHeader] = useState(columns);
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, error, data, isFetching } = useQuery(["slo-list", searchParams.toString()], () => fetcher(`/slo-list?${searchParams.toString()}`));
    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );
    useEffect(() => {
        if (data && user?.role == "DLC" && columns.length == 7) {
            columns.splice(5, 0, {
                field: "subdivision_name",
                headerName: "Subdivision Name",
            });
            setTableHeader(columns);
        }
    }, [data, user]);

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        searchParams.set("page", 1);
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    return (
        <>
            <UsersManagementListFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} />
            <TableList data={data?.data_Set} isLoading={isLoading || isFetching} error={error} tableHeader={tableHeader} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default SloCaList;
