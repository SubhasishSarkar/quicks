import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useValidate } from "../../../hooks";
import { fetcher, updater } from "../../../utils";
import { useNavigate } from "react-router";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import ConfirmationModal from "../../../components/ConfirmationModal";

const CAFUpdation = () => {
    const [ssinDetails, setSsinDetails] = useState({ data: null, error: null, loading: false });
    const [form, validator] = useValidate({
        radiostacked: { value: "regno", validate: "required" },
        ssin_reg: { value: "", validate: "required" },
    });

    const navigate = useNavigate();
    const [deathAlive, setDeathAlive] = useState("");
    const [deathAliveBox, setDeathAliveBox] = useState(false);
    const [buttonShowLoading, setButtonShowLoading] = useState(true);
    const [cancelButton, setCancelButton] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [title, setTitle] = useState("");

    const clearHandler = () => {
        setButtonShowLoading(true);
        setSsinDetails({ data: null, error: null, loading: false });
        validator.setState((state) => {
            state.ssin_reg.value = "";
            state.ssin_reg.error = null;
            return { ...state };
        });
        setCancelButton(true);
        setDeathAliveBox(false);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "ssin_reg":
                    if (value) {
                        setCancelButton(false);
                    }
                    break;
                case "radiostacked":
                    clearHandler();
                    break;
            }
        });
    };
    const handleChangeDeathAlive = (ev) => {
        setDeathAlive(ev.value);
    };

    const handleConfirm = () => {
        setOpenConfirm(false);
        submitData();
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const checkData = async (radioVal) => {
        console.log(radioVal);
        if (radioVal === "ssin" && form.ssin_reg?.value.length != 12) {
            validator.setError({ ssin_reg: ["Please enter 12 digit valid ssin."] });
        } else if (radioVal === "regno" && !form.ssin_reg?.value) {
            validator.setError({ ssin_reg: ["Please enter registration number."] });
        } else {
            try {
                setSsinDetails({ data: null, loading: true });
                const a = await fetcher("/checkbacklogdata-name-withssin-ajax?textvalue=" + form.ssin_reg.value + "&radiovalue=" + form.radiostacked.value);
                // submitData();
                setDeathAliveBox(true);
                setSsinDetails({ data: a, error: false, loading: false });
                setButtonShowLoading(false);
            } catch (error) {
                validator.setError({ ssin_reg: [error.message] });
                setSsinDetails({ data: null, loading: false });
            }
        }
    };

    const submitData = () => {
        setCancelButton(true);
        const data = validator.generalize();
        mutate(
            { url: `/old-caf-registration`, body: data },
            {
                onSuccess(data, variables, context) {
                    if (deathAlive === "alive") {
                        navigate("/caf/registration?application_id=" + data.enc_application_id);
                    }
                    if (deathAlive === "death") {
                        navigate("/caf/nominee-update?application_id=" + data.enc_application_id + "&beneficiary_type=1");
                    }
                },
                onError(error, variables, context) {
                    setButtonShowLoading(true);
                    toast.error(error.message);
                    validator.setError(error.errors);
                },
            }
        );
    };

    const handleSubmit = () => {
        if (deathAlive === "") return toast.error("Please Select Beneficiary type Death or Alive");

        if (deathAlive.toLowerCase() === "alive") {
            setTitle("Are you sure this beneficiary is alive?");
            setOpenConfirm(true);
        }
        if (deathAlive === "death") {
            // navigate("/caf/nominee-update?application_id=" + dataEncId + "&beneficiary_type=1");
            setTitle("Are you sure this beneficiary is death?");
            setOpenConfirm(true);
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Registration/CAF Update", url: "" }));
    }, []);

    return (
        <>
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title={title} />}

            <div className="card datatable-box">
                <form noValidate>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Select Search Type {form.radiostacked.required && <span className="text-danger">*</span>}
                                </label>

                                <div className="form-check ">
                                    <input
                                        type="radio"
                                        value="ssin"
                                        checked={form.radiostacked.value == "ssin" ? true : false}
                                        className={`form-check-input`}
                                        id="radiostacked_ssin"
                                        name="radiostacked"
                                        onChange={() => handleChange({ name: "radiostacked", value: "ssin" })}
                                    />
                                    <label className="form-check-label" htmlFor="radiostacked">
                                        SSIN
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        value="regno"
                                        type="radio"
                                        checked={form.radiostacked.value == "regno" ? true : false}
                                        className={`form-check-input `}
                                        id="radiostacked_reg"
                                        name="radiostacked"
                                        onChange={() => handleChange({ name: "radiostacked", value: "regno" })}
                                    />
                                    <label className="form-check-label" htmlFor="radiostacked">
                                        Registration No.
                                    </label>
                                    <div className="invalid-feedback">More example invalid feedback text</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    SSIN / Registration Number {form.ssin_reg.required && <span className="text-danger">*</span>}
                                </label>

                                <div className="row">
                                    <div className="col-md-10">
                                        <input
                                            placeholder="Enter SSIN / registration number"
                                            className={`form-control ${form.ssin_reg.error && "is-invalid"}`}
                                            type="text"
                                            name="ssin_reg"
                                            id="ssin_reg"
                                            value={form.ssin_reg.value}
                                            onChange={(e) => handleChange(e.currentTarget)}
                                            // onBlur={async (e) => {
                                            //     try {
                                            //         setSsinDetails({ data: null, loading: true });
                                            //         const a = await fetcher("/checkbacklogdata-name-withssin-ajax?textvalue=" + e.currentTarget.value + "&radiovalue=" + form.radiostacked.value);
                                            //         setSsinDetails({ data: a, error: false, loading: false });
                                            //         setButtonShowLoading(false);
                                            //     } catch (error) {
                                            //         validator.setError({ ssin_reg: [error.message] });
                                            //         setSsinDetails({ data: null, loading: false });
                                            //     }
                                            // }}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        {ssinDetails.loading ? (
                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            <button type="button" className="btn btn-success btn-sm" onClick={() => checkData(form.radiostacked.value)} disabled={ssinDetails.data}>
                                                Check
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <label className="invalid-feedback" htmlFor="ssin_reg">
                                    {form.ssin_reg.error}
                                </label>

                                {ssinDetails.data != null && (
                                    <div className="row" style={{ fontSize: "12px" }}>
                                        <div className="col-md-12">
                                            <span style={{ color: "#0879b3", fontWeight: "600" }}>
                                                {ssinDetails.data.name}, C/O : {ssinDetails.data.father_name}, DOB : {moment(ssinDetails.data.dob).format("DD-MM-YYYY")}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                {deathAliveBox && (
                                    <>
                                        <label htmlFor="exampleInputEmail1" className="form-label">
                                            Please Select Beneficiary type Death or Alive
                                        </label>

                                        <select aria-label="Default select example" className={`form-select`} onChange={(e) => handleChangeDeathAlive({ value: e.currentTarget.value })}>
                                            <option value="">Select One</option>
                                            <option value="death">Death</option>
                                            <option value="alive">Alive</option>
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                <div className="card-footer">
                    <div className="d-grid  d-md-flex justify-content-md-end gap-2">
                        {/* <button className="btn btn-primary btn-sm btn-primary" onClick={checkData} disabled={ssinDetails.data}>
                            Click
                        </button> */}
                        <button className="btn btn-success btn-sm " onClick={handleSubmit} disabled={isLoading || buttonShowLoading}>
                            {isLoading ? "Loading..." : "Save Draft & Proceed"}
                        </button>
                        <button className="btn btn-primary btn-sm btn-danger" onClick={clearHandler} disabled={cancelButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CAFUpdation;
