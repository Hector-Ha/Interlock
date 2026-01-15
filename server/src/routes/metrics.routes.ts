import { Router, type Router as RouterType } from "express";
import { getMetrics } from "@/middleware/metrics";

const router: RouterType = Router();

/**
 * Metrics Endpoint
 * Returns application metrics for monitoring.
 *
 * GET /api/v1/metrics
 */
router.get("/metrics", async (req, res) => {
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
