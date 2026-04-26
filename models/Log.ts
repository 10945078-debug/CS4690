import { Schema, model, Model } from 'mongoose';

export interface Log {
    id: string;
    courseId: string;
    uvuId: string;
    date: string;
    text: string;
}

export const logSchema = new Schema ({
    id: String,
    courseId: String,
    uvuId: String,
    date: String,
    text: String
}, {collection: 'C0llection0' });

export const wrapperSchema = new Schema ({
    logs: [
        {
            id: String,
            courseId: String,
            uvuId: String,
            date: String,
            text: String
        }
    ]
}, {collection: 'C0llection0' });

export const logModel : Model<Log> = model<Log>('Log', wrapperSchema);