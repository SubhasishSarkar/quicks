import React from "react";
import { CheckBoxGroup } from "./CheckBoxGroup";
import { useCheckBoxGroup } from "./CheckBoxGroup.context";

export const CheckBox = ({ children, value, ...rest }) => {
    const ctx = useCheckBoxGroup();
    const checked = ctx.isChipSelected(value);
    return <input type="checkbox" value={value} checked={checked} onChange={() => ctx.onChange(value)} {...rest} />;
};

CheckBox.Group = CheckBoxGroup;
