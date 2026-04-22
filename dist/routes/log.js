import express from 'express';
import { ApiLogRepository } from "../repositories/ApiLogRepository.js";
const router = express.Router();
router.get('/', async function (req, res, next) {
    try {
        const { courseId, uvuId } = req.query;
        const logReop = new ApiLogRepository;
        const logs = await logReop.getLogs(courseId, uvuId);
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async function (req, res, next) {
    try {
        const { courseId, uvuId, text } = req.query;
        const logReop = new ApiLogRepository;
        let log = await logReop.addLog(courseId, uvuId, text);
        res.json(log);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=log.js.map