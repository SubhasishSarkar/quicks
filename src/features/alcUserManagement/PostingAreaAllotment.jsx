import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher, updater } from "../../utils";
import MultiSelect from "../../components/select/MultiSelect";
import BMCNameSelect from "../../components/select/BMCNameSelect";
import { useSelector } from "react-redux";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import ErrorAlert from "../../components/list/ErrorAlert";

const PostingAreaAllotment = ({ encId, setPostingAreaShow, motherBlock }) => {
    const user = useSelector((state) => state.user.user);
    const [searchNewParams] = useSearchParams(`encId=${encId}`);
    const [newLoading, setNewLoading] = useState(false);
    const [gpwardArr, setGpwardArr] = useState([]);
    const [form, validator] = useValidate(
        {
            block: { value: "", validate: "required" },
            encId: { value: "", validate: "required" },
        },
        { block: motherBlock, encId: encId }
    );
    const queryClient = useQueryClient();
    const { error: newError, data: newData } = useQuery(["posting-area", encId], () => fetcher(`/posting-area?${searchNewParams}`), { enabled: searchNewParams ? true : false });
    const handleBack = () => setPostingAreaShow(0);
    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = () => {
        if (!validator.validate()) return;
        setNewLoading(true);
        const data = validator.generalize();
        mutate(
            { url: "/posting-area-add", body: { data: data, gpwardArr: gpwardArr } },
            {
                onSuccess(data, variables, context) {
                    setNewLoading(false);
                    if (gpwardArr.length > 0) {
                        toast.success("AREA SUCCESSFULLY ADDED");
                    } else {
                        toast.error("SELECT AREA PROPERLY");
                    }
                    setGpwardArr([]);
                    validator.reset();
                    queryClient.invalidateQueries(["posting-area", encId]);
                },
                onError(error, variables, context) {
                    setNewLoading(false);
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };

    const handleDelete = (gp_ward_code) => {
        mutate(
            { url: "/posting-area-delete", body: { encId: encId, gp_ward_code: gp_ward_code } },
            {
                onSuccess(data, variables, context) {
                    toast.success("AREA SUCCESSFULLY REMOVED");
                    validator.reset();
                    queryClient.invalidateQueries(["posting-area", encId]);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };


    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            <div className="card datatable-box mb-4">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-4">
                            <button type="button" className="btn btn btn-danger" onClick={() => handleBack()}>
                                <i className="fa-solid fa-arrow-left"></i> BACK
                            </button>
                        </div>
                        <div className="col-md-8" style={{ fontSize: "20px" }}>
                            <b>
                                <i
                                    className="fa-solid fa-user-tie"
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "8px",
                                        borderRadius: "19px",
                                        color: "black",
                                        marginRight: "7px",
                                    }}
                                ></i>
                            </b>
                            {newData && newData.rows[0].fullname} ({newData && newData.rows[0].employee_id})
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {newError && <ErrorAlert error={newError} />}

                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <form autoComplete="off">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className="form-control-label" htmlFor="amount">
                                                    Name of Block/Municipality/Corporation
                                                </label>
                                                <BMCNameSelect
                                                    className={`form-select`}
                                                    id="block"
                                                    name="block"
                                                    required={form.block.required}
                                                    value={form.block.value}
                                                    onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                                                    subDivision={user?.subDivision}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="form-control-label" htmlFor="amount">
                                                    GP/Ward
                                                </label>
                                                {form.block.value && <MultiSelect block={form.block.value} setGpwardArr={setGpwardArr} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="form-group">
                                            <div className="d-grid d-md-flex justify-content-md-end">
                                                <button type="button" className="btn btn-sm btn-success" onClick={() => handleSubmit()}>
                                                    {newLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} ADD MORE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    {newData && (
                                        <>
                                            <div style={{ overflow: "auto" }} className="table-container">
                                                <table className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>SL No.</th>
                                                            <th>GP/WARD</th>
                                                            <th>Block/Municipality/Corporation</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {newData.rows[0].gp_tagged == 1 &&
                                                            newData.rows?.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td  style={wrapStyle}>{index + 1}</td>
                                                                        <td  style={wrapStyle}>{item.gp_ward_name}</td>
                                                                        <td  style={wrapStyle}>{item.block_mun_name}</td>
                                                                        <td  style={wrapStyle}>
                                                                            <button
                                                                                type="button"
                                                                                className="btn"
                                                                                onClick={() => {
                                                                                    const confirmBox = window.confirm("ARE YOU SURE WANT TO REMOVE AREA?");
                                                                                    if (confirmBox === true) {
                                                                                        handleDelete(item.gp_ward_code);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <i className="fa-solid fa-trash-can" style={{ color: "rgb(239 13 13)" }}></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default PostingAreaAllotment;
