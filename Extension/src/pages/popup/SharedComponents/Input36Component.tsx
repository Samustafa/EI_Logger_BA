import {inputDefaultStyle, inputErrorStyle} from "@pages/popup/Consts/Styles";
import React from "react";

interface Props {
    isError: boolean;
    value: string;
    changeValue: (value: string) => void;
    isDisabled: boolean;
    name: string;
}

export function Input36Component({isError, value, changeValue, isDisabled, name}: Props) {
    return (<input
        className={isError ? inputErrorStyle : inputDefaultStyle}
        type="text"
        name={name}
        id="registrationCode"
        placeholder={"12345678-1234-1234-1234-123456789abc"}
        required={true}
        autoComplete={"one-time-code"}
        minLength={36}
        value={value}
        onChange={event => changeValue(event.target.value)}
        form={name}
        disabled={isDisabled}
    />)
}