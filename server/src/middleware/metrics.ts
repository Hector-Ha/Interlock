import { Request, Response, NextFunction } from "express";
import { prisma } from "@/db";

interface Metrics {
  requests: {
    total: number;
    byStatus: Record<number, number>;
    avgLatency: number;
  };
  business: {
    totalUsers: number;
    totalTransfers: number;
    p2pTransfersToday: number;
  };
}

// In-memory request metrics
const requestMetrics = {
  total: 0,
  byStatus: {} as Record<number, number>,
  latencies: [] as number[],
};

/**
 * Metrics middleware for tracking request performance.
 * Records total requests, status codes, and latencies.
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - start;
    requestMetrics.total++;
    requestMetrics.byStatus[res.statusCode] =
      (requestMetrics.byStatus[res.statusCode] || 0) + 1;
    requestMetrics.latencies.push(latency);

    // Keep only last 1000 latencies to prevent memory bloat
    if (requestMetrics.latencies.length > 1000) {
      requestMetrics.latencies.shift();
    }
  });

  next();
}

/**
 * Get current metrics including request and business stats.
 */
export async function getMetrics(): Promise<Metrics> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Fetch business metrics from database
  const [totalUsers, totalTransfers, p2pToday] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count({
      where: { dwollaTransferId: { not: null } },
    }),
    prisma.transaction.count({
      where: {
        type: { in: ["P2P_SENT", "P2P_RECEIVED"] },
        createdAt: { gte: todayStart },
      },
    }),
  ]);

  // Calculate average latency
  const avgLatency =
    requestMetrics.latencies.length > 0
      ? requestMetrics.latencies.reduce((a, b) => a + b, 0) /
        requestMetrics.latencies.length
      : 0;

  return {
    requests: {
      total: requestMetrics.total,
      byStatus: { ...requestMetrics.byStatus },
      avgLatency: Math.round(avgLatency * 100) / 100,
    },
    business: {
      totalUsers,
      totalTransfers,
      // Divide by 2 because each P2P creates 2 records (sent + received)
      p2pTransfersToday: Math.floor(p2pToday / 2),
    },
  };
}

/**
 * Reset metrics (useful for testing)
 */
export function resetMetrics(): void {
  requestMetrics.total = 0;
  requestMetrics.byStatus = {};
  requestMetrics.latencies = [];
}
