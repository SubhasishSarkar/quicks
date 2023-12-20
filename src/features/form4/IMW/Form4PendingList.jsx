import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";
import { useSearchParams } from "react-router-dom";
import PayInSlipStatus from "./PayInSlipStatus";
import { Tab, Tabs } from "react-bootstrap";

const Form4PendingList = () => {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        dispatch(setPageAddress({ title: `Pay In Slip ${searchParams.get("type") ?? "Pending"} List`, url: `/form4/imw-pay-in-slip-list?${searchParams.get("type")}` }));
    }, [searchParams]);

    const { isLoading, isFetching, error, data } = useQuery(["imw-pay-in-slip-pending-list", searchParams.toString()], () => fetcher(`/imw-pay-in-slip-pending-list?${searchParams.toString()}`));

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "bank_ifsc",
            headerName: "Bank IFSC",
        },
        {
            field: "bank_name",
            headerName: "Bank Name",
        },
        {
            field: "bank_ac_no",
            headerName: "Bank A/C No",
        },
        {
            field: "deposit_amount",
            headerName: "Deposit Amount",
        },
        {
            field: "arn_number",
            headerName: "ARN Number",
        },
        {
            field: "arn_name",
            headerName: "ARN Name",
        },
        {
            field: "deposit_date",
            headerName: "Deposit Date",
        },
        {
            field: "created_date_time",
            headerName: "Created Date",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return <PayInSlipStatus status={props.status} payInSlipId={props.enc_id} />;
            },
        },
    ];

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    return (
        <div className="card-nav-tabs">
            <Tabs
                onSelect={(e) => {
                    setSearchParams("type=" + e);
                }}
                defaultActiveKey={searchParams.has("type") ? searchParams.get("type") : "pending"}
                className="alc_claim_tabs"
            >
                <Tab eventKey="pending" title="Pending">
                    <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                </Tab>
                <Tab eventKey="incomplete" title="Incomplete">
                    <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                </Tab>
                <Tab eventKey="committed" title="Committed">
                    <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default Form4PendingList;
