// /lib/ga.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Track a page view
export const pageview = (url: string): void => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track specific events
interface GAEventProps {
  action: string;
  category: string;
  label: string;
  value?: number;
}

export const event = ({
  action,
  category,
  label,
  value,
}: GAEventProps): void => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// ✅ Strongly typed global gtag declaration
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}
