import express, { Request, Response, NextFunction } from 'express';
import { ApiLogRepository } from "../repositories/ApiLogRepository.js";

const router = express.Router();

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const { courseId, uvuId } = req.query;

        const logReop = new ApiLogRepository;
        const logs = await logReop.getLogs(courseId as string, uvuId as string);

        res.json(logs);
    } catch (error) {
        next(error);
    }
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const { courseId , uvuId, text } = req.query;

        const logReop = new ApiLogRepository;

        let log = await logReop.addLog(courseId as any as string, uvuId as any as string, text as any as string);

        res.json(log);
    } catch (error) {
        next(error);
    }
});

export default router;