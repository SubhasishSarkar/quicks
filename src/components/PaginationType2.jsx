import React from "react";

const PaginationType2 = ({ data, setSearchParams, searchParamsToObject, searchParams }) => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <small className="d-inline-flex mb-3 px-2 py-1 fw-semibold text-secondary bg-opacity-20 ">
                    Showing {data?.from} to {data?.to} of {data?.total_records} Entries
                </small>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <nav>
                        <ul className="pagination pagination-sm mb-3">
                            {data?.links?.map((item, index) => (
                                <li className={`page-item ${item.active ? "active" : ""} ${item.disabled ? "disabled" : ""}`} key={index}>
                                    <a
                                        href={item.query}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSearchParams(item.query.split("?")[1]);
                                        }}
                                        className="page-link"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <select
                        className="form-select form-select-sm"
                        value={searchParamsToObject(new URLSearchParams(searchParams)).limit}
                        onChange={(e) => {
                            const value = e.currentTarget.value;
                            const params = new URLSearchParams(searchParams);
                            params.set("limit", value);
                            e.preventDefault();
                            setSearchParams(params.toString());
                        }}
                    >
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default PaginationType2;
