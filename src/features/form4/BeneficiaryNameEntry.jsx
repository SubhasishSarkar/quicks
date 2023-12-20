import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const BeneficiaryNameEntry = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary Name Entry", url: "" }));
    }, []);

    return <></>;
};

export default BeneficiaryNameEntry;
