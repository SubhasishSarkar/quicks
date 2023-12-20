import React, { useEffect } from "react";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";

const tabObj = {
    updated: "1",
    pending: "0",
};

const VerhoffFailedAadhaarImw = () => {
    const [searchParams, setSearchParams] = useSearchParams(true);

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const { isFetching, data, error, isLoading } = useQuery(["/invalid_verhoff_failed_aadhaar_imw", searchParams.toString()], () => fetcher(`/invalid_verhoff_failed_aadhaar_imw?${searchParams.toString()}`));

    const dispatch = useDispatch();
    // console.log("invalid aaadhaar ", data);

    useEffect(() => {
        dispatch(setPageAddress({ title: "Verhoff Failed Invalid Aadhaar", url: "" }));
    }, []);

    const columnsPending = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ben_name",
            headerName: "Beneficiary Name",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "aadhar",
            headerName: "Aadhaar",
        },
    ];

    const columnsUpdated = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ben_name",
            headerName: "Beneficiary Name",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "aadhar",
            headerName: "Old Aadhaar",
        },
        {
            field: "updated_aadhar",
            headerName: "Updated Aadhaar",
        },
    ];
    return (
        <>
            <ControlledIMWApplicationListFilter />
            <div className="card-nav-tabs pt-2">
                <Tabs
                    defaultActiveKey={tabObj[searchParams.get("type") ?? "0"]}
                    onSelect={(val) => {
                        if (val == 0) {
                            searchParams.set("type", "pending");
                        } else if (val == 1) {
                            searchParams.set("type", "updated");
                        }
                        setSearchParams(searchParams);
                    }}
                    id="uncontrolled-tab-example"
                >
                    <Tab eventKey="0" title="Pending">
                        <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columnsPending} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                    </Tab>
                    <Tab eventKey="1" title="Updated">
                        <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columnsUpdated} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default VerhoffFailedAadhaarImw;
