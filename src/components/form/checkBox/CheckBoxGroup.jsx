import React from "react";
import { CheckBoxGroupProvider } from "./CheckBoxGroup.context";

export function CheckBoxGroup({ children, onChange, value, ...rest }) {
    const [_value, setValue] = React.useState(value || []);

    React.useEffect(() => {
        setValue(value || []);
    }, [value]);

    const isCheckBoxSelected = (val) => _value.includes(val);

    const handleChange = (value) => {
        const items = _value.includes(value) ? _value.filter((v) => v !== value) : [..._value, value];
        onChange && onChange(items);
        if (value || value.length === 0) setValue([...items]);
    };

    return (
        <CheckBoxGroupProvider
            value={{
                isChipSelected: isCheckBoxSelected,
                onChange: handleChange,
            }}
        >
            <div {...rest}>{children}</div>
        </CheckBoxGroupProvider>
    );
}
