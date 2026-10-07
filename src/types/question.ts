export interface Author {
  id: number;
  name: string;
  created_at: string;
  update_at: string;
}

export type LevelShortName = "NB" | "TH" | "VD" | "VDC";
export type LevelName = "Nhận Biết" | "Thông Hiểu" | "Vận Dụng" | "Vận Dụng Cao";

export interface QuestionLevel {
  id: number;
  name: LevelName | string;
  short_name: LevelShortName | string;
}

export type TypeShortName = "TN" | "DS" | "TLN" | "TL";
export type TypeName = "Trắc Nghiệm" | "Đúng Sai" | "Trả Lời Ngắn" | "Tự Luận";

export interface QuestionType {
  id: number;
  name: TypeName | string;
  short_name: TypeShortName | string;
}

export interface SubjectItem {
  id: string; // "TOAN", "VAN", "ANH", "LY", "HOA", "SINH", "SU", "DIA", "TIN", "GDCD", "CN"
  name: string;
}

export interface GradeItem {
  id: number; // 10, 11, 12, 9, 8, 7, 6
  name: string; // "Khối 10", "Khối 11", "Khối 12"
}

export interface QuestionDetail {
  lesson?: string; // Tên bài học trong SGK (ví dụ: "Bài 1: Sự đồng biến, nghịch biến của hàm số")
  content: string;
  question: string;
  solution_guide: string;
  answer: string;
  level: QuestionLevel;
  type: QuestionType;
  subject: SubjectItem;
  grade: GradeItem;
}

export interface ExamItem {
  id: string; // Khóa định danh duy nhất (UUID/Timestamp) cho React & CRUD
  author: Author;
  question: QuestionDetail;
}

export const QUESTION_LEVELS: QuestionLevel[] = [
  { id: 1, name: "Nhận Biết", short_name: "NB" },
  { id: 2, name: "Thông Hiểu", short_name: "TH" },
  { id: 3, name: "Vận Dụng", short_name: "VD" },
  { id: 4, name: "Vận Dụng Cao", short_name: "VDC" },
];

export const QUESTION_TYPES: QuestionType[] = [
  { id: 1, name: "Trắc Nghiệm", short_name: "TN" },
  { id: 2, name: "Đúng Sai", short_name: "DS" },
  { id: 3, name: "Trả Lời Ngắn", short_name: "TLN" },
  { id: 4, name: "Tự Luận", short_name: "TL" },
];

export const SUBJECTS: SubjectItem[] = [
  { id: "TOAN", name: "Toán học" },
  { id: "VAN", name: "Ngữ văn" },
  { id: "ANH", name: "Tiếng Anh" },
  { id: "LY", name: "Vật lý" },
  { id: "HOA", name: "Hóa học" },
  { id: "SINH", name: "Sinh học" },
  { id: "SU", name: "Lịch sử" },
  { id: "DIA", name: "Địa lý" },
  { id: "TIN", name: "Tin học" },
  { id: "GDCD", name: "GDCD / KT-PL" },
  { id: "CN", name: "Công nghệ" },
];

export const GRADES: GradeItem[] = [
  { id: 12, name: "Khối 12" },
  { id: 11, name: "Khối 11" },
  { id: 10, name: "Khối 10" },
  { id: 9, name: "Khối 9" },
  { id: 8, name: "Khối 8" },
  { id: 7, name: "Khối 7" },
  { id: 6, name: "Khối 6" },
];
