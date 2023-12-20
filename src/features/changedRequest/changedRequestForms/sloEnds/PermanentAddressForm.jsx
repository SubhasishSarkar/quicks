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

const PermanentAddressForm = ({ form, handleChange }) => {
    return (
        <div className="card mb-3">
            <div className="section_title">
                <strong>Permanent Address</strong>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="district">
                            District {form.district.required && <span className="text-danger">*</span>}
                        </label>
                        <DistrictSelect
                            className={`form-select ${form.district.error && "is-invalid"}`}
                            id="district"
                            name="district"
                            value={form.district.value}
                            onChange={(e) => {
                                handleChange({ name: "district", value: e.currentTarget.value });
                            }}
                        />
                        <div id="Feedback" className="invalid-feedback">
                            {form.district.error}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="subdivision">
                            Sub Division {form.subdivision.required && <span className="text-danger">*</span>}
                        </label>
                        <SubDivSelect
                            className={`form-select ${form.subdivision.error && "is-invalid"}`}
                            id="subdivision"
                            name="subdivision"
                            value={form.subdivision.value}
                            onChange={(e) => {
                                handleChange({ name: "subdivision", value: e.currentTarget.value });
                            }}
                            districtCode={form.district.value}
                        />
                        <div id="Feedback" className="invalid-feedback">
                            {form.subdivision.error}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="block">
                            Block/Municipality/Corporation {form.block.required && <span className="text-danger">*</span>}
                        </label>
                        <BMCNameSelect
                            className={`form-select ${form.block.error && "is-invalid"}`}
                            id="block"
                            name="block"
                            required={form.block.required}
                            value={form.block.value}
                            onChange={(e) => handleChange({ name: "block", value: e.currentTarget.value })}
                            subDivision={form.subdivision.value}
                        />

                        <div className="invalid-feedback">{form.block.error}</div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="blockType">
                            Block/Municipality/Corporation Type {form.blockType.required && <span className="text-danger">*</span>}
                        </label>
                        <BMCSelect
                            className={`form-select ${form.blockType.error && "is-invalid"}`}
                            id="blockType"
                            name="blockType"
                            required={form.blockType.required}
                            value={form.blockType.value}
                            onChange={(e) => handleChange({ name: "blockType", value: e.currentTarget.value })}
                        />

                        <div className="invalid-feedback">{form.blockType.error}</div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-control-label" htmlFor="gpWard">
                            Gp/Ward {form.gpWard.required && <span className="text-danger">*</span>}
                        </label>
                        <GPWardSelect
                            className={`form-select ${form.gpWard.error && "is-invalid"}`}
                            id="gpWard"
                            name="gpWard"
                            required={form.gpWard.required}
                            value={form.gpWard.value}
                            onChange={(e) => handleChange({ name: "gpWard", value: e.currentTarget.value })}
                            block={form.block.value}
                        />
                        <div className="invalid-feedback">{form.gpWard.error}</div>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="pincode" className="form-label">
                            Pin Code {form.pincode.required && <span className="text-danger">*</span>}
                        </label>

                        <AsyncSelect
                            className={form.pincode.error && "is-invalid"}
                            loadOptions={async (value) => {
                                try {
                                    const data = await fetcher("/pincode-suggestion?pincode=" + value);
                                    return data.map((item) => ({ value: `${item.value} ${item.district_state}`, key: item.value }));
                                } catch (error) {
                                    return [];
                                }
                            }}
                            id="pincode"
                            value={form.pincode.value}
                            onChange={(value) => handleChange({ name: "pincode", value: value })}
                            placeholder="Pincode"
                        />

                        <div className="invalid-feedback">{form.pincode.error}</div>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="postOffice" className="form-label">
                            Post Office {form.postOffice.required && <span className="text-danger">*</span>}
                        </label>
                        <PostOfficeSelect
                            className={`form-select ${form.postOffice.error && "is-invalid"}`}
                            id="postOffice"
                            name="postOffice"
                            required={form.postOffice.required}
                            value={form.postOffice.value}
                            onChange={(e) => handleChange({ name: "postOffice", value: e.currentTarget.value })}
                            pincode={form.pincode.value}
                        />
                        <div className="invalid-feedback">{form.postOffice.error}</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="policeStation" className="form-label">
                            Police Station {form.policeStation.required && <span className="text-danger">*</span>}
                        </label>
                        <PoliceStationSelect
                            className={`form-select ${form.policeStation.error && "is-invalid"}`}
                            id="policeStation"
                            name="policeStation"
                            required={form.policeStation.required}
                            value={form.policeStation.value}
                            onChange={(e) => handleChange({ name: "policeStation", value: e.currentTarget.value })}
                            district={form.district.value}
                        />
                        <div className="invalid-feedback">{form.policeStation.error}</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="hvsr" className="form-label">
                            House No./Name of the Village/Street/Road {form.hvsr.required && <span className="text-danger">*</span>}
                        </label>
                        <textarea
                            className={`form-control ${form.hvsr.error && "is-invalid"}`}
                            id="hvsr"
                            name="hvsr"
                            required={form.hvsr.required}
                            value={form.hvsr.value}
                            onChange={(e) => handleChange({ name: "hvsr", value: e.currentTarget.value })}
                        />
                        <div className="invalid-feedback">{form.hvsr.error}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermanentAddressForm;
