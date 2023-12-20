import React, { useEffect } from "react";
import PdfViewer from "../../components/PdfViewer";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils";
import ErrorAlert from "../../components/list/ErrorAlert";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const UserManual = () => {
    const { error, data } = useQuery(["fetch-user-manual", ""], () => fetcher(`/fetch-user-manual`));

    const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.user);
    useEffect(() => {
        dispatch(setPageAddress({ title: "SOP/User Manual", url: "" }));
    }, []);

    return (
        <>
            {error && <ErrorAlert error={error} />}
            <PdfViewer url={process.env.APP_BASE_V2 + data?.data} />
        </>
    );
};

export default UserManual;
