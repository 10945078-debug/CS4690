import { ILogRepository } from "./ILogRepository.js";
//import {Course, Log} from "../models/types.js";
import {Course, courseModel } from "../models/Course.js";
import {Log, logModel } from "../models/Log.js";
//import dbData from "../db.json" with {type: "json"};
//import * as fs from "fs";

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
        //const response = await axios.get<Course[]>(`${this.baseUrl}/courses`);
        /*
        const response = await dbData.courses;
        console.log(response);
        
        return response;
        */
       //const course = await courseModel.findById('69e5be14c101d72f294301e9').lean();
       //console.log(courses)
       //const course = await courseModel.findById('69e5be14c101d72f294301e9').lean();

       /*
       if (!course) {
        console.log("No course found with that ID in collection:", courseModel.collection.name);
        return [];
       }
       return [course as unknown as Course];
       */

       /*
       const result = await courseModel.find({}).lean() as unknown as CourseDocument;

       if(result.length > 0 && result[0].courses) {
        console.log("Successfully extracted courses:", result[0].courses.length);

        return result.[0].courses as unknown as Course[]
       }

       console.log("No courses found inside the document.");
       return [];
       */

       const doc = await courseModel.findOne({}).lean() as unknown as CourseDocument;
       return doc?.courses || []
    }

    async getLogs(courseId: string, uvuId: string): Promise<Log[]> {
        // Repository should open and read the json file
        // It should also filter the file as needed
        //const response = await axios.get<Log[]>(`${this.baseUrl}/log?courseId=${courseId}&uvuId=${uvuId}`);
        /*
        const response = await dbData.logs

        const filtered = this.checkLogs(courseId, uvuId, response)
        return filtered;
        */
       const doc = await logModel.findOne({}).lean() as any;

       //return await logModel.find({courseId, uvuId}).lean();

       return (doc?.logs || []).filter((l: Log) => l.courseId === courseId && l.uvuId === uvuId);
    }

    async addLog(courseId: string , uvuId: string, text: string): Promise<void> {
        /*
        const newLog = new logModel({
            courseId: courseId,
            uvuId: uvuId,
            text: text,
            id: Math.random().toString(36).substring(2,9),
            date: new Date().toLocaleString()
        });
        */

        const newLogEntry = {
        courseId,
        uvuId,
        text,
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleString()
    };
        
        /*
        dbData.logs.push(newLog);
        const newLogData = JSON.stringify(dbData);
        console.log(newLogData);
        await fs.writeFile('../db.json', newLogData, (err) => {
            if (err) console.error('Error writing to file: ', err);
            else console.log('Log added successfully');
        });
        */
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

    /*
    private generateRandomId(): string {
        return Math.random().toString(36).substring(2,9);
    }
    

    private checkLogs(courseId: string, uvuId: string, orgi: Log[]): Log[] {
        return orgi.filter((item: Log) => {
            return item.courseId === courseId && item.uvuId === uvuId;
        });
    }
    */
};

//Graveyard
/*
async addLog(log: Log): Promise<void> {
        await axios.post(`${this.baseUrl}/logs`, log);
    }
*/