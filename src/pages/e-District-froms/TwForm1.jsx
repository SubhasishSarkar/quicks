import React, { useState } from "react";
import { blankOpenFile } from "../../utils";
import { toast } from "react-toastify";

const TwForm1 = () => {
    const [loading, setLoading] = useState(false);
    const DownloadForm1 = async (n) => {
        setLoading(n);
        try {
            const doc = await blankOpenFile("/download-e-district-tw-form-1", "tw-form-1.pdf");
            if (doc === false) toast.error("Unable to download pdf");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const DownloadForm27 = async (n) => {
        setLoading(n);
        try {
            const doc = await blankOpenFile("/download-e-district-tw-form-27", "tw-form-27.pdf");
            if (doc === false) toast.error("Unable to download pdf");
            setLoading();
        } catch (error) {
            setLoading();
            console.error(error);
        }
    };

    const DownloadFormTwAC = async (n) => {
        setLoading(n);
        try {
            const doc = await blankOpenFile("/download-e-district-tw-ac-statement", "tw-form-ac-statement.pdf");
            if (doc === false) toast.error("Unable to download pdf");
            setLoading();
        } catch (error) {
            setLoading();
            console.error(error);
        }
    };

    const DownloadFormCwAC = async (n) => {
        setLoading(n);
        try {
            const doc = await blankOpenFile("/download-e-district-cw-ac-statement", "tw-form-ac-statement.pdf");
            if (doc === false) toast.error("Unable to download pdf");
            setLoading();
        } catch (error) {
            setLoading();
            console.error(error);
        }
    };

    return (
        <>
            <div className="p-3">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <button className="btn btn-primary" onClick={() => DownloadForm1("1")}>
                            {loading === "1" && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Open TW Form-I
                        </button>
                    </div>
                    <div className="col-md-12 mb-3">
                        <button className="btn btn-primary" onClick={() => DownloadForm27("27")}>
                            {loading === "27" && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Open CW Form-XXVII
                        </button>
                    </div>

                    <div className="col-md-12 mb-3">
                        <button className="btn btn-primary" onClick={() => DownloadFormTwAC("twAc")}>
                            {loading === "twAc" && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Open TW A/C Statement
                        </button>
                    </div>

                    <div className="col-md-12 mb-3">
                        <button className="btn btn-primary" onClick={() => DownloadFormCwAC("cwAc")}>
                            {loading === "cwAc" && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Open CW A/C Statement
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TwForm1;
