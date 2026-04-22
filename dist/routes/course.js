import express from 'express';
import { ApiLogRepository } from "../repositories/ApiLogRepository.js";
const router = express.Router();
router.get('/', async function (req, res, next) {
    try {
        const { courseId } = req.query;
        console.log(JSON.stringify(courseId));
        const courseReop = new ApiLogRepository;
        const logs = await courseReop.getCourses();
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async function (req, res, next) {
    try {
        //const courseReop : ApiLogRepository = new ApiLogRepository;
        let course = req.body;
        res.json(course);
    }
    catch (error) {
        next(error);
    }
});
// This handles GET /api/v1/courses
/*
router.get('/', (_req: Request, res: Response) => {
    //const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
    //const courses: Course[] = db.courses;
    const courseReop = new ApiLogRepository;
    const courses = courseReop.getCourses();
    res.json(courses);
});
*/
export default router;
//# sourceMappingURL=course.js.map