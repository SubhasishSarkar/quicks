import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import { fetcher, updater } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import SelectAllCheckBox from "../../../../components/list/SelectAllCheckBox";
import { useValidate } from "../../../../hooks";
import NoDataFound from "../../../../components/list/NoDataFound";

const AlcApprovedList = () => {
    const [formData, setFormData] = useState();
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [list, setList] = useState([]);
    const [adviceForPf, setAdviceForPf] = useState();
    const [adviceError, setAdviceError] = useState(false);

    const [form, validator] = useValidate({
        workerType: { value: "", validate: "required" },
        claimType: { value: "", validate: "required" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { error, data, isFetching } = useQuery(["alc-approved-claim-list", formData], () => fetcher(`/alc-approved-claim-list?${formData}`), { enabled: formData ? true : false });

    useEffect(() => {
        setFormData();
    }, [form.workerType.value, form.claimType.value]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setFormData(urlSearchParams.toString());
    };

    useEffect(() => {
        setList(data?.res);
    }, [data?.res, list]);

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map((li) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
        }
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const forwardClaim = (claimFor) => {
        if (form.workerType.value === "ow" && form.claimType.value === "pf" && !adviceForPf) {
            setAdviceError(true);
            return;
        }
        const bodyData = { claimFor: claimFor, ids: isCheck, workerType: data?.workerType, adviceForPf: adviceForPf ? adviceForPf : "" };

        mutate(
            { url: `/alc-generate-fund-request`, body: bodyData },
            {
                onSuccess(data, variables, context) {
                    if (data?.type) {
                        toast.success(data?.message);
                        navigate("/claim/advice-list");
                    } else {
                        toast.success("Your record has been submitted successfully and your fund request id is : " + data.id);
                        navigate("/claim/fund-request-list");
                    }
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const clearParams = () => {
        form.workerType.value = "";
        form.claimType.value = "";
        validator.reset();
        setFormData();
        setAdviceForPf();
        setAdviceError(false);
        setIsCheck([]);
    };

    const handelAdvice = (name, value) => {
        if (value) setAdviceError(false);
        else setAdviceError(true);
        setAdviceForPf(value);
    };

    return (
        <>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                <div className="row mb-2">
                    <div className="col-md-5">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                Select Worker Type {form.workerType.required && <span className="text-danger">*</span>}
                            </span>
                            <select
                                id="workerType"
                                name="workerType"
                                className={`form-select ${form.workerType.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.workerType.value}
                                required={form.workerType.required}
                                disabled={data}
                            >
                                <option value="">Select</option>
                                <option value="ow">Other Worker</option>
                                <option value="cw">Construction Worker</option>
                                <option value="tw">Transport Worker</option>
                            </select>
                            <div className="invalid-feedback">Please select worker type</div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                Select Claim Type {form.claimType.required && <span className="text-danger">*</span>}
                            </span>
                            <select
                                id="claimType"
                                name="claimType"
                                className={`form-select ${form.claimType.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.claimType.value}
                                required={form.claimType.required}
                                disabled={data}
                            >
                                <option value="">Select</option>
                                <option value="death">Death</option>
                                <option value="disability">Disability</option>
                                <option value="pf">PF</option>
                            </select>
                            <div className="invalid-feedback">Please select claim type</div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="d-grid mt-1 d-md-flex gap-2">
                            <button className="btn btn-primary btn-sm" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} {!isFetching && <i className="fa-solid fa-magnifying-glass"></i>} Search
                            </button>
                            <button type="button" className="btn btn-warning btn-sm" onClick={() => clearParams()} disabled={!data}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {error && <ErrorAlert error={error} />}

            {data?.res &&
                (data?.res.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>
                                        <SelectAllCheckBox type="checkbox" name="selectAll" id="selectAll" handleClick={handleSelectAll} isChecked={isCheckAll} />
                                    </th>
                                    <th>SL No.</th>
                                    <th>Claim Reference No.</th>
                                    <th>Beneficiary Name</th>
                                    <th>SSIN</th>
                                    <th>Registration Number</th>
                                    <th>Claim For</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.res.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <SelectAllCheckBox key={item.id} type="checkbox" name={item.name} id={item.id} handleClick={handleClick} isChecked={isCheck.includes(item.id)} />
                                            </td>

                                            <td>{item.sl}</td>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.ssin}</td>
                                            <td>{item.regNo}</td>
                                            <td>
                                                <ClaimForBadge claimFor={item.claimFor} benefitName={item.benefit_name} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="col-md-12 mb-2">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-first">
                                {form.workerType.value === "ow" && form.claimType.value === "pf" ? (
                                    <div className="row">
                                        <div className="col-md-12 mb-2">
                                            <input
                                                placeholder="Enter advice"
                                                className={adviceError ? "form-control is-invalid" : "form-control "}
                                                type="text"
                                                name="approvedPfAdvice"
                                                id="approvedPfAdvice"
                                                onKeyUp={(e) => handelAdvice(e.target.name, e.target.value)}
                                            />
                                            <div className="invalid-feedback">{adviceError && "Please enter advice"}</div>
                                        </div>

                                        <div className="col-md-12">
                                            <button className="btn btn-success btn-sm" type="submit" disabled={isCheck.length === 0 && !isLoading} onClick={() => forwardClaim(data?.claimFor)}>
                                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Generate Advice
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isCheck.length === 0 && !isLoading} onClick={() => forwardClaim(data?.claimFor)}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Generate Fund Request
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <NoDataFound />
                ))}
        </>
    );
};

export default AlcApprovedList;
