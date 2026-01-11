"use client";

import { useEffect, useState } from "react";

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
  clearAfter?: number;
}

// ARIA Live Region for announcing dynamic content changes to screen readers.
export function LiveRegion({
  message,
  politeness = "polite",
  clearAfter = 0,
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState(message);

  useEffect(() => {
    setAnnouncement(message);

    // Clear the message after a delay
    if (clearAfter > 0 && message) {
      const timeout = setTimeout(() => {
        setAnnouncement("");
      }, clearAfter);
      return () => clearTimeout(timeout);
    }
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
