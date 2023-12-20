import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import NoDataFound from "../../components/list/NoDataFound";
import ConfirmationModal from "../../components/ConfirmationModal";

const IncompleteDataList = () => {
    const listType = "incomplete";
    const [searchParams, setSearchParams] = useSearchParams({ listType });
    const { isFetching, error, data } = useQuery(["changed-request-list", searchParams.toString()], () => fetcher(`/changed-request-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [loading, setLoading] = useState();

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [removeId, setRemoveId] = useState();

    const deleteCR = (id) => {
        setOpenConfirm(true);
        setRemoveId(id);
    };

    const query = useQueryClient();
    const { mutate, isLoading } = useMutation((id) => fetcher("/cr-entry-delete?id=" + id));
    const handleConfirm = () => {
        setLoading(removeId);
        setOpenConfirm(false);
        mutate(removeId, {
            onSuccess(data, variables, context) {
                query.invalidateQueries("changed-request-list");
                toast.success(data.msg);
                setLoading();
            },
            onError(error, variables, context) {
                toast.error(error.message);
                setLoading();
            },
        });
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="This incomplete changed request will be deleted permanently. Do you want to continue ?" />}
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && data?.data.length > 0 && (
                <>
                    <div style={{ overflow: "auto" }} className="table-container table-responsive">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Changed Request Number</th>
                                    <th>Number Of Request</th>
                                    <th>SSIN Number</th>
                                    <th>Beneficiary Name</th>
                                    <th>Submitted Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={wrapStyle}>{data?.from + index}</td>
                                            <td style={wrapStyle}>{item.id}</td>
                                            <td style={wrapStyle}>{item.cr_fields.split(",").length}</td>
                                            <td style={wrapStyle}>{item.ssin}</td>
                                            <td style={wrapStyle}>{item.approved_name}</td>
                                            <td style={wrapStyle}>{item.created_date}</td>
                                            <td style={wrapStyle}>Incomplete</td>
                                            <td style={wrapStyle}>
                                                <button className="btn btn-sm btn-success" style={{ marginRight: "5px" }} disabled={isLoading}>
                                                    <Link to={"/change-request/final-review/" + item.enc_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                        View
                                                    </Link>
                                                </button>
                                                <button className="btn btn-sm btn-danger" disabled={isLoading}>
                                                    {loading === item.enc_id ? (
                                                        <Link to="" style={{ textDecoration: "none", color: "#fff" }}>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Delete
                                                        </Link>
                                                    ) : (
                                                        <Link to="" onClick={() => deleteCR(item.enc_id)} style={{ textDecoration: "none", color: "#fff" }}>
                                                            Delete
                                                        </Link>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </>
            )}
            {!isFetching && data?.data.length === 0 && <NoDataFound />}
        </>
    );
};

export default IncompleteDataList;
