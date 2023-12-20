import React, { useState } from "react";
import { useValidate } from "../../hooks";
import { fetcher } from "../../utils";
// import { useNavigate } from "react-router";
import ReverseCaf from "./ReverseCaf";
import { useMutation } from "@tanstack/react-query";

const EDistrictEntry = () => {
    const [ssinDetails, setSsinDetails] = useState({ data: null, error: null, loading: false });

    const [form, validator] = useValidate({
        radiostacked: { value: "regno", validate: "required" },
        ssin_reg: { value: "", validate: "required" },
    });

    // const navigate = useNavigate();
    const [cancelButton, setCancelButton] = useState(true);

    const clearHandler = () => {
        setSsinDetails({ data: null, error: null, loading: false });
        validator.setState((state) => {
            state.ssin_reg.value = "";
            state.ssin_reg.error = null;
            return { ...state };
        });
        setCancelButton(true);
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
    const { mutate: eDistrict ,data } = useMutation(() => fetcher("/get-beneficiary-by-ssin-reg?textValue=" + form.ssin_reg.value + "&radioValue=" + form.radiostacked.value));


    const checkData = async (e) => {
        try {
            e.preventDefault();
            if (!validator.validate()) return false;
            setSsinDetails({ data: null, loading: true });
            eDistrict(e, {
                onSuccess(data, variables, context) {
                   console.log(data)
                },
                onError(error, variables, context) {
                  
                },
            });
 
        } catch (error) {
            validator.setError({ ssin_reg: [error.message] });
            setSsinDetails({ data: null, loading: false });
        }
    };

    return (
        <>

        {data ? (
            <ReverseCaf applicationId={data?.id} type={data?.type} workerType={data?.workerType}/>
        ) : (
            <div className="card datatable-box">
            <form noValidate>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-2">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                Select Search Type
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
                                SSIN / Registration Number
                            </label>

                            <input
                                placeholder="Enter SSIN / registration number"
                                className={`form-control ${form.ssin_reg.error && "is-invalid"}`}
                                type="text"
                                name="ssin_reg"
                                id="ssin_reg"
                                value={form.ssin_reg.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                            />

                            <label className="invalid-feedback" htmlFor="ssin_reg">
                                {form.ssin_reg.error}
                            </label>
                        </div>
                    </div>
                </div>
            </form>
            <div className="card-footer">
                <div className="d-grid  d-md-flex justify-content-md-end gap-2">
                    <button className="btn btn-primary btn-sm btn-primary" onClick={checkData} disabled={ssinDetails.data}>
                        Click
                    </button>

                    <button className="btn btn-primary btn-sm btn-danger" onClick={clearHandler} disabled={cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        )}
           
            
        </>
    );
};

export default EDistrictEntry;
