import {Study} from "@pages/popup/model/Study";
import {Task} from "@pages/popup/model/Task";
import {RangeQuestion} from "@pages/popup/model/question/RangeQuestion";
import {MultipleChoiceQuestion} from "@pages/popup/model/question/MultipleChoiceQuestion";
import {TextQuestion} from "@pages/popup/model/question/TextQuestion";
import axios from "axios";


export async function registerUser(code: string) {
    const axiosResponse = await axios.post<{ userId: string }>(`http://localhost:8080/logger/registerUser/${code}`);
    return axiosResponse.data.userId;
}

/**
 * Sends a request to the server to log in the user
 * returns 200 if user exists, 401 if not, which then will be handled by the catch block
 * @param userId
 */
export async function login(userId: string) {
    await axios.get(`http://localhost:8080/logger/authenticateUser/${userId}`);
}

export async function getStudy(userId: string): Promise<Study> {
    const axiosResponse = await axios.get<Study>(`http://localhost:8080/logger/getTestStudy/${userId}`);
    return axiosResponse.data;
}


// Mocked methods for testing
export async function registerTestUser() {
    return "99746344-7382-4d7c-9e60-6ed3a3cef427";
}

export async function loginTestUser() {
    console.log("when method passes without problems the user will be logged in");
    console.log("Just use the method like this without changing anything in it");

}

export async function getTestStudy1(): Promise<Study> {
    const penicillinTask = new Task("1", "When was Penicillin invented and by whom?", [], []);

    const johnsonTaskText = "Mr Johnson and his family are planning a trip to Paris. Please write a summary of the following: What cultural events are there (for example on August 2023)? What sightseeing to do? Please also cover hotels, flights, travelling to Paris, and weather.";
    const johnsonTask = new Task("2", johnsonTaskText,
        [new RangeQuestion("1", "From one to ten, how fast, in your opinion, will you find the answer?", 10)],
        [new MultipleChoiceQuestion("2", "After trying to use the internet to get your information, would you rather get that information from", ["The internet", "A social network like Facebook or Reddit where you post your question and expect people to answer", "Through a travelling agency"]), new TextQuestion("3", "What was the hardest part of finding your answer?", 1000)]);
    return new Study("2", "Johnson", false, [penicillinTask, johnsonTask]);
}

export async function getTestStudy2(): Promise<Study> {
    const task1 = new Task("1", "Task 1", [], []);
    const task2 = new Task("2", "Task 2", [new TextQuestion("1", "first: text question", 1000)], []);
    const task3 = new Task("3", "Task 3", [], [new TextQuestion("2", "second: text question", 1000)]);
    const task4 = new Task("4", "Task 4", [new TextQuestion("3", "third: text question", 1000),
        new MultipleChoiceQuestion("4", "fourth: multiple choice question", ["choice 1", "choice 2", "choice 3"]),
        new RangeQuestion("5", "fifth: range question", 5)], [new TextQuestion("6", "sixth: text question", 1000)]);

    const tasks: Task[] = [task1, task2, task3, task4];
    return new Study("64456e83d6b1e3463ca52923", "study 1", false, tasks);
}

