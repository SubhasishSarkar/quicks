import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";
import TableList from "../../../components/table/TableList";
import { useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorAlert from "../../../components/list/ErrorAlert";
import AadhaarCorrectionStatus from "./AadhaarCorrectionStatus";
import ApplicationStatus from "../../../components/list/ApplicationStatus";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

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
        headerName: "Reg. No",
    },
    {
        field: "name",
        headerName: "Name",
    },
    {
        field: "mobile",
        headerName: "Mobile",
    },
    {
        field: "dob",
        headerName: "DOB",
    },
    {
        field: "aadhar",
        headerName: "AADHAAR",
    },
    {
        field: "status",
        headerName: "Status",
        renderHeader: (props) => {
            return <ApplicationStatus status={props.status?.trim()} />;
        },
    },
    {
        field: 1,
        headerName: "Action",
        renderHeader: (props) => {
            return <AadhaarCorrectionStatus item={props} />;
        },
    },
];

const columnsLog = [
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
        headerName: "Reg. No",
    },
    {
        field: "fullname",
        headerName: "Name",
    },
    {
        field: "mobile",
        headerName: "Mobile",
    },
    {
        field: "dob",
        headerName: "DOB",
    },
    {
        field: "aadhar",
        headerName: "AADHAAR",
    },
    {
        field: "name_collection",
        headerName: "Collected By ARN",
    },
];

const AadharCorrectionByImw = () => {
    const [searchParams, setSearchParams] = useSearchParams(false);
    const { isFetching, data, error, isLoading } = useQuery([`get-aadhaar-correction-log`], () => fetcher(`/get-aadhaar-correction-log`));

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Aadhaar Correction ", url: "/rectification/aadhar-correction-imw" }));
    }, []);

    const {
        isFetching: isFetchingSearch,
        data: dataSearch,
        error: errorSearch,
        isLoading: isLoadingSearch,
    } = useQuery(["/aadhaar-correction-search-beneficiary", searchParams.toString()], () => fetcher(`/aadhaar-correction-search-beneficiary?${searchParams.toString()}`), {
        enabled: searchParams ? true : false,
    });

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    return (
        <>
            {isFetching && <LoadingOverlay />}
            {error && <ErrorAlert error={error} />}

            <div className="card datatable-box mb-2">
                <div className="card-body">
                    <div className="row">
                        <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />

                        {dataSearch && (
                            <div className="card-nav-tabs pt-2">
                                <TableList data={dataSearch} isLoading={isLoadingSearch || isFetchingSearch} error={errorSearch} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {data?.data && (
                <div className="card datatable-box mb-2">
                    <div className="card-body">
                        <div className="col-md-6 mt-1">Aadhaar Correction Log</div>
                        <div className="row">
                            <div className="card-nav-tabs pt-2">
                                <TableList data={data} isFetching={isFetching} error={error} disablePagination tableHeader={columnsLog} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AadharCorrectionByImw;
