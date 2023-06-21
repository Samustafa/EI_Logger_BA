import {Route, Routes} from "react-router-dom";
import React from "react";
import LandingPage from "@pages/popup/Components/Not_Authenticated/LandingPage";
import Paths from "@pages/popup/Consts/Paths";
import {generalStyle} from "@pages/popup/Consts/Styles";
import {IdDisplayPage} from "@pages/popup/Components/Authenticated/IdDisplayPage";
import {TasksPage} from "@pages/popup/Components/Authenticated/TasksPage";
import {FetchingStudyData} from "@pages/popup/Components/Authenticated/FetchingStudyData";
import {DemographicsPage} from "@pages/popup/Components/Authenticated/DemographicsPage";
import {LoggerReadyPage} from "@pages/popup/Components/Authenticated/LoggerReady/LoggerReadyPage";
import {QuestionnairePage} from "@pages/popup/Components/Authenticated/Questions/QuestionnairePage";
import {InitializationPage} from "@pages/popup/Components/InitializationPage";
import {UploadPage} from "@pages/popup/Components/Authenticated/UploadPage";

export default function Popup() {
    return (
        <div className={generalStyle} style={{overflowY: "scroll"}}>
            <Routes>
                <Route path={Paths.initializationPage} element={<InitializationPage/>}/>
                <Route path={Paths.landingPage} element={<LandingPage/>}/>
                <Route path={Paths.idDisplayPage} element={<IdDisplayPage/>}/>
                <Route path={Paths.demographicsPage} element={<DemographicsPage/>}/>
                <Route path={Paths.tasksPage} element={<TasksPage/>}/>
                <Route path={Paths.fetchingStudyData} element={<FetchingStudyData/>}/>
                <Route path={Paths.defaultQuestionnaire} element={<QuestionnairePage/>}/>
                <Route path={Paths.loggerPage} element={<LoggerReadyPage/>}/>
                <Route path={Paths.uploadPage} element={<UploadPage/>}/>
            </Routes>
        </div>
    );
}