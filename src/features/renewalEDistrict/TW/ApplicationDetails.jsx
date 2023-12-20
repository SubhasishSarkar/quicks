import React from "react";
import TableList from "../../../components/table/TableList";

function ApplicationDetails({ data, handleRenew }) {
    const columns = [
        {
            field: "ssin_no",
            headerName: "SSIN No.",
        },
        {
            field: "registration_no",
            headerName: "Registration No.",
        },
        {
            field: "aadhar",
            headerName: "Aadhaar",
        },
        {
            field: "mobile",
            headerName: "Mobile",
        },
        {
            field: 1,
            headerName: "Full Name",
            renderHeader: ({ fname, mname, lname }) => {
                return `${fname} ${mname} ${lname}`;
            },
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (item) => {
                return (
                    <>
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRenew(item);
                            }}
                        >
                            Renew
                        </button>
                    </>
                );
            },
        },
    ];
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Benefeciary Details </h5>
            </div>
            <div className="card-body">
                <TableList data={{ data: [data.data] }} isLoading={false} error={false} tableHeader={columns} disablePagination />
            </div>
        </div>
    );
}

export default ApplicationDetails;
