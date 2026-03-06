"use client";

import { useEffect } from "react";

type AdBannerProps = {
  className?: string;
  format?: string;
  slot?: string;
  style?: React.CSSProperties;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner() {
  return null;
}

