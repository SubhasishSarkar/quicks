import React from "react";
import TableList from "../../../../components/table/TableList";
import moment from "moment";

const columns = [
    {
        field: 0,
        headerName: "SL No.",
    },
    {
        field: "employers_name",
        headerName: "Employer name",
    },
    {
        field: "employer_address",
        headerName: "Employer address",
    },
    {
        field: "registration_no_of_institute",
        headerName: "Institute registration no.",
    },
    {
        field: "workplace_details",
        headerName: "Workplace details",
    },
    {
        field: "nature_of_job",
        headerName: "Nature of job",
    },
    {
        field: "start_date",
        headerName: "Start date",
    },
    {
        field: "end_date",
        headerName: "End date",
    },
    {
        field: "remarks",
        headerName: "Remarks",
    },
    {
        field: 1,
        headerName: "Duration",
        renderHeader: (item) => {
            return moment(item.end_date).diff(moment(item.start_date), "days");
        },
    },
];

function EmployerInformation({ data }) {
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header py-1">
                <h5 className="m-0">
                    <i className="fa-solid fa-briefcase p-2"></i>Employer Information
                </h5>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <div className="row">
                        <TableList data={{ data: data?.empList }} isLoading={false} error={false} tableHeader={columns} disablePagination />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerInformation;
