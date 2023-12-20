// import axios from "axios";
import { toast } from "react-toastify";

export const fetcher = async (url) => {
    const token = localStorage.getItem("quicks_token");

    if (!token) throw new Error("There is no token");

    const res = await fetch(process.env.APP_BASE_API + url, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-type": "application/json",
        },
    });

    if (!res.ok) {
        try {
            return Promise.reject(await res.json());
        } catch (error) {
            return Promise.reject({ message: res.statusText });
        }
    }
    return await res.json();
};

export const updater = async (url, { method, body }) => {
    const token = localStorage.getItem("quicks_token");

    if (!token) throw new Error("There is no token");
    const options = {
        method: method,
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-type": "application/json",
        },
    };
    if (method !== "GET" && method !== "HEAD") options.body = JSON.stringify(body);
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

export const generateCaptcha = (canvas) => {
    const captchaChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#";
    const captchaLength = 6;
    const captcha = Array(captchaLength)
        .join()
        .split(",")
        .map(() => {
            return captchaChar.charAt(Math.floor(Math.random() * captchaChar.length));
        })
        .join("");
    const ctx = canvas.getContext("2d");
    canvas.height = 50;
    canvas.width = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "28px san-serif";
    const textWidth = ctx.measureText(captcha).width;
    ctx.fillText(captcha, canvas.width / 2 - textWidth / 2 - 33, 25 + 8);
    return captcha;
};

export const searchParamsToObject = (searchParams) => {
    let obj = {};
    for (const entry of searchParams.entries()) {
        obj[entry[0]] = entry[1];
    }
    return obj;
};

export const downloadFile = async (url, filename) => {
    try {
        // toast.info("Please wait,Your file is preparing");
        const token = localStorage.getItem("quicks_token");

        const res = await fetch(process.env.APP_BASE_API + url, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (res.ok === true) {
            toast.success("File Downloaded");
            const file = await res.blob();
            const urlObj = window.URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = urlObj;
            filename && link.setAttribute("download", filename);
            document.body.append(link);
            link.click();
            link.remove();

            return {
                status: true,
                message: "",
            };
        } else {
            return {
                status: false,
                message: await res.json(),
            };
        }
    } catch (error) {
        toast.error(error);
    }
};

export const blankOpenFile = async (url, filename) => {
    try {
        const token = localStorage.getItem("quicks_token");
        const res = await fetch(process.env.APP_BASE_API + url, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (res.ok === true) {
            const file = await res.blob();
            const fileURL = window.URL.createObjectURL(file);
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
        } else {
            toast.error("Something Wrong! Please try again some time later.");
            return false;
        }
    } catch (error) {
        return error;
    }
};

export const downloadExistingFile = async (apiUrl, filename) => {
    const token = localStorage.getItem("quicks_token");
    fetch(process.env.APP_BASE_API + apiUrl, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    })
        .then((response) => response.blob())
        .then((blob) => {
            // Create a temporary URL for the downloaded file
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a link element and click it to start the download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();

            // Clean up the temporary URL and the link element
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error("Error downloading the file:", error);
        });
};

export const Humanize = (str) => {
    var i,
        frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    let strName = frags.join(" ");
    if (strName.trim() === "Formv") strName = "Form-V";
    if (strName.trim() === "Delay") strName = "Prayer For Delay Condonation";
    if (strName.trim() === "Pf Aadhaar Doc") strName = "Aadhaar";
    if (strName.trim() === "Pf Scheme Passbook" || strName.trim() === "Pf Scheme Passbook Doc") strName = "Scheme Passbook (Page Containing First Subscription Details)";
    if (strName.trim() === "Pf Subscription" || strName.trim() === "Pf Subscription Doc") strName = "Scheme Passbook (First Page)";
    if (strName.trim() === "IMW Other Doc") strName = "Enquiry Report";
    if (strName.trim() === "Pf Nominee Passbook") strName = "Nominee Bank Passbook";
    if (strName.trim() === "Pf Death Certificate") strName = "Death Certificate";
    if (strName.trim() === "Pf Nominee Aadhaar Doc") strName = "Nominee Aadhaar";
    if (strName.trim() === "Dependency Details") strName = "Dependent Details";
    return strName;
};

export const autoPopulate = (item, validator) => {
    validator.setState((state) => {
        state.bank_name.value = item.bank_name || "";
        state.bank_branch_name.value = item.branch_name || "";
        state.bank_district_name.value = item.dist_code || "";
        state.bank_location.value = item.branch_address || "";
        return { ...state };
    });
    validator.validOnChange({ name: "bank_name", value: item.bank_name || "" });
    validator.validOnChange({ name: "bank_branch_name", value: item.branch_name || "" });
    validator.validOnChange({ name: "bank_district_name", value: item.dist_code || "" });
    validator.validOnChange({ name: "bank_location", value: item.branch_address || "" });
};

export const inWords = (num) => {
    const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if ((num = num.toString()).length > 9) return "overflow";
    const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = "";
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore " : "";
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh " : "";
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand " : "";
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred " : "";
    str += n[5] != 0 ? (str != "" ? " " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) + "Rupees" : "Rupees";
    return str;
};

export const getFileExtension = (params_url) => {
    if (params_url) {
        return Array.isArray(params_url) ? params_url.toString().split(/[#?]/)[0].split(".").pop().trim() : params_url.split(/[#?]/)[0].split(".").pop().trim();
    } else {
        return "pdf";
    }
};
