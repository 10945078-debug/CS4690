import { ILogRepository } from "./ILogRepository.js";
//import {Course, Log} from "../models/types.js";
import {Course, courseModel } from "../models/Course.js";
import {Log, logModel } from "../models/Log.js";

console.log("ApiLogRepository loaded!");

interface CourseDocument {
    _id: any;
    logs: Log[]
    courses: Course[]; // This is the property that was "missing"
    __v?: number;
}

//There should be a unique repo for each class
export class ApiLogRepository implements ILogRepository {

    async getCourses(): Promise<Course[]> {
       const doc = await courseModel.findOne({}).lean() as unknown as CourseDocument;
       return doc?.courses || []
    }

    async getLogs(courseId: string, uvuId: string): Promise<Log[]> {
       const doc = await logModel.findOne({}).lean() as any;

       return (doc?.logs || []).filter((l: Log) => l.courseId === courseId && l.uvuId === uvuId);
    }

    async addLog(courseId: string , uvuId: string, text: string): Promise<void> {
        const newLogEntry = {
        courseId,
        uvuId,
        text,
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleString()
        };

        try {
            console.dir({message: "MongoDb Playload", payload: newLogEntry});
            await logModel.findOneAndUpdate(
            {},
            { $push: { logs: newLogEntry}},
            {upsert: true, new: true, runValidators: true, strict: false}
            );
            console.log('Updated Doc Structure')
            console.log('Log added successfully');
            //this.getLogs(courseId, uvuId);
        } catch (error) {
            console.error('Error adding log to MongoDB:', error);
            throw error;
        }
    }
};
