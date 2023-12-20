import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../../../../components/Pagination";
import BMCNameSelect from "../../../../../components/select/BMCNameSelect";
import DistrictSelect from "../../../../../components/select/DistrictSelect";
import SubDivSelect from "../../../../../components/select/SubDivSelect";
import { useValidate } from "../../../../../hooks";
import { fetcher, searchParamsToObject } from "../../../../../utils";
import AdminCafListModal from "./AdminCafListModal";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../../store/slices/headerTitleSlice";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import { toast } from "react-toastify";

const AdminCafDsList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [idd, setIdd] = useState();
    const [aadhar, setAadhar] = useState();

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState();
    const [dsNo, setDsNo] = useState();

    const { data, isLoading, error } = useQuery(["duare-sarkar-admin-caf-list", searchParams.toString()], () => fetcher(`/duare-sarkar-admin-caf-list?${searchParams.toString()}`));

    const [form, validator] = useValidate(
        {
            district: { value: "", validate: "required" },
            sub_division: { value: "", validate: "" },
            block: { value: "", validate: "" },
        },
        searchParamsToObject(searchParams)
    );
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        setSearchParams(formData);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const clearHandler = () => {
        setSearchParams("");
        validator.setState((state) => {
            state.district.value = "";
            state.sub_division.value = "";
            state.block.value = "";
            return { ...state };
        });
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const checkDetailsHandler = (id, aadhaar_no) => {
        setShow(true);
        setIdd(id);
        setAadhar(aadhaar_no);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Duare Sarkar CAF List", url: "" }));
    }, []);

    const { mutate } = useMutation((id) => fetcher(`/update-ds-caf-reg-status?id=${confirmId}`));
    const dsCafReject = (id, dsNumber) => {
        setConfirmId(id);
        setDsNo(dsNumber);
        setOpenConfirm(true);
    };
    const query = useQueryClient();
    const handleConfirm = () => {
        setOpenConfirm(false);
        mutate(confirmId, {
            onSuccess(data, variables, context) {
                console.log(data);
                toast.success("DS Caf successfully rejected.");
                query.invalidateQueries("duare-sarkar-admin-caf-list");
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };
    return (
        <>
            <div className="card mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="status" className="form-control-label">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    // disabled
                                    required={form.district.required}
                                    value={form.district.value}
                                    onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })}
                                />

                                <div className="invalid-feedback">{form.district.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="status" className="form-control-label">
                                    Sub Division {form.sub_division.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.sub_division.error && "is-invalid"}`}
                                    id="sub_division"
                                    name="sub_division"
                                    // disabled
                                    required={form.sub_division.required}
                                    value={form.sub_division.value}
                                    onChange={(e) => handleChange({ name: "sub_division", value: e.currentTarget.value })}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">{form.sub_division.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="status" className="form-control-label">
                                    Block {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.sub_division.value}
                                />
                                <div className="invalid-feedback">{form.block.error}</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end gap-2">
                            <button className="btn btn-success btn-sm" type="submit">
                                <span className="" role="status" aria-hidden="true"></span> Search
                            </button>
                            <button className="btn btn-warning btn-sm" type="button" onClick={clearHandler}>
                                <span className="" role="status" aria-hidden="true"></span>Clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL.No.</th>
                                        <th>DS Registration No.</th>
                                        <th>DS Registration Date</th>
                                        <th>Beneficiary Name</th>
                                        <th>District</th>
                                        <th>Subdivision</th>
                                        <th>GP/Ward</th>
                                        {/* <th>Status</th> */}
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{data?.from + index}</td>
                                            <td>{item.ds_reg_no}</td>
                                            <td>{item.ds_reg_date}</td>
                                            <td>{item.beneficiary_name}</td>
                                            <td>{item.district_name}</td>
                                            <td>{item.subdivision_name}</td>
                                            <td>{item.gp_ward_name}</td>
                                            {/* <td>{item.status.trim() === "B" ? "Back For Correction" : item.status.trim() === "R" ? "Rejected" : "Pending"}</td> */}
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-success btn-sm" style={{ fontSize: 12 }} onClick={() => checkDetailsHandler(item.id, item.aadhaar_no)}>
                                                        Check Details
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        style={{ fontSize: 12 }}
                                                        onClick={() => {
                                                            dsCafReject(item.id, item.ds_reg_no);
                                                        }}
                                                        disabled={openConfirm && confirmId === item.id ? true : false}
                                                    >
                                                        {openConfirm && confirmId === item.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Reject"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                    </div>
                </div>
            )}

            <AdminCafListModal show={show} handleClose={handleClose} idd={idd} aadhar={aadhar} />
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title={"DS Caf Registration no : " + dsNo + ". Are sure to delete this ds caf?"} />}
        </>
    );
};

export default AdminCafDsList;
