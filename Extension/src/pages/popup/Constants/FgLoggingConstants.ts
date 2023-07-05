import {Port} from "@pages/popup/Types";
import {connectToBGPort, sendMessages} from "@pages/popup/UtilityFunctions";

/**
 * Foreground logging constants
 * This class is used to store the logging constants that are used in the Popup and communicates them to the background
 */
class LoggingConstants {
    private _taskId?: string;
    private _port?: Port;

    constructor(taskId?: string) {
        this._taskId = taskId;
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

    initialize(taskId: string) {
        if (!this._port) this._initializePort();
        this.taskId = taskId;
    }

    disconnectPort() {
        this._port?.disconnect();
        this._port = undefined;
    }
}

export const fgLoggingConstants = new LoggingConstants(undefined);
