import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//import fs from 'fs';
//import { Course, Log } from './models/types.js';
import logRouter from './routes/log.js';
import courseRouter from './routes/course.js';
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'repositories')));
//Use static file from 'dist' directory
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/repositories', express.static(path.join(__dirname, '..', 'repositories')));
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/logs', logRouter);
app.use('/logs', logRouter);
app.use('/course', courseRouter);
//Index.html
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
export default app;
//GRAVEYARD
/*
//API: Get All Courses
app.get('/api/v1/courses', (_req: Request, res: Response) => {
    const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
    const courses: Course[] = db.courses;
    res.json(courses)
});

//API: Get log by Course and UVU ID
app.get('/api/v1/logs', (req: Request, res: Response) => {
    //console.log('entering /api/v1');
    const { courseId, uvuId } = req.query;
    const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

    const filteredLogs: Log[] = db.logs.filter((l: Log) =>
    l.courseId === courseId && l.uvuId === uvuId);
    res.json(filteredLogs)
});

//API: Add a new log
app.post('/api/v1/logs', (req: Request, res: Response) => {
    const newLog: Log = req.body;
    const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

    db.logs.push(newLog);
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));

    res.status(201).json(newLog);
});
*/ 
//# sourceMappingURL=app.js.map