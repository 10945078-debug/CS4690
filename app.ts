import express, {Request, Response} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db/connection.js'

await connectDB();

const logRouter = (await import ('./routes/log.js')).default;
const courseRouter =(await import ('./routes/course.js')).default;

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '/public')));
app.use(express.static(path.join(__dirname, '..', '/repositories')));

//Use static file from 'dist' directory
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/repositories', express.static(path.join(__dirname, '..', 'repositories')));

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/logs', logRouter);

app.use('/logs', logRouter);
app.use('/course', courseRouter);

//Index.html
app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;
