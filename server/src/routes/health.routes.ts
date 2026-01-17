import { Router, type Router as RouterType } from "express";
import { prisma } from "@/db";

const router: RouterType = Router();

// Returns health status with database connectivity check.
// Mounted at root level for infrastructure probe discovery
router.get("/health", async (_req, res) => {
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

// Used by orchestrators to determine if the service can accept traffic.
router.get("/ready", async (_req, res) => {
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

// Used by orchestrators to determine if the service is alive.
router.get("/live", (_req, res) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

export default router;
