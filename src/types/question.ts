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

export interface QuestionDetail {
  content: string;
  question: string;
  solution_guide: string;
  answer: string;
  level: QuestionLevel;
  type: QuestionType;
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
