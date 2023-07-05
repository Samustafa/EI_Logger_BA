import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Constants/Styles";
import * as React from "react";
import {useEffect, useState} from "react";
import {dataBase} from "@pages/popup/Database/database";
import {useNavigate} from "react-router-dom";
import {goToPage} from "@pages/popup/UtilityFunctions";

export function DemographicsButton({isDisabled}: { isDisabled?: boolean }) {
    const [hasDemographics, setHasDemographics] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(function checkIfShouldOpenDemographics() {
        dataBase.getHasDemographics()
            .then(hasDemographics => setHasDemographics(hasDemographics))
            .catch(error => console.error("DemographicsButton Couldn't fetch hasDemographics", error));
    }, []);

    return (<>{hasDemographics &&
        <button className={isDisabled ? buttonDisabledStyle : buttonStyle} disabled={isDisabled}
                onClick={() => goToPage('DEMOGRAPHICS', navigate)}>Edit
            Demographics</button>}</>);
}