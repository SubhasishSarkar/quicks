import React, { useEffect, useState } from "react";
import { useValidate } from "../../../../../hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../../utils";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import SelectAllCheckBox from "../../../../../components/list/SelectAllCheckBox";
import NoDataFound from "../../../../../components/list/NoDataFound";
import WorkerTypeAdviceGeneratedDetailsModal from "./WorkerTypeAdviceGeneratedDetailsModal";

const WorkerTypeAdviceGenerate = ({ workerType }) => {
    const type = workerType;
    const [show, setShow] = useState();
    const [showHide, setShowHide] = useState(false);
    const [getId, setGetId] = useState();
    const [getName, setGetName] = useState();
    const [form, validator] = useValidate({
        claimType: { value: "", validate: "required" },
    });

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [list, setList] = useState([]);
    const [dropVal, setDropVal] = useState();
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const [formData, setFormData] = useState();
    const { error, data, isFetching } = useQuery(["get-memo-list", formData, type], () => fetcher(`/get-memo-list?${formData}&type=${type}`), { enabled: formData ? true : false });

    const formHandelSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const dropData = validator.generalize();
        const claimTypeUrl = new URLSearchParams(dropData);
        setFormData(claimTypeUrl.toString());
        setDropVal(dropData.claimType);
    };

    const handleClick = (e) => {
        const { checked, id } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
        }
    };

    useEffect(() => {
        setList(data);
    }, [data, list]);

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map((li) => li.memo_id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const forwardClaim = () => {
        const bodyData = { claimFor: dropVal, ids: isCheck, workerType: type, adviceName: adviceValue };

        if (isCheck.length === 0) {
            toast.error("Please select check box");
            return;
        }
        if (!adviceValue) {
            toast.error("Please enter advice number");
            return;
        }

        mutate(
            { url: `/alc-generate-advice`, body: bodyData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Your advice generated successfully ");
                    navigate("/claim/advice-list");
                },
                onError(error, variables, context) {
                    console.error(error.message);
                    toast.error(error.message);
                },
            }
        );
    };
    const [adviceValue, setAdviceValue] = useState();
    const handleAdviceNameChange = (e) => {
        setAdviceValue(e);
    };

    const getMemoDetails = async ({ id, name }) => {
        try {
            setShowHide(true);
            setGetId(id);
            setGetName(name);
            setShow();
        } catch (error) {
            setShow();
            console.error(error);
        }
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            <form className="needs-validation" noValidate onSubmit={formHandelSubmit}>
                <div className="row mb-2">
                    <div className="col-md-5">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                Select Claim Type {form.claimType.required && <span className="text-danger">*</span>}
                            </span>
                            <select
                                id="claimType"
                                name="claimType"
                                className={`form-select && ${form.claimType.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.claimType.value}
                                required={form.claimType.required}
                            >
                                <option value="">Select</option>
                                <option value="1">Death</option>
                                <option value="2">Disability</option>
                                {type != "ow" && <option value="3">PF</option>}
                            </select>
                            <div className="invalid-feedback">Please select claim type</div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="d-grid mt-1 d-md-flex">
                            <button className="btn btn-primary btn-sm" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {error && <ErrorAlert error={error} />}
            {data &&
                (data?.length > 0 ? (
                    <div  style={{ overflow: "auto" }} className="table-container table-responsive">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>
                                        <SelectAllCheckBox type="checkbox" name="selectAll" id="selectAll" handleClick={handleSelectAll} isChecked={isCheckAll} />
                                    </th>
                                    <th>SL No.</th>
                                    <th>Memo ID</th>
                                    <th>Amount</th>
                                    <th>Created Date</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={wrapStyle}>
                                                <SelectAllCheckBox key={item.memo_id} type="checkbox" name={item.fund_requirment_id} id={item.memo_id} handleClick={handleClick} isChecked={isCheck.includes(item.memo_id)} />
                                            </td>

                                            <td style={wrapStyle}> {index + 1}</td>
                                            <td style={wrapStyle}>{item.fund_requirment_id}</td>
                                            <td style={wrapStyle}>{item.sum}</td>
                                            <td style={wrapStyle}>{item.created_date}</td>
                                            <td style={wrapStyle}>
                                                <button className="btn btn-success btn-sm" onClick={() => getMemoDetails({ id: item?.memo_id, name: item?.fund_requirment_id })} disabled={show === item?.memo_id ? true : false}>
                                                    {show === item?.memo_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                name="adviceName"
                                id="adviceName"
                                value={adviceValue || ""}
                                onChange={(e) => {
                                    handleAdviceNameChange(e.currentTarget.value);
                                }}
                                className="form-control undefined"
                            />
                        </div>
                        <div className="col-md-8 mb-2">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-first">
                                <button className="btn btn-success btn-sm" type="submit" disabled={isCheck.length === 0 && !isLoading} onClick={() => forwardClaim()}>
                                    {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}Generate Advice
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <NoDataFound />
                ))}

            <WorkerTypeAdviceGeneratedDetailsModal showHide={showHide} setShowHide={setShowHide} getName={getName} id={getId} />
        </>
    );
};

export default WorkerTypeAdviceGenerate;
