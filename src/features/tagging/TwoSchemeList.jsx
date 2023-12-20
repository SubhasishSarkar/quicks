import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetcher } from "../../utils";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import NoDataFound from "../../components/list/NoDataFound";
import OffcanvasPdfViewerTagging from "../../components/OffcanvasPdfViewerTagging";

const TwoSchemeList = () => {
    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (doc, url1) => {
        setShow(true);
        setDoc(doc);
        setUrl(process.env.APP_BASE + url1);
    };
    const user = useSelector((state) => state.user.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Two Scheme Tagging List", url: "" }));
    }, []);
    const { error, data, isFetching } = useQuery(["two-scheme-list", searchParams.toString(), user.id], () => fetcher(`/two-scheme-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    const even = {
        backgroundColor: "#e7d4d4",
    };
    const odd = {
        backgroundColor: "white",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error}
            {data &&
                (data?.data?.length === 0 ? (
                    <NoDataFound />
                ) : (
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr className="table-active">
                                <th>SL. No</th>
                                <th>SSIN</th>
                                <th>Registration No</th>
                                <th>Registration Date</th>
                                <th>Name</th>
                                <th>DOB</th>
                                <th>Aadhar</th>
                                <th>Scheme</th>
                                <th>Assigned Aadhaar</th>
                                <th>Assigned Reg. Date</th>
                                <th>Assigned DOB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((element, index) => {
                                let keyval = element.ssy_application_id;
                                return (
                                    <>
                                        <tr key={index * 2} style={(data?.data_Set?.from + index) % 2 == 0 ? even : odd}>
                                            <td rowSpan="2">{data?.data_Set?.from + index}</td>
                                            <td>{element.ssin_no ? element.ssin_no : "-"}</td>
                                            <td>
                                                {element.old_registration_number ? element.old_registration_number : "-"}
                                                {element.ssin_no ? "" : "(NDF)"}
                                            </td>
                                            <td>{element.old_registration_dt ? element.old_registration_dt : "-"}</td>
                                            <td style={wrapStyle}>{element.name ? element.name : "-"}</td>
                                            <td>{element.old_dob_dt ? element.old_dob_dt : "-"}</td>
                                            <td>{element.old_aadhar_number ? element.old_aadhar_number : "-"}</td>
                                            <td>{element.scheme ? element.scheme : "-"}</td>
                                            <td rowSpan={element.aadhar_no_filename ? "2" : ""}>
                                                {element.aadhar_no_filename ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary "
                                                        style={{ fontSize: 13, marginRight: "3px" }}
                                                        onClick={() => handleShow("Aadhaar", element.aadhar_no_filepath + "/" + element.aadhar_no_filename)}
                                                    >
                                                        {element.aadhar_no ? element.aadhar_no : element.oldstatus == "A" ? element.old_aadhar_number : data.tagged_data[keyval].oldstatus == "A" ? data.tagged_data[keyval].old_aadhar_number : "-"}
                                                    </button>
                                                ) : element.aadhar_no ? (
                                                    element.aadhar_no
                                                ) : element.oldstatus == "A" ? (
                                                    element.old_aadhar_number
                                                ) : data.tagged_data[keyval].oldstatus == "A" ? (
                                                    data.tagged_data[keyval].old_aadhar_number
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>
                                                {element.oldstatus == "A" || element.oldstatus == "OA" || element.oldstatus == "DA" || element.oldstatus == "SA" ? (
                                                    element.old_registration_dt
                                                ) : element.registration_filename ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-warning "
                                                        style={{ fontSize: 13, marginRight: "3px" }}
                                                        onClick={() => handleShow("Scheme Passbook", element.registration_filepath + "/" + element.registration_filename)}
                                                    >
                                                        {element.registration_dt}
                                                    </button>
                                                ) : (
                                                    element.old_registration_dt
                                                )}
                                            </td>
                                            <td rowSpan={element.dob_filename ? "2" : ""}>
                                                {element.dob_filename ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success "
                                                        style={{ fontSize: 13, marginRight: "3px" }}
                                                        onClick={() => handleShow("DOB Certificate", element.dob_filepath + "/" + element.dob_filename)}
                                                    >
                                                        {element.dob_dt ? element.dob_dt : element.old_dob_dt ? element.old_dob_dt : "-"}
                                                    </button>
                                                ) : (
                                                    element.old_dob_dt
                                                )}
                                            </td>
                                        </tr>
                                        <tr key={index * 3} style={(data?.data_Set?.from + index) % 2 == 0 ? even : odd}>
                                            <td>{data.tagged_data[keyval].ssin_no ? data.tagged_data[keyval].ssin_no : "-"}</td>
                                            <td>
                                                {data.tagged_data[keyval].old_registration_number ? data.tagged_data[keyval].old_registration_number : data.tagged_data[keyval].ndf_registration_no}
                                                {data.tagged_data[keyval].ssin_no ? "" : "(NDF)"}
                                            </td>
                                            <td>{data.tagged_data[keyval].old_registration_dt ? data.tagged_data[keyval].old_registration_dt : "-"}</td>
                                            <td>{data.tagged_data[keyval].name ? data.tagged_data[keyval].name : "-"}</td>
                                            <td>{data.tagged_data[keyval].old_dob_dt ? data.tagged_data[keyval].old_dob_dt : "-"}</td>
                                            <td>{data.tagged_data[keyval].old_aadhar_number ? data.tagged_data[keyval].old_aadhar_number : "-"}</td>
                                            <td>{data.tagged_data[keyval].scheme ? data.tagged_data[keyval].scheme : "-"}</td>
                                            {element.aadhar_no_filename == null && (
                                                <td>
                                                    {element.aadhar_no_filename == null && element.oldstatus == "A"
                                                        ? element.old_aadhar_number
                                                            ? element.old_aadhar_number
                                                            : data.tagged_data[keyval].oldstatus == "A"
                                                            ? data.tagged_data[keyval].old_aadhar_number
                                                            : ""
                                                        : "-"}
                                                </td>
                                            )}
                                            <td>
                                                {data.tagged_data[keyval].oldstatus == "A" || data.tagged_data[keyval].oldstatus == "OA" || data.tagged_data[keyval].oldstatus == "DA" || data.tagged_data[keyval].oldstatus == "SA" ? (
                                                    data.tagged_data[keyval].old_registration_dt
                                                ) : element.registration_filename ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-warning "
                                                        style={{ fontSize: 13, marginRight: "3px" }}
                                                        onClick={() => handleShow("Scheme Passbook", element.registration_filepath + "/" + element.registration_filename)}
                                                    >
                                                        {element.registration_dt}
                                                    </button>
                                                ) : (
                                                    data.tagged_data[keyval].old_registration_dt
                                                )}
                                            </td>
                                            {element.dob_filename == null ? <td>{data.tagged_data[keyval].old_dob_dt ? data.tagged_data[keyval].old_dob_dt : element.old_dob_dt}</td> : ""}
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                ))}
            <OffcanvasPdfViewerTagging show={show} handleClose={handleClose} doc={doc} isUrlArray url={url} />
            {data && data?.data_Set?.data?.length > 0 && <Pagination data={data?.data_Set} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
        </>
    );
};

export default TwoSchemeList;
