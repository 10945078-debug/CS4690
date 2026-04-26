import express, { Request, Response, NextFunction } from 'express';
import { ApiLogRepository } from "../repositories/ApiLogRepository.js";

const router = express.Router();

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const { courseId, uvuId } = req.query;

        const logRepo = new ApiLogRepository();
        const logs = await logRepo.getLogs(courseId as string, uvuId as string);

        res.json(logs);
    } catch (error) {
        next(error);
    }
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const { courseId , uvuId, text } = req.body;

        const logRepo = new ApiLogRepository();

        let log = await logRepo.addLog(courseId as string, uvuId as string, text as string);

        res.json(log);
    } catch (error) {
        next(error);
    }
});

export default router;