import {Port} from "@pages/popup/Types";
import {connectToPort, sendMessages} from "@pages/popup/UtilityFunctions";

/**
 * Foreground logging constants
 * This class is used to store the logging constants that are used in the Popup and communicates them to the background
 */
class LoggingConstants {
    private _studyId?: string;
    private _userId?: string;
    private _taskId?: string;
    private _port?: Port;

    constructor(studyId?: string, userId?: string, taskId?: string) {
        this._studyId = studyId;
        this._userId = userId;
        this._taskId = taskId;
    }

    get studyId(): string {
        return <string>this._studyId;
    }

    set studyId(value: string) {
        this._studyId = value;
        const port = this._port ?? connectToPort('loggingConstantsPort');
        sendMessages(port, {studyId: value});
    }

    get userId(): string {
        return <string>this._userId;
    }

    set userId(value: string) {
        this._userId = value;
        const port = this._port ?? connectToPort('loggingConstantsPort');
        sendMessages(port, {userId: value})
    }

    get taskId(): string {
        return <string>this._taskId;
    }

    set taskId(value: string) {
        this._taskId = value;
        const port = this._port ?? connectToPort('loggingConstantsPort');
        sendMessages(port, {taskId: value})
    }

    private _initializePort() {
        this._port = connectToPort('loggingConstantsPort');
    }


    initialize(userId: string, studyId: string, taskId: string) {
        if (!this._port) this._initializePort();
        this.userId = userId;
        this.studyId = studyId;
        this.taskId = taskId;
    }


}

export const fgLoggingConstants = new LoggingConstants(undefined, undefined, undefined);
