//import {Course, Log} from "../models/types.js";
import {Course} from "../models/Course.js";
import {Log} from "../models/Log.js";

export interface ILogRepository {
    getCourses(): Promise<Course[]>;
    getLogs(courseId: string, uvuId: string): Promise<Log[]>;
    addLog(courseId: string , uvuId: string, text: string): Promise<void>;
}