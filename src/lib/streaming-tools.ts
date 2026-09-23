export type StreamingTool = {
  id: "flixpatrol" | "netflix" | "justwatch" | "showlabs" | "parrot" | "nielsen";
  href: string;
  cadence: "daily" | "weekly" | "industry";
  inUse?: boolean;
};

export const STREAMING_TOOLS: StreamingTool[] = [
  {
    id: "flixpatrol",
    href: "https://flixpatrol.com/title/fauda/",
    cadence: "weekly",
    inUse: true,
  },
  {
    id: "netflix",
    href: "https://www.netflix.com/tudum/top10",
    cadence: "weekly",
  },
  {
    id: "justwatch",
    href: "https://www.justwatch.com/us/tv-show/fauda",
    cadence: "daily",
  },
  {
    id: "showlabs",
    href: "https://www.showlabs.tv/en",
    cadence: "weekly",
  },
  {
    id: "parrot",
    href: "https://www.parrotanalytics.com",
    cadence: "industry",
  },
  {
    id: "nielsen",
    href: "https://www.nielsen.com/data-center/the-gauge/",
    cadence: "weekly",
  },
];
