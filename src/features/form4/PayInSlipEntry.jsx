import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AsyncSelect from "../../components/select/AsyncSelect";
import { useValidate } from "../../hooks";
import { fetcher, updater } from "../../utils";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import { setPageAddress } from "../../store/slices/headerTitleSlice";

const PayInSlipEntry = () => {
    const user = useSelector((state) => state.user.user.id);
    const navigate = useNavigate();
    const { id } = useParams();
    //state for lwfc code
    const [lwfcCode, setLwfcCode] = useState();
    const { data, isFetching, error } = useQuery([`/form4-get-pay-in-slip-by-id`, id], () => fetcher(`/form4-get-pay-in-slip-by-id?id=${id}`), {
        enabled: id ? true : false,
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Pay In Slip Entry", url: "" }));
    }, []);

    const [form, validator] = useValidate(
        {
            uid: { value: user, validate: "required" },
            bank_ifsc: { value: "", validate: "required" },
            bank_name: { value: "", validate: "required" },
            bank_ac_no: { value: "", validate: "required" },
            deposit_amount: { value: "", validate: "required" },
            arn_number: { value: "", validate: "required" },
            arn_name: { value: "", validate: "required" },
            rlo_name: { value: "", validate: "required" },
            rlo_code: { value: "", validate: "required" },
            district_code: { value: "", validate: "required" },
            lwfc_code: { value: "", validate: "required" },
            worker_type: { value: "", validate: "required" },
            deposit_date: { value: "", validate: "required" },
        },
        data,
        true
    );

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.bank_ifsc.value = item.ifsc.replace(item.account_no) || "";
            state.bank_name.value = item.name || "";
            state.bank_ac_no.value = item.account_no || "";

            state.bank_ifsc.error = "";
            state.bank_name.error = "";
            state.bank_ac_no.error = "";
            return { ...state };
        });
    };

    const maxDate = moment().format("2020-03-31");
    const minDate = moment().format("2010-03-31");

    // handle input change event
    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name, setState) => {
            switch (name) {
                case "deposit_date":
                    setState((state) => {
                        if (value) {
                            const validateDate = moment(value).format("YYYY-MM-DD");
                            if (validateDate >= minDate && validateDate <= maxDate) {
                                state.deposit_date.error = "";
                            } else {
                                state.deposit_date.error = "Please provide valid deposit date.";
                            }
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate: getArnName } = useMutation((arn) => fetcher("/form4-get-arn-name-by-arn-number?arn_number=" + arn));
    const handleBlur = (e) => {
        if (!e == "") {
            getArnName(e, {
                onSuccess(data, variables, context) {
                    setLwfcCode(data?.lwfc_code);
                    validator.setState((state) => {
                        state.arn_number.success = data?.message;
                        state.arn_number.error = null;
                        state.arn_name.value = data?.arn_name;
                        state.rlo_name.value = data?.rlo_name;
                        state.rlo_code.value = data?.rlo_code;
                        state.district_code.value = data?.district_code;
                        state.lwfc_code.value = data?.lwfc_code;
                        return {
                            ...state,
                        };
                    });
                },
                onError(error, variables, context) {
                    validator.setState((state) => {
                        state.arn_number.success = null;
                        state.arn_number.error = error.message;
                        return {
                            ...state,
                        };
                    });
                },
            });
        }
    };

    const { mutate: postData } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        if (!data) {
            postData(
                { url: `/form4-pay-in-slip-entry`, body: formData },
                {
                    onSuccess(data, variables, context) {
                        toast.success("Pay In Slip Inserted Successfully..!!");
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        } else {
            postData(
                { url: `/form4-pay-in-slip-update?id=${id}`, body: formData },
                {
                    onSuccess(data, variables, context) {
                        toast.success("Pay In Slip Updated Successfully..!!");
                        navigate("/form4/pay-in-slip-list"); //
                    },
                    onError(error, variables, context) {
                        console.error(error);
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (!id) {
            validator.setState((state) => {
                state.bank_ifsc.value = "";
                state.bank_name.value = "";
                state.bank_ac_no.value = "";
                state.deposit_amount.value = "";
                state.arn_number.value = "";
                state.arn_name.value = "";
                state.deposit_date.value = "";
                return { ...state };
            });
        }
    }, [!id]);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}

            <div className="card datatable-box mb-4">
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor="arn_number" className="form-label">
                                    ARN Number<span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="ARN Number "
                                    className={`form-control ${form.arn_number.error && "is-invalid"}`}
                                    type="text"
                                    value={form.arn_number.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    onBlur={(e) => handleBlur(e.currentTarget.value)}
                                    name="arn_number"
                                    id="arn_number"
                                    required={form.arn_number.required}
                                    disabled={data ? true : false}
                                />
                                <div className="invalid-feedback">Please enter valid ARN Number</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="arn_name" className="form-label">
                                    ARN Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    disabled={true}
                                    placeholder="ARN Name"
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
                                <label htmlFor="rlo_name" className="form-label">
                                    RLO Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    disabled={true}
                                    placeholder="RLO Name"
                                    className={`form-control ${form.rlo_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.rlo_name.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="rlo_name"
                                    id="rlo_name"
                                    required={form.rlo_name.required}
                                />
                                <div className="invalid-feedback">Please enter RLO Name</div>
                            </div>
                            {lwfcCode && (
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="lwfc_code" className="form-control-label">
                                            LWFC <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${form.lwfc_code.error && "is-invalid"}`}
                                            id="lwfc_code"
                                            name="lwfc_code"
                                            onChange={(e) => {
                                                handleChange(e.currentTarget);
                                            }}
                                            value={form.lwfc_code.value}
                                            required={form.lwfc_code.required}
                                        >
                                            <option value="">Select LWFC</option>
                                            {lwfcCode?.map((item) => (
                                                <option value={item.lwfc_code} key={item.lwfc_code}>
                                                    {item.block_name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">Select Board</div>
                                    </div>
                                </div>
                            )}

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="worker_type" className="form-control-label">
                                        Board <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${form.worker_type.error && "is-invalid"}`}
                                        id="worker_type"
                                        name="worker_type"
                                        onChange={(e) => {
                                            handleChange(e.currentTarget);
                                        }}
                                        value={form.worker_type.value}
                                        required={form.worker_type.required}
                                    >
                                        <option value="">-Select-</option>
                                        <option value="ow">Others Worker</option>
                                        <option value="cw">Construction Worker</option>
                                        <option value="tw">Transport Worker</option>
                                    </select>
                                    <div className="invalid-feedback">Select Board</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="bank_ifsc" className="form-label">
                                    Bank IFSC<span className="text-danger">*</span>
                                </label>

                                <AsyncSelect
                                    className={form.bank_ifsc.error && "is-invalid"}
                                    loadOptions={async (value) => {
                                        try {
                                            const data = await fetcher(`/form4-get-bank-autocomplete?ifsc=${value}`);
                                            return data.map((item) => ({ ...item, value: `${item.ifsc} ${item.name} ${item.account_no}`, key: item.ifsc }));
                                        } catch (error) {
                                            return [];
                                        }
                                    }}
                                    onItemSubmit={autoPopulate}
                                    id="bank_ifsc"
                                    value={form.bank_ifsc.value}
                                    onChange={(value) => handleChange({ name: "bank_ifsc", value: value })}
                                    disabled={data ? true : false}
                                />

                                <div className="invalid-feedback">Please enter Bank Ifsc</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="bank_name" className="form-label">
                                    Bank Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="Bank Name"
                                    className={`form-control ${form.bank_name.error && "is-invalid"}`}
                                    type="text"
                                    value={form.bank_name.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="bank_name"
                                    id="bank_name"
                                    required={form.bank_name.required}
                                    disabled={data ? true : false}
                                />
                                <div className="invalid-feedback">Please enter Bank Name</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="bank_ac_no" className="form-label">
                                    ACCOUNT NUMBER <span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="ACCOUNT NUMBER"
                                    className={`form-control ${form.bank_ac_no.error && "is-invalid"}`}
                                    type="number"
                                    pattern="[0-9]*"
                                    value={form.bank_ac_no.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="bank_ac_no"
                                    id="bank_ac_no"
                                    required={form.bank_ac_no.required}
                                    disabled={data ? true : false}
                                />
                                <div className="invalid-feedback">Please enter A/C Number</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="deposit_amount" className="form-label">
                                    Deposit Amount<span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="Deposit Amount"
                                    className={`form-control ${form.deposit_amount.error && "is-invalid"}`}
                                    type="number"
                                    pattern="[0-9]*"
                                    value={form.deposit_amount.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="deposit_amount"
                                    id="deposit_amount"
                                    required={form.deposit_amount.required}
                                />
                                <div className="invalid-feedback">Please enter Deposit Amount</div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="deposit_date" className="form-label">
                                    DATE OF DEPOSIT <span className="text-danger">*</span>
                                </label>
                                <input
                                    placeholder="DATE OF DEPOSIT"
                                    className={`form-control ${form.deposit_date.error && "is-invalid"}`}
                                    type="date"
                                    value={form.deposit_date.value}
                                    onChange={(e) => handleChange(e.currentTarget)}
                                    name="deposit_date"
                                    id="deposit_date"
                                    required={form.deposit_date.required}
                                    disabled={data ? true : false}
                                />
                                <div className="invalid-feedback">Please Select Deposit Date</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button type="submit" className="btn btn-success btn-sm">
                                {!data ? "Submit" : "Update"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PayInSlipEntry;
