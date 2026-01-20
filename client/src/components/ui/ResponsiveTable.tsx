"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  priority?: "high" | "medium" | "low";
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  mobileCardRender?: (item: T) => ReactNode;
}

export function ResponsiveTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No data available",
  className,
  mobileCardRender,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">{emptyMessage}</div>
    );
  }

  // Mobile card view
  if (mobileCardRender) {
    return (
      <>
        {/* Mobile view */}
        <div className="md:hidden space-y-3">
          {data.map((item) => (
            <div
              key={keyExtractor(item)}
              className="bg-card rounded-lg border border-border p-4"
            >
              {mobileCardRender(item)}
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className={clsx("w-full", className)}>
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={clsx(
                      "px-4 py-3 text-left text-sm font-semibold text-foreground",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={clsx("px-4 py-3 text-sm", col.className)}
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // Default table only with horizontal scroll
  return (
    <div className="overflow-x-auto">
      <table className={clsx("w-full min-w-[600px]", className)}>
        <thead className="bg-muted/50 border-b border-border sticky top-0">
          <tr>
            {columns
              .filter((col) => !col.hideOnMobile)
              .map((col) => (
                <th
                  key={String(col.key)}
                  className={clsx(
                    "px-4 py-3 text-left text-sm font-semibold text-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="hover:bg-muted/50 transition-colors"
            >
              {columns
                .filter((col) => !col.hideOnMobile)
                .map((col) => (
                  <td
                    key={String(col.key)}
                    className={clsx("px-4 py-3 text-sm", col.className)}
                  >
                    {col.render
                      ? col.render(item)
                      : (item[col.key as keyof T] as ReactNode)}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
