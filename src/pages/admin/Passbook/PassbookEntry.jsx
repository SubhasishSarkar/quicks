import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useValidate } from "../../../hooks";
import PassbookServiceForm from "../../../features/pfpassbookupdation/PassbookServiceForm";
import PassbookServiceEntryForm from "../../../features/pfpassbookupdation/PassbookServiceEntryForm";
import { fetcher, updater } from "../../../utils";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const PassbookEntry = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "PF Passbook Entry", url: "" }));
    }, []);
    const [ssinDetails, setSsinDetails] = useState("");
    const [collectedArn, setCollectedArn] = useState("");
    const [items, setItems] = useState("");
    const [duaresarkar, setDuaresarkar] = useState(0);
    const [dsregDate, setDsregDate] = useState(null);
    const [dsminregDate, setDsminregDate] = useState(null);

    const navigate = useNavigate();
    const [collectedDetails, setCollectedDetails] = useState({ data: null, error: null, loading: false });
    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const [form, validator] = useValidate({
        ssin_no: { value: "", validate: "required|number|length:12" },
        ds_reg_no: { value: "", validate: "" },
        ds_reg_dt: { value: "", validate: "" },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        mutate(
            { url: `/ppu-service`, body: { data, duaresarkar } },
            {
                onSuccess(data) {
                    setCollectedDetails({ data: null, error: null, loading: false });
                    setSsinDetails(data);
                    setCollectedArn(data.data.pf_collected_by);
                },
                onError(error) {
                    toast.error(error.message);
                    validator.setError(error.message);
                },
            }
        );
    };

    useEffect(() => {
        (async () => {
            try {
                if (ssinDetails === "") {
                    const { gp_alloted, duaresarkar, dsregdt_fix, dsregdt_min } = await fetcher("/ppu-check");
                    setItems(gp_alloted);
                    setDuaresarkar(duaresarkar);
                    setDsregDate(dsregdt_fix);
                    setDsminregDate(dsregdt_min);

                    if (duaresarkar == 1) {
                        validator.setState((prev) => {
                            prev.ds_reg_no.validate = "required|number|length:24";
                            prev.ds_reg_no.required = true;
                            prev.ds_reg_dt.validate = "required";
                            prev.ds_reg_dt.required = true;
                            prev.ds_reg_dt.value = moment(dsregdt_fix).format("YYYY-MM-DD");
                            return { ...prev };
                        });
                    }
                }
            } catch (error) {
                toast.error(error.message);
                navigate("/dashboard");
            }
        })();
    }, []);

    const handleChange = (e) => {
        validator.validOnChange(e);
    };

    const handleClick = async (collected_arn) => {
        try {
            setCollectedDetails({ data: null, error: null, loading: true });
            const a = await fetcher("/getname_type_witharn_ajax?arn=" + collected_arn);
            setCollectedDetails({ data: a, error: null, loading: false });
        } catch (error) {
            setCollectedDetails({ data: null, error: error.message, loading: false });
        }
    };

    return (
        <>
            {!ssinDetails && items && <PassbookServiceForm isLoading={isLoading} handleSubmit={handleSubmit} handleChange={handleChange} duaresarkar={duaresarkar} form={form} dsregDate={dsregDate} dsregdt_min={dsminregDate} />}
            {ssinDetails && (
                <PassbookServiceEntryForm
                    data={ssinDetails}
                    setSsinDetails={setSsinDetails}
                    handleClick={handleClick}
                    collectedArn={collectedArn}
                    setCollectedArn={setCollectedArn}
                    setCollectedDetails={setCollectedDetails}
                    collectedDetails={collectedDetails}
                    duaresarkar={duaresarkar}
                    formValidator={validator}
                />
            )}
        </>
    );
};

export default PassbookEntry;
