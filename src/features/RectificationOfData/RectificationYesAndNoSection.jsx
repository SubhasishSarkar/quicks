import React from "react";

const RectificationYesAndNoSection = ({ updateWant, forNoLoading }) => {
    return (
        <>
            <div className="row mb-3">
                <div className="col-md-12">
                    <h5>Do you want to Rectify ? </h5>
                </div>
                <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div className="btn-group me-2" role="group" aria-label="First group">
                            <button type="button" className="btn btn-success" onClick={() => updateWant("Yes")}>
                                <i className="fa-solid"></i> Yes
                            </button>
                        </div>
                        <div className="btn-group me-2" role="group" aria-label="Second group">
                            <button type="button" className="btn btn-danger" onClick={() => updateWant("No")} disabled={forNoLoading}>
                                {forNoLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid "></i>} No
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RectificationYesAndNoSection;
