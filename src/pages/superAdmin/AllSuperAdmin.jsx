import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetcher } from "../../utils";
import TableList from "../../components/table/TableList";
import moment from "moment";
import { Button } from "react-bootstrap";

function AllSuperAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Super Admin List", url: "" }));
    }, []);

    const { isLoading, error, data, isFetching } = useQuery(["/super/admin", searchParams.toString()], () => fetcher(`/super/admin?${searchParams.toString()}`));

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "name",
            headerName: "Name",
        },
        {
            field: "role",
            headerName: "Role",
        },
        {
            field: "aadharNo",
            headerName: "Aadhaar",
        },
        {
            field: "mobile",
            headerName: "Mobile",
        },
        {
            field: "email",
            headerName: "Email",
        },
        {
            field: "address",
            headerName: "address",
        },
        {
            field: "dateOfBirth",
            headerName: "DOB",
            renderHeader: (props) => {
                return moment(props.dateOfBirth).format("DD-MM-YYYY");
            },
        },
        {
            field: "dateOfJoining",
            headerName: "Date of joining",
            renderHeader: (props) => {
                return moment(props.dateOfJoining).format("DD-MM-YYYY");
            },
        },
        {
            field: "approved",
            headerName: "Approved",
            renderHeader: (props) => {
                return props.approved ? "Yes" : "No";
            },
        },
        {
            field: "status",
            headerName: "Status",
        },
        {
            field: 1,
            headerName: "Actions",
            renderHeader: (props) => {
                return (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/super-admin-view-details/${props._id}`);
                        }}
                    >
                        View
                    </Button>
                );
            },
        },
    ];

    if (isLoading || isFetching || error) {
        return <p>Loading...</p>;
    }
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    return (
        <div>
            <TableList data={{ data: data.perPageSuperAdmins }} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </div>
    );
}

export default AllSuperAdmin;
