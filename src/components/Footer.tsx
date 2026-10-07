"use client";

import React, { useState } from "react";
import {
  Phone,
  MapPin,
  ExternalLink,
  Navigation,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  Copy,
  Compass,
} from "lucide-react";

export default function Footer() {
  const latitude = 14.935;
  const longitude = 108.685;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=vi&z=14&output=embed`;
  const mapDirectUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("0379862310");
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-300 border-t border-slate-800/80 pt-10 pb-8 no-print mt-auto w-full safe-padding-bottom overflow-hidden">
      {/* Decorative ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-indigo-500/5 blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-sky-500/5 blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Main Grid: 3 Pillars Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* CỘT 1: Thương Hiệu & Người Sáng Lập (5/12 cột trên màn lớn) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Logo & Tên Phần Mềm */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(79,70,229,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-indigo-400/30">
                <Layers className="w-6 h-6 drop-shadow-xs" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-white text-base sm:text-lg tracking-tight">
                    Phần Mềm Trộn Đề Thi
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full tracking-wider">
                    v2.4 PRO
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-300/90 mt-0.5">
                  Tích hợp Ngân Hàng Câu Hỏi Thông Minh
                </p>
              </div>
            </div>

            {/* Mô tả tính năng cốt lõi */}
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Hệ thống quản trị ngân hàng câu hỏi, hoán vị đáp án và đảo đề thi ngẫu nhiên tự động.
              Hỗ trợ 4 mức độ tư duy (NB, TH, VD, VDC) và 4 dạng câu hỏi (Trắc nghiệm, Đúng/Sai, Trả lời ngắn, Tự luận) chuẩn Bộ Giáo Dục & Đào Tạo.
            </p>

            {/* Thẻ Người Sáng Lập (Founder Card VIP) */}
            <div className="bg-gradient-to-r from-slate-800/80 via-slate-800/50 to-indigo-950/40 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-md shadow-black/30 transition-all group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-[0_2px_8px_rgba(245,158,11,0.3)] border border-amber-300/40">
                <span className="font-black text-sm tracking-tighter">TP</span>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-900 flex items-center justify-center text-[8px] text-slate-950 font-black">
                  ★
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1 tracking-wide uppercase">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Người sáng lập & Phát triển</span>
                </div>
                <div className="text-sm font-extrabold text-white truncate group-hover:text-indigo-200 transition-colors">
                  Trần Tấn Phước
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md shrink-0">
                Chính thức
              </span>
            </div>
          </div>

          {/* CỘT 2: Thông Tin Liên Hệ & Kênh Mạng Xã Hội 3D (3.5/12 cột) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thông Tin Liên Hệ
              </h4>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Hotline Card */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-medium">Hotline / Liên hệ:</div>
                    <a
                      href="tel:0379862310"
                      className="text-xs sm:text-sm font-black text-emerald-400 hover:text-emerald-300 transition-colors font-mono tracking-tight"
                      title="Gọi điện ngay"
                    >
                      0379862310
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-md border border-slate-600/50 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Sao chép số điện thoại"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Địa chỉ Card */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 hover:border-indigo-500/40 transition-colors space-y-1.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Địa chỉ cơ sở:</div>
                  <div className="text-xs font-bold text-white leading-tight">
                    Long Hiệp - Minh Long - Quảng Ngãi
                  </div>
                </div>
              </div>

              {/* Tọa độ GPS */}
              <div className="pt-1 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  14.9350° N, 108.6850° E
                </span>
                <a
                  href={mapDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-0.5"
                >
                  <span>Chỉ đường</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Mạng xã hội 3D Buttons (Zalo, Facebook, Telegram, Direct Call) */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-400">
                Kênh kết nối mạng xã hội:
              </div>

              <div className="flex items-center gap-2.5">
                {/* Zalo Icon 3D */}
                <a
                  href="https://zalo.me/0379862310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex-1 h-10 rounded-xl bg-gradient-to-b from-[#0080FF] to-[#0055D4] hover:from-[#1A8CFF] hover:to-[#0060E6] text-white flex items-center justify-center gap-1.5 font-bold shadow-[0_4px_12px_rgba(0,104,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer border border-blue-400/30"
                  title="Nhắn tin Zalo: 0379862310"
                  aria-label="Nhắn tin Zalo"
                >
                  <span className="text-xs font-black tracking-tight drop-shadow-xs">Zalo</span>
                </a>

                {/* Facebook Icon 3D */}
                <a
                  href="https://www.facebook.com/kiritokun.1125?locale=vi_VN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex-1 h-10 rounded-xl bg-gradient-to-b from-[#1877F2] to-[#0F56B3] hover:from-[#2B85F7] hover:to-[#1264CF] text-white flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(24,119,242,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer border border-sky-400/30"
                  title="Facebook: Trần Tấn Phước"
                  aria-label="Facebook Trần Tấn Phước"
                >
                  <svg className="w-4 h-4 fill-current drop-shadow-xs group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs font-bold hidden sm:inline-block">FB</span>
                </a>

                {/* Telegram Icon 3D */}
                <a
                  href="https://t.me/Phuoctran262"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex-1 h-10 rounded-xl bg-gradient-to-b from-[#28A9E8] to-[#177BB5] hover:from-[#3BB4EF] hover:to-[#1B89C9] text-white flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(34,158,217,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer border border-cyan-300/30"
                  title="Telegram: @Phuoctran262"
                  aria-label="Telegram Phuoctran262"
                >
                  <svg className="w-4 h-4 fill-current drop-shadow-xs group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.19-.03.35z" />
                  </svg>
                  <span className="text-xs font-bold hidden sm:inline-block">Tele</span>
                </a>

                {/* Direct Call Button 3D */}
                <a
                  href="tel:0379862310"
                  className="group relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#10B981] to-[#047857] hover:from-[#18D194] hover:to-[#059669] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer border border-emerald-400/30"
                  title="Gọi điện trực tiếp: 0379862310"
                  aria-label="Gọi điện thoại"
                >
                  <Phone className="w-4 h-4 drop-shadow-xs group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* CỘT 3: Bản Đồ Vị Trí Google Maps Có Tọa Độ (4/12 cột) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Vị Trí Bản Đồ Trực Tiếp
                </h4>
              </div>
              <a
                href={mapDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                title="Mở Google Maps trên tab mới"
              >
                <span>Mở bản đồ lớn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Khung Bản Đồ Hiện Đại Đẳng Cấp */}
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-slate-700/60 to-slate-800/80 border border-slate-700/80 shadow-lg shadow-black/40 overflow-hidden group">
              {/* Header Bar Nhỏ Trong Map Card */}
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/80 rounded-t-xl text-[11px] font-medium border-b border-slate-800">
                <div className="flex items-center gap-1.5 truncate text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate font-semibold">Long Hiệp, Minh Long, Quảng Ngãi</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 shrink-0 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  GPS Live
                </span>
              </div>

              {/* Viewport Iframe Google Maps */}
              <div className="relative w-full h-44 sm:h-48 rounded-b-xl overflow-hidden bg-slate-950">
                <iframe
                  title="Bản đồ Google Maps Long Hiệp, Minh Long, Quảng Ngãi"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter saturate-105"
                />

                {/* Floating GPS Coordinates Overlay on hover */}
                <div className="absolute bottom-2 left-2 right-2 pointer-events-none flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-300 px-2 py-1 rounded-md shadow border border-cyan-500/30 backdrop-blur-xs">
                    <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                    14.9350° N, 108.6850° E
                  </span>
                  <a
                    href={mapDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-md shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Chỉ đường</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-medium">
              Tọa độ thực tế được ghim chính xác trên Google Maps vệ tinh.
            </p>
          </div>
        </div>

        {/* Sub-Footer: Bản Quyền & Trạng Thái Hệ Thống */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span>
              © 2026 <strong className="text-slate-200">Phần Mềm Trộn Đề Thi</strong>. Bản quyền thuộc về tác giả{" "}
              <strong className="text-indigo-400">Trần Tấn Phước</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hệ thống hoạt động ổn định</span>
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              Hỗ trợ 24/7 qua Zalo & Telegram
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
