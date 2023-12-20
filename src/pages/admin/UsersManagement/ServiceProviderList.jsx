import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetcher, searchParamsToObject } from "../../../utils";
import { useValidate } from "../../../hooks";
import DistrictSelect from "../../../components/select/DistrictSelect";
import SubDivSelect from "../../../components/select/SubDivSelect";
import ErrorAlert from "../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import UsersManagementListFilter from "./UsersManagementListFilter";
import EditUserDataModal from "./EditUserDataModal";
import NoDataFound from "../../../components/list/NoDataFound";
import Pagination from "../../../components/Pagination";

const ServiceProviderList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Service Provider List", url: "" }));
    }, []);

    const [searchParams, setSearchParams] = useSearchParams();
    const { error, data, isLoading } = useQuery(["service-provider-list", searchParams.toString()], () => fetcher(`/service-provider-list?${searchParams.toString()}`));

    console.log(data?.data.length);

    const user = useSelector((state) => state.user.user);

    const [form, validator] = useValidate(
        {
            district: { value: user?.district, validate: "required" },
            subdivision: { value: user?.subDivision, validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const dataNew = validator.generalize();
        Object.keys(dataNew).forEach((key) => searchParams.set(key, dataNew[key]));
        setSearchParams(searchParams);
    };

    const clearParams = () => {
        setSearchParams();
        form.block.value = "";
        form.ssin.value = "";
    };

    const [lgShow, setLgShow] = useState(false);
    const [userId, setUserId] = useState();
    const [otherData, setOtherData] = useState();

    const openEditModal = (id, name, empId) => {
        setLgShow(true);
        setUserId(id);
        setOtherData(name + " (" + empId + ")");
    };
    const handleClose = () => setLgShow(false);

    
    const wrapStyle = {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            <form noValidate onSubmit={handleSubmit}>
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
                            disabled
                        />
                        <div className="invalid-feedback">Please select district</div>
                    </div>
                    <div className="col-md-4">
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
                        />
                        <div className="invalid-feedback">Please select sub division</div>
                    </div>
                    <div className="col-md-2">
                        <div className="mt-4 d d-md-flex gap-2">
                            <button type="submit " className="btn btn-success btn-sm">
                                <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => clearParams()}>
                                <i className="fa-solid fa-broom"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="card datatable-box mb-2">
                <div className="card-body">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <>
                            <UsersManagementListFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} />
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th>SL.No.</th>
                                            <th>Username</th>
                                            <th>Name</th>
                                            <th>Employee ID</th>
                                            <th>Area</th>
                                            <th>Mobile</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data?.map((item, index) => {
                                            return (
                                                <tr key={index} className="text-center">
                                                    <td style={wrapStyle}>{data?.from + index}</td>
                                                    <td style={wrapStyle}>{item.name}</td>
                                                    <td style={wrapStyle}>{item.fullname}</td>
                                                    <td style={wrapStyle}>{item.employee_id}</td>
                                                    <td style={wrapStyle}>{item.user_place}</td>
                                                    <td style={wrapStyle}>{item.mobile} </td>
                                                    <td style={wrapStyle}>
                                                        <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                                            <div className="btn-group me-2 mb-2" role="group" aria-label="First group">
                                                                <button type="button" className="btn btn-sm btn-primary" onClick={() => openEditModal(item.encUserId, item.name, item.employee_id)}>
                                                                    Edit User
                                                                </button>
                                                            </div>
                                                            <div className="btn-group me-2" role="group" aria-label="Second group">
                                                                <button type="button" className="btn btn-sm btn-info" style={{ height: "32px" }}>
                                                                    <Link to={"/users-management/alc-list?createdBy=" + item.encUserId} style={{ textDecoration: "none", color: "#010101" }}>
                                                                        View ALC List
                                                                    </Link>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {userId && <EditUserDataModal lgShow={lgShow} userId={userId} handleClose={handleClose} otherData={otherData} />}
                        </>
                    )}
                    {!isLoading && data?.data.length === 0 && <NoDataFound />}
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </div>
            </div>
        </>
    );
};

export default ServiceProviderList;
