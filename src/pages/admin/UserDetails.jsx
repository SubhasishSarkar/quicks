import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const UserDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        (async () => {
            setError(null);
            setLoading(true);
            try {
                const token = localStorage.getItem("bmssy_token");

                const res = await fetch(
                    process.env.APP_BASE_API + "/user-details/" + id,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    }
                );
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
    }, [id]);

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {data && (
                <p>
                    {JSON.stringify(data)}
                    <Link to={"/user-update/" + data.id}>Edit </Link>
                </p>
            )}
        </>
    );
};

export default UserDetails;
