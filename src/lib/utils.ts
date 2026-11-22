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

// Generate playful pastel / neon colors and avatar styling for commenter numbers (User #1, User #2...)
export function getCommenterAvatar(userNumber: number) {
  const themes = [
    { bg: "from-fuchsia-500 to-purple-600", text: "text-white", border: "border-fuchsia-400/40", emoji: "👾" },
    { bg: "from-cyan-500 to-blue-600", text: "text-white", border: "border-cyan-400/40", emoji: "🛸" },
    { bg: "from-emerald-400 to-teal-600", text: "text-black", border: "border-emerald-400/40", emoji: "🪐" },
    { bg: "from-amber-400 to-orange-500", text: "text-black", border: "border-amber-400/40", emoji: "⚡" },
    { bg: "from-pink-500 to-rose-600", text: "text-white", border: "border-pink-400/40", emoji: "🌸" },
    { bg: "from-violet-500 to-indigo-600", text: "text-white", border: "border-violet-400/40", emoji: "🔮" },
    { bg: "from-lime-400 to-emerald-600", text: "text-black", border: "border-lime-400/40", emoji: "🍄" },
    { bg: "from-sky-400 to-indigo-500", text: "text-white", border: "border-sky-400/40", emoji: "🌀" },
  ];

  const index = Math.abs((userNumber - 1) % themes.length);
  return themes[index];
}
