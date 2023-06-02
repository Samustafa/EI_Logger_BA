/**
 * Background Logging Constants
 * This class is used to store the logging constants that are used in the background script.
 */
class BGLoggingConstants {
    private _studyId?: string;
    private _userId?: string;
    private _taskId?: string;

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
    }
}

export const bgLoggingConstants = new BGLoggingConstants(undefined, undefined, undefined);
