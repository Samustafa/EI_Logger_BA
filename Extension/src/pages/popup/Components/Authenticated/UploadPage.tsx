import {useEffect, useState} from "react";
import {dataBase} from "@pages/popup/database";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {LoadingButton} from "@pages/popup/SharedComponents/LoadingButton";
import {useNavigate} from "react-router-dom";

export function UploadPage() {
    const navigate = useNavigate();

    const [numberOfObjectsToUpload, setNumberOfObjectsToUpload] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(function assignStates() {
        dataBase.getNumberOfObjectsToLoad()
            .then((response) => setNumberOfObjectsToUpload(response))
            .catch(error => handleErrorFromAsync(error, setError, setOpen));

    }, []);

    function handleBack() {
        goToPage("TASKS_PAGE", navigate);
    }

    function handleUpload() {
        console.log("handleUpload")
    }

    return <>
        <div className={"font-bold text-xl"}>Upload</div>

        <h2>Number of objects to upload: {numberOfObjectsToUpload}</h2>

        <LoadingButton text={'Back'} loadingText={'Uploading...'} isLoading={isUploading} onClick={handleBack}/>
        <LoadingButton text={'Upload'} loadingText={'Uploading...'} isLoading={isUploading} onClick={handleUpload}/>

        <Notification notificationType={"error"} message={error} open={open} setOpen={setOpen}/>
    </>


}