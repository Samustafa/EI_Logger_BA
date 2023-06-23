import {useEffect, useState} from "react";
import {dataBase} from "@pages/popup/database";

export function UploadPage() {
    const [hasDemographics, setHasDemographics] = useState<boolean>(false);

    useEffect(function checkIfShouldOpenDemographics() {
        dataBase.getHasDemographics()
            .then(hasDemographics => setHasDemographics(hasDemographics))
            .catch(error => console.error("DemographicsButton Couldn't fetch hasDemographics", error));
    }, []);

    return (
        <div>
            <h1>Upload Page</h1>
        </div>
    );

}