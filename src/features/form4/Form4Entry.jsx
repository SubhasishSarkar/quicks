import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";
import { toast } from "react-toastify";
import moment from "moment";
import ContributionMonthChecked from "../../components/form/ContributionMonthChecked";
import ErrorAlert from "../../components/list/ErrorAlert";
import Form4EntryList from "./Form4EntryList";
import SelectAllCheckBox from "../../components/list/SelectAllCheckBox";

const Form4Entry = () => {
    const user = useSelector((state) => state.user.user.id);
    const [months, setMonths] = useState(0);
    const [arr, setArr] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [sumAmount, setSumAmount] = useState(0);
    const [areaContribution, setAreaContribution] = useState(false);
    const [ssinName, setSsinName] = useState({ data: null, error: null, loading: false });
    const [lastCollectionDate, setLastCollectionDate] = useState();
    const [lastBookNumber, setLastBookNumber] = useState(0);
    const [lastReceiptNumber, setLastReceiptNumber] = useState(0);

    const { id } = useParams();
    const { data, isFetching, error } = useQuery([`/form4-get-pay-in-slip-by-id`, id], () => fetcher(`/form4-get-pay-in-slip-by-id?id=${id}`), {
        enabled: id ? true : false,
    });

    const [form, validator] = useValidate(
        {
            uid: { value: user, validate: "" },
            payin_slip_id: { value: "", validate: "" },
            bank_ifsc: { value: "", validate: "" },
            bank_name: { value: "", validate: "" },
            bank_ac_no: { value: "", validate: "" },
            deposit_amount: { value: "", validate: "" },
            arn_number: { value: "", validate: "" },
            arn_name: { value: "", validate: "" },
            deposit_date: { value: "", validate: "" },
            is_active: { value: "", validate: "" },
            created_date_time: { value: "", validate: "" },
            status: { value: "", validate: "" },
            worker_type: { value: "", validate: "" },
            rlo_code: { value: "", validate: "" },
            rlo_name: { value: "", validate: "" },
            district_code: { value: "", validate: "" },
            search_type: { value: "radio_reg", validate: "required" },
            ssin: { value: "", validate: "" },
            registration: { value: "", validate: "" },
            ben_name: { value: "", validate: "" },
            book_no: { value: "", validate: "required" },
            receipt_no: { value: "", validate: "required" },
            collection_date: { value: "", validate: "required" },
            financial_year: { value: "", validate: "required" },
            amount: { value: "", validate: "required" },
            sum_amount: { value: "", validate: "required" },
            rupees_20: { value: "", validate: "" },
            rupees_25: { value: "", validate: "" },
            rupees_5: { value: "", validate: "" },
            checkMonth: { value: "", validate: "" },
            total_check: { value: "", validate: "" },
            slip_sum_amount: { value: "", validate: "" },
            excess_amount: { value: "false", validate: "" },
        },
        data,
        true
    );

    const arrearMaxDate = moment().format("2014-03-31");
    const arrearMinDate = moment().format("2012-11-01");
    const calendarMinDate = moment().format("2010-03-31");

    const entryList = (list_entry) => {
        if (list_entry?.pay_in_slip_entry.length > 0) {
            const last_date = list_entry?.pay_in_slip_entry[0].contribution_date;
            const last_book = list_entry?.pay_in_slip_entry[0].book_no;
            const last_receipt = parseInt(list_entry?.pay_in_slip_entry[0].receipt_no);
            const sum_amount = parseInt(list_entry?.amount.amount);

            setSumAmount(sum_amount);
            setLastCollectionDate(last_date);

            if (last_receipt < 600) {
                setLastBookNumber(last_book);
                setLastReceiptNumber(last_receipt + 1);
            } else if (last_receipt == 600) {
                setLastReceiptNumber(1);
            } else if (!isNaN(last_book)) {
                setLastBookNumber(1);
                setLastReceiptNumber(last_receipt);
            } else {
                setLastBookNumber(1);
                setLastReceiptNumber(1);
            }
        }
    };

    //! Parent_Callback
    const checkTotal = (e) => {
        validator.setState((state) => {
            state.total_check.value = e;
            return { ...state };
        });
    };

    useEffect(() => {
        validator.setState((state) => {
            state.checkMonth.value = arr;
            return { ...state };
        });
    }, [arr]);

    useEffect(() => {
        validator.setState((state) => {
            state.total_check.value = totalAmount;
            return { ...state };
        });
    }, [totalAmount]);

    useEffect(() => {
        validator.setState((state) => {
            state.sum_amount.value = sumAmount;
            state.book_no.value = lastBookNumber;
            state.receipt_no.value = lastReceiptNumber;
            state.collection_date.value = lastCollectionDate;
            return { ...state };
        });
    }, [lastBookNumber, lastReceiptNumber, lastCollectionDate]);

    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name, setState) => {
            switch (name) {
                case "search_type":
                    setState((state) => {
                        if (value === "radio_ssin") {
                            state.ssin.required = true;
                            state.ssin.validate = "required|number|length:12";
                            state.ssin.value = "";
                            state.ssin.error = null;

                            state.registration.required = false;
                            state.registration.validate = "";
                            state.registration.value = "";
                            state.registration.error = null;

                            state.ben_name.required = true;
                            state.ben_name.validate = "required";
                            state.ben_name.value = "";
                            state.ben_name.error = null;
                        } else if (value === "radio_reg") {
                            state.ssin.required = false;
                            state.ssin.validate = "";
                            state.ssin.value = "";
                            state.ssin.error = null;

                            state.registration.required = true;
                            state.registration.validate = "required";
                            state.registration.value = "";
                            state.registration.error = null;

                            state.ben_name.required = true;
                            state.ben_name.validate = "require";
                            state.ben_name.value = "";
                            state.ben_name.error = null;
                        }
                        return { ...state };
                    });
                    break;
                case "ssin":
                    if (form.search_type.value === "radio_ssin" && evt.value.length === 12 && (form.collection_date.value != null || form.collection_date.value != "")) {
                        try {
                            if (!evt.value) return;
                            setSsinName({ data: null, loading: true });
                            const a = await fetcher(`/form4-get-beneficiary-name-by-number?number=${evt.value}&search_type=${form.search_type.value}&collection_date=${form.collection_date.value}&district_code=${form.district_code.value}`);

                            validator.setState((state) => {
                                state.ben_name.value = a.applicant_name;
                                state.financial_year.value = a.financial_year_id;
                                return { ...state };
                            });
                            setMonths(a.data);
                            setSsinName({ data: null, loading: false });
                        } catch (error) {
                            toast.error(error.message);
                            setSsinName({ data: null, loading: false });
                        }
                    }
                    break;
                case "registration":
                    if (form.search_type.value === "radio_reg" && evt.value.length === 10 && (form.collection_date.value != null || form.collection_date.value != "")) {
                        try {
                            if (!evt.value) return;
                            setSsinName({ data: null, loading: true });
                            const a = await fetcher(`/form4-get-beneficiary-name-by-number?number=${evt.value}&search_type=${form.search_type.value}&collection_date=${form.collection_date.value}&district_code=${form.district_code.value}`);

                            validator.setState((state) => {
                                state.ben_name.value = a.applicant_name;
                                state.financial_year.value = a.financial_year_id;
                                return { ...state };
                            });
                            setMonths(a.data);
                            setSsinName({ data: null, loading: false });
                        } catch (error) {
                            toast.error(error.message);
                            setSsinName({ data: null, loading: false });
                        }
                    }
                    break;
                case "collection_date":
                    setState((state) => {
                        if (value) {
                            if (value > state.deposit_date.value) {
                                state.collection_date.error = "Collection Date must be under deposit date";
                            }
                            if (value < calendarMinDate) {
                                state.collection_date.error = "Collection Date must be above 2010-03-31";
                            }
                            if (value >= arrearMinDate && value <= arrearMaxDate) {
                                setAreaContribution(true);
                            } else {
                                setAreaContribution(false);
                            }
                        }
                        return { ...state };
                    });

                    try {
                        let number = 0;
                        if (!evt.value || !number) return;
                        setSsinName({ data: null, loading: true });
                        if (form.search_type.value === "radio_ssin") {
                            number = form.ssin.value;
                        } else {
                            number = form.registration.value;
                        }
                        const a = await fetcher(`/form4-get-beneficiary-name-by-number?number=${number}&search_type=${form.search_type.value}&collection_date=${evt.value}&district_code=${form.district_code.value}`);
                        validator.setState((state) => {
                            state.ben_name.value = a.applicant_name;
                            state.financial_year.value = a.financial_year_id;
                            return { ...state };
                        });
                        setMonths(a.data);
                        setSsinName({ data: null, loading: false });
                    } catch (error) {
                        toast.error(error.message);
                        setSsinName({ data: null, loading: false });
                    }
                    break;
                case "receipt_no":
                    //
                    break;
            }
        });
    };

    const { mutate: postData } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;

        if (form.ssin.value) {
            form.ssin.value = parseInt(form.ssin.value);
        }

        if (form.search_type.value === "radio_reg" && form.worker_type.value === "ow") {
            form.registration.value = parseInt(form.registration.value);
        }

        const formData = validator.generalize();

        postData(
            { url: `/form-four-entry-save`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("Pay In Slip Inserted Successfully..!!");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    return (
        <>
            <div className="card datatable-box mb-4">
                <div className="card-header py-2">
                    <h5 className="m-0 font-weight-bold text-white">Pay In Slip Details</h5>
                </div>

                {isFetching && <LoadingOverlay />}
                {error && <ErrorAlert error={error} />}

                <div className="card-body" style={{ position: "relative" }}>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label htmlFor="bank_ifsc" className="form-control-label">
                                Bank IFSC<span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="Bank IFSC"
                                className={`form-control ${form.bank_ifsc.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_ifsc.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_ifsc"
                                id="bank_ifsc"
                                required={form.bank_ifsc.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Ifsc</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_name" className="form-control-label">
                                Bank Name <span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="Bank Name"
                                className={`form-control ${form.bank_name.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_name.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_name"
                                id="bank_name"
                                required={form.bank_name.required}
                            />
                            <div className="invalid-feedback">Please enter Bank Name</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="bank_ac_no" className="form-control-label">
                                ACCOUNT NUMBER <span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="ACCOUNT NUMBER"
                                className={`form-control ${form.bank_ac_no.error && "is-invalid"}`}
                                type="text"
                                value={form.bank_ac_no.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="bank_ac_no"
                                id="bank_ac_no"
                                required={form.bank_ac_no.required}
                            />
                            <div className="invalid-feedback">Please enter A/C Number</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="deposit_amount" className="form-control-label">
                                Deposit Amount<span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="Deposit Amount"
                                className={`form-control ${form.deposit_amount.error && "is-invalid"}`}
                                type="text"
                                value={form.deposit_amount.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="deposit_amount"
                                id="deposit_amount"
                                required={form.deposit_amount.required}
                            />
                            <div className="invalid-feedback">Please enter Deposit Amount</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="arn_number" className="form-control-label">
                                ARN NUMBER<span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="ARN NUMBER "
                                className={`form-control ${form.arn_number.error && "is-invalid"}`}
                                type="text"
                                value={form.arn_number.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="arn_number"
                                id="arn_number"
                                // required={form.arn_number.required}
                            />
                            <div className="invalid-feedback">Please enter ARN Number</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="arn_name" className="form-control-label">
                                ARN NAME <span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="ARN NAME"
                                className={`form-control ${form.arn_name.error && "is-invalid"}`}
                                type="text"
                                value={form.arn_name.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="arn_name"
                                id="arn_name"
                                required={form.arn_name.required}
                            />
                            <div className="invalid-feedback">Please enter ARN Name</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="arn_name" className="form-control-label">
                                RLO NAME <span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="ARN NAME"
                                className={`form-control ${form.rlo_name.error && "is-invalid"}`}
                                type="text"
                                value={form.rlo_name.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="rlo_name"
                                id="rlo_name"
                                required={form.rlo_name.required}
                            />
                            <div className="invalid-feedback">Please enter ARN Name</div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="deposit_date" className="form-control-label">
                                DATE OF DEPOSIT <span className="text-danger">*</span>
                            </label>
                            <input
                                disabled={id ? true : false}
                                placeholder="DATE OF DEPOSIT"
                                className={`form-control ${form.deposit_date.error && "is-invalid"}`}
                                type="date"
                                value={form.deposit_date.value}
                                onChange={(e) => handleChange(e.currentTarget)}
                                name="deposit_date"
                                id="deposit_date"
                                required={form.deposit_date.required}
                            />
                            <div className="invalid-feedback">Please Select Deposit Date</div>
                        </div>

                        <label htmlFor="deposit_date" className="form-control-label">
                            Worker_Type - {form.worker_type.value}
                        </label>
                    </div>
                </div>
            </div>

            <div className="card datatable-box mb-4">
                <div className="card-header py-2">
                    <h5 className="m-0 font-weight-bold text-white">Form 4 Entry</h5>
                </div>
                <div className="card-body" style={{ position: "relative" }}>
                    <form onSubmit={handleSubmit} noValidate autoComplete="off">
                        <div className="row">
                            <div className="col-md-1">
                                <label className="form-control-label">Search By {form.search_type.required && <span className="text-danger">*</span>}</label>
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${form.search_type.error && "is-invalid"}`}
                                        type="radio"
                                        name="search_type"
                                        id="search_type1"
                                        onChange={() => handleChange({ name: "search_type", value: "radio_ssin" })}
                                        checked={form.search_type.value == "radio_ssin" ? true : false}
                                        value="radio_ssin"
                                        required={form.search_type.required}
                                    />
                                    <label className="form-check-label" htmlFor="search_type1">
                                        SSIN
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${form.search_type.error && "is-invalid"}`}
                                        type="radio"
                                        name="search_type"
                                        id="search_type2"
                                        onChange={() => handleChange({ name: "search_type", value: "radio_reg" })}
                                        checked={form.search_type.value == "radio_reg" ? true : false}
                                        value="radio_reg"
                                        required={form.search_type.required}
                                    />
                                    <label className="form-check-label" htmlFor="search_type2">
                                        Registration
                                    </label>
                                </div>
                            </div>

                            {form.search_type.value === "radio_ssin" && (
                                <div className="col-md-2">
                                    <label className="form-control-label" htmlFor="ssin">
                                        SSIN No. <span className="text-danger">*</span> {form.ssin.required}
                                    </label>
                                    <input
                                        type="number"
                                        pattern="[0-9]*"
                                        id="ssin"
                                        name="ssin"
                                        className={`form-control ${form.ssin.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.ssin.value}
                                        required={form.ssin.required}
                                        placeholder="Enter SSIN No."
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.ssin.error}
                                    </div>
                                    {ssinName.loading && (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {form.search_type.value === "radio_reg" && (
                                <div className="col-md-2">
                                    <label className="form-control-label" htmlFor="aadhar">
                                        Registration No. <span className="text-danger">*</span> {form.registration.required}
                                    </label>
                                    <input
                                        type="text"
                                        id="registration"
                                        name="registration"
                                        className={`form-control ${form.registration.error && "is-invalid"}`}
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.registration.value}
                                        required={form.registration.required}
                                        placeholder="Enter Registration No."
                                    />
                                    <div id="Feedback" className="invalid-feedback">
                                        {form.registration.error}
                                    </div>
                                    {ssinName.loading && (
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="col-md-2">
                                <label htmlFor="ben_name" className="form-control-label">
                                    Beneficiary Name<span className="text-danger">*</span>
                                </label>
                                <input
                                    disabled={id ? true : false}
                                    placeholder="Beneficiary Name"
                                    className={`form-control ${form.ben_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.ben_name.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="ben_name"
                                    id="ben_name"
                                    required={form.ben_name.required}
                                />
                                <div className="invalid-feedback">Please Enter Beneficiary Name</div>
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="book_no" className="form-control-label">
                                    Book No.<span className="text-danger">*</span>
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
                                <div className="invalid-feedback">Please Enter Book No.</div>
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="receipt_no" className="form-control-label">
                                    Receipt No.<span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="Receipt No."
                                    className={`form-control ${form.receipt_no.error && "is-invalid"}`}
                                    type="number"
                                    value={form.receipt_no.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="receipt_no"
                                    id="receipt_no"
                                    required={form.receipt_no.required}
                                />
                                <div className="invalid-feedback">Please Enter Receipt No.</div>
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="collection_date" className="form-control-label">
                                    Collection Date<span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="Collection Date"
                                    className={`form-control ${form.collection_date.error && "is-invalid"}`}
                                    type="date"
                                    max={form.deposit_date.value}
                                    min={calendarMinDate}
                                    defaultValue={form.collection_date.value}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                    name="collection_date"
                                    id="collection_date"
                                    required={form.collection_date.required}
                                />
                                <div className="invalid-feedback">{form.collection_date.error}</div>
                            </div>

                            <div className="col-md-1">
                                <label htmlFor="amount" className="form-control-label">
                                    Amount<span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="₹"
                                    className={`form-control ${form.amount.error && "is-invalid"}`}
                                    type="number"
                                    value={form.amount.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="amount"
                                    id="amount"
                                    required={form.amount.required}
                                />

                                <div className="invalid-feedback">Please Enter Amount.</div>
                            </div>
                        </div>

                        <div className="row justify-content-md-center">
                            {areaContribution && (
                                <div className="col-md-3">
                                    <div className="row">
                                        <label htmlFor="deposit_date" className="form-label">
                                            Arrear Contribution <span className="text-danger">*</span>
                                        </label>
                                        <div className="col-md-4">
                                            <input
                                                placeholder="₹20"
                                                className={`form-control ${form.rupees_20.error && "is-invalid"}`}
                                                type="number"
                                                value={form.rupees_20.value}
                                                onChange={(e) => handleChange(e.currentTarget)}
                                                name="rupees_20"
                                                id="rupees_20"
                                                required={form.rupees_20.required}
                                            />
                                            <div className="invalid-feedback">Enter Amount</div>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                placeholder="₹25"
                                                className={`form-control ${form.rupees_25.error && "is-invalid"}`}
                                                type="number"
                                                value={form.rupees_25.value}
                                                onChange={(e) => handleChange(e.currentTarget)}
                                                name="rupees_25"
                                                id="rupees_25"
                                                required={form.rupees_25.required}
                                            />
                                            <div className="invalid-feedback">Enter Amount</div>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                placeholder="₹5"
                                                className={`form-control ${form.rupees_5.error && "is-invalid"}`}
                                                type="number"
                                                value={form.rupees_5.value}
                                                onChange={(e) => handleChange(e.currentTarget)}
                                                name="rupees_5"
                                                id="rupees_5"
                                                required={form.rupees_5.required}
                                            />
                                            <div className="invalid-feedback">Enter Amount</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-3">
                                <label htmlFor="deposit_date" className="form-label">
                                    <>{`Monthly Contribution ( ${form.total_check.value} )`} </>
                                </label>

                                <ContributionMonthChecked
                                    value={months}
                                    onChange={(value) => {
                                        setMonths(value);
                                    }}
                                    arr={arr}
                                    setArr={setArr}
                                    setTotalAmountClicked={setTotalAmount}
                                    checked_total={checkTotal}
                                />
                                <label htmlFor="excess_amount" className="mt-3">
                                    Excess Amount : <SelectAllCheckBox type="checkbox" id="excess_amount" name="excess_amount" handleClick={handleChange} value={form.excess_amount.value} />
                                </label>
                            </div>
                        </div>

                        <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                            <button type="submit" className="btn btn-success btn-sm mt-3">
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card datatable-box mb-4">
                <div className="card-header py-2">
                    <h5 className="m-0 font-weight-bold text-white">Entry List</h5>
                </div>
                <Form4EntryList slip_id={id} parentCallback={entryList} district_code={form.district_code.value} />
            </div>
        </>
    );
};

export default Form4Entry;
