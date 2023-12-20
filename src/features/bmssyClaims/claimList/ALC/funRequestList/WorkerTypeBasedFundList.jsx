import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../../utils";
import { Button, Modal } from "react-bootstrap";
import FundDetails from "./FundDetails";
import FundStatus from "./FundStatus";
import { useSearchParams } from "react-router-dom";
import TableList from "../../../../../components/table/TableList";

const WorkerTypeBasedFundList = ({ type }) => {
    const [searchParams, setSearchParams] = useSearchParams({ type: type });
    const { error, data, isFetching } = useQuery(["alc-fund-request-list", searchParams.toString()], () => fetcher(`/alc-fund-request-list?${searchParams.toString()}`));

    const [show, setShow] = useState(false);
    const [getId, setGetId] = useState();

    const modalEventSet = (id) => {
        setShow(true);
        setGetId(id);
    };

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
            field: "id",
            headerName: "Fund Request ID",
        },
        {
            field: "fdate",
            headerName: "Fund Request Date",
        },
        {
            field: 1,
            headerName: "Fund Request Status",
            renderHeader: (props) => {
                return (
                    <>
                        <FundStatus status={props.status} advice={props.advice_id} />
                    </>
                );
            },
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <Button variant="success" onClick={() => modalEventSet(props.id)} size="sm">
                        View Details
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data?.data && <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />}

            <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title" className="confirm_modal">
                <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#fff", color: "#0886e3" }}>
                    <Modal.Title id="example-custom-modal-styling-title">Fund Request Details Of ID : {getId}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                    }}
                >
                    <FundDetails id={getId} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default WorkerTypeBasedFundList;
