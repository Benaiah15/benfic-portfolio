"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Check if we have already tracked this specific browsing session
    const hasTracked = sessionStorage.getItem("tracked_visit");
    
    // Also, let's not track you while you are logged into the Admin panel!
    const isAdmin = sessionStorage.getItem("tab_auth");

    if (!hasTracked && !isAdmin) {
      // Ping our tracking API
      fetch("/api/track", { method: "POST" })
        .then(() => {
          // Mark this session as tracked so it doesn't fire again
          sessionStorage.setItem("tracked_visit", "true");
        })
        .catch((err) => console.error("Tracking failed", err));
    }
  }, []);

  return null; // This component is completely invisible
}