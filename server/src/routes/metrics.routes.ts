import { Router, type Router as RouterType } from "express";
import { getMetrics } from "@/middleware/metrics";

const router: RouterType = Router();

// Returns application metrics for monitoring.
router.get("/metrics", async (_req, res) => {
  try {
    const metrics = await getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve metrics",
    });
  }
});

export default router;
