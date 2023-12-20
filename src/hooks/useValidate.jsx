import moment from "moment";
import { useEffect, useState } from "react";
// required|number|string|email|confirm_password

const prevStateConverter = (data, old) => {
    for (const [key] of Object.entries(data)) {
        if (data[key].validate.includes("required")) data[key].required = true;
        else data[key].required = false;
        data[key].disabled = data[key].disabled ? true : false;
    }

    if (old !== null) {
        for (const [key] of Object.entries(data)) {
            if (old[key] !== undefined && old[key] !== null) data[key].value = old[key];
        }
    }
    return data;
};

const useValidate = (value, old = null, dependency = false) => {
    const [state, setState] = useState(prevStateConverter(value, old));

    useEffect(() => {
        if (dependency)
            setState((state) => {
                const fill = prevStateConverter(state, old);
                return { ...fill };
            });
    }, [dependency, old]);

    const validOnChange = ({ value, name }, callback = () => void 0) => {
        const oldState = { value: value };
        const validation = state[name].validate;
        const message = state[name].errorMessage;
        if (validation) {
            const validate = validateField(validation.split("|"), value, message);
            oldState.error = validate.message;
        }
        // change state accordingly
        setState((prev) => {
            prev[name] = { ...prev[name], ...oldState };
            return { ...prev };
        });

        callback(value, name, setState);
    };

    const validateField = (validation, value, message) => {
        let validMsg = {
            valid: true,
            message: null,
        };
        for (let i = 0; i < validation.length; i++) {
            let type = validation[i].split(":")[0];
            let extra = validation[i].split(":")[1];

            switch (type) {
                case "required":
                    validMsg = checkRequired(value);
                    break;
                case "number":
                    validMsg = checkNumber(value);
                    break;
                case "string":
                    validMsg = checkString(value);
                    break;
                case "email":
                    validMsg = checkEmail(value);
                    break;
                case "confirm_password":
                    validMsg = checkConfirmPassword(value, state["password"].value);
                    break;
                case "length":
                    validMsg = checkStringLength(value, Number(extra));
                    break;
                case "min":
                    validMsg = checkMin(value, Number(extra));
                    break;
                case "max":
                    validMsg = checkMax(value, Number(extra));
                    break;
                case "special_character":
                    validMsg = checkNoSpecialCharacter(value);
                    break;
                case "onlyAlphabets":
                    validMsg = checkOnlyAlphabets(value);
                    break;
                case "indianPhone":
                    validMsg = indianPhone(value);
                    break;
                case "bankAccount":
                    validMsg = bankAccount(value);
                    break;
                case "maxDate":
                    validMsg = checkDateMax(value);
                    break;
                default:
                    validMsg = { valid: true, message: null };
            }
            if (!validMsg.valid) {
                if (message) validMsg.message = message;
                break;
            }
        }
        return validMsg;
    };

    const validate = () => {
        let flag = true;
        const oldState = { ...state };
        for (const [key] of Object.entries(oldState)) {
            const data = oldState[key];
            const validate = validateField(data.validate.split("|"), data.value);
            if (!validate.valid) flag = false;

            /* data.error looks for old error, flag updation not required for old error */
            if (data.error) flag = false;
            else data.error = validate.message;
            // data.error = validate.message;
        }
        if (!flag) setState({ ...oldState });
        return flag;
    };

    const generalize = (newState) => {
        const response = {};
        for (const [key, data] of Object.entries(newState ? { ...newState } : { ...state })) {
            response[key] = data.value;
        }
        return response;
    };

    const setError = (error) => {
        setState((state) => {
            for (const key in error) if (state[key]) state[key].error = error[key][0];
            return { ...state };
        });
    };

    const reset = () => {
        setState(value);
    };
    return [state, { validate, validOnChange, generalize, reset, setState, setError }];
};

export default useValidate;

const checkRequired = (value) => {
    if (value === undefined || value === null || value.length === 0 || value === "null") return { valid: false, message: "This field can not be empty" };
    else return { valid: true, message: null };
};

const checkNumber = (value) => {
    if (!isNaN(+value)) return { valid: true, message: null };
    else return { valid: false, message: "This field must be a number" };
};

const checkString = (value) => {
    if (typeof value == "string") return { valid: true, message: null };
    else return { valid: false, message: "This field must be a string" };
};

const checkStringLength = (value, length) => {
    if (value.length == length) return { valid: true, message: null };
    else return { valid: false, message: "Length of the field should be " + length };
};

const checkMin = (value, min) => {
    if (min <= value) return { valid: true, message: null };
    else return { valid: false, message: "Value lower than Minimum value " + min };
};

const checkMax = (value, max) => {
    if (max >= value) return { valid: true, message: null };
    else return { valid: false, message: "Value higher than Maximum value " + max };
};

const checkEmail = (value) => {
    if (!value) return { valid: true, message: null };
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) return { valid: true, message: null };
    else
        return {
            valid: false,
            message: "Please enter a valid email address",
        };
};

const checkConfirmPassword = (password, confirmPassword) => {
    if (password === confirmPassword) return { valid: true, message: null };
    return { valid: false, message: "Password does not match" };
};

const checkNoSpecialCharacter = (value) => {
    // eslint-disable-next-line no-useless-escape
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (regex.test(value)) return { valid: false, message: "Special characters are not allowed" };
    else return { valid: true, message: null };
};

const checkOnlyAlphabets = (value) => {
    if (!value) return { valid: true, message: null };
    if (value) {
        const regex = /^[A-Za-z ]+$/;
        if (regex.test(value)) return { valid: true, message: null };
        else return { valid: false, message: "Please enter only alphabets" };
    }
};

//indianPhoneNumberRegex = /^[6789]\d{9}$/;
const indianPhone = (value) => {
    if (!value) return { valid: true, message: null };
    if (value) {
        const regex = /^[6789]\d{9}$/;
        if (regex.test(value)) return { valid: true, message: null };
        else return { valid: false, message: "Please enter valid mobile number" };
    }
};

const bankAccount = (value) => {
    if (!value) return { valid: true, message: null };
    if (value) {
        if (value.length < 4) return { valid: false, message: "Please enter a valid account number" };
        else if (value.length > 18) return { valid: false, message: "Please enter a valid account number" };
        else return { valid: true, message: null };
    }
};

const checkDateMax = (value) => {
    if (!value) return { valid: true, message: null };
    if (value) {
        if (moment(value).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) return { valid: false, message: "Please enter a valid date" };
        else return { valid: true, message: null };
    }
};
