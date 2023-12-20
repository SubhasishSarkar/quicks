import React, { useState } from "react";

import { blankOpenFile } from "../../utils";

const Sample = () => {
    const [first, setFirst] = useState();
    const loadPdf = async () => {
        setFirst(true);
        try {
            await blankOpenFile("/sample-pdf-download/");
            setFirst();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <button onClick={() => loadPdf()} className="btn btn-primary" disabled={first}>
            {first && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Open
        </button>
    );
};

export default Sample;
