import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useValidate } from "../../../hooks";
import { useSearchParams } from "react-router-dom";
import { fetcher, searchParamsToObject } from "../../../utils";
import UsersManagementListFilter from "../UsersManagement/UsersManagementListFilter";
import TableList from "../../../components/table/TableList";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
};
const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "name",
        headerName: "ARN",
    },
    {
        field: "usr_type",
        headerName: "Role",
    },
    {
        field: "fullname",
        headerName: "Name",
    },
    {
        field: "mail",
        headerName: "Email",
        renderHeader: (prop) => {
            return <>{prop.mail ? prop.mail : "Not Updated"}</>;
        },
    },

    {
        field: "mobile",
        headerName: "Mobile",
        renderHeader: (prop) => {
            return <>{prop.mobile ? prop.mobile : "Not Updated"}</>;
        },
    },
    {
        field: "status",
        headerName: "Status",
        renderHeader: (prop) => {
            return <>{prop.status == "0" ? "BLOCKED" : "ACTIVE"}</>;
        },
    },
    {
        field: "pan_aadhaar_linked_doc",
        headerName: "Actions",
        renderHeader: (prop) => {
            return (
                <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        openInNewTab(process.env.APP_BASE_V2 + prop.pan_aadhaar_linked_doc);
                    }}
                >
                    View
                </button>
            );
        },
    },
];

const PanAadhaarLinkedList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isFetching, error } = useQuery(["pan-aadhaar-linked-list", searchParams.toString()], () => fetcher(`/pan-aadhaar-linked-list?${searchParams.toString()}`));
    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Pan Aadhaar Linked List", url: "" }));
    }, []);
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
            <>
                <UsersManagementListFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} />
                <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
            </>
        </>
    );
};

export default PanAadhaarLinkedList;
