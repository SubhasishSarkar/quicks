import React from "react";
import FPUploader from "../../../../../components/FPUploader";
import { useSearchParams } from "react-router-dom";

const PaymentDetails = ({ form, handleChange, data }) => {
    // console.log("papapaDDDDDDp",data)
    return (
        <div className="card datatable-box mb-2">
            <div className="card-header">Payment details (INR 50.00)</div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="receipt_no" className="form-label">
                            Receipt No. {form.receipt_no.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Receipt No."
                            className={`form-control ${form.receipt_no.error && "is-invalid"}`}
                            type="text"
                            value={form.receipt_no.value}
                            onChange={(e) => handleChange(e.currentTarget)}
                            name="receipt_no"
                            id="receipt_no"
                            required={form.receipt_no.required}
                        />
                        <div className="invalid-feedback">Please enter receipt no.</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="book_no" className="form-label">
                            Book No. {form.book_no.required && <span className="text-danger">*</span>}
                        </label>
                        <input
                            placeholder="Book No."
                            className={`form-control ${form.book_no.error && "is-invalid"}`}
                            type="text"
                            value={form.book_no.value}
                            onChange={(e) => handleChange(e.currentTarget)}
                            name="book_no"
                            id="book_no"
                            required={form.book_no.required}
                        />

                        <div className="invalid-feedback">Please enter book no.</div>
                    </div>
                    <div className="col-md-4">
                        <PaymentReceiptUpload form={form} handleChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentReceiptUpload = ({ form, handleChange }) => {
    const [searchParams] = useSearchParams();
    const applicationId = searchParams.get("application_id");
    const handleUploadSuccess = (path, docType) => {
        handleChange({ name: "file_location", value: path });
    };
    const handleDeleteSuccess = (docType) => {
        handleChange({ name: "file_location", value: "" });
    };

    return (
        <>
            <div className="card" style={{ border: "none" }}>
                <div className="card-body">
                    <FPUploader
                        fileURL={form?.file_location?.value ? `${process.env.APP_BASE}${form?.file_location?.value}` : ""}
                        title="Receipt"
                        maxFileSize="50KB"
                        description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                        acceptedFileTypes={["image/jpeg", "image/jpg"]}
                        name="file_location"
                        onUploadSuccessful={(res) => handleUploadSuccess(res.path, "receipt")}
                        onDeleteSuccessful={() => handleDeleteSuccess("receipt")}
                        upload={`/eDistrict-payment-reciept-upload?id=${applicationId}&name=receipt`}
                        required="true"
                    />
                </div>

                {form.file_location.error && (
                    <div
                        style={{
                            width: "100%",
                            marginZTop: "0.25rem",
                            fontSize: "0.875em",
                            color: "#dc3545",
                        }}
                    >
                        Upload the required document
                    </div>
                )}
            </div>
        </>
    );
};

export default PaymentDetails;
