import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ApplicationStatus from "../../components/list/ApplicationStatus";
import ApplicationStatusWiseLink from "../../components/list/ApplicationStatusWiseLink ";
import ControlledIMWApplicationListFilter from "./IMWApplicationListFilter";
import TableList from "../../components/table/TableList";
import { downloadFile } from "../../utils";
import { toast } from "react-toastify";
import ApplicationWorkerTypeWiseAcStatement from "../../components/list/ApplicationWorkerTypeWiseAcStatement";
import moment from "moment";

const List = ({ data, isLoading, isFetching, error, setFetchAgain, gpFilterAddOn }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useParams("type");

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [dwnLoading, setDwnLoading] = useState();
    const approvedBeneficiaryDownloadExcel = async () => {
        try {
            setDwnLoading(true);
            const doc = await downloadFile("/download-excel-approved-beneficiary", "Download excel approved beneficiary.xlsx");

            if (doc === false) toast.error("Unable to download excel file");
            if (doc.status === false) toast.error(doc.message.message);
            setDwnLoading();
        } catch (error) {
            toast.error(error);
        }
    };
    //console.log(params);
    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "application_id",
            headerName: "Application No.",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "fullname",
            headerName: "Beneficiary Name",
        },

        {
            field: "father_name",
            headerName: "Fathers / Husband Name",
        },
        // {
        //     field: "mobile",
        //     headerName: "Mobile",
        // },
        {
            field: "aadhar",
            headerName: "Aadhar",
        },

        {
            field: 1,
            headerName: "Gp/Ward",
            renderHeader: (props) => {
                return <span className="text-capitalize">{props.gp_ward_name}</span>;
            },
        },

        {
            field: "application_date",
            headerName: "Submitted Date",
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
                return (
                    <>
                        <ApplicationStatusWiseLink item={props} />
                        {props.cat_worker_type !== "ow" &&
                            params?.type === "approved" &&
                            props?.registration_type === "NEW" &&
                            props?.is_ndf === 0 &&
                            moment(props?.created_date).isAfter("2023-11-01") &&
                            moment(moment().format("YYYY-MM-DD")).isAfter(props?.approval_date, "days") && <ApplicationWorkerTypeWiseAcStatement item={props} />}
                    </>
                );
            },
        },
    ];

    return (
        <>
            <div className="row">
                <div className="col-md-10">
                    <ControlledIMWApplicationListFilter isLoading={isLoading} isFetching={isFetching} setFetchAgain={setFetchAgain} gpFilterAddOn={gpFilterAddOn} />
                </div>
                {params.type.trim() === "approved" && (
                    <div className="col-md-2 mt-3">
                        <div className="d-flex justify-content-md-end">
                            <button
                                className="btn btn-success btn-sm"
                                type="submit"
                                onClick={() => {
                                    approvedBeneficiaryDownloadExcel();
                                }}
                                disabled={dwnLoading}
                            >
                                {dwnLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-file-arrow-down"></i>} Approved Beneficiary
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default List;
