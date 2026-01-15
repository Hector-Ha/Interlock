import { Router, type Router as RouterType } from "express";
import { prisma } from "@/db";

const router: RouterType = Router();

/**
 * Health Check Endpoint
 * Returns health status with database connectivity check.
 * Mounted at root level for infrastructure probe discovery (AWS ALB, K8s).
 *
 * GET /health
 */
router.get("/health", async (req, res) => {
  const startTime = Date.now();

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - startTime;

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      database: "connected",
      responseTime: `${responseTime}ms`,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      database: "disconnected",
      responseTime: `${responseTime}ms`,
      error: "Database connection failed",
    });
  }
});

/**
 * Readiness Check Endpoint
 * Used by orchestrators to determine if the service can accept traffic.
 * Mounted at root level for infrastructure probe discovery (AWS ALB, K8s).
 *
 * GET /ready
 */
router.get("/ready", async (req, res) => {
  try {
    // Verify database is ready
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Liveness Check Endpoint
 * Used by orchestrators to determine if the service is alive.
 * Mounted at root level for infrastructure probe discovery (AWS ALB, K8s).
 *
 * GET /live
 */
router.get("/live", (req, res) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

export default router;
