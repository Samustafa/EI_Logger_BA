import {inputDefaultStyle, inputErrorStyle, labelStyle} from "@pages/popup/Constants/Styles";
import React, {useEffect, useState} from "react";
import {LoadingButton} from "@pages/popup/Components/SharedComponents/LoadingButton";
import CustomizedMenus from "@pages/popup/Components/SharedComponents/CustomizedMenus";
import dayjs from "dayjs";
import {IDemographics} from "@pages/popup/Database/DatabaseInterfaces";
import {dataBase} from "@pages/popup/Database/database";
import {useNavigate} from "react-router-dom";
import {goToPage, handleErrorFromAsync} from "@pages/popup/UtilityFunctions";
import {SexType} from "@pages/popup/Types";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";
import {Title} from "@pages/popup/Components/SharedComponents/Title";

export function DemographicsPage() {

    const navigate = useNavigate();
    const formId = "demographicsForm";
    const [isValidating,] = useState<boolean>(false);
    const demographicsPrimaryKey = '0';
    const [generalError, setGeneralError] = useState<string>('');
    const [hasTasks, setHasTasks] = useState<boolean>(false);

    const birthDateInput = "birthDate";
    const [birthDate, setBirthDate] = useState<string>("");
    const [birthDateError, setBirthDateError] = useState<string>('');
    const birthDatePlaceHolder = "Insert Birth Date";
    const ageSection = <div className={"pb-1 pt-6"}>
        <label className={labelStyle} htmlFor={birthDateInput}>Birth Date</label>
        <input
            form={formId}                      //to associate with the form
            id={birthDateInput}                 //to associate with the label
            className={birthDateError ? inputErrorStyle : inputDefaultStyle}
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            disabled={isValidating}
            type={"date"}
            placeholder={birthDatePlaceHolder}
            autoFocus={true}
        />
    </div>

    const jobInput = "jobInput";
    const [job, setJob] = useState<string>("");
    const [jobError, setJobError] = useState<string>('');
    const jobPlaceHolder = "Insert Job";
    const jobSection = <div className={"p-1"}>
        <label className={labelStyle} htmlFor={jobInput}>Job</label>
        <input
            form={formId}                      //to associate with the form
            id={jobInput}                 //to associate with the label
            className={jobError ? inputErrorStyle : inputDefaultStyle}
            value={job}
            onChange={(event) => setJob(event.target.value)}
            disabled={isValidating}
            type={"text"}
            placeholder={jobPlaceHolder}
        />
    </div>

    const [sex, setSex] = useState<SexType>("sex")
    const [sexError, setSexError] = useState<string>('');
    const sexSection = <div className={"p-1"}>
        <label className={labelStyle} htmlFor={"sex-button"}>Choose Sex</label>
        <CustomizedMenus sex={sex} setSex={setSex} error={Boolean(sexError)}/>
    </div>

    const [open, setOpen] = useState<boolean>(false);


    useEffect(function logOpenedDemographics() {
        dataBase.logUserExtensionInteraction('OPENED:DEMOGRAPHICS')
    }, []);

    useEffect(function loadSavedDataIfExists() {
        dataBase.getDemographics()
            .then((demographics) => initializeForms(demographics))
            .catch((error) => handleErrorFromAsync(error, setGeneralError, setOpen))

        function initializeForms(demographics: IDemographics) {
            setSex(demographics.sex);
            setBirthDate(demographics.birthDate);
            setJob(demographics.job);
        }
    }, []);

    useEffect(function fetchHasTasks() {
        dataBase.getHasTasks()
            .then(setHasTasks)
            .catch(error => handleErrorFromAsync(error, setGeneralError, setOpen));
    }, []);

    function isFormValid() {
        return isDateValid(birthDate) && isSexSelected() && job !== '';
    }

    function isSexSelected() {
        return sex !== 'sex'
    }

    function isDateValid(age: string) {
        const date = dayjs(age)
        return date.isValid() && date.isBefore(dayjs()) && date.isAfter(dayjs().subtract(100, 'year'));
    }

    function setCorrespondingError() {
        if (!isDateValid(birthDate)) setBirthDateError('Invalid Date')
        if (!isSexSelected()) setSexError(' Invalid Sex')
        if (job === '') setJobError(' Invalid Job')

        setOpen(true);
    }

    function clearErrors() {
        setBirthDateError('')
        setSexError('')
        setJobError('')
    }

    function handleSubmit() {
        clearErrors();
        if (!isFormValid()) {
            setCorrespondingError();
            return;
        }

        const demographics: IDemographics = {
            id: demographicsPrimaryKey,
            birthDate: birthDate,
            job: job,
            sex: sex
        }

        dataBase.setDemographics(demographics)
            .then(() => handlePostSave())
            .catch((error) => handleErrorFromAsync(error, setGeneralError, setOpen))

        function handlePostSave() {
            dataBase.logUserExtensionInteraction('SUBMITTED:DEMOGRAPHICS');
            hasTasks ? goToPage('TASKS_PAGE', navigate) : goToPage('LOGGER_READY', navigate);
        }

    }

    return (
        <>
            <Title title={"Demographics"}/>
            <form id={formId}>
                {ageSection}
                <br/>
                {jobSection}
                <br/>
                {sexSection}
                <br/>
                <LoadingButton text={'Submit'} loadingText={'Validating...'} isLoading={isValidating} type={'button'}
                               onClick={handleSubmit}/>
            </form>

            <Notification notificationType={"error"} message={generalError + birthDateError + sexError + jobError}
                          open={open} setOpen={setOpen}/>
        </>
    );
}


