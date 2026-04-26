import { Schema, model, Model } from 'mongoose';

export interface Course {
    id: String;
    display: String;
}

export const courseSchema = new Schema ({
    id: String,
    display: String
}, {collection: 'C0llection0' });

export const courseModel : Model<Course> = model<Course>("Course", courseSchema);