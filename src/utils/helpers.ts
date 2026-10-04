export function formatDateTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function getLevelBadge(shortName: string) {
  switch (shortName) {
    case "NB":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Nhận Biết (NB)",
      };
    case "TH":
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
        label: "Thông Hiểu (TH)",
      };
    case "VD":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "Vận Dụng (VD)",
      };
    case "VDC":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        label: "Vận Dụng Cao (VDC)",
      };
    default:
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-500",
        label: shortName,
      };
  }
}

export function getTypeBadge(shortName: string) {
  switch (shortName) {
    case "TN":
      return {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        label: "Trắc Nghiệm (TN)",
      };
    case "DS":
      return {
        bg: "bg-cyan-50 text-cyan-700 border-cyan-200",
        label: "Đúng Sai (DS)",
      };
    case "TLN":
      return {
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Trả Lời Ngắn (TLN)",
      };
    case "TL":
      return {
        bg: "bg-orange-50 text-orange-700 border-orange-200",
        label: "Tự Luận (TL)",
      };
    default:
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        label: shortName,
      };
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
