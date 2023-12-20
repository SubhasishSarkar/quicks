import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../../utils";
import FormUploader from "./FormUploader";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";

function FormUpload() {
    const [uploads, setUploads] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isFetching } = useQuery(["caf-registration-preview", "final-submit", id], () => fetcher(`/caf-registration-preview?id=${id}&step_name=final-submit`), {
        enabled: id ? true : false,
    });

    const { isFetching: docFetching, data: docData } = useQuery(["caf-registration-preview", "documents-details", id], () => fetcher(`/caf-registration-preview?id=${id}&step_name=documents-details`), {
        enabled: id ? true : false,
    });

    const { mutate: setStatusAfterFormsUpload, isLoading: isLoader } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const config = {
        tw: {
            forms: [
                {
                    id: 1,
                    title: "Form1 BMSSY",
                    uploadURL: `/caf-registration?id=${id}&type=documents-details&name=Form-1`,
                    viewURL: docData?.Form1 ? process.env.APP_BASE + docData?.Form1 : "",
                    downloadURL: `/form1-download-pdf/${id},`,
                    downloadFileName: "form-1.pdf",
                },
                {
                    id: 11,
                    title: "Form1 WBTWSSS",
                    uploadURL: `/caf-registration?id=${id}&type=documents-details&name=Form-E-1`,
                    viewURL: docData?.Form1 ? process.env.APP_BASE + docData?.FormE1 : "",
                    downloadURL: `/form1-tw-download-pdf/${id}`,
                    downloadFileName: "Form1-WBTWSSS.pdf",
                },
            ],
        },
        cw: {
            forms: [
                {
                    id: 1,
                    title: "Form1 BMSSY",
                    uploadURL: `/caf-registration?id=${id}&type=documents-details&name=Form-1`,
                    viewURL: docData?.Form1 ? process.env.APP_BASE + docData?.Form1 : "",
                    downloadURL: `/form1-download-pdf/${id},`,
                    downloadFileName: "form-1.pdf",
                },
                {
                    id: 27,
                    title: "Form27 WBBOCW",
                    uploadURL: `/caf-registration?id=${id}&type=documents-details&name=Form-27`,
                    viewURL: docData?.Form1 ? process.env.APP_BASE + docData?.Form27 : "",
                    downloadURL: `/form27-cw-download-pdf/${id}`,
                    downloadFileName: "Form27-WBBOCW.pdf",
                },
            ],
        },
        ow: {
            forms: [
                {
                    id: 1,
                    title: "Form1 BMSSY",
                    uploadURL: `/caf-registration?id=${id}&type=documents-details&name=Form-1`,
                    viewURL: docData?.Form1 ? process.env.APP_BASE + docData?.Form1 : "",
                    downloadURL: `/form1-download-pdf/${id},`,
                    downloadFileName: "form-1.pdf",
                },
            ],
        },
    };

    const handleUpload = (formNo) => {
        if (JSON.stringify(config[data.cat_worker_type].forms.map((i) => i.id).sort()) === JSON.stringify([...uploads, formNo].sort())) {
            console.log("Ready");
            toast.error("preparing");
            const apidata = { application_id: id, cat_worker_type: data.cat_worker_type };
            setStatusAfterFormsUpload(
                { url: `/forms-upload-final-submit`, body: apidata },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.message);
                        navigate("/my-application-list");
                    },
                    onError(error, variables, context) {
                        console.error(error);
                        toast.error(error.message);
                    },
                }
            );
        } else {
            setUploads([...uploads, formNo]);
        }
    };

    //need to add handle remove
    const handleRemove = (formNo) => {
        console.log(formNo);
        setUploads((prev) => {
            return prev.filter((_id) => _id != formNo);
        });
    };
    return (
        <>
            {isFetching || (docFetching && <LoadingOverlay />)}
            {config[data?.cat_worker_type]?.forms.map((item, index) => {
                return (
                    <FormUploader
                        handleUpload={() => handleUpload(item.id)}
                        handleRemove={() => handleRemove(item.id)}
                        title={item.title}
                        key={index}
                        downloadURL={item.downloadURL}
                        uploadURL={item.uploadURL}
                        viewURL={item.viewURL}
                        downloadFileName={item.downloadFileName}
                    />
                );
            })}
        </>
    );
}

export default FormUpload;
