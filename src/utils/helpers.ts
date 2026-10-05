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

export function getSubjectBadge(subject?: { id?: string; name?: string } | string) {
  const name = typeof subject === "object" ? subject?.name || subject?.id : subject;
  const id = typeof subject === "object" ? subject?.id : subject;
  const key = (id || name || "").toUpperCase();

  if (key.includes("TOAN")) {
    return { bg: "bg-blue-50 text-blue-700 border-blue-200", label: name || "Toán học" };
  }
  if (key.includes("VAN") || key.includes("NGU VAN")) {
    return { bg: "bg-rose-50 text-rose-700 border-rose-200", label: name || "Ngữ văn" };
  }
  if (key.includes("ANH") || key.includes("ENG")) {
    return { bg: "bg-amber-50 text-amber-800 border-amber-200", label: name || "Tiếng Anh" };
  }
  if (key.includes("LY") || key.includes("VAT LY")) {
    return { bg: "bg-sky-50 text-sky-700 border-sky-200", label: name || "Vật lý" };
  }
  if (key.includes("HOA")) {
    return { bg: "bg-violet-50 text-violet-700 border-violet-200", label: name || "Hóa học" };
  }
  if (key.includes("SINH")) {
    return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", label: name || "Sinh học" };
  }
  if (key.includes("SU") || key.includes("LICH SU")) {
    return { bg: "bg-orange-50 text-orange-800 border-orange-200", label: name || "Lịch sử" };
  }
  if (key.includes("DIA")) {
    return { bg: "bg-teal-50 text-teal-700 border-teal-200", label: name || "Địa lý" };
  }
  if (key.includes("TIN")) {
    return { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", label: name || "Tin học" };
  }
  if (key.includes("GDCD") || key.includes("KINH TE") || key.includes("PHAP LUAT")) {
    return { bg: "bg-pink-50 text-pink-700 border-pink-200", label: name || "GDCD / KT-PL" };
  }
  if (key.includes("CN") || key.includes("CONG NGHE")) {
    return { bg: "bg-lime-50 text-lime-800 border-lime-200", label: name || "Công nghệ" };
  }
  return { bg: "bg-slate-100 text-slate-700 border-slate-200", label: name || "Toán học" };
}

export function getGradeBadge(grade?: { id?: number | string; name?: string } | number | string) {
  const name = typeof grade === "object" ? grade?.name : grade !== undefined ? `Khối ${grade}` : "";
  const id = typeof grade === "object" ? grade?.id : grade;
  const num = Number(id);

  if (num === 12) {
    return { bg: "bg-purple-50 text-purple-700 border-purple-200", label: "Khối 12" };
  }
  if (num === 11) {
    return { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Khối 11" };
  }
  if (num === 10) {
    return { bg: "bg-teal-50 text-teal-700 border-teal-200", label: "Khối 10" };
  }
  if (num >= 6 && num <= 9) {
    return { bg: "bg-amber-50 text-amber-800 border-amber-200", label: `Khối ${num}` };
  }
  return { bg: "bg-slate-100 text-slate-700 border-slate-200", label: name || "Khối 12" };
}

