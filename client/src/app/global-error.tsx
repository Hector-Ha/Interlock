"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

/**
 * Global Error Boundary for Next.js App Router
 * Catches unhandled errors and reports them to Sentry.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-[#dee2e6]/50 p-8">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-[#fef2f2] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#ef4444]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-[#212529] mb-2">
              Something went wrong!
            </h2>
            <p className="text-[#70707b] mb-6">
              We apologize for the inconvenience. Our team has been notified and
              is working to fix the issue.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-[#f8f9fa] rounded-lg border border-[#dee2e6]/50 text-left">
                <p className="text-sm font-mono text-[#ef4444] break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-[#70707b] mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-4 py-2 bg-[#7839ee] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-4 py-2 border border-[#dee2e6] text-[#212529] rounded-lg hover:bg-[#f8f9fa] transition-colors font-medium"
              >
                Go Home
              </a>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-sm text-[#70707b]">
            If the problem persists, please contact support.
          </p>
        </div>
      </body>
    </html>
  );
}
