"use client";

import React from "react";
import { Phone, MapPin, ExternalLink, Navigation } from "lucide-react";

export default function Footer() {
  const latitude = 14.935;
  const longitude = 108.685;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=vi&z=14&output=embed`;
  const mapDirectUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 sm:py-8 text-xs text-slate-600 dark:text-slate-400 no-print mt-auto w-full safe-padding-bottom transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột 1: Thông tin phần mềm, người sáng lập và liên hệ (7 cột) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Tên phần mềm */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight">
                Phần Mềm Trộn Đề Thi tích hợp Ngân Hàng Câu Hỏi
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full shadow-2xs">
                © 2026
              </span>
            </div>

            {/* Người sáng lập & Hotline */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Người sáng lập:</span>
                <strong className="text-indigo-900 dark:text-indigo-200 font-bold bg-indigo-50/70 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800">
                  Trần Tấn Phước
                </strong>
              </div>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              <a
                href="tel:0379862310"
                className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                title="Gọi điện liên hệ ngay"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="w-3 h-3" />
                </div>
                <span>Liên hệ: <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">0379862310</strong></span>
              </a>
            </div>

            {/* Địa chỉ & Tọa độ */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Địa chỉ: </span>
                  <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                    Long Hiệp - Minh Long - Quảng Ngãi
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pl-6 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  <Navigation className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Tọa độ: 14.9350° N, 108.6850° E
                </span>
                <a
                  href={mapDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold underline decoration-indigo-300 hover:decoration-indigo-600 transition-colors"
                >
                  <span>Chỉ đường trên Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Mạng xã hội dạng Icon 3D */}
            <div className="pt-2 flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
                Kênh liên hệ:
              </span>

              {/* Zalo */}
              <a
                href="https://zalo.me/0379862310"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-[0_2px_6px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title="Nhắn tin Zalo: 0379862310"
                aria-label="Zalo"
              >
                <span className="text-[11px] font-black tracking-tight group-hover:scale-105 transition-transform">
                  Zalo
                </span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/kiritokun.1125?locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-b from-sky-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white flex items-center justify-center shadow-[0_2px_6px_rgba(67,56,202,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title="Facebook: Trần Tấn Phước"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/Phuoctran262"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white flex items-center justify-center shadow-[0_2px_6px_rgba(2,132,199,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title="Telegram: @Phuoctran262"
                aria-label="Telegram"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.19-.03.35z" />
                </svg>
              </a>

              {/* Direct Call */}
              <a
                href="tel:0379862310"
                className="w-9 h-9 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex items-center justify-center shadow-[0_2px_6px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title="Gọi điện ngay: 0379862310"
                aria-label="Gọi điện"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Cột 2: Bản đồ Google Maps hiển thị trực tiếp có chỉ định tọa độ (5 cột) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-2.5 shadow-sm space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">Vị trí: Long Hiệp, Minh Long</span>
                </div>
                <a
                  href={mapDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
                >
                  <span>Phóng to</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Khung nhúng Google Maps trực tiếp */}
              <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-inner">
                <iframe
                  title="Bản đồ Google Maps Long Hiệp, Minh Long, Quảng Ngãi"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium">
                Chỉ định tọa độ GPS: 14.9350° N, 108.6850° E (Minh Long, Quảng Ngãi)
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
