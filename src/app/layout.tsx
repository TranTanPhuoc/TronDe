import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phần Mềm Trộn Đề Thi & Quản Lý Ngân Hàng Câu Hỏi",
  description:
    "Hệ thống quản lý câu hỏi trắc nghiệm, đúng sai, trả lời ngắn, tự luận và trộn đề thi chuẩn giáo dục.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
