import React, { useState } from "react";
import FormUploader from "../../registrationV2/FormUpload/FormUploader";
import { useMutation } from "@tanstack/react-query";
import { updater } from "../../../utils";
import { toast } from "react-toastify";

function FormUpload({ data, handleRenewed }) {
    const [uploads, setUploads] = useState([]);
    const [config, setConfig] = useState({
        tw: [
            {
                id: 3,
                title: "Form3 WBTWSSS",
                uploadURL: `/renew-e-district-documents-upload?id=${data.data?.application_id}&name=form3`,
                viewURL: "",
                downloadURL: `/form1-tw-download-pdf/${data.data?.application_id}`,
                downloadFileName: "Form1-WBTWSSS.pdf",
            },
            {
                id: 999,
                title: "Delay Condon",
                uploadURL: `/renew-e-district-documents-upload?id=${data.data?.application_id}&name=delayCondon`,
                viewURL: "",
                downloadURL: `/form1-tw-download-pdf/${data.data?.application_id}`,
                downloadFileName: "Form1-WBTWSSS.pdf",
            },
        ],
    });

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const handleUpload = (formNo, res) => {
        setConfig((prev) => {
            const forms = prev[data.data.cat_worker_type].map((item) => {
                if (item.id === formNo) item.viewURL = res.path;
                return item;
            });

            return { ...prev, [data.data.cat_worker_type]: [...forms] };
        });
        if (
            JSON.stringify(
                config[data.data.cat_worker_type]
                    .filter((i) => data.forms.includes(i.id))
                    .map((i) => i.id)
                    .sort()
            ) === JSON.stringify([...uploads, formNo].sort())
        ) {
            // call api to add a row to renwal table
            const files = {
                application_id: data.data.application_id,
                form3: formNo === 3 ? res.path : config[data.data.cat_worker_type].find((_i) => _i.id === 3).viewURL,
                delayCondon: formNo === 999 ? res.path : config[data.data.cat_worker_type].find((_i) => _i.id === 999).viewURL,
            };
            mutate(
                {
                    url: `/renew-e-district`,
                    body: { ...files },
                },
                {
                    onSuccess(data, variables, context) {
                        handleRenewed();
                        console.log("---------------");
                        toast.success("Application renewd");
                    },
                    onError(error, variables, context) {
                        handleRenewed();
                        toast.error(error.message);
                    },
                }
            );
        } else {
            setUploads([...uploads, formNo]);
        }
    };
    const handleRemove = (formNo) => {
        console.log(formNo);
        setUploads((prev) => {
            return prev.filter((_id) => _id != formNo);
        });
        setConfig((prev) => {
            const forms = prev[data.data.cat_worker_type].map((item) => {
                if (item.id === formNo) item.viewURL = "";
                return item;
            });

            return { ...prev, [data.data.cat_worker_type]: [...forms] };
        });
    };
    return (
        <>
            {config[data.data?.cat_worker_type]
                .filter((item) => {
                    return data.forms.includes(item.id);
                })
                .map((item, index) => {
                    return (
                        <div key={index} className="my-2">
                            <FormUploader
                                handleUpload={(data) => handleUpload(item.id, data)}
                                handleRemove={() => handleRemove(item.id)}
                                title={item.title}
                                downloadURL={item.downloadURL}
                                uploadURL={item.uploadURL}
                                viewURL={item.viewURL ? process.env.APP_BASE + item.viewURL : ""}
                                downloadFileName={item.downloadFileName}
                            />
                        </div>
                    );
                })}
        </>
    );
}

export default FormUpload;
