import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "recently";
  }
}

// Clean street/graffiti themed badges for commenter numbers (User 1, User 2...)
export function getCommenterAvatar(userNumber: number) {
  const themes = [
    { bg: "bg-black text-white", border: "border-black", tag: "#111111" },
    { bg: "bg-blue-600 text-white", border: "border-blue-700", tag: "#2563EB" },
    { bg: "bg-amber-400 text-black", border: "border-amber-500", tag: "#F59E0B" },
    { bg: "bg-emerald-600 text-white", border: "border-emerald-700", tag: "#059669" },
    { bg: "bg-neutral-800 text-white", border: "border-neutral-900", tag: "#262626" },
    { bg: "bg-red-600 text-white", border: "border-red-700", tag: "#DC2626" },
    { bg: "bg-violet-600 text-white", border: "border-violet-700", tag: "#7C3AED" },
    { bg: "bg-sky-500 text-white", border: "border-sky-600", tag: "#0284C7" },
  ];

  const index = Math.abs((userNumber - 1) % themes.length);
  return themes[index];
}
