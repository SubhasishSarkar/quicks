import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useValidate } from "../../../hooks";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import NoDataFound from "../../../components/list/NoDataFound";
import Pagination from "../../../components/Pagination";
import { fetcher, updater } from "../../../utils";
import { toast } from "react-toastify";

const PassbookDateManage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "PF Passbook Date Management", url: "" }));
    }, []);

    const [searchParams, setSearchParams] = useSearchParams();

    const [form, validator] = useValidate({
        start_date: { value: "", validate: "required" },
        end_date: { value: "", validate: "required" },
        passbook_updation_type: { value: "", validate: "required" },
        passbook_updation_upto: { value: "", validate: "required" },
    });
    const queryClient = useQueryClient();
    const { error, data, isFetching } = useQuery(["ppu-date-management"], () => fetcher(`/ppu-date-management`));

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleReset = (e) => {
        e.preventDefault();
        validator.reset();
        setSearchParams();
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();

        mutate(
            { url: `/ppu-date-management-post`, body: { data } },
            {
                onSuccess(data) {
                    toast.success(data.message);
                    validator.reset();
                    queryClient.invalidateQueries();
                },
                onError(error) {
                    toast.error(error.message);
                    validator.setError(error.message);
                },
            }
        );
    };
    return (
        <>
            {error && <ErrorAlert error={error} />}
            <form noValidate onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor="passbook_updation_type" className="form-control-label">
                                    Type Of Passbook Updation {form.passbook_updation_type.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    className={`form-select  ${form.passbook_updation_type.error && "is-invalid"}`}
                                    id="passbook_updation_type"
                                    name="passbook_updation_type"
                                    required={form.passbook_updation_type.required}
                                    value={form.passbook_updation_type.value}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                >
                                    <option value="0">Select Type Of Passbook Updation</option>
                                    <option value="1">With Duare Sarkar</option>
                                    <option value="2">Without Duare Sarkar</option>
                                </select>

                                <div className="invalid-feedback">{form.passbook_updation_upto.error}</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="passbook_updation_upto" className="form-control-label">
                                    Type Of Passbook Updation Upto Date {form.passbook_updation_upto.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    className={`form-select  ${form.passbook_updation_upto.error && "is-invalid"}`}
                                    id="passbook_updation_upto"
                                    name="passbook_updation_upto"
                                    required={form.passbook_updation_upto.required}
                                    value={form.passbook_updation_upto.value}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                >
                                    <option value="0">Select Passbook Updation Date</option>
                                    {data?.yearModYear?.map((item, index) => {
                                        return (
                                            <option value={item} key={index}>
                                                {item}
                                            </option>
                                        );
                                    })}
                                </select>

                                <div className="invalid-feedback">{form.passbook_updation_upto.error}</div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="start_date">
                                        Effective Start Date {form.start_date.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        className={`form-control ${form.start_date.error && "is-invalid"}`}
                                        value={form.start_date.value}
                                        required={form.start_date.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.start_date.error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-control-label" htmlFor="end_date">
                                        Effective End Date {form.end_date.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        className={`form-control ${form.end_date.error && "is-invalid"}`}
                                        value={form.end_date.value}
                                        required={form.end_date.required}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.end_date.error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                <i className="fa-solid fa-user-lock"></i> {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "ADD"}
                            </button>
                        </div>
                        <div className="btn-group me-2 mb-2">
                            <button className="btn btn-primary btn-sm" onClick={handleReset}>
                                <i className="fa-solid fa-backward"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <br />

            <div className="card">
                <div className="card-body">
                    {isFetching && <LoadingSpinner />}
                    {data &&
                        (data?.data_Set?.length === 0 ? (
                            <NoDataFound />
                        ) : (
                            <>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>SL No</th>
                                                        <th>Passbook Updation Type</th>
                                                        <th>Passbook Updation Upto Date</th>
                                                        <th>Effective Start Date</th>
                                                        <th>Effective End Date</th>
                                                        <th>Status</th>
                                                        <th>Updated Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.data_Set?.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.passbook_updation_type_name}</td>
                                                                <td>{item.passbook_updation_upto_date}</td>
                                                                <td>{item.passbook_start_date}</td>
                                                                <td>{item.passbook_end_date}</td>
                                                                <td>{item.active_status == "1" ? "ACTIVE" : "INACTIVE"}</td>
                                                                <td>{item.updated_on}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}

                    {data && data?.data_Set?.data?.length > 0 && <Pagination data={data?.data_Set} onLimitChange={handleLimit} limit={searchParams.get("limit")} />}
                </div>
            </div>
        </>
    );
};

export default PassbookDateManage;
