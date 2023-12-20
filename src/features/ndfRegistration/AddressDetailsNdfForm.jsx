import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DistrictSelect from "../../components/select/DistrictSelect";
import { useSearchParams } from "react-router-dom";
import StateSelect from "../../components/select/StateSelect";
import { disableQuery } from "../../data";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SubDivSelect from "../../components/select/SubDivSelect";
import BMCSelect from "../../components/select/BMCSelect.";
import BMCNameSelect from "../../components/select/BMCNameSelect";
import GPWardSelect from "../../components/select/GPWardSelect";
import { fetcher, updater } from "../../utils";
import AsyncSelect from "../../components/select/AsyncSelect";
import PostOfficeSelect from "../../components/select/PostOfficeSelect";
import PoliceStationSelect from "../../components/select/PoliceStationSelect";
import LoadingOverlay from "../../components/LoadingOverlay";

const AddressDetailsNdfForm = ({ nextStep, prevStep }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");
    const user = useSelector((state) => state.user.user);

    const { isFetching, data } = useQuery(["caf-registration-preview", "address-details", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=address-details`), {
        ...disableQuery,
        enabled: application_id ? true : false,
    });

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const [form, validator] = useValidate(
        {
            permanent_district: { value: user?.district, validate: "required" },
            permanent_sub_division: { value: user?.subDivision, validate: "required" },
            permanent_bmc_type: { value: "", validate: "required" },
            permanent_bmc_name: { value: "", validate: "required" },
            permanent_gp_ward: { value: "", validate: "required" },
            permanent_pincode: { value: "", validate: "required" },
            permanent_post_office: { value: "", validate: "required" },
            permanent_police_station: { value: "", validate: "required" },
            permanent_address_line: { value: "", validate: "required" },

            same: { value: false, validate: "" },

            present_district: { value: "", validate: "required" },
            present_sub_division: { value: "", validate: "required" },
            present_bmc_type: { value: "", validate: "required" },
            present_bmc_name: { value: "", validate: "required" },
            present_gp_ward: { value: "", validate: "required" },
            present_pincode: { value: "", validate: "required" },
            present_post_office: { value: "", validate: "required" },
            present_police_station: { value: "", validate: "required" },
            present_address_line: { value: "", validate: "required" },
        },
        data,
        true
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            // eslint-disable-next-line default-case
            switch (name) {
                case "same":
                    setState((prev) => {
                        if (value) {
                            prev.present_district.value = prev.permanent_district.value;
                            prev.present_sub_division.value = prev.permanent_sub_division.value;
                            prev.present_bmc_type.value = prev.permanent_bmc_type.value;
                            prev.present_bmc_name.value = prev.permanent_bmc_name.value;
                            prev.present_gp_ward.value = prev.permanent_gp_ward.value;
                            prev.present_pincode.value = prev.permanent_pincode.value;
                            prev.present_post_office.value = prev.permanent_post_office.value;
                            prev.present_police_station.value = prev.permanent_police_station.value;
                            prev.present_address_line.value = prev.permanent_address_line.value;
                        } else {
                            prev.present_district.value = "";
                            prev.present_sub_division.value = "";
                            prev.present_bmc_type.value = "";
                            prev.present_bmc_name.value = "";
                            prev.present_gp_ward.value = "";
                            prev.present_pincode.value = "";
                            prev.present_post_office.value = "";
                            prev.present_police_station.value = "";
                            prev.present_address_line.value = "";
                        }
                        return { ...prev };
                    });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        if (application_id) {
            const data = validator.generalize();
            mutate(
                { url: "/caf-registration?type=address-details&id=" + application_id, body: data },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        nextStep(2);
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };
    useEffect(() => {
        return () => {
            query.removeQueries(["caf-registration-preview", "address-details", application_id], {
                exact: true,
            });
        };
    }, [application_id, query]);
    return (
        <>
            <div className="card datatable-box mb-4">
                <div className="card-body" style={{ position: "relative", overflow: "hidden" }}>
                    {isFetching && <LoadingOverlay />}
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <h6>Permanent Address</h6>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label htmlFor="state" className="form-label">
                                    State {<span className="text-danger">*</span>}
                                </label>
                                <StateSelect value="1" disabled className={`form-select`} id="state" name="state" />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_district" className="form-label">
                                    District {form.permanent_district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.permanent_district.error && "is-invalid"}`}
                                    id="permanent_district"
                                    name="permanent_district"
                                    // disabled
                                    // required={form.permanent_district.required}
                                    value={form.permanent_district.value}
                                    onChange={(e) => handleChange({ name: "permanent_district", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.permanent_district.error}</div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="permanent_sub_division" className="form-label">
                                    Sub Division {form.permanent_sub_division.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.permanent_sub_division.error && "is-invalid"}`}
                                    id="permanent_sub_division"
                                    name="permanent_sub_division"
                                    // disabled
                                    // required={form.permanent_sub_division.required}
                                    value={form.permanent_sub_division.value}
                                    onChange={(e) => handleChange({ name: "permanent_sub_division", value: e.currentTarget.value })}
                                    districtCode={form.permanent_district.value}
                                />
                                <div className="invalid-feedback">{form.permanent_sub_division.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_bmc_type" className="form-label">
                                    Block/Muncipality/Corporation {form.permanent_bmc_type.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCSelect
                                    className={`form-select ${form.permanent_bmc_type.error && "is-invalid"}`}
                                    id="permanent_bmc_type"
                                    name="permanent_bmc_type"
                                    // required={form.permanent_bmc_type.required}
                                    value={form.permanent_bmc_type.value}
                                    onChange={(e) => handleChange({ name: "permanent_bmc_type", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.permanent_bmc_type.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_bmc_name" className="form-label">
                                    Name of Block/Municipality/Corporation {form.permanent_bmc_name.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.permanent_bmc_name.error && "is-invalid"}`}
                                    id="permanent_bmc_name"
                                    name="permanent_bmc_name"
                                    // required={form.permanent_bmc_name.required}
                                    value={form.permanent_bmc_name.value}
                                    onChange={(e) => handleChange({ name: "permanent_bmc_name", value: e.currentTarget.value })}
                                    subDivision={form.permanent_sub_division.value}
                                />
                                <div className="invalid-feedback">{form.permanent_bmc_name.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_gp_ward" className="form-label">
                                    GP / Ward {form.permanent_gp_ward.required && <span className="text-danger">*</span>}
                                </label>
                                <GPWardSelect
                                    className={`form-select ${form.permanent_gp_ward.error && "is-invalid"}`}
                                    id="permanent_gp_ward"
                                    name="permanent_gp_ward"
                                    // required={form.permanent_gp_ward.required}
                                    value={form.permanent_gp_ward.value}
                                    onChange={(e) => handleChange({ name: "permanent_gp_ward", value: e.currentTarget.value })}
                                    block={form.permanent_bmc_name.value}
                                />
                                <div className="invalid-feedback">{form.permanent_gp_ward.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_pincode" className="form-label">
                                    Pin Code {<span className="text-danger">*</span>}
                                </label>

                                <AsyncSelect
                                    className={form.permanent_pincode.error && "is-invalid"}
                                    loadOptions={async (value) => {
                                        try {
                                            const data = await fetcher("/pincode-suggestion?pincode=" + value);
                                            return data.map((item) => ({ value: `${item.value} ${item.district_state}`, key: item.value }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }}
                                    id="permanent_pincode"
                                    value={form.permanent_pincode.value}
                                    onChange={(value) => handleChange({ name: "permanent_pincode", value: value })}
                                />

                                <div className="invalid-feedback">{form.permanent_pincode.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_post_office" className="form-label">
                                    Post Office {<span className="text-danger">*</span>}
                                </label>
                                <PostOfficeSelect
                                    className={`form-select ${form.permanent_post_office.error && "is-invalid"}`}
                                    id="permanent_post_office"
                                    name="permanent_post_office"
                                    // required={form.permanent_post_office.required}
                                    value={form.permanent_post_office.value}
                                    onChange={(e) => handleChange({ name: "permanent_post_office", value: e.currentTarget.value })}
                                    pincode={form.permanent_pincode.value}
                                />
                                <div className="invalid-feedback">{form.permanent_post_office.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="permanent_police_station" className="form-label">
                                    Police Station {<span className="text-danger">*</span>}
                                </label>
                                <PoliceStationSelect
                                    className={`form-select ${form.permanent_police_station.error && "is-invalid"}`}
                                    id="permanent_police_station"
                                    name="permanent_police_station"
                                    // required={form.permanent_police_station.required}
                                    value={form.permanent_police_station.value}
                                    onChange={(e) => handleChange({ name: "permanent_police_station", value: e.currentTarget.value })}
                                    district={form.permanent_district.value}
                                />
                                <div className="invalid-feedback">{form.permanent_police_station.error}</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="permanent_address_line" className="form-label">
                                    House No./Name of the Village/Street/Road {<span className="text-danger">*</span>}
                                </label>
                                <textarea
                                    className={`form-select ${form.permanent_address_line.error && "is-invalid"}`}
                                    id="permanent_address_line"
                                    name="permanent_address_line"
                                    // required={form.permanent_address_line.required}
                                    value={form.permanent_address_line.value}
                                    onChange={(e) => handleChange({ name: "permanent_address_line", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.permanent_address_line.error}</div>
                            </div>
                        </div>
                        <h6 className="mt-4">Present Address</h6>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={(e) => handleChange({ name: "same", value: e.currentTarget.checked })} />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Same as Permanent Address
                            </label>
                        </div>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label htmlFor="state" className="form-label">
                                    State {<span className="text-danger">*</span>}
                                </label>
                                <StateSelect value="1" disabled className={`form-select`} id="" name="" />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_district" className="form-label">
                                    District {form.present_district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.present_district.error && "is-invalid"}`}
                                    id="present_district"
                                    name="present_district"
                                    // disabled
                                    // required={form.present_district.required}
                                    value={form.present_district.value}
                                    onChange={(e) => handleChange({ name: "present_district", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.present_district.error}</div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="present_sub_division" className="form-label">
                                    Sub Division {form.present_sub_division.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.present_sub_division.error && "is-invalid"}`}
                                    id="present_sub_division"
                                    name="present_sub_division"
                                    // disabled
                                    // required={form.present_sub_division.required}
                                    value={form.present_sub_division.value}
                                    onChange={(e) => handleChange({ name: "present_sub_division", value: e.currentTarget.value })}
                                    districtCode={form.present_district.value}
                                />
                                <div className="invalid-feedback">{form.present_sub_division.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_bmc_type" className="form-label">
                                    Block/Muncipality/Corporation {form.present_bmc_type.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCSelect
                                    className={`form-select ${form.present_bmc_type.error && "is-invalid"}`}
                                    id="present_bmc_type"
                                    name="present_bmc_type"
                                    // required={form.present_bmc_type.required}
                                    value={form.present_bmc_type.value}
                                    onChange={(e) => handleChange({ name: "present_bmc_type", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.present_bmc_type.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_bmc_name" className="form-label">
                                    Name of Block/Municipality/Corporation {form.present_bmc_name.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.present_bmc_name.error && "is-invalid"}`}
                                    id="present_bmc_name"
                                    name="present_bmc_name"
                                    // required={form.present_bmc_name.required}
                                    value={form.present_bmc_name.value}
                                    onChange={(e) => handleChange({ name: "present_bmc_name", value: e.currentTarget.value })}
                                    subDivision={form.present_sub_division.value}
                                />
                                <div className="invalid-feedback">{form.present_bmc_name.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_gp_ward" className="form-label">
                                    GP / Ward {form.present_gp_ward.required && <span className="text-danger">*</span>}
                                </label>
                                <GPWardSelect
                                    className={`form-select ${form.present_gp_ward.error && "is-invalid"}`}
                                    id="present_gp_ward"
                                    name="present_gp_ward"
                                    // required={form.present_gp_ward.required}
                                    value={form.present_gp_ward.value}
                                    onChange={(e) => handleChange({ name: "present_gp_ward", value: e.currentTarget.value })}
                                    block={form.present_bmc_name.value}
                                />
                                <div className="invalid-feedback">{form.present_gp_ward.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_pincode" className="form-label">
                                    Pin Code {<span className="text-danger">*</span>}
                                </label>

                                <AsyncSelect
                                    className={form.present_pincode.error && "is-invalid"}
                                    loadOptions={async (value) => {
                                        try {
                                            const data = await fetcher("/pincode-suggestion?pincode=" + value);
                                            return data.map((item) => ({ value: `${item.value} ${item.district_state}`, key: item.value }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }}
                                    id="present_pincode"
                                    value={form.present_pincode.value}
                                    onChange={(value) => handleChange({ name: "present_pincode", value: value })}
                                />

                                <div className="invalid-feedback">{form.present_pincode.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_post_office" className="form-label">
                                    Post Office {<span className="text-danger">*</span>}
                                </label>
                                <PostOfficeSelect
                                    className={`form-select ${form.present_post_office.error && "is-invalid"}`}
                                    id="present_post_office"
                                    name="present_post_office"
                                    // required={form.present_post_office.required}
                                    value={form.present_post_office.value}
                                    onChange={(e) => handleChange({ name: "present_post_office", value: e.currentTarget.value })}
                                    pincode={form.present_pincode.value}
                                />
                                <div className="invalid-feedback">{form.present_post_office.error}</div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="present_police_station" className="form-label">
                                    Police Station {<span className="text-danger">*</span>}
                                </label>
                                <PoliceStationSelect
                                    className={`form-select ${form.present_police_station.error && "is-invalid"}`}
                                    id="present_police_station"
                                    name="present_police_station"
                                    // required={form.present_police_station.required}
                                    value={form.present_police_station.value}
                                    onChange={(e) => handleChange({ name: "present_police_station", value: e.currentTarget.value })}
                                    district={form.present_district.value}
                                />
                                <div className="invalid-feedback">{form.present_police_station.error}</div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="present_address_line" className="form-label">
                                    House No./Name of the Village/Street/Road {<span className="text-danger">*</span>}
                                </label>
                                <textarea
                                    className={`form-select ${form.present_address_line.error && "is-invalid"}`}
                                    id="present_address_line"
                                    name="present_address_line"
                                    // required={form.present_address_line.required}
                                    value={form.present_address_line.value}
                                    onChange={(e) => handleChange({ name: "present_address_line", value: e.currentTarget.value })}
                                />
                                <div className="invalid-feedback">{form.present_address_line.error}</div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success btn-sm mt-3" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Save Draft & Proceed"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddressDetailsNdfForm;
