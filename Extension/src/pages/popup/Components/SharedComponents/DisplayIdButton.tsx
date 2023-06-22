import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {goToPage} from "@pages/popup/UtilityFunctions";

interface Props {
    isDisabled?: boolean
}

export function DisplayIdButton({isDisabled}: Props) {
    const navigate = useNavigate();

    return (
        <button className={isDisabled ? buttonDisabledStyle : buttonStyle}
                disabled={isDisabled}
                onClick={() => goToPage('DISPLAYING_ID', navigate)}>

            View your ID
        </button>
    )

}