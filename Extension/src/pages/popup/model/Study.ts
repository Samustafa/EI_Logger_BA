import {Task} from "@pages/popup/model/Task";

export class Study {
    private _studyId: string;
    private _name: string;
    private _hasDemographics: boolean;
    private _tasks: Task[];

    constructor(studyId: string, name: string, hasDemographics: boolean, tasks: Task[]) {
        this._studyId = studyId;
        this._name = name;
        this._hasDemographics = hasDemographics;
        this._tasks = tasks.map((task: Task) => new Task(task.taskId, task.text, task.preQuestions, task.postQuestions));
    }

    getIQuestions() {
        return this._tasks.flatMap((task: Task) => task.extractQuestions())
    }

    get studyId(): string {
        return this._studyId;
    }

    set studyId(value: string) {
        this._studyId = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get tasks(): Task[] {
        return this._tasks;
    }

    set tasks(value: Task[]) {
        this._tasks = value;
    }

    get hasDemographics(): boolean {
        return this._hasDemographics;
    }

    set hasDemographics(value: boolean) {
        this._hasDemographics = value;
    }
}