import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import ActionModalPage from "../../../../features/RectificationOfData/ActionModalPage";
import { useValidate } from "../../../../hooks";
import { fetcher, updater } from "../../../../utils";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";

const WorkerTypeCorrectionBySSIN = () => {
    const [form, validator] = useValidate({
        ssin: { value: "", validate: "required|number|length:12" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching, error } = useQuery(["check-worker-correction-for-ssin", searchQuery], () => fetcher("/check-worker-correction-for-ssin?" + searchQuery), { enabled: searchQuery ? true : false });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchQuery(urlSearchParams.toString());
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();
    const [loading, setLoading] = useState();
    const { mutate: checkClaim } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const showModal = (id, isActive, SSIN, name) => {
        const body = { application_id: id, ssin: SSIN };
        setLoading(id);
        checkClaim(
            { url: `/check-claim-for-worker-rectification`, body: body },
            {
                onSuccess(data, variables, context) {
                    setShow(true);
                    setEncId(id);
                    setIsActive(isActive);
                    setSsin(SSIN);
                    setBenName(name);
                    setLoading();
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                    setLoading();
                },
            }
        );
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Worker Type Correction By SSIN", url: "" }));
    }, []);

    const clear = () => {
        form.ssin.value = "";
        validator.reset();
        setSearchQuery();
    };

    return (
        <>
            <div className="card datatable-box ">
                <div className="card-body mb-2">
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
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
                                    disabled={data ? true : false}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.ssin.error}
                                </div>
                            </div>
                            <div className="col-md-4 mt-4">
                                <div className="form-group">
                                    <button className="btn btn-sm btn-success " type="submit" disabled={isFetching || data}>
                                        {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                        Search
                                    </button>
                                    <button className="btn btn-sm btn-warning " type="button" onClick={clear} style={{ marginLeft: "5px" }}>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {data && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">SL No.</th>
                                        <th scope="col">SSIN</th>
                                        <th scope="col">Registration Date</th>
                                        <th scope="col">Block</th>
                                        <th scope="col">Gp/Ward</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key="">
                                        <td>1</td>
                                        <td>{data.ssin}</td>
                                        <td>{data.registrationDate}</td>
                                        <td>{data.blockName}</td>
                                        <td>{data.gpName}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-success"
                                                style={{ textDecoration: "none", color: "#fff" }}
                                                onClick={() => showModal(data.enc_application_id, data.isActive, data.ssin, data.name)}
                                                disabled={loading === data.enc_application_id ? true : false}
                                            >
                                                {loading === data.enc_application_id && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {error && <ErrorAlert error={error} />}
            <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} actionTabType="workerType" handleClose={handleClose} />
        </>
    );
};

export default WorkerTypeCorrectionBySSIN;
