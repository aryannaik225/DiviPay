"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad/.test(userAgent); // Detect iPhones & iPads
    const isStandalone = window.navigator.standalone; // Check if running as PWA
    const isSmallScreen = window.innerWidth <= 1024; // Ensure it's not a MacBook or larger

    if (isIOS && !isStandalone && isSmallScreen) {
      setShowPrompt(true);
    }
  }, []);

  if (!showPrompt) return null; // Hide prompt if not needed

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-3 shadow-lg rounded-lg text-center z-50">
      <p className="text-sm text-black">
        Install DiviPay: Tap <strong>Share</strong> and then <strong>Add to Home Screen</strong>.
      </p>
      <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setShowPrompt(false)}>
        Got it!
      </button>
    </div>
  );
}
