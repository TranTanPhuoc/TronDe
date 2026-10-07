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
        bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Nhận Biết (NB)",
      };
    case "TH":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
        label: "Thông Hiểu (TH)",
      };
    case "VD":
      return {
        bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        label: "Vận Dụng (VD)",
      };
    case "VDC":
      return {
        bg: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
        label: "Vận Dụng Cao (VDC)",
      };
    default:
      return {
        bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        dot: "bg-slate-500",
        label: shortName,
      };
  }
}

export function getTypeBadge(shortName: string) {
  switch (shortName) {
    case "TN":
      return {
        bg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        label: "Trắc Nghiệm (TN)",
      };
    case "DS":
      return {
        bg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
        label: "Đúng Sai (DS)",
      };
    case "TLN":
      return {
        bg: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        label: "Trả Lời Ngắn (TLN)",
      };
    case "TL":
      return {
        bg: "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
        label: "Tự Luận (TL)",
      };
    default:
      return {
        bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
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

export function getSubjectBadge(subject?: { id?: string; name?: string } | string) {
  const name = typeof subject === "object" ? subject?.name || subject?.id : subject;
  const id = typeof subject === "object" ? subject?.id : subject;
  const key = (id || name || "").toUpperCase();

  if (key.includes("TOAN")) {
    return { bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800", label: name || "Toán học" };
  }
  if (key.includes("VAN") || key.includes("NGU VAN")) {
    return { bg: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800", label: name || "Ngữ văn" };
  }
  if (key.includes("ANH") || key.includes("ENG")) {
    return { bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800", label: name || "Tiếng Anh" };
  }
  if (key.includes("LY") || key.includes("VAT LY")) {
    return { bg: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800", label: name || "Vật lý" };
  }
  if (key.includes("HOA")) {
    return { bg: "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800", label: name || "Hóa học" };
  }
  if (key.includes("SINH")) {
    return { bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", label: name || "Sinh học" };
  }
  if (key.includes("SU") || key.includes("LICH SU")) {
    return { bg: "bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800", label: name || "Lịch sử" };
  }
  if (key.includes("DIA")) {
    return { bg: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800", label: name || "Địa lý" };
  }
  if (key.includes("TIN")) {
    return { bg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800", label: name || "Tin học" };
  }
  if (key.includes("GDCD") || key.includes("KINH TE") || key.includes("PHAP LUAT")) {
    return { bg: "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800", label: name || "GDCD / KT-PL" };
  }
  if (key.includes("CN") || key.includes("CONG NGHE")) {
    return { bg: "bg-lime-50 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border-lime-200 dark:border-lime-800", label: name || "Công nghệ" };
  }
  return { bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700", label: name || "Toán học" };
}

export function getGradeBadge(grade?: { id?: number | string; name?: string } | number | string) {
  const name = typeof grade === "object" ? grade?.name : grade !== undefined ? `Khối ${grade}` : "";
  const id = typeof grade === "object" ? grade?.id : grade;
  const num = Number(id);

  if (num === 12) {
    return { bg: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800", label: "Khối 12" };
  }
  if (num === 11) {
    return { bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800", label: "Khối 11" };
  }
  if (num === 10) {
    return { bg: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800", label: "Khối 10" };
  }
  if (num >= 6 && num <= 9) {
    return { bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800", label: `Khối ${num}` };
  }
  return { bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700", label: name || "Khối 12" };
}

