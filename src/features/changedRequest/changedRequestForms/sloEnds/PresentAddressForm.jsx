import React from "react";
import AsyncSelect from "../../../../components/select/AsyncSelect";
import BMCNameSelect from "../../../../components/select/BMCNameSelect";
import BMCSelect from "../../../../components/select/BMCSelect.";
import DistrictSelect from "../../../../components/select/DistrictSelect";
import GPWardSelect from "../../../../components/select/GPWardSelect";
import PoliceStationSelect from "../../../../components/select/PoliceStationSelect";
import PostOfficeSelect from "../../../../components/select/PostOfficeSelect";
import SubDivSelect from "../../../../components/select/SubDivSelect";
import { fetcher } from "../../../../utils";

const PresentAddressForm = ({ form, handleChange }) => {
    return (
        <>
            <div className="card mb-3">
                <div className="section_title">
                    <strong>Present Address</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="presentDistrict">
                                District {form.presentDistrict.required && <span className="text-danger">*</span>}
                            </label>
                            <DistrictSelect
                                className={`form-select ${form.presentDistrict.error && "is-invalid"}`}
                                id="presentDistrict"
                                name="presentDistrict"
                                value={form.presentDistrict.value}
                                onChange={(e) => {
                                    handleChange({ name: "presentDistrict", value: e.currentTarget.value });
                                }}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.presentDistrict.error}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="presentSubdivision">
                                Sub Division {form.presentSubdivision.required && <span className="text-danger">*</span>}
                            </label>
                            <SubDivSelect
                                className={`form-select ${form.presentSubdivision.error && "is-invalid"}`}
                                id="presentSubdivision"
                                name="presentSubdivision"
                                value={form.presentSubdivision.value}
                                onChange={(e) => {
                                    handleChange({ name: "presentSubdivision", value: e.currentTarget.value });
                                }}
                                districtCode={form.presentDistrict.value}
                            />
                            <div id="Feedback" className="invalid-feedback">
                                {form.presentSubdivision.error}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="presentBlock">
                                Block/Municipality/Corporation {form.presentBlock.required && <span className="text-danger">*</span>}
                            </label>
                            <BMCNameSelect
                                className={`form-select ${form.presentBlock.error && "is-invalid"}`}
                                id="presentBlock"
                                name="presentBlock"
                                required={form.presentBlock.required}
                                value={form.presentBlock.value}
                                onChange={(e) => handleChange({ name: "presentBlock", value: e.currentTarget.value })}
                                subDivision={form.presentSubdivision.value}
                            />

                            <div className="invalid-feedback">{form.presentBlock.error}</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="presentBlockType">
                                Block/Municipality/Corporation Type {form.presentBlockType.required && <span className="text-danger">*</span>}
                            </label>
                            <BMCSelect
                                className={`form-select ${form.presentBlockType.error && "is-invalid"}`}
                                id="presentBlockType"
                                name="presentBlockType"
                                required={form.presentBlockType.required}
                                value={form.presentBlockType.value}
                                onChange={(e) => handleChange({ name: "presentBlockType", value: e.currentTarget.value })}
                            />

                            <div className="invalid-feedback">{form.blockType.error}</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-control-label" htmlFor="presentGpWard">
                                Gp/Ward {form.presentGpWard.required && <span className="text-danger">*</span>}
                            </label>
                            <GPWardSelect
                                className={`form-select ${form.presentGpWard.error && "is-invalid"}`}
                                id="presentGpWard"
                                name="presentGpWard"
                                required={form.presentGpWard.required}
                                value={form.presentGpWard.value}
                                onChange={(e) => handleChange({ name: "presentGpWard", value: e.currentTarget.value })}
                                block={form.presentBlock.value}
                            />
                            <div className="invalid-feedback">{form.presentGpWard.error}</div>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="presentPincode" className="form-label">
                                Pin Code {form.presentPincode.required && <span className="text-danger">*</span>}
                            </label>

                            <AsyncSelect
                                className={form.presentPincode.error && "is-invalid"}
                                loadOptions={async (value) => {
                                    try {
                                        const data = await fetcher("/pincode-suggestion?pincode=" + value);
                                        return data.map((item) => ({ value: `${item.value} ${item.district_state}`, key: item.value }));
                                    } catch (error) {
                                        return [];
                                    }
                                }}
                                id="presentPincode"
                                value={form.presentPincode.value}
                                onChange={(value) => handleChange({ name: "presentPincode", value: value })}
                            />

                            <div className="invalid-feedback">{form.presentPincode.error}</div>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="presentPostOffice" className="form-label">
                                Post Office {form.presentPostOffice.required && <span className="text-danger">*</span>}
                            </label>
                            <PostOfficeSelect
                                className={`form-select ${form.presentPostOffice.error && "is-invalid"}`}
                                id="presentPostOffice"
                                name="presentPostOffice"
                                required={form.presentPostOffice.required}
                                value={form.presentPostOffice.value}
                                onChange={(e) => handleChange({ name: "presentPostOffice", value: e.currentTarget.value })}
                                pincode={form.presentPincode.value}
                            />
                            <div className="invalid-feedback">{form.presentPostOffice.error}</div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="presentPoliceStation" className="form-label">
                                Police Station {form.presentPoliceStation.required && <span className="text-danger">*</span>}
                            </label>
                            <PoliceStationSelect
                                className={`form-select ${form.presentPoliceStation.error && "is-invalid"}`}
                                id="presentPoliceStation"
                                name="presentPoliceStation"
                                required={form.presentPoliceStation.required}
                                value={form.presentPoliceStation.value}
                                onChange={(e) => handleChange({ name: "presentPoliceStation", value: e.currentTarget.value })}
                                district={form.presentDistrict.value}
                            />
                            <div className="invalid-feedback">{form.presentPoliceStation.error}</div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="presentHvsr" className="form-label">
                                House No./Name of the Village/Street/Road {form.presentHvsr.required && <span className="text-danger">*</span>}
                            </label>
                            <textarea
                                className={`form-control ${form.presentHvsr.error && "is-invalid"}`}
                                id="presentHvsr"
                                name="presentHvsr"
                                required={form.presentHvsr.required}
                                value={form.presentHvsr.value}
                                onChange={(e) => handleChange({ name: "presentHvsr", value: e.currentTarget.value })}
                            />
                            <div className="invalid-feedback">{form.presentHvsr.error}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PresentAddressForm;
