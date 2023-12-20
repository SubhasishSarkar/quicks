import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            setError(null);
            setLoading(true);
            try {
                const token = localStorage.getItem("quicks_token");
                const res = await fetch(process.env.APP_BASE_API + "/user-list", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setLoading(false);
                    setData(data);
                } else {
                    const data = await res.json();
                    throw Error(data.message);
                }
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        })();
    }, []);

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {loading && (
                <div className="d-flex align-items-center">
                    <strong>Loading...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            )}
            {error && <p>{error}</p>}

            {data && (
                <div style={{ overflow: "auto" }} className="table-container">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Sl.no.</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) => (
                            <tr key={user.id}>
                                <td style={wrapStyle}>{data?.from + index}</td>
                                <td style={wrapStyle}>{user.fname}</td>
                                <td style={wrapStyle}>{user.lname}</td>
                                <td style={wrapStyle}>{user.email}</td>
                                <td style={wrapStyle}>
                                    <Link to={"/user-details/" + user.id}>View</Link>|<Link to={"/user-update/" + user.id}>Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </>
    );
};

export default UserList;
