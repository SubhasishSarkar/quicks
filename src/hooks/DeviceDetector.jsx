import { useState, useEffect } from "react";

const useDeviceDetector = () => {
    const [deviceType, setDeviceType] = useState("");

    useEffect(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
            setDeviceType("Mobile");
        } else {
            setDeviceType("Desktop");
        }
    }, []);

    return deviceType;
};

export const isMobile = (deviceType) => {
    return deviceType === "Mobile" ? true : false;
};

export default useDeviceDetector;
