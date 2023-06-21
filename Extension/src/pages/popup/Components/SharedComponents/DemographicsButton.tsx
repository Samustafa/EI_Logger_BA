import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Consts/Styles";
import * as React from "react";
import {useEffect, useState} from "react";
import {dataBase} from "@pages/popup/database";
import Paths from "@pages/popup/Consts/Paths";
import {useNavigate} from "react-router-dom";

export function DemographicsButton({isDisabled}: { isDisabled?: boolean }) {
    const [hasDemographics, setHasDemographics] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(function checkIfShouldOpenDemographics() {
        dataBase.getHasDemographics()
            .then(hasDemographics => setHasDemographics(hasDemographics))
            .catch(error => console.error("DemographicsButton Couldn't fetch hasDemographics", error));
    }, []);

    function goToDemographics() {
        dataBase.setExtensionState('DEMOGRAPHICS')
            .then(() => navigate(Paths.demographicsPage))
            .catch(error => console.error("DemographicsButton Couldn't set extension state", error));
    }

    return (<>{hasDemographics &&
        <button className={isDisabled ? buttonDisabledStyle : buttonStyle} disabled={isDisabled}
                onClick={() => goToDemographics()}>Edit
            Demographics</button>}</>);
}