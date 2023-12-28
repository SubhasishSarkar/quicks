import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../utils";
import TableList from "../../components/table/TableList";
import { Link, useSearchParams } from "react-router-dom";
import ControlledIMWApplicationListFilter from "../IMWApplicationList/IMWApplicationListFilter";
import ModalLayout from "../../layout/ModalLayout";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const namePattern = /^[a-zA-Z ]+(\.|')?[a-zA-Z ]+(\.|')?/;

function ALCRejectedList() {
    const [show, setShow] = useState(false);
    const [action, setAction] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Rejected List", url: "" }));
    }, []);

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const { mutate, isLoading: isLoadingCheck } = useMutation(({ url }) => fetcher(url));
    const handleAction = (item) => {
        console.log(item);
        setAction(item);
        mutate(
            {
                url: `/alc-check-send-back-for-rectification-eligibility?id=${item.application_id}`,
            },
            {
                onSuccess(data, variables, context) {
                    setShow(true);
                },
                onError(error, variables, context) {
                    setAction();
                    toast.error(error.message);
                },
            }
        );
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
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
            headerName: "Father / Husband Name",
            renderHeader: ({ father_name, husband_name }) => {
                return (
                    <>
                        {husband_name && husband_name !== "N/A" && namePattern.test(husband_name) && husband_name?.trim() !== "." ? (
                            <>
                                <span className="badge text-bg-light me-1">Husband:</span>
                                {husband_name}
                            </>
                        ) : (
                            <>
                                <span className="badge text-bg-light me-1">Father:</span>
                                {father_name}
                            </>
                        )}
                    </>
                );
            },
        },
        {
            field: "gp_ward_name",
            headerName: "GP/WARD",
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
                                e.preventDefault();
                                handleAction(item);
                            }}
                            style={{ marginRight: "3px" }}
                            disabled={item.application_id === action?.application_id && isLoadingCheck}
                        >
                            {item.application_id === action?.application_id && isLoadingCheck ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-arrow-left"></i>} Send back for
                            rectification
                        </button>
                    </>
                );
            },
        },
    ];
    const { data, isLoading, error, isFetching, refetch } = useQuery(["alc-rejected-list", searchParams.toString()], () => fetcher(`/alc-rejected-list?${searchParams.toString()}`));
    return (
        <div>
            <>
                <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />
                <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                <ModalLayout
                    title="Send back for rectification"
                    show={show}
                    handleClose={() => {
                        setShow(false);
                    }}
                    size="md"
                    refetch={refetch}
                >
                    <SendBackForRectificationForm applicationData={action} />
                </ModalLayout>
            </>
        </div>
    );
}

export default ALCRejectedList;

function SendBackForRectificationForm({ applicationData, handleClose, refetch }) {
    const [form, validator] = useValidate({
        status: { value: "B", validate: "required" },
        remark: { value: "", validate: "required" },
    });

    const { mutate, isLoading } = useMutation(({ body, url }) => updater(url, { method: "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        console.log(applicationData);
        mutate(
            {
                url: `/alc-send-back-for-rectification`,
                body: {
                    remark_type: formData.status,
                    remark: formData.remark,
                    application_id: applicationData.application_id,
                },
            },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.message);
                    handleClose();
                    refetch();
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    handleClose();
                },
            }
        );
    };
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    return (
        <div>
            <form noValidate onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="action">
                        Select Action {form.status.required && <span className="text-danger">*</span>}
                    </label>
                    <select
                        id="action"
                        name="action"
                        className={`form-select ${form.status.error && "is-invalid"}`}
                        onChange={(e) => {
                            handleChange(e.currentTarget);
                        }}
                        value={form.status.value}
                        required={form.status.required}
                    >
                        <option value="B">Back for Rectification to Inspector</option>
                    </select>
                    <div className="invalid-feedback">{form.status.error}</div>
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="nominee_name">
                        Remark {form.remark.required && <span className="text-danger">*</span>}
                    </label>
                    <input
                        type="text"
                        id="remark"
                        name="remark"
                        className={`form-control ${form.remark.error && "is-invalid"}`}
                        value={form.remark.value}
                        required={form.remark.required}
                        onChange={(e) => {
                            handleChange(e.currentTarget);
                        }}
                    />
                    <div id="Feedback" className="invalid-feedback">
                        {form.remark.error}
                    </div>
                </div>
                <div className="d-grid d-md-flex justify-content-md-end">
                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
