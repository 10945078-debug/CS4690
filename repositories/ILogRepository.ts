import {Course, Log} from "../models/types.js";

export interface ILogRepository {
    getCourses(): Promise<Course[]>;
    getLogs(courseId: string, uvuId: string): Promise<Log[]>;
    addLog(courseId: string , uvuId: string, text: string): Promise<void>;
}