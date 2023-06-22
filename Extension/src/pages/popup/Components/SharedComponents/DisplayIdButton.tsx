import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Paths from "@pages/popup/Consts/Paths";

interface Props {
    isDisabled?: boolean
}

export function DisplayIdButton({isDisabled}: Props) {
    const navigate = useNavigate();

    return (
        <button className={isDisabled ? buttonDisabledStyle : buttonStyle}
                disabled={isDisabled}
                onClick={() => navigate(Paths.idDisplayPage)}>

            View your ID
        </button>
    )

}