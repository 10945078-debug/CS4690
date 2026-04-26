import express, { Request, Response, NextFunction } from 'express';
import { ApiLogRepository } from "../repositories/ApiLogRepository.js";
import {Course} from "../models/Course.js"

const router = express.Router();

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
       const {courseId} = req.query;
       console.log(JSON.stringify(courseId));

        const courseRepo = new ApiLogRepository();
        const logs = await courseRepo.getCourses()

        res.json(logs);
    } catch (error) {
        next(error);
    }
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        //const courseReop : ApiLogRepository = new ApiLogRepository;
        let course : Course = req.body;

        res.json(course);
    } catch (error) {
        next(error);
    }
});

export default router;
