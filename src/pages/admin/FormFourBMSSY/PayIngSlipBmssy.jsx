import React, { useCallback, useEffect, useState } from "react";
import { useValidate } from "../../../hooks";
import DistrictSelect from "../../../components/select/DistrictSelect";
import RloSelect from "../../../components/select/RloSelect";
import LwfcSelect from "../../../components/select/LwfcSelect";
import { blankOpenFile, fetcher, searchParamsToObject } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";
import TableList from "../../../components/table/TableList";

const PayIngSlipBmssy = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [genLoading, setGenLoading] = useState(false);
    const [newLoading, setNewLoading] = useState();
    const [apiHit, setApiHit] = useState(false);
    const user = useSelector((state) => state.user.user);
    const [form, validator] = useValidate(
        {
            district: { value: user?.role === "ALC" || user?.role === "inspector" ? user?.district : "", validate: "required" },
            rlo: { value: user?.role === "ALC" || user?.role === "inspector" ? user?.rloCode : "", validate: "required" },
            lwfc: { value: "", validate: "" },
            from_date: { value: "", validate: "required" },
            to_date: { value: "", validate: "required" },
            ssy_collecting_agent_arn: { value: "", validate: "" },
            committed: { value: "Yes", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    useEffect(() => {
        dispatch(setPageAddress({ title: "BMSSY Pay-In Slip Details", url: "" }));
    }, []);

    const { data, isFetching, error } = useQuery(["bmssy-payinslip-summary-view", searchParams.toString()], () => fetcher(`/bmssy-payinslip-summary-view?${searchParams.toString()}`), {
        enabled: apiHit ? true : false,
    });
    console.log("searchParams.toString()", data, searchParams);
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const generatePayinslipPdf = async (e) => {
        try {
            setGenLoading(true);
            if (!validator.validate()) return;
            const formPdfData = validator.generalize();
            const urlSearchPdfParams = new URLSearchParams(formPdfData);
            await blankOpenFile("/generate-payinslip-summary-pdf?" + urlSearchPdfParams.toString());
            setGenLoading(false);
        } catch (error) {
            setGenLoading(false);
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        setApiHit(true);
        Object.keys(formData).forEach((key) => searchParams.set(key, formData[key]));
        setSearchParams(searchParams);
        // const urlSearchParams = new URLSearchParams(formData);
        // setSearchParams(urlSearchParams.toString());
    };

    const loadPdf = async (props) => {
        setNewLoading(props?.id);
        try {
            await blankOpenFile(`/generate-form4-pdf/${props?.id}`);
            setNewLoading();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setApiHit(false);
        setSearchParams();
    };

    const handleLimit = useCallback(
        (val) => {
            searchParams.set("limit", val);
            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "arn_number",
            headerName: "Collected By ARN",
        },
        {
            field: "arn_name",
            headerName: "Collected By Name",
        },
        {
            field: "deposit_date",
            headerName: "Deposit Date",
        },
        {
            field: "deposit_amount",
            headerName: "Deposit Amount",
        },
        {
            field: "board",
            headerName: "Board",
        },
        {
            field: "txn",
            headerName: "Transaction",
        },
        {
            field: "created_by_arn",
            headerName: "Digitized By",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button className="btn btn-sm btn-success" onClick={() => loadPdf(props)} disabled={newLoading === props.id ? true : false}>
                        {newLoading === props?.id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "View"}
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="district">
                                    District{form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    option_all="true"
                                    //disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">{form.district.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="rlo">
                                    RLO{form.rlo.required && <span className="text-danger">*</span>}
                                </label>
                                <RloSelect
                                    className={`form-select ${form.rlo.error && "is-invalid"}`}
                                    id="rlo"
                                    name="rlo"
                                    value={form.rlo.value}
                                    option_all="true"
                                    //disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                    onChange={(e) => {
                                        handleChange({ name: "rlo", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">{form.rlo.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="lwfc">
                                    LWFC{form.lwfc.required && <span className="text-danger">*</span>}
                                </label>
                                <LwfcSelect
                                    className={`form-select ${form.lwfc.error && "is-invalid"}`}
                                    id="lwfc"
                                    name="lwfc"
                                    required={form.lwfc.required}
                                    value={form.lwfc.value}
                                    // disabled={user?.role == "inspector" ? true : false}
                                    option_all="true"
                                    onChange={(e) => handleChange({ name: "lwfc", value: e.currentTarget.value })}
                                    rloCode={form.rlo.value}
                                />
                                <div className="invalid-feedback">{form.lwfc.error}</div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="from_date" className="form-label">
                                    From Deposit Date {form.from_date.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="From Deposit Date"
                                    className={`form-control ${form.from_date.error && "is-invalid"}`}
                                    type="date"
                                    value={form.from_date.value}
                                    name="from_date"
                                    id="from_date"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.from_date.error}</div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="to_date" className="form-label">
                                    To Deposit Date {form.to_date.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    placeholder="To Deposit Date"
                                    className={`form-control ${form.to_date.error && "is-invalid"}`}
                                    type="date"
                                    value={form.to_date.value}
                                    name="to_date"
                                    id="to_date"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.to_date.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="ssy_collecting_agent_arn">
                                    Agent ARN
                                </label>
                                <input
                                    placeholder="Agent ARN"
                                    className={`form-control ${form.ssy_collecting_agent_arn.error && "is-invalid"}`}
                                    type="text"
                                    value={form.ssy_collecting_agent_arn.value}
                                    name="ssy_collecting_agent_arn"
                                    id="ssy_collecting_agent_arn"
                                    onChange={(e) => handleChange(e.currentTarget)}
                                />
                                <div className="invalid-feedback">{form.ssy_collecting_agent_arn.error}</div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-check col-md-4">
                                    <input
                                        type="radio"
                                        value="Yes"
                                        checked={form.committed.value == "Yes" ? true : false}
                                        onChange={() => handleChange({ name: "committed", value: "Yes" })}
                                        className={`form-check-input ${form.committed.error && "is-invalid"}`}
                                        id="committed_yes"
                                        name="radio-stacked"
                                        required={form.committed.required}
                                    />
                                    <label className="form-check-label" htmlFor="committed_yes">
                                        Committed
                                    </label>
                                </div>
                                <div className="form-check  col-md-4 ">
                                    <input
                                        checked={form.committed.value == "No" ? true : false}
                                        value="No"
                                        type="radio"
                                        className={`form-check-input ${form.committed.error && "is-invalid"}`}
                                        onChange={() => handleChange({ name: "committed", value: "No" })}
                                        id="committed_no"
                                        name="radio-stacked"
                                        required={form.committed.required}
                                    />
                                    <label className="form-check-label" htmlFor="committed_no">
                                        Not Committed
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit">
                                {isFetching ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span>
                                        <i className="fa-solid fa-user-lock"></i>View Payinslip
                                    </span>
                                )}
                            </button>
                            &nbsp;
                            <button className="btn btn-danger btn-sm" type="button" onClick={() => generatePayinslipPdf()} disabled={genLoading}>
                                {genLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span>
                                        <i className="fa-regular fa-pen-to-square"></i>Generate Payinslip
                                    </span>
                                )}
                            </button>
                            &nbsp;
                            <button className="btn btn-primary btn-sm" onClick={handleReset}>
                                <i className="fa-solid fa-backward"></i> Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <TableList data={data?.data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default PayIngSlipBmssy;
