import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useValidate } from "../../../../hooks";
import { fetcher, updater } from "../../../../utils";
import { toast } from "react-toastify";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import RloSelect from "../../../../components/select/RloSelect";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import SelectAllCheckBox from "../../../../components/list/SelectAllCheckBox";
import { Button, Modal } from "react-bootstrap";
import FundDetails from "../ALC/funRequestList/FundDetails";

const CfacoClaimPendingList = () => {
    const [getId, setGetId] = useState(false);
    const [show, setShow] = useState(false);
    const [list, setList] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState();
    const [isCheck, setIsCheck] = useState([]);
    const query = useQueryClient();

    const [form, validator] = useValidate({
        district: { value: "", validate: "required" },
        claimType: { value: "", validate: "required" },
        rloCode: { value: "", validate: "required" },
    });

    const handleChange = (e) => {
        validator.validOnChange(e);
    };
    const [formData, setFormData] = useState();
    const { error, data, isFetching } = useQuery(["alc-fund-request-list", formData], () => fetcher(`/alc-fund-request-list?${formData}`), { enabled: formData ? true : false });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setFormData(urlSearchParams.toString());
    };

    const modalEventSet = (id) => {
        setShow(true);
        setGetId(id);
    };

    useEffect(() => {
        setList(data);
    }, [data, list]);

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list?.data?.map((li) => li.id));
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
    const generateReleaseOrderNumberByCfcao = (pros) => {
        const bodyData = { ids: isCheck, claimType: pros };
        mutate(
            { url: `/cfcao-generate-release-order-number`, body: bodyData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Your record has been submitted successfully. Your Released Order Number is : " + data.rows[0].id);
                    query.invalidateQueries("alc-fund-request-list");
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
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                District
                            </span>
                            <DistrictSelect className={`form-select ${form.district.error && "is-invalid"} `} id="district" required="" onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })} />
                            <div className="invalid-feedback">Please select district</div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                RLO
                            </span>
                            <RloSelect
                                className={`form-select ${form.rloCode.error && "is-invalid"}`}
                                id="rloCode"
                                districtCode={form.district.value}
                                onChange={(e) => handleChange({ name: "rloCode", value: e.currentTarget.value })}
                                required={form.rloCode.required}
                            />
                            <div className="invalid-feedback">Please select RLO</div>
                        </div>
                    </div>

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
            {data?.data?.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>
                                    <SelectAllCheckBox type="checkbox" name="selectAll" id="selectAll" handleClick={handleSelectAll} isChecked={isCheckAll} />
                                </th>
                                <th>SL No.</th>
                                <th>Fund Request ID</th>
                                <th>Fund Request Date</th>
                                <th>Amount</th>
                                <th>Number Of Beneficiary</th>
                                <th>Created By</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <SelectAllCheckBox key={item.id} type="checkbox" name={item.fdate} id={item.id} handleClick={handleClick} isChecked={isCheck.includes(item.id)} />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{item.id}</td>
                                        <td>{item.fdate}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.number_of_application}</td>
                                        <td>{item.fullname}</td>
                                        <td>
                                            <Button variant="success" onClick={() => modalEventSet(item.id)} size="sm">
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="col-md-12 mb-2">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-first">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isCheck.length === 0 || isLoading} onClick={() => generateReleaseOrderNumberByCfcao(form.claimType.value)}>
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Generate Release Order
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

export default CfacoClaimPendingList;
