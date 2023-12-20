import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { downloadFile, fetcher, searchParamsToObject } from "../../../utils";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import TableList from "../../../components/table/TableList";
import DistrictSelect from "../../../components/select/DistrictSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";

const OfflineClaimReport = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Download Offline Claim Report", url: "" }));
    }, []);

    const user = useSelector((state) => state.user.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState();

    const { error, data, isFetching } = useQuery(["offline-claim-list-report-download", searchParams.toString()], () => fetcher(`/offline-claim-list-report-download?${searchParams.toString()}`), {
        enabled: user.role === "ALC" ? true : searchParams.toString() ? true : false,
    });
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [form, validator] = useValidate(
        {
            bankAdviceNo: { value: "", validate: user.role === "SUPER ADMIN" ? "" : "required" },
            district: { value: "", validate: user.role === "SUPER ADMIN" ? "required" : "" },
            subdivision: { value: "", validate: user.role === "SUPER ADMIN" ? "required" : "" },
        },
        searchParamsToObject(searchParams)
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();

        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const clearParams = () => {
        setSearchParams();
        form.bankAdviceNo.value = "";
        if (user.role === "SUPER ADMIN") {
            form.district.value = "";
            form.subdivision.value = "";
            form.district.error = "";
            form.subdivision.error = "";
        }
    };

    const downloadReport = async (bankAdviceNo, bankAdviceDate) => {
        setLoading(bankAdviceNo + bankAdviceDate);
        try {
            const queryParams =
                user.role === "SUPER ADMIN" ? `bankAdviceNo=${bankAdviceNo}&bankAdviceDate=${bankAdviceDate}&district=${form.district.value}&subDivision=${form.subdivision.value}` : `bankAdviceNo=${bankAdviceNo}&bankAdviceDate=${bankAdviceDate}`;
            const doc = await downloadFile("/download-offline-claim-report?" + queryParams, "offline Claim Report.xlsx");
            if (doc === false) toast.error("Unable to download excel");
            setLoading();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "bank_advice_no",
            headerName: "Bank Advice No.",
        },
        {
            field: "bank_advice_date",
            headerName: "Bank Advice Date",
        },
        {
            field: "total",
            headerName: "Total No.",
        },
        {
            field: "amount",
            headerName: "Total Amount",
        },

        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => downloadReport(props.bank_advice_no, props.bank_advice_date)} disabled={loading === props.bank_advice_no + props.bank_advice_date ? true : false}>
                        {loading != props.bank_advice_no + props.bank_advice_date ? <i className="fa-solid fa-file-arrow-down"> </i> : <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        {" Download"}
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <form noValidate onSubmit={handleSubmit}>
                <div className="row">
                    {user.role === "ALC" && (
                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="bankAdviceNo">
                                Bank Advice Number {form.bankAdviceNo.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                id="bankAdviceNo"
                                name="bankAdviceNo"
                                className={`form-control ${form.bankAdviceNo.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.bankAdviceNo.value}
                                required={form.bankAdviceNo.required}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.bankAdviceNo.error}
                            </div>
                        </div>
                    )}

                    {user.role === "SUPER ADMIN" && (
                        <>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="district">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    value={form.district.value}
                                    onChange={(e) => {
                                        handleChange({ name: "district", value: e.currentTarget.value });
                                    }}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-control-label" htmlFor="subdivision">
                                    Subdivision {form.subdivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subdivision.error && "is-invalid"}`}
                                    id="subdivision"
                                    name="subdivision"
                                    value={form.subdivision.value}
                                    onChange={(e) => {
                                        handleChange({ name: "subdivision", value: e.currentTarget.value });
                                    }}
                                    districtCode={form.district.value}
                                />
                                <div className="invalid-feedback">Please select sub division</div>
                            </div>
                        </>
                    )}

                    <div className="col-md-3">
                        <div className="mt-4 d d-md-flex gap-2">
                            <button type="submit" className="btn btn-sm btn-success" disabled={isFetching}>
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => clearParams()}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="card">
                <div className="card-body">
                    <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                </div>
            </div>
        </>
    );
};

export default OfflineClaimReport;
