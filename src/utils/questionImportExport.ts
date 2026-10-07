import * as XLSX from "xlsx";
import mammoth from "mammoth";
import {
  ExamItem,
  LevelShortName,
  TypeShortName,
  QUESTION_LEVELS,
  QUESTION_TYPES,
  SUBJECTS,
  GRADES,
} from "@/types/question";

export interface ParsedQuestionCandidate {
  tempId: string;
  lesson?: string; // Tên bài học SGK
  question: string;
  content: string;
  answer: string;
  solution_guide: string;
  levelShort: LevelShortName;
  typeShort: TypeShortName;
  subjectId: string;
  gradeId: number;
  isValid: boolean;
  warnings: string[];
}

/**
 * Normalizes Level string to LevelShortName ("NB" | "TH" | "VD" | "VDC")
 */
export function normalizeLevel(input: string): LevelShortName {
  if (!input) return "NB";
  const clean = input.trim().toLowerCase();
  if (clean.includes("vdc") || clean.includes("vận dụng cao") || clean.includes("van dung cao") || clean === "4") {
    return "VDC";
  }
  if (clean.includes("vd") || clean.includes("vận dụng") || clean.includes("van dung") || clean === "3") {
    return "VD";
  }
  if (clean.includes("th") || clean.includes("thông hiểu") || clean.includes("thong hieu") || clean === "2") {
    return "TH";
  }
  return "NB";
}

/**
 * Normalizes Question Type string to TypeShortName ("TN" | "DS" | "TLN" | "TL")
 */
export function normalizeType(input: string, content = "", answer = ""): TypeShortName {
  if (!input) {
    if (content.includes("A.") && content.includes("B.")) return "TN";
    if (["đúng", "sai", "dung", "true", "false"].includes(answer.trim().toLowerCase())) return "DS";
    return "TN";
  }
  const clean = input.trim().toLowerCase();
  if (clean.includes("ds") || clean.includes("đúng sai") || clean.includes("dung sai") || clean === "2") {
    return "DS";
  }
  if (clean.includes("tln") || clean.includes("trả lời ngắn") || clean.includes("tra loi ngan") || clean === "3") {
    return "TLN";
  }
  if (clean.includes("tl") || clean.includes("tự luận") || clean.includes("tu luan") || clean === "4") {
    return "TL";
  }
  return "TN";
}

/**
 * Normalizes Subject string to Subject ID
 */
export function normalizeSubject(input: string, defaultSubjectId = "TOAN"): string {
  if (!input) return defaultSubjectId;
  const clean = input.trim().toLowerCase();
  if (clean.includes("toán") || clean.includes("toan") || clean === "toan") return "TOAN";
  if (clean.includes("văn") || clean.includes("van") || clean === "van") return "VAN";
  if (clean.includes("anh") || clean.includes("tiếng anh") || clean === "anh") return "ANH";
  if (clean.includes("lý") || clean.includes("vật lý") || clean.includes("ly") || clean === "ly") return "LY";
  if (clean.includes("hóa") || clean.includes("hoa") || clean === "hoa") return "HOA";
  if (clean.includes("sinh") || clean === "sinh") return "SINH";
  if (clean.includes("sử") || clean.includes("lịch sử") || clean.includes("su") || clean === "su") return "SU";
  if (clean.includes("địa") || clean.includes("dia") || clean === "dia") return "DIA";
  if (clean.includes("tin") || clean === "tin") return "TIN";
  if (clean.includes("gdcd") || clean.includes("kinh tế") || clean.includes("pháp luật")) return "GDCD";
  if (clean.includes("công nghệ") || clean.includes("cong nghe") || clean === "cn") return "CN";
  return defaultSubjectId;
}

/**
 * Normalizes Grade string to Grade ID (6 - 12)
 */
export function normalizeGrade(input: string | number, defaultGradeId = 12): number {
  if (!input) return defaultGradeId;
  const text = String(input).trim();
  const match = text.match(/\b(12|11|10|9|8|7|6)\b/);
  if (match) return Number(match[1]);
  return defaultGradeId;
}

/**
 * Generates and downloads the standard Excel template file (.xlsx)
 */
export function downloadSampleExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Danh sách câu hỏi mẫu
  const sampleData = [
    [
      "STT",
      "Bài học (SGK)",
      "Câu hỏi / Lệnh hỏi",
      "Phương án lựa chọn",
      "Đáp án đúng",
      "Lời giải chi tiết",
      "Môn học",
      "Khối lớp",
      "Mức độ",
      "Dạng câu hỏi",
    ],
    [
      1,
      "Bài 1: Khảo sát hàm số",
      "Cho hàm số y = f(x) có bảng biến thiên như hình vẽ. Hàm số đồng biến trên khoảng nào dưới đây?",
      "A. (0; 2)\nB. (-∞; 0)\nC. (2; +∞)\nD. (-1; 1)",
      "A",
      "Dựa vào bảng biến thiên, đạo hàm f'(x) > 0 trên khoảng (0; 2) nên hàm số đồng biến trên khoảng này.",
      "Toán học",
      "Khối 12",
      "Nhận Biết",
      "Trắc Nghiệm",
    ],
    [
      2,
      "Bài 3: Mạch dao động RLC",
      "Đặt điện áp xoay chiều u = U0*cos(ωt) vào hai đầu đoạn mạch R, L, C mắc nối tiếp. Hiện tượng cộng hưởng xảy ra khi:",
      "A. ωL = 1 / (ωC)\nB. ωL = ωC\nC. ω = 1 / (LC)\nD. L = C",
      "A",
      "Điều kiện xảy ra cộng hưởng điện trong mạch RLC nối tiếp là ZL = ZC <=> ωL = 1/(ωC).",
      "Vật lý",
      "Khối 12",
      "Thông Hiểu",
      "Trắc Nghiệm",
    ],
    [
      3,
      "Bài 5: Kim loại kiềm và kiềm thổ",
      "Kim loại nào sau đây có tính dẫn điện tốt nhất?",
      "A. Ag (Bạc)\nB. Cu (Đồng)\nC. Al (Nhôm)\nD. Au (Vàng)",
      "A",
      "Bạc (Ag) là kim loại có độ dẫn điện tốt nhất trong tất cả các kim loại ở điều kiện thường.",
      "Hóa học",
      "Khối 12",
      "Nhận Biết",
      "Trắc Nghiệm",
    ],
    [
      4,
      "Bài 1: Dao động điều hòa",
      "Một chất điểm dao động điều hòa theo phương trình x = 6cos(2πt - π/4) (cm). Pha ban đầu của dao động là bao nhiêu radian?",
      "A. π/4 rad\nB. -π/4 rad\nC. 2π rad\nD. 6 rad",
      "B",
      "Theo phương trình x = A*cos(ωt + φ), pha ban đầu φ = -π/4 rad.",
      "Vật lý",
      "Khối 11",
      "Nhận Biết",
      "Trắc Nghiệm",
    ],
    [
      5,
      "Bài 2: Cực trị của hàm số",
      "Tìm giá trị của m để hàm số y = x^3 - 3mx^2 + 3(m^2 - 1)x đạt cực tiểu tại x = 2.",
      "",
      "1",
      "Đạo hàm y' = 3x^2 - 6mx + 3(m^2 - 1). Để x = 2 là cực tiểu thì y'(2) = 0 và y''(2) > 0, ta tìm được m = 1.",
      "Toán học",
      "Khối 12",
      "Vận Dụng",
      "Trả Lời Ngắn",
    ],
  ];

  const wsQuestions = XLSX.utils.aoa_to_sheet(sampleData);

  // Set column widths
  wsQuestions["!cols"] = [
    { wch: 6 },  // STT
    { wch: 25 }, // Bài học (SGK)
    { wch: 45 }, // Câu hỏi
    { wch: 30 }, // Phương án
    { wch: 14 }, // Đáp án
    { wch: 40 }, // Lời giải
    { wch: 14 }, // Môn học
    { wch: 12 }, // Khối lớp
    { wch: 14 }, // Mức độ
    { wch: 15 }, // Dạng câu
  ];

  XLSX.utils.book_append_sheet(wb, wsQuestions, "DanhSachCauHoi");

  // Sheet 2: Hướng dẫn nhập
  const guideData = [
    ["HƯỚNG DẪN ĐỊNH DẠNG FILE EXCEL NHẬP CÂU HỎI"],
    [""],
    ["1. Cột 'Bài học (SGK)': Nhập tên bài học trong SGK (ví dụ: 'Bài 1: Khảo sát hàm số') - không bắt buộc."],
    ["2. Cột 'Câu hỏi / Lệnh hỏi' (Bắt buộc): Nhập nội dung câu hỏi hoặc đề bài."],
    ["3. Cột 'Phương án lựa chọn': Nhập các phương án trắc nghiệm A., B., C., D. xuống dòng, hoặc có thể để trống với câu Tự luận/Trả lời ngắn."],
    ["4. Cột 'Đáp án đúng': Nhập chữ cái phương án đúng (A, B, C, D) hoặc giá trị đáp án đối với dạng Trả lời ngắn."],
    ["5. Cột 'Lời giải chi tiết': Nhập giải thích hoặc hướng dẫn giải từng bước (không bắt buộc)."],
    ["6. Cột 'Môn học': Toán học, Ngữ văn, Tiếng Anh, Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, Tin học, GDCD / KT-PL, Công nghệ."],
    ["7. Cột 'Khối lớp': Khối 12, Khối 11, Khối 10, Khối 9, Khối 8, Khối 7, Khối 6."],
    ["8. Cột 'Mức độ': Nhận Biết (NB), Thông Hiểu (TH), Vận Dụng (VD), Vận Dụng Cao (VDC)."],
    ["9. Cột 'Dạng câu hỏi': Trắc Nghiệm (TN), Đúng Sai (DS), Trả Lời Ngắn (TLN), Tự Luận (TL)."],
    ["* Lưu ý: Nếu cột Môn học hoặc Khối lớp để trống, hệ thống sẽ tự động áp dụng Môn học và Khối lớp mặc định bạn đã chọn."],
  ];
  const wsGuide = XLSX.utils.aoa_to_sheet(guideData);
  wsGuide["!cols"] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, "HuongDan");

  XLSX.writeFile(wb, "Mau_Nhap_Cau_Hoi.xlsx");
}

/**
 * Generates and downloads the standard Word template file (.docx)
 */
export function downloadSampleWordTemplate(): void {
  // Use HTML -> Blob or standard Word XML structure
  const wordContentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:after="120"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1E293B"/></w:rPr><w:t>BỘ GIÁO DỤC VÀ ĐÀO TẠO</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:after="300"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="4338CA"/></w:rPr><w:t>FILE MẪU NHẬP CÂU HỎI TỰ ĐỘNG (.DOCX)</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:spacing w:after="180"/></w:pPr>
      <w:r><w:rPr><w:i/><w:sz w:val="22"/><w:color w:val="64748B"/></w:rPr><w:t>(Quy tắc: Mỗi câu hỏi bắt đầu bằng "Câu [số]:" hoặc "Bài [số]:", các phương án A., B., C., D. ở từng dòng riêng, sau đó có các dòng "Đáp án:", "Lời giải:", "Mức độ: [NB/TH/VD/VDC]", "Dạng: [TN/DS/TLN/TL]")</w:t></w:r>
    </w:p>

    <!-- Câu 1 -->
    <w:p><w:pPr><w:spacing w:before="200" w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Câu 1: </w:t></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Cho hàm số y = f(x) có bảng biến thiên như hình vẽ. Hàm số đồng biến trên khoảng nào dưới đây?</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>A. (0; 2)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>B. (-∞; 0)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>C. (2; +∞)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>D. (-1; 1)</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="047857"/><w:sz w:val="24"/></w:rPr><w:t>Đáp án: A</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="475569"/></w:rPr><w:t>Lời giải: Dựa vào bảng biến thiên, đạo hàm f'(x) &gt; 0 trên khoảng (0; 2) nên hàm số đồng biến trên khoảng này.</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="160"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="64748B"/></w:rPr><w:t>Mức độ: NB | Dạng: TN</w:t></w:r></w:p>

    <!-- Câu 2 -->
    <w:p><w:pPr><w:spacing w:before="200" w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Câu 2: </w:t></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Đặt điện áp xoay chiều u = U0*cos(ωt) vào hai đầu đoạn mạch R, L, C mắc nối tiếp. Hiện tượng cộng hưởng điện xảy ra khi:</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>A. ωL = 1 / (ωC)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>B. ωL = ωC</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>C. ω = 1 / (LC)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>D. L = C</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="047857"/><w:sz w:val="24"/></w:rPr><w:t>Đáp án: A</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="475569"/></w:rPr><w:t>Lời giải: Điều kiện cộng hưởng điện là ZL = ZC &lt;=&gt; ωL = 1/(ωC).</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="160"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="64748B"/></w:rPr><w:t>Mức độ: TH | Dạng: TN</w:t></w:r></w:p>

    <!-- Câu 3 -->
    <w:p><w:pPr><w:spacing w:before="200" w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Câu 3: </w:t></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>Kim loại nào sau đây có độ dẫn điện tốt nhất?</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>A. Ag (Bạc)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>B. Cu (Đồng)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>C. Al (Nhôm)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="400"/><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>D. Au (Vàng)</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="047857"/><w:sz w:val="24"/></w:rPr><w:t>Đáp án: A</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="475569"/></w:rPr><w:t>Lời giải: Bạc là kim loại dẫn điện tốt nhất trong các kim loại.</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="160"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="64748B"/></w:rPr><w:t>Mức độ: NB | Dạng: TN</w:t></w:r></w:p>
  </w:body>
</w:document>`;

  // Reuse the built-in PKZip packaging mechanism for standard .docx
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  // Create Zip Archive and download
  const encoder = new TextEncoder();
  const files = [
    { name: "[Content_Types].xml", content: encoder.encode(contentTypesXml) },
    { name: "_rels/.rels", content: encoder.encode(rootRelsXml) },
    { name: "word/document.xml", content: encoder.encode(wordContentXml) },
  ];

  // Simple zip packer
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[i] = c;
  }
  const calcCrc = (bytes: Uint8Array) => {
    let crc = -1;
    for (let i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
    return (crc ^ -1) >>> 0;
  };

  const parts: Uint8Array[] = [];
  const entries: { nameBytes: Uint8Array; crc: number; size: number; offset: number }[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const crc = calcCrc(f.content);
    const size = f.content.length;

    const lh = new Uint8Array(30 + nameBytes.length);
    const v = new DataView(lh.buffer);
    v.setUint32(0, 0x04034b50, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 0x0800, true);
    v.setUint32(14, crc, true);
    v.setUint32(18, size, true);
    v.setUint32(22, size, true);
    v.setUint16(26, nameBytes.length, true);
    lh.set(nameBytes, 30);

    parts.push(lh);
    parts.push(f.content);
    entries.push({ nameBytes, crc, size, offset });
    offset += lh.length + size;
  }

  const cdStart = offset;
  let cdSize = 0;
  for (const e of entries) {
    const cdh = new Uint8Array(46 + e.nameBytes.length);
    const v = new DataView(cdh.buffer);
    v.setUint32(0, 0x02014b50, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 20, true);
    v.setUint16(8, 0x0800, true);
    v.setUint32(16, e.crc, true);
    v.setUint32(20, e.size, true);
    v.setUint32(24, e.size, true);
    v.setUint16(28, e.nameBytes.length, true);
    v.setUint32(42, e.offset, true);
    cdh.set(e.nameBytes, 46);

    parts.push(cdh);
    cdSize += cdh.length;
  }

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, cdStart, true);
  parts.push(eocd);

  const total = parts.reduce((acc, p) => acc + p.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const part of parts) {
    out.set(part, p);
    p += part.length;
  }

  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Mau_Nhap_Cau_Hoi.docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses an Excel file (.xlsx, .xls) into candidate question items
 */
export async function parseExcelFile(
  file: File,
  defaultSubjectId = "TOAN",
  defaultGradeId = 12
): Promise<ParsedQuestionCandidate[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  if (!workbook.SheetNames.length) {
    throw new Error("File Excel không chứa bất kỳ trang tính (sheet) nào!");
  }

  // Use the first sheet or the sheet named "DanhSachCauHoi"
  const targetSheetName =
    workbook.SheetNames.find((s) => s.toLowerCase().includes("cauhoi") || s.toLowerCase().includes("danhsach")) ||
    workbook.SheetNames[0];
  const sheet = workbook.Sheets[targetSheetName];

  const rawRows: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  if (rawRows.length < 2) {
    throw new Error("File Excel không chứa dữ liệu câu hỏi!");
  }

  // Detect header row index
  let headerRowIndex = -1;
  let colLesson = -1;
  let colQuestion = -1;
  let colContent = -1;
  let colAnswer = -1;
  let colSolution = -1;
  let colSubject = -1;
  let colGrade = -1;
  let colLevel = -1;
  let colType = -1;
  let colOptA = -1;
  let colOptB = -1;
  let colOptC = -1;
  let colOptD = -1;

  for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
    const row = rawRows[r].map((cell) => String(cell || "").toLowerCase().trim());
    const hasQuestion = row.some((c) => c.includes("câu hỏi") || c.includes("lệnh hỏi") || c.includes("question") || c.includes("đề bài"));
    if (hasQuestion) {
      headerRowIndex = r;
      row.forEach((c, idx) => {
        if (c.includes("bài học") || c.includes("lesson") || c.includes("tên bài") || c.includes("sgk")) {
          colLesson = idx;
        } else if (c.includes("câu hỏi") || c.includes("lệnh hỏi") || c.includes("question") || c.includes("đề bài")) {
          colQuestion = idx;
        } else if (c.includes("phương án") || c.includes("lựa chọn") || c.includes("nội dung")) {
          colContent = idx;
        } else if (c.includes("đáp án") || c.includes("answer") || c.includes("key")) {
          colAnswer = idx;
        } else if (c.includes("lời giải") || c.includes("hướng dẫn") || c.includes("giải chi tiết")) {
          colSolution = idx;
        } else if (c.includes("môn")) {
          colSubject = idx;
        } else if (c.includes("khối") || c.includes("lớp")) {
          colGrade = idx;
        } else if (c.includes("mức độ") || c.includes("level")) {
          colLevel = idx;
        } else if (c.includes("dạng") || c.includes("loại") || c.includes("type")) {
          colType = idx;
        } else if (c === "a" || c === "phương án a" || c === "đáp án a") {
          colOptA = idx;
        } else if (c === "b" || c === "phương án b" || c === "đáp án b") {
          colOptB = idx;
        } else if (c === "c" || c === "phương án c" || c === "đáp án c") {
          colOptC = idx;
        } else if (c === "d" || c === "phương án d" || c === "đáp án d") {
          colOptD = idx;
        }
      });
      break;
    }
  }

  // Fallback defaults if no explicit header found
  if (headerRowIndex === -1) {
    headerRowIndex = 0;
    colQuestion = 1;
    colContent = 2;
    colAnswer = 3;
    colSolution = 4;
    colSubject = 5;
    colGrade = 6;
    colLevel = 7;
    colType = 8;
  }

  const candidates: ParsedQuestionCandidate[] = [];

  for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    const qText = String(row[colQuestion] ?? "").trim();
    if (!qText) continue;

    const lesson = colLesson !== -1 ? String(row[colLesson] ?? "").trim() : "";

    let content = String(row[colContent] ?? "").trim();
    // If separate option columns exist
    if (!content && colOptA !== -1 && colOptB !== -1) {
      const parts: string[] = [];
      if (row[colOptA]) parts.push(`A. ${String(row[colOptA]).trim()}`);
      if (row[colOptB]) parts.push(`B. ${String(row[colOptB]).trim()}`);
      if (colOptC !== -1 && row[colOptC]) parts.push(`C. ${String(row[colOptC]).trim()}`);
      if (colOptD !== -1 && row[colOptD]) parts.push(`D. ${String(row[colOptD]).trim()}`);
      content = parts.join("\n");
    }

    const answer = String(row[colAnswer] ?? "").trim();
    const solution = String(row[colSolution] ?? "").trim();
    const subject = normalizeSubject(String(row[colSubject] ?? ""), defaultSubjectId);
    const grade = normalizeGrade(row[colGrade] ?? "", defaultGradeId);
    const level = normalizeLevel(String(row[colLevel] ?? ""));
    const type = normalizeType(String(row[colType] ?? ""), content, answer);

    const warnings: string[] = [];
    if (!answer) warnings.push("Chưa có đáp án");
    if (type === "TN" && !content) warnings.push("Câu trắc nghiệm chưa có phương án A, B, C, D");

    candidates.push({
      tempId: `cand-excel-${Date.now()}-${r}-${Math.random().toString(36).slice(2, 6)}`,
      lesson: lesson || undefined,
      question: qText,
      content,
      answer,
      solution_guide: solution,
      levelShort: level,
      typeShort: type,
      subjectId: subject,
      gradeId: grade,
      isValid: qText.length > 0,
      warnings,
    });
  }

  return candidates;
}

/**
 * Parses a Word file (.docx) into candidate question items
 */
export async function parseWordFile(
  file: File,
  defaultSubjectId = "TOAN",
  defaultGradeId = 12
): Promise<ParsedQuestionCandidate[]> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = result.value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (!text.trim()) {
    throw new Error("File Word không có nội dung văn bản nào!");
  }

  // Regex to detect start of questions: e.g. "Câu 1:", "Câu 1.", "Bài 1:", "Câu 01:"
  const questionStartRegex = /(?:^|\n)\s*(?:Câu|Bài|Question)\s+(\d+)[\.:\-\s]/gi;
  const matches = [...text.matchAll(questionStartRegex)];

  const candidates: ParsedQuestionCandidate[] = [];

  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const startIdx = matches[i].index! + matches[i][0].length;
      const endIdx = i < matches.length - 1 ? matches[i + 1].index! : text.length;
      const rawBlock = text.slice(startIdx, endIdx).trim();

      const candidate = parseSingleQuestionBlock(rawBlock, i + 1, defaultSubjectId, defaultGradeId);
      if (candidate) {
        candidates.push(candidate);
      }
    }
  } else {
    // Fallback: try splitting by numbered lines like "1.", "1:"
    const numberedRegex = /(?:^|\n)\s*(\d+)[\.:\)]\s+/gi;
    const numMatches = [...text.matchAll(numberedRegex)];
    if (numMatches.length > 0) {
      for (let i = 0; i < numMatches.length; i++) {
        const startIdx = numMatches[i].index! + numMatches[i][0].length;
        const endIdx = i < numMatches.length - 1 ? numMatches[i + 1].index! : text.length;
        const rawBlock = text.slice(startIdx, endIdx).trim();

        const candidate = parseSingleQuestionBlock(rawBlock, i + 1, defaultSubjectId, defaultGradeId);
        if (candidate) {
          candidates.push(candidate);
        }
      }
    } else {
      throw new Error(
        "Không nhận diện được cấu trúc câu hỏi trong file Word! Vui lòng định dạng mỗi câu theo mẫu 'Câu 1:', 'Câu 2:',..."
      );
    }
  }

  return candidates;
}

/**
 * Helper to parse a single text block representing one question
 */
function parseSingleQuestionBlock(
  block: string,
  index: number,
  defaultSubjectId: string,
  defaultGradeId: number
): ParsedQuestionCandidate | null {
  if (!block.trim()) return null;

  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  let answer = "";
  let solution = "";
  let levelStr = "";
  let typeStr = "";
  let subjectStr = "";
  let gradeStr = "";
  let lessonStr = "";

  const optionLines: string[] = [];
  const questionLines: string[] = [];
  let inSolution = false;

  const optRegex = /^([A-D])[\.:\)]\s*(.*)$/i;
  const ansRegex = /^(?:Đáp án|Đ\/A|Chọn|Answer|Key)\s*[:\.]?\s*(.*)$/i;
  const solRegex = /^(?:Lời giải|Hướng dẫn giải|Giải chi tiết|HDG|Solution)\s*[:\.]?\s*(.*)$/i;
  const lessonRegex = /^(?:Bài học|Tên bài|Lesson)\s*[:\.]?\s*(.*)$/i;
  const metaRegex = /^(?:Mức độ|Dạng|Môn|Khối|Level|Type|Bài học|Lesson)\s*[:\.]?\s*(.*)$/i;

  for (const line of lines) {
    if (lessonRegex.test(line)) {
      const m = line.match(lessonRegex);
      if (m && m[1]) lessonStr = m[1].trim();
      continue;
    }

    if (solRegex.test(line)) {
      inSolution = true;
      const m = line.match(solRegex);
      if (m && m[1]) solution += m[1] + " ";
      continue;
    }

    if (inSolution) {
      // Check if line contains meta tags before appending to solution
      if (line.toLowerCase().includes("mức độ:") || line.toLowerCase().includes("dạng:") || line.toLowerCase().includes("bài học:")) {
        inSolution = false;
        // Parse metadata on this line
        const parts = line.split(/[|;]/);
        for (const p of parts) {
          if (p.toLowerCase().includes("mức độ")) levelStr = p.replace(/mức độ\s*[:\.]?/i, "").trim();
          if (p.toLowerCase().includes("dạng")) typeStr = p.replace(/dạng\s*[:\.]?/i, "").trim();
          if (p.toLowerCase().includes("bài học") || p.toLowerCase().includes("lesson")) {
            lessonStr = p.replace(/^(?:bài học|lesson)\s*[:\.]?/i, "").trim();
          }
        }
      } else {
        solution += line + "\n";
      }
      continue;
    }

    if (ansRegex.test(line)) {
      const m = line.match(ansRegex);
      if (m && m[1]) answer = m[1].trim();
      continue;
    }

    if (metaRegex.test(line) || line.includes("|")) {
      const parts = line.split(/[|;]/);
      for (const p of parts) {
        const low = p.toLowerCase();
        if (low.includes("mức độ") || low.includes("level")) levelStr = p.replace(/^(?:mức độ|level)\s*[:\.]?/i, "").trim();
        if (low.includes("dạng") || low.includes("type")) typeStr = p.replace(/^(?:dạng|type)\s*[:\.]?/i, "").trim();
        if (low.includes("môn")) subjectStr = p.replace(/^môn\s*[:\.]?/i, "").trim();
        if (low.includes("khối") || low.includes("lớp")) gradeStr = p.replace(/^(?:khối|lớp)\s*[:\.]?/i, "").trim();
        if (low.includes("bài học") || low.includes("lesson") || low.includes("tên bài")) {
          lessonStr = p.replace(/^(?:bài học|lesson|tên bài)\s*[:\.]?/i, "").trim();
        }
      }
      continue;
    }

    if (optRegex.test(line)) {
      const m = line.match(optRegex);
      if (m) {
        optionLines.push(`${m[1].toUpperCase()}. ${m[2].trim()}`);
      }
      continue;
    }

    // Otherwise it is part of question title
    if (optionLines.length === 0) {
      questionLines.push(line);
    }
  }

  const qText = questionLines.join(" ").trim();
  const content = optionLines.join("\n").trim();
  const level = normalizeLevel(levelStr);
  const type = normalizeType(typeStr, content, answer);
  const subject = normalizeSubject(subjectStr, defaultSubjectId);
  const grade = normalizeGrade(gradeStr, defaultGradeId);

  const warnings: string[] = [];
  if (!answer) warnings.push("Chưa có đáp án");
  if (type === "TN" && optionLines.length < 2) warnings.push("Ít hơn 2 phương án lựa chọn");

  return {
    tempId: `cand-word-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    lesson: lessonStr || undefined,
    question: qText || `Câu hỏi ${index}`,
    content,
    answer,
    solution_guide: solution.trim(),
    levelShort: level,
    typeShort: type,
    subjectId: subject,
    gradeId: grade,
    isValid: Boolean(qText || optionLines.length > 0),
    warnings,
  };
}

/**
 * Converts candidate question to full ExamItem for Question Bank
 */
export function convertCandidateToExamItem(
  cand: ParsedQuestionCandidate,
  userName = "Tran Tan Phuoc",
  userId = 1
): ExamItem {
  const now = new Date();
  const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
    2,
    "0"
  )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  )}:00`;

  const levelObj = QUESTION_LEVELS.find((l) => l.short_name === cand.levelShort) || QUESTION_LEVELS[0];
  const typeObj = QUESTION_TYPES.find((t) => t.short_name === cand.typeShort) || QUESTION_TYPES[0];
  const subjectObj = SUBJECTS.find((s) => s.id === cand.subjectId) || {
    id: cand.subjectId,
    name: "Toán học",
  };
  const gradeObj = GRADES.find((g) => g.id === cand.gradeId) || {
    id: cand.gradeId,
    name: `Khối ${cand.gradeId}`,
  };

  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    author: {
      id: userId,
      name: userName,
      created_at: formattedDate,
      update_at: formattedDate,
    },
    question: {
      lesson: cand.lesson?.trim() || undefined,
      question: cand.question.trim(),
      content: cand.content.trim(),
      answer: cand.answer.trim(),
      solution_guide: cand.solution_guide.trim(),
      level: levelObj,
      type: typeObj,
      subject: subjectObj,
      grade: gradeObj,
    },
  };
}
