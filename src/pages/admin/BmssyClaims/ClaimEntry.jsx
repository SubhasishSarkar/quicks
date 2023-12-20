import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ErrorAlert from "../../../components/list/ErrorAlert";
import DeathClaimEntry from "../../../features/bmssyClaims/death/DeathClaimEntry";
import DisabilityClaimEntry from "../../../features/bmssyClaims/disability/DisabilityClaimEntry";
import { useValidate } from "../../../hooks";
import { fetcher } from "../../../utils";
import PfCafByBeneficiary from "../../../features/bmssyClaims/pf/CAF/SLO/PfCafByBeneficiary";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import PfClaimEntry from "../../../features/bmssyClaims/pf/PfClaimEntry";

const ClaimEntry = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isFetching, error } = useQuery(["check-ssin-or-reg-for-claim", searchQuery], () => fetcher("/check-ssin-or-reg-for-claim?" + searchQuery), { retry: false, refetchOnWindowFocus: false, enabled: searchQuery ? true : false });

    const [form, validator] = useValidate({
        radioStacked: { value: "", validate: "required" },
        radioClaim: { value: "", validate: "required" },
        claim_text: { value: "", validate: "required" },
        pfClaimBy: { value: "", validate: "" },
    });

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "radioStacked":
                    setState((state) => {
                        if (value === "ssin") {
                            state.claim_text.validate = "required|number|length:12";
                        } else {
                            state.claim_text.validate = "required";
                        }
                        return { ...state };
                    });
                    break;
                case "radioClaim":
                    setState((state) => {
                        if (value === "pf") {
                            state.pfClaimBy.required = true;
                            state.pfClaimBy.validate = "required";
                        } else {
                            state.pfClaimBy.required = false;
                            state.pfClaimBy.validate = "";
                            state.pfClaimBy.value = "";
                            state.pfClaimBy.error = null;
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchQuery(urlSearchParams.toString());
    };

    const cardStyle = {
        fontSize: "17px",
        letterSpacing: "0.6px",
    };

    const pfCafNoClick = () => {
        window.location.reload(true);
    };

    const [pfCafYes, setPfCafYes] = useState(true);
    const pfCafYesClick = () => {
        setPfCafYes(false);
    };
    const cardClass = {
        marginRight: "0.3rem",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "rgb(242 241 241)",
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Claim Entry", url: "" }));
    }, []);

    return (
        <>
            <>
                <div className="card datatable-box mb-4">
                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                        <div className="card-body" style={cardStyle}>
                            <div className="row">
                                <div className="card-group">
                                    <div className="card" style={cardClass}>
                                        <div className="card-body">
                                            <div className="card-text styledP">
                                                <div className="form-check mb-2">
                                                    <input
                                                        type="radio"
                                                        value="ssin"
                                                        checked={form.radioStacked.value == "ssin" ? true : false}
                                                        className={`form-check-input ${form.radioStacked.error && "is-invalid"}`}
                                                        id="radioStackedSsin"
                                                        name="radioStacked"
                                                        onChange={() => handleChange({ name: "radioStacked", value: "ssin" })}
                                                        disabled={data ? true : false}
                                                    />
                                                    <label className="form-check-label" htmlFor="radioStackedSsin">
                                                        <h6 className="text-dark">SSI Number</h6>
                                                    </label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input
                                                        value="regNo"
                                                        type="radio"
                                                        checked={form.radioStacked.value == "regNo" ? true : false}
                                                        className={`form-check-input ${form.radioStacked.error && "is-invalid"}`}
                                                        id="radioStackedReg"
                                                        name="radioStacked"
                                                        onChange={() => handleChange({ name: "radioStacked", value: "regNo" })}
                                                        disabled={data ? true : false}
                                                    />
                                                    <label className="form-check-label" htmlFor="radioStackedReg">
                                                        <h6 className="text-dark">Registration Number</h6>
                                                    </label>
                                                    <div className="invalid-feedback">{form.radioStacked.error}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card" style={cardClass}>
                                        <div className="card-body">
                                            <div className="card-text styledP">
                                                <div className="form-check mb-2">
                                                    <input
                                                        type="radio"
                                                        value="death"
                                                        className={`form-check-input ${form.radioClaim.error && "is-invalid"}`}
                                                        id="radioClaimDeath"
                                                        name="radioClaim"
                                                        onChange={() => handleChange({ name: "radioClaim", value: "death" })}
                                                        checked={form.radioClaim.value == "death" ? true : false}
                                                        disabled={data ? true : false}
                                                    />
                                                    <label className="form-check-label" htmlFor="radioClaimDeath">
                                                        <h6 className="text-dark">DEATH</h6>
                                                    </label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input
                                                        value="pf"
                                                        type="radio"
                                                        className={`form-check-input  ${form.radioClaim.error && "is-invalid"}`}
                                                        id="radioClaimPf"
                                                        name="radioClaim"
                                                        onChange={() => handleChange({ name: "radioClaim", value: "pf" })}
                                                        checked={form.radioClaim.value == "pf" ? true : false}
                                                        disabled={data ? true : false}
                                                    />
                                                    <label className="form-check-label" htmlFor="radioClaimPf">
                                                        <h6 className="text-dark">PF</h6>
                                                    </label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input
                                                        value="disability"
                                                        type="radio"
                                                        className={`form-check-input  ${form.radioClaim.error && "is-invalid"}`}
                                                        id="radioClaimDisability"
                                                        name="radioClaim"
                                                        onChange={() => handleChange({ name: "radioClaim", value: "disability" })}
                                                        checked={form.radioClaim.value == "disability" ? true : false}
                                                        disabled={data ? true : false}
                                                    />
                                                    <label className="form-check-label" htmlFor="radioClaimDisability">
                                                        <h6 className="text-dark">DISABILITY</h6>
                                                    </label>
                                                    <div className="invalid-feedback">{form.radioClaim.error}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card" style={cardClass}>
                                        <div className="card-body">
                                            <div className="card-text styledP">
                                                <div className="form-check mb-2">
                                                    <input
                                                        type="radio"
                                                        value="pf_by_ben"
                                                        className={`form-check-input ${form.pfClaimBy.error && "is-invalid"}`}
                                                        id="pfClaimByBen"
                                                        name="pfClaimBy"
                                                        onChange={() => handleChange({ name: "pfClaimBy", value: "pf_by_ben" })}
                                                        disabled={data ? true : form.radioClaim.value === "pf" ? false : true}
                                                        checked={form.radioClaim.value === "pf" && form.pfClaimBy.value === "pf_by_ben"}
                                                    />
                                                    <label className="form-check-label" htmlFor="pfClaimByBen">
                                                        <h6 className="text-dark">PF Claim By Beneficiary</h6>
                                                    </label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input
                                                        value="pf_by_nom"
                                                        type="radio"
                                                        className={`form-check-input ${form.pfClaimBy.error && "is-invalid"}`}
                                                        id="pfClaimByNom"
                                                        name="pfClaimBy"
                                                        onChange={() => handleChange({ name: "pfClaimBy", value: "pf_by_nom" })}
                                                        disabled={data ? true : form.radioClaim.value === "pf" ? false : true}
                                                        checked={form.radioClaim.value === "pf" && form.pfClaimBy.value === "pf_by_nom"}
                                                    />
                                                    <label className="form-check-label" htmlFor="pfClaimByNom">
                                                        <h6 className="text-dark">PF Claim By Nominee</h6>
                                                    </label>
                                                    <div className="invalid-feedback">{form.pfClaimBy.error}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card" style={cardClass}>
                                        <div className="card-body">
                                            <div className="card-text styledP">
                                                <label className="form-control-label" htmlFor="claim_text">
                                                    Enter SSIN/Registration Number {form.claim_text.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${form.claim_text.error && "is-invalid"}`}
                                                    name="claim_text"
                                                    id="claim_text"
                                                    required={form.claim_text.required}
                                                    value={form.claim_text.value}
                                                    onChange={(e) => handleChange(e.currentTarget)}
                                                    disabled={data ? true : false}
                                                />
                                                <div className="invalid-feedback">{form.claim_text.error}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <div className="d-grid  d-md-flex justify-content-md-end">
                                        <button className="btn btn-success btn-sm" type="submit" disabled={isFetching || data}>
                                            {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {error && <ErrorAlert error={error} />}
                {data?.claimFor === "death" && <DeathClaimEntry data={data} />}
                {data?.claimFor === "disability" && <DisabilityClaimEntry data={data} />}
                {data?.claimFor === "pf" && <PfClaimEntry data={data} />}
                {data?.claimFor === "pf" && data?.pfCaf ? (
                    <>
                        {pfCafYes ? (
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title" style={{ fontFamily: "monospace", fontSize: "18px", letterSpacing: "1px" }}>
                                        CAF Not Updated Do you want to proceed :
                                        <button type="button" className="btn btn-primary" onClick={pfCafYesClick}>
                                            <i className="fa-solid fa-thumbs-up"></i> Yes
                                        </button>
                                        <button type="button" className="btn btn-danger" style={{ marginLeft: "5px" }} onClick={pfCafNoClick}>
                                            <i className="fa-solid fa-thumbs-down"></i> NO
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <PfCafByBeneficiary isBackLog={data?.isBackLog} ssin={data?.ssin} />
                        )}
                    </>
                ) : (
                    ""
                )}
            </>
        </>
    );
};

export default ClaimEntry;
