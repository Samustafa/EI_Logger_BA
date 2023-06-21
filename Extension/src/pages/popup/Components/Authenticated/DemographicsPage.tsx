import {inputDefaultStyle, inputErrorStyle} from "@pages/popup/Consts/Styles";
import React, {useEffect, useState} from "react";
import {LoadingButton} from "@pages/popup/SharedComponents/LoadingButton";
import CustomizedMenus from "@pages/popup/SharedComponents/CustomizedMenus";
import dayjs from "dayjs";
import {IDemographics} from "@pages/popup/Interfaces";
import {dataBase} from "@pages/popup/database";
import {useNavigate} from "react-router-dom";
import Paths from "@pages/popup/Consts/Paths";
import {extractAndSetError} from "@pages/popup/UtilityFunctions";
import {ErrorMessage} from "@pages/popup/SharedComponents/ErrorMessage";
import {SexType} from "@pages/popup/Types";

export function DemographicsPage() {

    const navigate = useNavigate();
    const formId = "demographicsForm";
    const [isValidating,] = useState<boolean>(false);
    const demographicsPrimaryKey = '0';
    const [generalError, setGeneralError] = useState<string>('');
    const [isStudyExists, setIsStudyExists] = useState<boolean>(false);


    const birthDateInput = "birthDate";
    const [birthDate, setBirthDate] = useState<string>("");
    const [birthDateError, setBirthDateError] = useState<string>('');
    const birthDatePlaceHolder = "Insert Birth Date";
    const ageSection = <>
        <label htmlFor={birthDateInput}>Birth Date</label>
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
    </>

    const jobInput = "jobInput";
    const [job, setJob] = useState<string>("");
    const [jobError, setJobError] = useState<string>('');
    const jobPlaceHolder = "Insert Job";
    const jobSection = <>
        <label htmlFor={jobInput}>Job</label>
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
    </>

    const [sex, setSex] = useState<SexType>("sex")
    const [sexError, setSexError] = useState<string>('');
    const sexSection = <>
        <label>Choose Sex</label>
        <CustomizedMenus sex={sex} setSex={setSex} error={Boolean(sexError)}/>
    </>


    useEffect(function logOpenedDemographics() {
        dataBase.logUserExtensionInteraction('OPENED:DEMOGRAPHICS')
    }, []);

    useEffect(function checkIfStudyExists() {
        dataBase.isStudyExists()
            .then((isStudyExists) => setIsStudyExists(isStudyExists))
            .catch((error) => extractAndSetError(error, setGeneralError))
    }, []);

    useEffect(function loadSavedDataIfExists() {
        dataBase.getDemographics()
            .then((demographics) => initializeForms(demographics))
            .catch((error) => extractAndSetError(error, setGeneralError))

        function initializeForms(demographics: IDemographics) {
            setSex(demographics.sex);
            setBirthDate(demographics.birthDate);
            setJob(demographics.job);
        }
    }, [])

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
            .catch((error) => extractAndSetError(error, setGeneralError))

        function handlePostSave() {
            dataBase.logUserExtensionInteraction('SUBMITTED:DEMOGRAPHICS');
            dataBase.setExtensionState('TASKS_PAGE');
            navigate(isStudyExists ? Paths.tasksPage : Paths.fetchingStudyData);
        }
    }

    return (
        <>
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

            <ErrorMessage error={generalError + birthDateError + sexError + jobError}/>
        </>
    );
}


