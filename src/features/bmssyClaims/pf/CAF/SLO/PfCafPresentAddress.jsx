import React from "react";
import DistrictSelect from "../../../../../components/select/DistrictSelect";
import SubDivSelect from "../../../../../components/select/SubDivSelect";
import BMCNameSelect from "../../../../../components/select/BMCNameSelect";
import BMCSelect from "../../../../../components/select/BMCSelect.";
import GPWardSelect from "../../../../../components/select/GPWardSelect";
import AsyncSelect from "../../../../../components/select/AsyncSelect";
import PostOfficeSelect from "../../../../../components/select/PostOfficeSelect";
import PoliceStationSelect from "../../../../../components/select/PoliceStationSelect";
import { fetcher } from "../../../../../utils";

const PfCafPresentAddress = ({ form, handleChange }) => {
    return (
        <>
            <div className="card mb-2">
                <div className="card-body">
                    <h5 className="card-title">Beneficiary Address Details</h5>
                    <div className="row">
                        <div className="col-md-4 mb-2">
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
                                disabled
                            />
                            <div className="invalid-feedback">Please select district</div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-control-label" htmlFor="subdivision">
                                Subdivision {form.subdivision.required && <span className="text-danger">*</span>}
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
                                disabled
                            />
                            <div className="invalid-feedback">Please select sub division</div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label htmlFor="bmcType" className="form-label">
                                Block/Municipality/Corporation {form.bmcType.required && <span className="text-danger">*</span>}
                            </label>
                            <BMCSelect
                                className={`form-select ${form.bmcType.error && "is-invalid"}`}
                                id="bmcType"
                                name="bmcType"
                                required={form.bmcType.required}
                                value={form.bmcType.value}
                                onChange={(e) => handleChange({ name: "bmcType", value: e.currentTarget.value })}
                            />
                            <div className="invalid-feedback">{form.bmcType.error}</div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label htmlFor="block" className="form-label">
                                Name of Block/Municipality/Corporation {form.block.required && <span className="text-danger">*</span>}
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
                        <div className="col-md-4 mb-2">
                            <label htmlFor="gpWard" className="form-label">
                                GP / Ward {form.gpWard.required && <span className="text-danger">*</span>}
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
                        <div className="col-md-4 mb-2">
                            <label htmlFor="pinCode" className="form-label">
                                Pin Code {<span className="text-danger">*</span>}
                            </label>

                            <AsyncSelect
                                className={form.pinCode.error && "is-invalid"}
                                loadOptions={async (value) => {
                                    try {
                                        const data = await fetcher("/pincode-suggestion?pincode=" + value);
                                        return data.map((item) => ({ value: `${item.value} ${item.district_state}`, key: item.value }));
                                    } catch (error) {
                                        return [];
                                    }
                                }}
                                id="pinCode"
                                value={form.pinCode.value}
                                onChange={(value) => handleChange({ name: "pinCode", value: value })}
                            />

                            <div className="invalid-feedback">{form.pinCode.error}</div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label htmlFor="postOffice" className="form-label">
                                Post Office {<span className="text-danger">*</span>}
                            </label>
                            <PostOfficeSelect
                                className={`form-select ${form.postOffice.error && "is-invalid"}`}
                                id="postOffice"
                                name="postOffice"
                                required={form.postOffice.required}
                                value={form.postOffice.value}
                                onChange={(e) => handleChange({ name: "postOffice", value: e.currentTarget.value })}
                                pincode={form.pinCode.value}
                            />
                            <div className="invalid-feedback">{form.postOffice.error}</div>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label htmlFor="policeStation" className="form-label">
                                Police Station {<span className="text-danger">*</span>}
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
                        <div className="col-md-12">
                            <label htmlFor="hvsr" className="form-label">
                                House No./Name of the Village/Street/Road {<span className="text-danger">*</span>}
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
        </>
    );
};

export default PfCafPresentAddress;
