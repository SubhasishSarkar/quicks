import React from "react";
import ControlledIMWApplicationListFilter from "../IMWApplicationList/IMWApplicationListFilter";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import TableList from "../../components/table/TableList";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const BeneficiarySearchByCms = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Correction By CMS", url: "" }));
    }, []);

    const { data, error, isLoading, isFetching } = useQuery(["/get-searched-ben-details-cms", searchParams.toString()], () => fetcher(`/get-searched-ben-details-cms?${searchParams.toString()}`), {
        enabled: searchParams.get("searchVal") ? true : false,
    });

    const handleClickEdit = (eidtData) => {
        const { application_id } = eidtData;
        navigate(`/cms/form-ben-details-correction-cms/${application_id}`);
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "registration_no",
            headerName: "Registration No",
        },
        {
            field: "fullname",
            headerName: "Beneficiary Name",
        },
        {
            field: "mobile",
            headerName: "Mobile",
        },
        {
            field: "husband_name",
            headerName: "Husband Name",
        },
        {
            field: "father_name",
            headerName: "Father Name",
        },
        {
            field: "dobb",
            headerName: "DOB",
        },
        {
            field: "status",
            headerName: "Status",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button className="btn btn-sm btn-success" onClick={() => handleClickEdit(props)}>
                        Edit
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <ControlledIMWApplicationListFilter />

            {data && <TableList data={{ data: data?.dataSet }} isLoading={isLoading || isFetching} error={error} tableHeader={columns} disablePagination errorMessage={<h2>No Approved Data Found</h2>} />}
        </>
    );
};

export default BeneficiarySearchByCms;
