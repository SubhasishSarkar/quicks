import React, { useEffect, useState } from "react";
import { useValidate } from "../../../../hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../utils";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import SelectAllCheckBox from "../../../../components/list/SelectAllCheckBox";
import { Modal } from "react-bootstrap";
import FundDetails from "../ALC/funRequestList/FundDetails";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ClaimReleaseList = () => {
    const [getId] = useState(false);
    const [formData, setFormData] = useState();
    const [list, setList] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState();
    const [isCheck, setIsCheck] = useState([]);
    const [show, setShow] = useState(false);
    const [dropVal, setDropVal] = useState();
    const [form, validator] = useValidate({
        claimType: { value: "", validate: "required" },
    });

    const handleChange = (e) => {
        validator.validOnChange(e);
    };

    const { error, data, isFetching } = useQuery(["ceo-claim-release-list", formData], () => fetcher(`/ceo-claim-release-list?${formData}`), { enabled: formData ? true : false });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setFormData(urlSearchParams.toString());
        setDropVal(formData.claimType);
    };
    // const modalEventSet = (id) => {
    //     setShow(true);
    //     setGetId(id);
    // };
    useEffect(() => {
        setList(data);
    }, [data, list]);

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

    const [memoName, setMemoName] = useState();
    const handleMemoNameChange = (e) => {
        setMemoName(e);
    };
    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const generateMemo = () => {
        const bodyData = { claimType: dropVal, ids: isCheck, memoNo: memoName };
        if (isCheck.length === 0) {
            toast.error("Please select check box");
            return;
        }
        if (!memoName) {
            toast.error("Please enter memo number");
            return;
        }

        mutate(
            { url: `/ceo-generate-memo`, body: bodyData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Your memo generated successfully ");
                    navigate("/claim/list?type=fundReleaseList");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };
    return (
        <>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                <div className="row mb-2">
                    <div className="col-md-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                Claim Type
                            </span>
                            <select
                                id="claimType"
                                className={`form-select ${form.claimType.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange({ name: "claimType", value: e.currentTarget.value });
                                }}
                                required={form.claimType.required}
                            >
                                <option value="">Select</option>
                                <option value="1">Death</option>
                                <option value="2">Disability</option>
                                <option value="3">PF</option>
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
            {isFetching && <LoadingSpinner />}
            {data?.length > 0 && (
                <div style={{ overflow: "auto" }} className="table-container table-responsive">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>
                                    <SelectAllCheckBox type="checkbox" name="selectAll" id="selectAll" handleClick={handleSelectAll} isChecked={isCheckAll} />
                                </th>
                                <th>SL No.</th>
                                <th>Release Order No.</th>
                                <th>Release Order Date</th>
                                <th>Amount</th>
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>
                                            <SelectAllCheckBox key={item.id} type="checkbox" name={item.fdate} id={item.id} handleClick={handleClick} isChecked={isCheck.includes(item.id)} />
                                        </td>
                                        <td style={wrapStyle}>{index + 1}</td>
                                        <td style={wrapStyle}>{item.id}</td>
                                        <td style={wrapStyle}>{item.fdate}</td>
                                        <td style={wrapStyle}>{item.amount}</td>
                                        <td style={wrapStyle}>{item.number_of_application}</td>

                                        {/* <td>
                                            <Button variant="success" onClick={() => modalEventSet(item.id)} size="sm">
                                                View Details
                                            </Button>
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {/* ========  MEMO Section ===== */}
                    <div className="col-md-4 mb-2">
                        <input
                            type="text"
                            name="memoName"
                            id="memoName"
                            className="form-control "
                            placeholder="Enter Memo No."
                            value={memoName || ""}
                            onChange={(e) => {
                                handleMemoNameChange(e.currentTarget.value);
                            }}
                        />
                    </div>
                    <div className="col-md-8 mb-2">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-first">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isCheck.length === 0} onClick={() => generateMemo()}>
                                Generate Memo
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">Fund Request Details Of ID : {getId}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                    }}
                >
                    <FundDetails id={getId} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ClaimReleaseList;
