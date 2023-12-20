import { useEffect, useState } from "react";

const ContributionMonthChecked = ({ value, onChange, className, arr, setArr, setTotalAmountClicked, checked_total }) => {
    const [totalValue, setTotalValue] = useState(0);

    const [datalist, setDataList] = useState([
        { label: "APR", value: 4, amount: 0, disabled: false, checked: false },
        { label: "MAY", value: 5, amount: 0, disabled: false, checked: false },
        { label: "JUN", value: 6, amount: 0, disabled: false, checked: false },
        { label: "JUL", value: 7, amount: 0, disabled: false, checked: false },
        { label: "AUG", value: 8, amount: 0, disabled: false, checked: false },
        { label: "SEP", value: 9, amount: 0, disabled: false, checked: false },
        { label: "OCT", value: 10, amount: 0, disabled: false, checked: false },
        { label: "NOV", value: 11, amount: 0, disabled: false, checked: false },
        { label: "DEC", value: 12, amount: 0, disabled: false, checked: false },
        { label: "JAN", value: 1, amount: 0, disabled: false, checked: false },
        { label: "FEB", value: 2, amount: 0, disabled: false, checked: false },
        { label: "MAR", value: 3, amount: 0, disabled: false, checked: false },
    ]);

    useEffect(() => {
        if (value?.length == 12) setDataList(value);
        checked_total(totalValue);
    }, [value, totalValue]);

    const onClick = (e) => {
        const index = arr.indexOf(e.value);
        if (index > -1) {
            arr.splice(index, 1);
            setTotalAmountClicked(totalValue);
        } else {
            setArr((array) => [...arr, e.value]);
            setTotalAmountClicked(totalValue);
        }
    };

    const onMonthChange = (id, checked, e) => {
        let data_amount = e.getAttribute("data-amount");
        setDataList((state) => {
            const newState = state.map((item) => {
                if (item.value === id) {
                    if (checked) {
                        return {
                            ...item,
                            checked: true,
                            total: setTotalValue(parseInt(totalValue) + parseInt(data_amount)),
                        };
                    } else {
                        return {
                            ...item,
                            checked: false,
                            total: setTotalValue(parseInt(totalValue) - parseInt(data_amount)),
                        };
                    }
                }
                return item;
            });
            onChange && onChange(newState);
            return [...newState];
        });
    };

    return (
        <div className={"form-grid " + (className ? className : "")}>
            {datalist.map((item, index) => (
                <div key={index} className="month-form-control">
                    <input
                        onChange={(e) => {
                            onClick(e.currentTarget);
                            onMonthChange(item.value, e.currentTarget.checked, e.currentTarget);
                        }}
                        type="checkbox"
                        id={item.value}
                        data-amount={item.amount}
                        value={item.value}
                        checked={item.checked}
                        disabled={item.disabled}
                    />
                    <label htmlFor={item.value}>{item.label}</label>
                </div>
            ))}
        </div>
    );
};

export default ContributionMonthChecked;
