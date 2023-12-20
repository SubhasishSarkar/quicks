import React, { useEffect, useState } from "react";
import { useValidate } from "../../../../../hooks";
import TableList from "../../../../../components/table/TableList";
import OtherDetails from "./OtherDetails";

const TwEmployerDetails = ({ handleChangeEmp }) => {
    const [empList, setEmpList] = useState([]);

    const [form, validator] = useValidate({
        status: { value: "", validate: "required" },
        nature_of_vehicle: { value: "", validate: "required" },
        nature_of_duty: { value: "", validate: "required" },
    });
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {});
    };

    useEffect(() => {
        handleChangeEmp({ name: "empList", value: [...empList] });
    }, [empList]);

    const handleAdd = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (!validator.validate()) return;
        setEmpList((prev) => {
            return [...prev, { ...validator.generalize() }];
        });

        validator.reset();
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "status",
            headerName: "Worker Name",
        },
        {
            field: "nature_of_vehicle",
            headerName: "Nature of vehicle",
        },
        {
            field: "nature_of_duty",
            headerName: "Nature of duty",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (item) => {
                return (
                    <div
                        className="text-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEmpList((prev) => {
                                return prev.filter((i) => i.id != item?.id);
                            });
                        }}
                    >
                        <i className="fa fa-trash text-danger"></i>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <form onSubmit={handleAdd} noValidate autoComplete="off">
                <OtherDetails form={form} handleChange={handleChange} />
            </form>
            {empList.length > 0 && (
                <>
                    <div className="card mb-2">
                        <div className="card-title">
                            <h5>All Employers</h5>
                        </div>

                        <div className="card-body">
                            <TableList data={{ data: empList }} tableHeader={columns} disablePagination />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default TwEmployerDetails;
