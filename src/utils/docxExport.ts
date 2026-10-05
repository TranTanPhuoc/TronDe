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
