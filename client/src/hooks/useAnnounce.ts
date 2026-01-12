"use client";

import { useCallback, useRef, useState } from "react";

// Hook for programmatic screen reader announcements.
export function useAnnounce() {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const announce = useCallback((text: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear then set to trigger re-announcement of same message
    setMessage("");
    requestAnimationFrame(() => {
      setMessage(text);
    });

    // Auto-clear after announcement
    timeoutRef.current = setTimeout(() => setMessage(""), 3000);
  }, []);

  const announcePolite = useCallback(
    (text: string) => announce(text),
    [announce]
  );

  const announceAssertive = useCallback(
    (text: string) => announce(text),
    [announce]
  );

  return {
    message,
    announce,
    announcePolite,
    announceAssertive,
  };
}
