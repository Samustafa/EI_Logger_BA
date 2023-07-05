/**
 * Background Logging Constants
 * This class is used to store the logging constants that are used in the background script.
 */
class BGLoggingConstants {
    private _taskId?: string;

    constructor(taskId?: string) {
        this._taskId = taskId;
    }

    get taskId(): string {
        return <string>this._taskId;
    }

    set taskId(value: string) {
        this._taskId = value;
    }
}

export const bgLoggingConstants = new BGLoggingConstants(undefined);
