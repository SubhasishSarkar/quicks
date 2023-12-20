import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Badge, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";

const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
};

function RenewalList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const user = useSelector((state) => state.user.user);

    const { error, data, isFetching } = useQuery(["renew-e-district-list", searchParams.get("type")], () => fetcher(`/renew-e-district-list/?${searchParams.toString() ?? "type=pending"}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "registration_no",
            headerName: "Registration No.",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "aadhaar",
            headerName: "Aadhaar",
        },
        {
            field: "apply_date",
            headerName: "Apply date",
        },
        {
            field: "renewal_start_date",
            headerName: "Renewal starts from",
        },
        {
            field: "renewal_end_date",
            headerName: "Last date of renewal",
        },
        {
            field: "cancelation_date",
            headerName: "Cancellation date",
        },

        {
            field: 1,
            headerName: "Form 3",
            renderHeader: (props) => {
                return (
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            openInNewTab(process.env.APP_BASE + props.form3_upload_path + props.form3_name);
                        }}
                    >
                        View
                    </button>
                );
            },
        },
        {
            field: 1,
            headerName: "Delay Condon",
            renderHeader: (props) => {
                if (props.delay_tag === 0)
                    return (
                        <Badge bg="secondary" className="p-2">
                            Not required
                        </Badge>
                    );
                else if (props.delay_tag === 1 && (!props.delay_condon_path || !props.delay_condon_name))
                    return (
                        <Badge bg="danger" className="p-2">
                            Document missing
                        </Badge>
                    );
                return (
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            openInNewTab(process.env.APP_BASE + props.delay_condon_path + props.delay_condon_name);
                        }}
                    >
                        View
                    </button>
                );
            },
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        Approve
                    </button>
                );
            },
        },
    ];

    return (
        <div className="card-nav-tabs ">
            <Tabs
                defaultActiveKey={searchParams.has("type") ? searchParams.get("type") : "pending"}
                onSelect={(key) => {
                    setSearchParams({
                        type: key,
                    });
                }}
                id="uncontrolled-tab-example"
            >
                <Tab eventKey="pending" title="Pending">
                    <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                </Tab>
                <Tab eventKey="approved" title="Approved">
                    aa
                </Tab>
                <Tab eventKey="rejected" title="Rejected">
                    aa
                </Tab>
            </Tabs>
        </div>
    );
}

export default RenewalList;
