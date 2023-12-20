import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../utils";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import { Modal } from "react-bootstrap";
import FormIVBankAddEdit from "./FormIVBankAddEdit";
import TableList from "../../../components/table/TableList";
import Pagination from "../../../components/Pagination";
import FormIVBankListSearch from "./FormIVBankListSearch";

const FormIVBankListWorkerTypeWise = ({ type }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState();
    const [searchParams, setSearchParams] = useSearchParams({ type: type });
    const { error, data, isFetching } = useQuery(["form-IV-bank-list", searchParams.toString()], () => fetcher(`/form-IV-bank-list?${searchParams.toString()}`));

    const [bankEditId, setBankEditId] = useState();
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
            field: "ifsc",
            headerName: "IFSC",
        },
        {
            field: "name",
            headerName: "Name",
        },
        {
            field: "branch",
            headerName: "Branch",
        },
        {
            field: "location",
            headerName: "Location",
        },
        {
            field: "account_no",
            headerName: "Account Number",
        },
        {
            field: "add_date",
            headerName: "Created Date",
        },
    ];

    
    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}

            {data?.data && (
                <>
                    {type === "ow" ? (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <FormIVBankListSearch />
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex justify-content-md-end mb-1">
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => {
                                                setModalShow(true);
                                                setModalTitle("Add New Bank");
                                                setBankEditId();
                                            }}
                                        >
                                            <i className="fa-solid fa-plus"></i> Add New Bank
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>SL.No.</th>
                                                    <th>IFSC</th>
                                                    <th>Name</th>
                                                    <th>Branch</th>
                                                    <th>Location</th>
                                                    <th>Account No</th>
                                                    <th>Created Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.data?.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={wrapStyle}>{index + 1}</td>
                                                            <td style={wrapStyle}>{item.ifsc}</td>
                                                            <td style={wrapStyle}>{item.name}</td>
                                                            <td style={wrapStyle}>{item.branch}</td>
                                                            <td style={wrapStyle}>{item.location}</td>
                                                            <td style={wrapStyle}>{item.account_no}</td>
                                                            <td style={wrapStyle}>{item.add_date}</td>
                                                            <td style={wrapStyle}>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => {
                                                                        setModalShow(true);
                                                                        setBankEditId(item.id);
                                                                        setModalTitle("Edit Bank");
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                    )}
                </>
            )}

            <Modal show={modalShow} backdrop="static" keyboard={false} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="confirm_modal">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormIVBankAddEdit id={bankEditId} modalTitle={modalTitle} setModalShow={setModalShow} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FormIVBankListWorkerTypeWise;
