import express from "express";
import { getActivity, getCharts, getSummary } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/charts", getCharts);
router.get("/activity", getActivity);

export default router;
