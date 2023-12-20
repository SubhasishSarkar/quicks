import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import RegistrationForm from "../../features/registration/RegistrationForm";

const UserUpdate = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            setError(null);
            setLoading(true);
            try {
                const token = localStorage.getItem("quicks_token");

                const res = await fetch(process.env.APP_BASE_API + "/user-details/" + id, {
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
    }, [id]);
    if (loading) {
        return <div>Loading....</div>;
    }
    if (error) {
        return <div>Error....</div>;
    }
    return <>{data && <RegistrationForm data={data} />}</>;
};

export default UserUpdate;
