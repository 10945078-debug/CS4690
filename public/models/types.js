import mongoose, { model, Model, Schema } from 'mongoose';
export class Course {
    id;
    display;
}

const courseSchema = new Schema ({
    id: String,
    display: String
});

export class Log {
    id;
    courseId;
    uvuId;
    date;
    text;
}

const logSchema = new Schema ({
    id: String,
    courseId: String,
    uvuId: String,
    date: String,
    text: String
});

const courseModel = mongoose.model('Course', courseSchema);
const logModel = mongoose.model('Log', logSchema);
module.exports = courseModel;
module.exports = logModel;