import {Study} from "@pages/popup/model/Study";
import {Task} from "@pages/popup/model/Task";
import {TextQuestion} from "@pages/popup/model/question/TextQuestion";
import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {RangeQuestion} from "@pages/popup/model/question/RangeQuestion";


export async function registerUser(code: string) {
    // const axiosResponse = await axios.post<{ userId: string }>(`http://localhost:8080/logger/registerUser/${code}`);
    // return axiosResponse.data.userId;
    return "99746344-7382-4d7c-9e60-6ed3a3cef427";
}

export async function getStudy(): Promise<Study> {
    // const axiosResponse = await axios.get<Study>(`http://localhost:8080/logger/getTestStudy`);
    // return axiosResponse.data;

    const task1 = new Task("1", "Task 1", [], []);
    const task2 = new Task("2", "Task 2", [new TextQuestion("1", "first: text question", 1000)], []);
    const task3 = new Task("3", "Task 3", [], [new TextQuestion("2", "second: text question", 1000)]);
    const task4 = new Task("4", "Task 4", [new TextQuestion("3", "third: text question", 1000),
        new MultipleChoiceQuestion("4", "fourth: multiple choice question", ["choice 1", "choice 2", "choice 3"]),
        new RangeQuestion("5", "fifth: range question", 5)], [new TextQuestion("6", "sixth: text question", 1000)]);

    const tasks: Task[] = [task1, task2, task3, task4];
    return new Study("64456e83d6b1e3463ca52923", "study 1", false, tasks);
}

/**
 * Sends a request to the server to log in the user
 * returns 200 if user exists, 401 if not, which then will be handled by the catch block
 * @param userId
 */
export async function login(userId: string) {
    // await axios.get(`http://localhost:8080/logger/authenticateUser/${userId}`);
}
