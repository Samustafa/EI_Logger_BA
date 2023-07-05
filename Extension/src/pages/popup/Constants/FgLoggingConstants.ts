import {Port} from "@pages/popup/Types";
import {connectToBGPort, sendMessages} from "@pages/popup/UtilityFunctions";

/**
 * Foreground logging constants
 * This class is used to store the logging constants that are used in the Popup and communicates them to the background
 */
class LoggingConstants {
    private _userId?: string;
    private _taskId?: string;
    private _port?: Port;

    constructor(userId?: string, taskId?: string) {
        this._userId = userId;
        this._taskId = taskId;
    }


    get userId(): string {
        return <string>this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get taskId(): string {
        return <string>this._taskId;
    }

    set taskId(value: string) {
        this._taskId = value;
        const port = this._port ?? connectToBGPort('loggingConstantsPort');
        sendMessages(port, {taskId: value});
        this.disconnectPort();
    }

    private _initializePort() {
        this._port = connectToBGPort('loggingConstantsPort');
    }

    initialize({userId, taskId}: { userId: string, taskId: string }) {
        if (!this._port) this._initializePort();
        this.userId = userId;
        this.taskId = taskId;
    }

    disconnectPort() {
        this._port?.disconnect();
        this._port = undefined;
    }
}

export const fgLoggingConstants = new LoggingConstants(undefined, undefined);
