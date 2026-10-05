/**
 * Utility to generate standard Office Open XML (.docx) files purely in the browser.
 * Zero external npm dependencies, 100% compliant with ISO/IEC 29500 (Open Packaging Conventions).
 * Opens natively in Microsoft Word, Google Docs, WPS Office, Apple Pages, and LibreOffice.
 */

interface ShuffledQuestionItem {
  questionText: string;
  contentText: string;
}

interface ExportDocxOptions {
  schoolName: string;
  examTitle: string;
  subjectName: string;
  duration: string;
  examCode: string;
  questions: ShuffledQuestionItem[];
}

// Precomputed CRC32 table for high performance
function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
}

const CRC_TABLE = makeCrcTable();

function calculateCrc32(bytes: Uint8Array): number {
  let crc = -1;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function getDosTimeAndDate(d = new Date()): { time: number; date: number } {
  const year = Math.max(1980, d.getFullYear());
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = Math.floor(d.getSeconds() / 2);

  const dosDate = ((year - 1980) << 9) | (month << 5) | day;
  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  return { time: dosTime, date: dosDate };
}

interface ZipFileEntry {
  name: string;
  content: string | Uint8Array;
}

/**
 * Creates an uncompressed (Store) ZIP archive compliant with PKZip and OOXML specs.
 */
function createZipArchive(files: ZipFileEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const { time: dosTime, date: dosDate } = getDosTimeAndDate();
  const fileEntries: {
    nameBytes: Uint8Array;
    crc: number;
    size: number;
    offset: number;
  }[] = [];

  let offset = 0;
  const parts: Uint8Array[] = [];

  // Write Local File Headers + File Data
  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const contentBytes =
      typeof file.content === "string" ? encoder.encode(file.content) : file.content;
    const crc = calculateCrc32(contentBytes);
    const size = contentBytes.length;

    // Local file header: 30 bytes + name length
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);
    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true); // Version needed to extract (2.0)
    view.setUint16(6, 0x0800, true); // General purpose bit flag: bit 11 = UTF-8
    view.setUint16(8, 0, true); // Compression method: 0 = Store (no compression)
    view.setUint16(10, dosTime, true); // File last mod time
    view.setUint16(12, dosDate, true); // File last mod date
    view.setUint32(14, crc, true); // CRC-32
    view.setUint32(18, size, true); // Compressed size
    view.setUint32(22, size, true); // Uncompressed size
    view.setUint16(26, nameBytes.length, true); // File name length
    view.setUint16(28, 0, true); // Extra field length
    localHeader.set(nameBytes, 30);

    fileEntries.push({ nameBytes, crc, size, offset });
    parts.push(localHeader);
    parts.push(contentBytes);
    offset += localHeader.length + contentBytes.length;
  }

  const centralDirStart = offset;
  let centralDirSize = 0;

  // Write Central Directory Headers
  for (const entry of fileEntries) {
    const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(cdHeader.buffer);
    view.setUint32(0, 0x02014b50, true); // Central file header signature
    view.setUint16(4, 20, true); // Version made by
    view.setUint16(6, 20, true); // Version needed to extract
    view.setUint16(8, 0x0800, true); // Flags: UTF-8
    view.setUint16(10, 0, true); // Compression: 0
    view.setUint16(12, dosTime, true); // Mod time
    view.setUint16(14, dosDate, true); // Mod date
    view.setUint32(16, entry.crc, true); // CRC-32
    view.setUint32(20, entry.size, true); // Compressed size
    view.setUint32(24, entry.size, true); // Uncompressed size
    view.setUint16(28, entry.nameBytes.length, true); // File name length
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // File comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal file attributes
    view.setUint32(38, 0, true); // External file attributes
    view.setUint32(42, entry.offset, true); // Relative offset of local header
    cdHeader.set(entry.nameBytes, 46);

    parts.push(cdHeader);
    centralDirSize += cdHeader.length;
  }

  // End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const view = new DataView(eocd.buffer);
  view.setUint32(0, 0x06054b50, true); // EOCD signature
  view.setUint16(4, 0, true); // Disk number
  view.setUint16(6, 0, true); // Disk with central directory
  view.setUint16(8, fileEntries.length, true); // Entries on this disk
  view.setUint16(10, fileEntries.length, true); // Total entries
  view.setUint32(12, centralDirSize, true); // Central directory size
  view.setUint32(16, centralDirStart, true); // Offset of start of central directory
  view.setUint16(20, 0, true); // Zip comment length
  parts.push(eocd);

  // Concatenate all parts
  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }
  return result;
}

function escapeXml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateExamDocxBytes(options: ExportDocxOptions): Uint8Array {
  const { schoolName, examTitle, subjectName, duration, examCode, questions } = options;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`;

  const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
</w:settings>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="26"/>
        <w:szCs w:val="26"/>
        <w:lang w:val="vi-VN"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="280" w:lineRule="auto" w:after="80"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`;

  // Build question paragraphs
  const questionParagraphsXml = questions
    .map((q, idx) => {
      const qText = escapeXml(q.questionText);
      const contentLines = escapeXml(q.contentText)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const optionsXml = contentLines
        .map(
          (line) => `
        <w:p>
          <w:pPr>
            <w:ind w:left="420"/>
            <w:spacing w:after="30" w:line="260" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
            <w:rPr><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
            <w:t xml:space="preserve">${line}</w:t>
          </w:r>
        </w:p>`
        )
        .join("");

      return `
        <w:p>
          <w:pPr>
            <w:spacing w:before="120" w:after="40" w:line="280" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
            <w:t xml:space="preserve">Câu ${idx + 1}: </w:t>
          </w:r>
          <w:r>
            <w:rPr><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
            <w:t xml:space="preserve">${qText}</w:t>
          </w:r>
        </w:p>
        ${optionsXml}
      `;
    })
    .join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- Header Table: School Name | Exam Title | Exam Code -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9638" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="none"/>
          <w:left w:val="none"/>
          <w:right w:val="none"/>
          <w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000"/>
          <w:insideH w:val="none"/>
          <w:insideV w:val="none"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <!-- School Column -->
        <w:tc>
          <w:tcPr><w:tcW w:w="3500" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="30"/></w:pPr>
            <w:r>
              <w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
              <w:t>${escapeXml(schoolName).toUpperCase()}</w:t>
            </w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="80"/></w:pPr>
            <w:r>
              <w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
              <w:t>TỔ BỘ MÔN CHUYÊN MÔN</w:t>
            </w:r>
          </w:p>
        </w:tc>

        <!-- Exam Title Column -->
        <w:tc>
          <w:tcPr><w:tcW w:w="4438" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="30"/></w:pPr>
            <w:r>
              <w:rPr><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
              <w:t>${escapeXml(examTitle).toUpperCase()}</w:t>
            </w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="30"/></w:pPr>
            <w:r>
              <w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
              <w:t>${escapeXml(subjectName)}</w:t>
            </w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="80"/></w:pPr>
            <w:r>
              <w:rPr><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
              <w:t>Thời gian làm bài: ${escapeXml(duration)} phút (không kể phát đề)</w:t>
            </w:r>
          </w:p>
        </w:tc>

        <!-- Exam Code Column -->
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="1700" w:type="dxa"/>
            <w:tcBorders>
              <w:top w:val="single" w:sz="12" w:space="0" w:color="000000"/>
              <w:left w:val="single" w:sz="12" w:space="0" w:color="000000"/>
              <w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000"/>
              <w:right w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            </w:tcBorders>
          </w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="10"/></w:pPr>
            <w:r>
              <w:rPr><w:b/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>
              <w:t>MÃ ĐỀ THI</w:t>
            </w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:after="30"/></w:pPr>
            <w:r>
              <w:rPr><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr>
              <w:t>${escapeXml(examCode)}</w:t>
            </w:r>
          </w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- Student Info Box -->
    <w:p><w:pPr><w:spacing w:before="80" w:after="40"/></w:pPr></w:p>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9638" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="999999"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="999999"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="999999"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="999999"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="5200" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:spacing w:after="30"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">Họ và tên thí sinh: </w:t></w:r>
            <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>.............................................................</w:t></w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4438" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:spacing w:after="30"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">Lớp: </w:t></w:r>
            <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>....................................................</w:t></w:r>
          </w:p>
        </w:tc>
      </w:tr>
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="5200" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:spacing w:after="30"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">Số báo danh: </w:t></w:r>
            <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>...................................................................</w:t></w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4438" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:spacing w:after="30"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">Phòng thi số: </w:t></w:r>
            <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>...........................................</w:t></w:r>
          </w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- Subtitle Note -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="100" w:after="140"/></w:pPr>
      <w:r>
        <w:rPr><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
        <w:t>(Đề thi gồm có ${questions.length} câu hỏi)</w:t>
      </w:r>
    </w:p>

    <!-- Questions Content -->
    ${questionParagraphsXml}

    <!-- End Of Exam Line -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
        <w:t>----------------------------- HẾT -----------------------------</w:t>
      </w:r>
    </w:p>

    <!-- Page Setup: A4 Portrait (11906 x 16838 dxa), 20mm margins (1134 dxa) -->
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const zipData = createZipArchive([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: rootRelsXml },
    { name: "word/_rels/document.xml.rels", content: docRelsXml },
    { name: "word/settings.xml", content: settingsXml },
    { name: "word/styles.xml", content: stylesXml },
    { name: "word/document.xml", content: documentXml },
  ]);

  return zipData;
}

export function generateExamDocxBlob(options: ExportDocxOptions): Blob {
  const bytes = generateExamDocxBytes(options);
  return new Blob([bytes as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export function downloadExamDocx(options: ExportDocxOptions): string {
  const blob = generateExamDocxBlob(options);
  const cleanSubject = options.subjectName.replace(/^MÔN:\s*/i, "").trim();
  const safeFileName = `De_Thi_${cleanSubject || "Mon_Hoc"}_Ma_${options.examCode}.docx`
    .replace(/[\/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return safeFileName;
}

export interface ExportAllExamsZipOptions {
  schoolName: string;
  examTitle: string;
  subjectName: string;
  duration: string;
  exams: {
    code: string;
    questions: ShuffledQuestionItem[];
  }[];
}

/**
 * Generates individual .docx files for all exams and packages them into a single .zip archive.
 */
export function downloadAllExamsZip(options: ExportAllExamsZipOptions): string {
  const cleanSubject = options.subjectName.replace(/^MÔN:\s*/i, "").trim();
  const zipEntries: ZipFileEntry[] = [];

  for (const exam of options.exams) {
    const docxBytes = generateExamDocxBytes({
      schoolName: options.schoolName,
      examTitle: options.examTitle,
      subjectName: options.subjectName,
      duration: options.duration,
      examCode: exam.code,
      questions: exam.questions,
    });

    const fileName = `De_Thi_${cleanSubject || "Mon_Hoc"}_Ma_${exam.code}.docx`
      .replace(/[\/\\?%*:|"<>]/g, "_")
      .replace(/\s+/g, "_");

    zipEntries.push({
      name: fileName,
      content: docxBytes,
    });
  }

  const zipData = createZipArchive(zipEntries);
  const blob = new Blob([zipData as unknown as BlobPart], {
    type: "application/zip",
  });

  const zipFileName = `Bo_De_Thi_${cleanSubject || "Mon_Hoc"}_${options.exams.length}_De.zip`
    .replace(/[\/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return zipFileName;
}

export interface ExportMatrixOptions {
  schoolName: string;
  examTitle: string;
  subjectName: string;
  duration: string;
  exams: {
    code: string;
    questions: { answer: string }[];
  }[];
}

/**
 * Generates an A4 Word (.docx) document containing the Answer Matrix.
 * Automatically chunks exam variants into groups of up to 10 per table with page breaks
 * so columns never overflow standard A4 paper width, regardless of whether there are 10, 20, or 50 exam codes.
 */
export function generateMatrixDocxBytes(options: ExportMatrixOptions): Uint8Array {
  const { schoolName, examTitle, subjectName, duration, exams } = options;
  const maxQuestions = exams[0]?.questions.length || 0;

  // Maximum 10 exam code columns per table to guarantee perfect fit on A4 portrait (9638 dxa printable width)
  const CODES_PER_CHUNK = 10;
  const chunks: { code: string; questions: { answer: string }[] }[][] = [];
  for (let i = 0; i < exams.length; i += CODES_PER_CHUNK) {
    chunks.push(exams.slice(i, i + CODES_PER_CHUNK));
  }

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`;

  const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
</w:settings>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:val="vi-VN"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="240" w:lineRule="auto" w:after="40"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`;

  // Build tables for each chunk
  const chunksBodyXml = chunks
    .map((chunk, chunkIdx) => {
      const colQuestionWidth = 1138;
      const colCodeWidth = Math.floor((9638 - colQuestionWidth) / chunk.length);
      const tableWidth = colQuestionWidth + colCodeWidth * chunk.length;

      // Table Header Row
      const headerColsXml = chunk
        .map(
          (v) => `
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="${colCodeWidth}" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="E0E7FF"/>
            <w:vAlign w:val="center"/>
          </w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="60"/></w:pPr>
            <w:r>
              <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="312E81"/></w:rPr>
              <w:t>Mã ${escapeXml(v.code)}</w:t>
            </w:r>
          </w:p>
        </w:tc>`
        )
        .join("");

      const headerRowXml = `
        <w:tr>
          <w:trPr>
            <w:tblHeader/>
            <w:cantSplit/>
          </w:trPr>
          <w:tc>
            <w:tcPr>
              <w:tcW w:w="${colQuestionWidth}" w:type="dxa"/>
              <w:shd w:val="clear" w:color="auto" w:fill="E0E7FF"/>
              <w:vAlign w:val="center"/>
            </w:tcPr>
            <w:p>
              <w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="60"/></w:pPr>
              <w:r>
                <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="1E293B"/></w:rPr>
                <w:t>Câu</w:t>
              </w:r>
            </w:p>
          </w:tc>
          ${headerColsXml}
        </w:tr>`;

      // Table Data Rows
      const dataRowsXml: string[] = [];
      for (let qIdx = 0; qIdx < maxQuestions; qIdx++) {
        const rowBg = qIdx % 2 === 1 ? "F8FAFC" : "FFFFFF";
        const answerColsXml = chunk
          .map((v) => {
            const ans = v.questions[qIdx]?.answer || "-";
            return `
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="${colCodeWidth}" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="${rowBg}"/>
                <w:vAlign w:val="center"/>
              </w:tcPr>
              <w:p>
                <w:pPr><w:jc w:val="center"/><w:spacing w:before="40" w:after="40"/></w:pPr>
                <w:r>
                  <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="047857"/></w:rPr>
                  <w:t>${escapeXml(ans)}</w:t>
                </w:r>
              </w:p>
            </w:tc>`;
          })
          .join("");

        dataRowsXml.push(`
          <w:tr>
            <w:trPr><w:cantSplit/></w:trPr>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="${colQuestionWidth}" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
                <w:vAlign w:val="center"/>
              </w:tcPr>
              <w:p>
                <w:pPr><w:jc w:val="center"/><w:spacing w:before="40" w:after="40"/></w:pPr>
                <w:r>
                  <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="334155"/></w:rPr>
                  <w:t>Câu ${qIdx + 1}</w:t>
                </w:r>
              </w:p>
            </w:tc>
            ${answerColsXml}
          </w:tr>`);
      }

      const chunkRangeText =
        chunks.length > 1
          ? `(Nhóm mã đề ${chunk[0].code} - ${chunk[chunk.length - 1].code} • Trang ${chunkIdx + 1}/${chunks.length})`
          : `(Tổng cộng ${chunk.length} mã đề thi)`;

      const pageBreakXml =
        chunkIdx < chunks.length - 1
          ? `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`
          : "";

      return `
        <!-- Chunk Header (School & Exam Info) -->
        <w:tbl>
          <w:tblPr>
            <w:tblW w:w="9638" w:type="dxa"/>
            <w:tblBorders>
              <w:top w:val="none"/><w:left w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/>
              <w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            </w:tblBorders>
          </w:tblPr>
          <w:tr>
            <w:tc>
              <w:tcPr><w:tcW w:w="4200" w:type="dxa"/></w:tcPr>
              <w:p>
                <w:pPr><w:jc w:val="center"/><w:spacing w:after="20"/></w:pPr>
                <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>${escapeXml(schoolName).toUpperCase()}</w:t></w:r>
              </w:p>
              <w:p>
                <w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
                <w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>TỔ BỘ MÔN CHUYÊN MÔN</w:t></w:r>
              </w:p>
            </w:tc>
            <w:tc>
              <w:tcPr><w:tcW w:w="5438" w:type="dxa"/></w:tcPr>
              <w:p>
                <w:pPr><w:jc w:val="center"/><w:spacing w:after="20"/></w:pPr>
                <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(examTitle).toUpperCase()}</w:t></w:r>
              </w:p>
              <w:p>
                <w:pPr><w:jc w:val="center"/><w:spacing w:after="20"/></w:pPr>
                <w:r><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:t>${escapeXml(subjectName)} - ${escapeXml(duration)} PHÚT</w:t></w:r>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>

        <w:p>
          <w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="40"/></w:pPr>
          <w:r>
            <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1E3A8A"/></w:rPr>
            <w:t>BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU CÁC MÃ ĐỀ</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:pPr><w:jc w:val="center"/><w:spacing w:after="120"/></w:pPr>
          <w:r>
            <w:rPr><w:i/><w:sz w:val="20"/><w:color w:val="475569"/></w:rPr>
            <w:t>${escapeXml(chunkRangeText)}</w:t>
          </w:r>
        </w:p>

        <!-- Matrix Table -->
        <w:tbl>
          <w:tblPr>
            <w:tblW w:w="${tableWidth}" w:type="dxa"/>
            <w:jc w:val="center"/>
            <w:tblBorders>
              <w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
              <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
              <w:left w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
              <w:right w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
              <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
              <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            </w:tblBorders>
          </w:tblPr>
          ${headerRowXml}
          ${dataRowsXml.join("")}
        </w:tbl>

        ${pageBreakXml}
      `;
    })
    .join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${chunksBodyXml}
    <!-- Page Setup: A4 Portrait (11906 x 16838 dxa), 20mm margins (1134 dxa) -->
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  return createZipArchive([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: rootRelsXml },
    { name: "word/_rels/document.xml.rels", content: docRelsXml },
    { name: "word/settings.xml", content: settingsXml },
    { name: "word/styles.xml", content: stylesXml },
    { name: "word/document.xml", content: documentXml },
  ]);
}

/**
 * Downloads the Answer Matrix as a clean, professionally formatted A4 Word (.docx) document.
 */
export function downloadMatrixDocx(options: ExportMatrixOptions): string {
  const bytes = generateMatrixDocxBytes(options);
  const blob = new Blob([bytes as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const cleanSubject = options.subjectName.replace(/^MÔN:\s*/i, "").trim();
  const safeFileName = `Ma_Tran_Dap_An_${cleanSubject || "Mon_Hoc"}_${options.exams.length}_De.docx`
    .replace(/[\/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return safeFileName;
}

function getExcelColName(n: number): string {
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

/**
 * Generates an OpenXML Spreadsheet (.xlsx) document for the Answer Matrix.
 */
export function generateMatrixXlsxBytes(options: ExportMatrixOptions): Uint8Array {
  const { schoolName, examTitle, subjectName, exams } = options;
  const maxQuestions = exams[0]?.questions.length || 0;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Ma_Tran_Dap_An" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <font><sz val="11"/><name val="Times New Roman"/></font>
    <font><b/><sz val="14"/><color rgb="FF1E3A8A"/><name val="Times New Roman"/></font>
    <font><b/><sz val="11"/><color rgb="FF1E293B"/><name val="Times New Roman"/></font>
    <font><b/><sz val="11"/><color rgb="FF047857"/><name val="Times New Roman"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE0E7FF"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="5">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
</styleSheet>`;

  // Build Sheet Rows
  const sheetRows: string[] = [];

  // Row 1: School Name
  sheetRows.push(`
    <row r="1">
      <c r="A1" t="inlineStr" s="1"><is><t>${escapeXml(schoolName).toUpperCase()}</t></is></c>
    </row>`);

  // Row 2: Exam Title & Subject
  sheetRows.push(`
    <row r="2">
      <c r="A2" t="inlineStr" s="1"><is><t>${escapeXml(examTitle).toUpperCase()} - ${escapeXml(subjectName)}</t></is></c>
    </row>`);

  // Row 3: Subtitle
  sheetRows.push(`
    <row r="3">
      <c r="A3" t="inlineStr" s="0"><is><t>BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU (${exams.length} MÃ ĐỀ THI)</t></is></c>
    </row>`);

  // Row 5: Table Header
  const headerCells = exams
    .map((v, idx) => {
      const col = getExcelColName(idx + 1);
      return `<c r="${col}5" t="inlineStr" s="2"><is><t>Mã ${escapeXml(v.code)}</t></is></c>`;
    })
    .join("");

  sheetRows.push(`
    <row r="5">
      <c r="A5" t="inlineStr" s="2"><is><t>Câu hỏi</t></is></c>
      ${headerCells}
    </row>`);

  // Row 6..N: Data rows
  for (let qIdx = 0; qIdx < maxQuestions; qIdx++) {
    const rowNum = 6 + qIdx;
    const answerCells = exams
      .map((v, colIdx) => {
        const col = getExcelColName(colIdx + 1);
        const ans = v.questions[qIdx]?.answer || "-";
        return `<c r="${col}${rowNum}" t="inlineStr" s="4"><is><t>${escapeXml(ans)}</t></is></c>`;
      })
      .join("");

    sheetRows.push(`
      <row r="${rowNum}">
        <c r="A${rowNum}" t="inlineStr" s="3"><is><t>Câu ${qIdx + 1}</t></is></c>
        ${answerCells}
      </row>`);
  }

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="14" customWidth="1"/>
    <col min="2" max="${Math.max(2, exams.length + 1)}" width="11" customWidth="1"/>
  </cols>
  <sheetData>
    ${sheetRows.join("")}
  </sheetData>
</worksheet>`;

  return createZipArchive([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: rootRelsXml },
    { name: "xl/_rels/workbook.xml.rels", content: workbookRelsXml },
    { name: "xl/workbook.xml", content: workbookXml },
    { name: "xl/styles.xml", content: stylesXml },
    { name: "xl/worksheets/sheet1.xml", content: sheetXml },
  ]);
}

/**
 * Downloads the Answer Matrix as an Excel (.xlsx) spreadsheet.
 */
export function downloadMatrixXlsx(options: ExportMatrixOptions): string {
  const bytes = generateMatrixXlsxBytes(options);
  const blob = new Blob([bytes as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const cleanSubject = options.subjectName.replace(/^MÔN:\s*/i, "").trim();
  const safeFileName = `Ma_Tran_Dap_An_${cleanSubject || "Mon_Hoc"}_${options.exams.length}_De.xlsx`
    .replace(/[\/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return safeFileName;
}
