import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, searchParamsToObject } from "../../../utils";
import { useSearchParams } from "react-router-dom";
import { useValidate } from "../../../hooks";
import DistrictSelect from "../../../components/select/DistrictSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import BMCNameSelect from "../../../components/select/BMCNameSelect";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import TableList from "../../../components/table/TableList";
import ConfirmationModal from "../../../components/ConfirmationModal";

const OfflineClaimList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Offline Claim List", url: "" }));
    }, []);

    const user = useSelector((state) => state.user.user);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState();
    const [confirmMsg, setConfirmMsg] = useState();

    const [form, validator] = useValidate(
        {
            district: { value: user.role === "ALC" ? user?.district : "", validate: "required" },
            subdivision: { value: user.role === "ALC" ? user?.subDivision : "", validate: user.role === "ALC" ? "required" : "" },
            block: { value: "", validate: "" },
            ssin: { value: "", validate: "" },
        },
        searchParamsToObject(searchParams)
    );

    const { error, data, isFetching } = useQuery(["offline-claim-list", searchParams.toString()], () => fetcher(`/offline-claim-list?${searchParams.toString()}`), {
        enabled: user.role === "ALC" || user.role === "inspector" ? true : searchParams.toString() ? true : false,
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "ssin":
                    setState((state) => {
                        setState((state) => {
                            if (value) {
                                state.ssin.required = true;
                                state.ssin.validate = "required";
                                state.ssin.error = null;
                            } else {
                                state.ssin.required = false;
                                state.ssin.validate = "";
                                state.ssin.value = "";
                                state.ssin.error = null;
                            }
                            return { ...state };
                        });
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const { mutate } = useMutation((urlQueryParams) => fetcher(`/offline-claim-delete?${urlQueryParams}`));
    const query = useQueryClient();
    const deleteClaim = (id, ssin, adviceNo) => {
        setConfirmMsg(`SSIN : ${ssin} and advice number : ${adviceNo}. Are you sure to delete this offline claim?`);
        setOpenConfirm(true);
        setConfirmId(id);
    };

    const handleConfirm = () => {
        const urlQueryParams = `id=${confirmId}`;
        setOpenConfirm(false);
        mutate(urlQueryParams, {
            onSuccess(data, variables, context) {
                query.invalidateQueries("offline-claim-list");
                toast.success(data.message);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const clearParams = (e) => {
        setSearchParams();
        if (user.role === "SUPER ADMIN") {
            form.district.value = "";
            form.subdivision.value = "";
            form.district.error = "";
            form.subdivision.error = "";
        }
        form.block.value = "";
        form.ssin.value = "";
    };
    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ssin_no",
            headerName: "SSIN Number",
        },
        {
            field: "reg_no",
            headerName: "Registration Number",
        },
        {
            field: "name",
            headerName: "Beneficiary Name",
        },
        {
            field: "type_of_claim",
            headerName: "Type Of Claim",
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
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteClaim(props.entry_id, props.ssin_no, props.bank_advice_no)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                );
            },
        },
    ];
    return (
        <>
            {(user.role === "ALC" || user.role === "SUPER ADMIN") && (
                <>
                    <form noValidate onSubmit={handleSubmit} className="filter_box">
                        <div className="row">
                            <div className={user.role === "ALC" ? "col-md-2" : "col-md-3"}>
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
                                    disabled={user.role === "ALC" && true}
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>
                            <div className={user.role === "ALC" ? "col-md-2" : "col-md-3"}>
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
                                    disabled={user.role === "ALC" && true}
                                />
                                <div className="invalid-feedback">Please select sub division</div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="block">
                                    B/M/C {form.block.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.block.error && "is-invalid"}`}
                                    id="block"
                                    name="block"
                                    required={form.block.required}
                                    value={form.block.value}
                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                    subDivision={form.subdivision.value}
                                />
                                <div className="invalid-feedback">Please select B/M/C</div>
                            </div>
                            {user.role === "ALC" && (
                                <div className="col-md-3">
                                    <label className="form-control-label" htmlFor="ssin">
                                        SSIN {form.ssin.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="ssin"
                                        name="ssin"
                                        className={`form-control ${form.ssin.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.ssin.value}
                                        required={form.ssin.required}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.ssin.error}
                                    </div>
                                </div>
                            )}

                            <div className="col-md-2">
                                <div className="mt-4 d d-md-flex gap-2">
                                    <button type="submit" className="btn btn-success btn-sm">
                                        <i className="fa-solid fa-magnifying-glass"></i> Search
                                    </button>
                                    <button type="button" className="btn btn-warning btn-sm" onClick={() => clearParams()}>
                                        <i className="fa-solid fa-broom"></i> Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
            )}
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title={confirmMsg} />}
            <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
        </>
    );
};

export default OfflineClaimList;
