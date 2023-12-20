import React, { useEffect, useState } from "react";
import { useValidate } from "../../../hooks";
import DistrictSelect from "../../../components/select/DistrictSelect";
import RloSelect from "../../../components/select/RloSelect";
import LwfcSelect from "../../../components/select/LwfcSelect";
import { blankOpenFile, fetcher, searchParamsToObject } from "../../../utils";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../components/list/ErrorAlert";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import PaginationType2 from "../../../components/PaginationType2";

const PayIngSlip = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useState();
    const [genLoading, setGenLoading] = useState(false);
    const [newLoading, setNewLoading] = useState();
    const user = useSelector((state) => state.user.user);
    const [form, validator] = useValidate({
        district: { value: user?.role == "inspector" || user?.role == "ALC" ? user?.district : "", validate: "required" },
        rlo: { value: user?.role == "inspector" || user?.role == "ALC" ? user?.rloCode : "", validate: "" },
        lwfc: { value: user?.role == "inspector" ? user?.lwfcCode : "", validate: "" },
        block: { value: "", validate: "" },
        from_date: { value: "", validate: "required" },
        to_date: { value: "", validate: "required" },
        ssy_collecting_agent_arn: { value: "", validate: "" },
    });

    useEffect(() => {
        dispatch(setPageAddress({ title: "Pay-In Slip Details", url: "" }));
    }, []);

    const { data, isFetching, error } = useQuery(["form4-payinslip-details", searchParams], () => fetcher(`/form4-payinslip-details?${searchParams}`), { enabled: searchParams ? true : false });
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const generatePayinslipPdf = async (e) => {
        try {
            setGenLoading(true);
            if (!validator.validate()) return;
            const formPdfData = validator.generalize();
            const urlSearchPdfParams = new URLSearchParams(formPdfData);
            await blankOpenFile("/payinslip-pdf-view?" + urlSearchPdfParams.toString());
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
        const urlSearchParams = new URLSearchParams(formData);
        setSearchParams(urlSearchParams.toString());
    };

    const loadPdf = async (id) => {
        setNewLoading(id);
        try {
            await blankOpenFile("/form-four-pdf-view/" + id);
            setNewLoading();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setSearchParams();
    };

    return (
        <>
            <div className="card datatable-box mb-2">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="district">
                                    District<span className="text-danger">*</span>
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    option_all="true"
                                    disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">{form.district.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="rlo">
                                    RLO
                                </label>
                                <RloSelect
                                    className={`form-select ${form.rlo.error && "is-invalid"}`}
                                    id="rlo"
                                    name="rlo"
                                    value={form.rlo.value}
                                    option_all="true"
                                    disabled={user?.role == "inspector" || user?.role == "ALC" ? true : false}
                                    onChange={(e) => {
                                        handleChange({ name: "rlo", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">{form.rlo.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="lwfc">
                                    LWFC
                                </label>
                                <LwfcSelect
                                    className={`form-select ${form.lwfc.error && "is-invalid"}`}
                                    id="lwfc"
                                    name="lwfc"
                                    required={form.lwfc.required}
                                    value={form.lwfc.value}
                                    disabled={user?.role == "inspector" ? true : false}
                                    option_all="true"
                                    onChange={(e) => handleChange({ name: "lwfc", value: e.currentTarget.value })}
                                    rloCode={form.rlo.value}
                                />
                                <div className="invalid-feedback">{form.lwfc.error}</div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="from_date" className="form-label">
                                    From Deposit Date <span className="text-danger">*</span>
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
                                    To Deposit Date <span className="text-danger">*</span>
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
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                <i className="fa-solid fa-user-lock"></i> View Payinslip
                            </button>
                            &nbsp;
                            <button className="btn btn-danger btn-sm" type="button" onClick={() => generatePayinslipPdf()} disabled={genLoading}>
                                {genLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                <i className="fa-regular fa-pen-to-square"></i> Generate Payinslip
                            </button>
                            &nbsp;
                            <button className="btn btn-primary btn-sm" onClick={handleReset}>
                                <i className="fa-solid fa-backward"></i> Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm table-hover">
                            <thead>
                                <tr className="table-active" align="center">
                                    <th scope="col">SL No.</th>
                                    <th scope="col">ARN</th>
                                    <th scope="col">Agent Name</th>
                                    <th scope="col">Deposit Date</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">TRXN</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data_Set?.data?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{data?.data_Set?.from + index}</td>
                                            <td>{item.ssy_collecting_agent_arn}</td>
                                            <td>{item.fullname}</td>
                                            <td>{item.deposit_date}</td>
                                            <td>{item.deposit_amount}</td>
                                            <td>{item.trans_cnt}</td>
                                            <td>
                                                {newLoading != item.pflegacymasterid ? (
                                                    <button onClick={() => loadPdf(item.pflegacymasterid)} className="btn btn-primary btn-sm">
                                                        View
                                                    </button>
                                                ) : (
                                                    <button type="button" className="btn btn-danger btn-sm mt-2">
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        View
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {data?.data_Set?.links && <PaginationType2 data={data?.data_Set} setSearchParams={setSearchParams} searchParamsToObject={searchParamsToObject} searchParams={searchParams} />}
                </>
            )}
        </>
    );
};

export default PayIngSlip;
