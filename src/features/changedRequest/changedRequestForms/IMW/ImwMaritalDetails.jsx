import React from "react";

const ImwMaritalDetails = ({ data }) => {
    return (
        <>
            <h5 className="card-title text-center mb-1 text-dark">Marital Status</h5>
            <div className="table-responsive">
                <table className="table table-bordered table-sm table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Fields Name</th>
                            <th scope="col">Previously Approved Data</th>
                            <th scope="col">Changed Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Marital Status</th>
                            <td>{data?.approved_marital_status}</td>
                            <td>{data?.cr_marital_status}</td>
                        </tr>
                        <tr>
                            <th>Husband Name</th>
                            <td>{data?.approved_husband_name}</td>
                            <td>{data?.cr_husband_name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ImwMaritalDetails;
