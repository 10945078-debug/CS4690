import { ILogRepository } from "./ILogRepository.js";
import {Course, Log} from "../models/types.js";
import dbData from "../db.json" with {type: "json"};
import * as fs from "fs";

//There should be a unique repo for each class
export class ApiLogRepository implements ILogRepository {

    async getCourses(): Promise<Course[]> {
        //const response = await axios.get<Course[]>(`${this.baseUrl}/courses`);
        const response = await dbData.courses;
        console.log(response);
        
        return response;
    }

    async getLogs(courseId: string, uvuId: string): Promise<Log[]> {
        // Repository should open and read the json file
        // It should also filter the file as needed
        //const response = await axios.get<Log[]>(`${this.baseUrl}/log?courseId=${courseId}&uvuId=${uvuId}`);
        const response = await dbData.logs

        const filtered = this.checkLogs(courseId, uvuId, response)
        return filtered;
    }

    async addLog(courseId: string , uvuId: string, text: string): Promise<void> {
        const newLog: Log = {
            courseId: courseId,
            uvuId: uvuId,
            text: text,
            id: this.generateRandomId(),
            date: new Date().toLocaleString()
        };
        
        dbData.logs.push(newLog);
        const newLogData = JSON.stringify(dbData);
        console.log(newLogData);
        await fs.writeFile('../db.json', newLogData, (err) => {
            if (err) console.error('Error writing to file: ', err);
            else console.log('Log added successfully');
        });

    }

    private generateRandomId(): string {
        return Math.random().toString(36).substring(2,9);
    }

    private checkLogs(courseId: string, uvuId: string, orgi: Log[]): Log[] {
        return orgi.filter((item: Log) => {
            return item.courseId === courseId && item.uvuId === uvuId;
        });
    }
};

//Graveyard
/*
async addLog(log: Log): Promise<void> {
        await axios.post(`${this.baseUrl}/logs`, log);
    }
*/