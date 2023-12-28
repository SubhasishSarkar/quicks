import { useMutation } from "@tanstack/react-query";
import { registerPlugin } from "filepond";
import React, { useEffect, useState } from "react";
import { FilePond } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import { toast } from "react-toastify";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

const fetcher = async (body, method, url) => {
    const token = localStorage.getItem("quicks_token");
    if (!token) throw new Error("There is no token");
    const options = {
        method: method,
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    };
    if (method === "POST") options["body"] = body;
    const res = await fetch(process.env.APP_BASE_API + url, options);
    if (!res.ok) {
        try {
            return Promise.reject(await res.json());
        } catch (error) {
            return Promise.reject({ message: res.statusText });
        }
    }
    return await res.json();
};

const FPUploader = ({ title, description, acceptedFileTypes, minFileSize, maxFileSize, name = String(Math.random()), upload, fileURL = null, onUploadSuccessful, onDeleteSuccessful, onUploadError, onDeleteError, required, isFileReadyToUpload }) => {
    const [uploaded, setUploaded] = useState(fileURL);

    const [file, setFile] = useState();
    const [btnHide, setBtnHide] = useState();
    const [fileType, setFileType] = useState();
    const [uploadLoading, setUploadLoading] = useState(false);
    const { mutate, isLoading: fileLoading } = useMutation(({ body, method, url }) => fetcher(body, method, url));
    const handleFileUpload = () => {
        if (!upload) return;
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file?.file, file?.file?.name);
        setUploadLoading(true);
        mutate(
            { url: upload, body: formData, method: "POST" },
            {
                onError(error) {
                    toast.error(error.message);
                    onUploadError && onUploadError(error);
                },
                onSuccess(data) {
                    setUploadLoading(false);
                    toast.success(data.message);
                    setUploaded(data.path);
                    onUploadSuccessful && onUploadSuccessful(data);
                },
            }
        );
    };

    const handleFileDelete = () => {
        if (!upload) return;
        mutate(
            { url: upload, method: "DELETE" },
            {
                onError(error) {
                    toast.error(error.message);
                    onDeleteError && onDeleteError(error);
                },
                onSuccess(data) {
                    toast.success(data.message);
                    setUploaded(null);
                    setFile(undefined);
                    onDeleteSuccessful && onDeleteSuccessful(data);
                },
            }
        );
    };

    const handleFileSelect = (ev) => {
        setFile(ev[0]);
        let ftype = ev[0].file?.type;
        if (ftype === acceptedFileTypes[0] || ftype === acceptedFileTypes[1]) {
            setFileType(true);
        } else {
            setFileType(false);
        }
        let rawFileSize = ev[0].file?.size;
        let exactSize = Math.floor(rawFileSize / 1024);
        if (exactSize > parseInt(maxFileSize)) {
            setBtnHide(false);
        } else {
            setBtnHide(true);
        }
    };

    useEffect(() => {
        setUploaded(fileURL);
    }, [fileURL]);

    useEffect(() => {
        if (isFileReadyToUpload) {
            if (file && !uploaded) isFileReadyToUpload(true);
            else isFileReadyToUpload(false);
        }
    }, [file, uploaded, isFileReadyToUpload]);

    return (
        <>
            <div className="card " style={{ height: "100%" }}>
                <div className="card-body">
                    <div className="card-title ">
                        <h6 className="filepond_section_title">
                            {title && title} {required === "true" && <span style={{ color: "#e31010" }}>*</span>}
                        </h6>
                    </div>
                    <div className="card-subtitle mb-2 text-muted filepond_section_sub_title">{description && description}</div>

                    {!uploaded && (
                        <>
                            <FilePond
                                // onupdatefiles={((d) => setFile(d[0]), handleFileSelect)}
                                onupdatefiles={handleFileSelect}
                                maxFileSize={maxFileSize}
                                allowFileSizeValidation={true}
                                allowFileTypeValidation={true}
                                acceptedFileTypes={acceptedFileTypes}
                                labelFileTypeNotAllowed="Invalid type file"
                                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                                name={name}
                                credits={false}
                            />

                            {file && fileType && btnHide && (
                                <div className="filepond_section_btn">
                                    <button className="btn btn-primary btn-sm" onClick={handleFileUpload} disabled={uploadLoading}>
                                        {uploadLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-cloud-arrow-up"></i>} Upload
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {uploaded && (
                        <>
                            <div className="filepond_section_view" style={{ backgroundColor: "rgb(181 181 181)" }}></div>
                            <div className="filepond_section_btn">
                                <button className="btn btn-danger btn-sm" type="button" onClick={handleFileDelete} disabled={fileLoading}>
                                    {fileLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-trash-can"></i>} Remove
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default FPUploader;
