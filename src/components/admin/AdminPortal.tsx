"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  Database,
  Award,
  Search,
  CheckCheck,
  Check,
  X,
  Trash2,
  Eye,
  BookOpen,
  Building2,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  Filter,
  PlusCircle,
  FileQuestion,
  GraduationCap,
  Pencil,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { ExamItem, PendingQuestionItem, SUBJECTS } from "@/types/question";
import { User, LicenseSubscription, UserRole, UserVersion } from "@/types/user";
import {
  getPendingQuestions,
  approvePendingQuestions,
  approveAllPendingQuestions,
  rejectPendingQuestions,
  getAllUsersList,
  updateUserInList,
  getLicenseSubscriptions,
  activateLicenseSubscription,
  changeUserVersionWithLicenseSync,
  getUserProExpiryInfo,
  getLicenseExpiryInfo,
} from "@/utils/approvalService";
import CustomSelect from "@/components/CustomSelect";
import QuestionDetailModal from "@/components/QuestionDetailModal";
import EditUserModal from "@/components/admin/EditUserModal";
import ConfirmChangeVersionModal from "@/components/admin/ConfirmChangeVersionModal";

interface AdminPortalProps {
  currentUser: User;
  globalQuestions: ExamItem[];
  onGlobalQuestionsChange: (newQuestions: ExamItem[]) => void;
  onOpenQuestionModal: () => void;
  onOpenEditQuestion: (item: ExamItem) => void;
  onSwitchToMixer?: () => void;
}

export default function AdminPortal({
  currentUser,
  globalQuestions,
  onGlobalQuestionsChange,
  onOpenQuestionModal,
  onOpenEditQuestion,
  onSwitchToMixer,
}: AdminPortalProps) {
  // Main Admin Tab: 'approvals' | 'users' | 'bank' | 'licenses'
  const [adminTab, setAdminTab] = useState<"approvals" | "users" | "bank" | "licenses">("approvals");

  // State for pending approvals
  const [pendingList, setPendingList] = useState<PendingQuestionItem[]>(() => getPendingQuestions());
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [pendingSubjectFilter, setPendingSubjectFilter] = useState<string>("ALL");
  const [pendingSearch, setPendingSearch] = useState<string>("");
  const [previewItem, setPreviewItem] = useState<ExamItem | null>(null);

  // State for User Management
  const [usersList, setUsersList] = useState<User[]>(() => getAllUsersList());
  const [userSearch, setUserSearch] = useState<string>("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);

  // State for Confirmation Dialog when changing version (Normal <-> Pro)
  const [isConfirmVersionOpen, setIsConfirmVersionOpen] = useState<boolean>(false);
  const [userToConfirmVersion, setUserToConfirmVersion] = useState<User | null>(null);
  const [targetVersionToConfirm, setTargetVersionToConfirm] = useState<UserVersion>("normal");

  // State for License Management
  const [licensesList, setLicensesList] = useState<LicenseSubscription[]>(() => getLicenseSubscriptions());

  // State for Global Question Bank in Admin view
  const [bankSubjectFilter, setBankSubjectFilter] = useState<string>("ALL");
  const [bankSearch, setBankSearch] = useState<string>("");

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reload data
  const refreshPending = () => {
    setPendingList(getPendingQuestions());
    setSelectedPendingIds([]);
  };

  // Handlers for approvals
  const handleApproveSelected = () => {
    if (selectedPendingIds.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 câu hỏi để phê duyệt!");
      return;
    }
    const result = approvePendingQuestions(selectedPendingIds, globalQuestions);
    onGlobalQuestionsChange(result.updatedGlobal);
    refreshPending();
    showToast(`Đã phê duyệt thành công ${result.approvedCount} câu hỏi vào ngân hàng chung!`);
  };

  const handleApproveAll = () => {
    if (pendingList.length === 0) {
      showToast("Không có câu hỏi nào đang chờ duyệt!");
      return;
    }
    const result = approveAllPendingQuestions(globalQuestions);
    onGlobalQuestionsChange(result.updatedGlobal);
    refreshPending();
    showToast(`Đã phê duyệt toàn bộ ${result.approvedCount} câu hỏi vào ngân hàng chung!`);
  };

  const handleRejectSelected = () => {
    if (selectedPendingIds.length === 0) {
      showToast("Vui lòng chọn câu hỏi cần từ chối!");
      return;
    }
    rejectPendingQuestions(selectedPendingIds);
    refreshPending();
    showToast(`Đã từ chối ${selectedPendingIds.length} câu hỏi!`);
  };

  // Handlers for Users
  const handleOpenEditUser = (u: User) => {
    if (u.role === "admin") {
      showToast("Không thể chỉnh sửa tài khoản Quản trị viên!");
      return;
    }
    setUserToEdit(u);
    setIsEditUserOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    if (userToEdit && updatedUser.version !== userToEdit.version) {
      changeUserVersionWithLicenseSync(updatedUser.id, updatedUser.version);
    }
    updateUserInList(updatedUser);
    setUsersList(getAllUsersList());
    setLicensesList(getLicenseSubscriptions());
    setIsEditUserOpen(false);
    setUserToEdit(null);
    showToast(`Đã cập nhật thông tin cho giáo viên ${updatedUser.name} thành công!`);
  };

  const handlePromptToggleUserVersion = (u: User) => {
    const targetVer: UserVersion = u.version === "pro" ? "normal" : "pro";
    setUserToConfirmVersion(u);
    setTargetVersionToConfirm(targetVer);
    setIsConfirmVersionOpen(true);
  };

  const handleConfirmChangeVersion = () => {
    if (!userToConfirmVersion) return;
    const targetVer = targetVersionToConfirm;
    const result = changeUserVersionWithLicenseSync(userToConfirmVersion.id, targetVer);
    if (result) {
      setUsersList(getAllUsersList());
      setLicensesList(getLicenseSubscriptions());
      if (targetVer === "pro") {
        showToast(
          `Đã nâng cấp giáo viên ${result.updatedUser.name} sang bản Pro (thời hạn 1 năm) thành công!`
        );
      } else {
        showToast(
          `Đã chuyển giáo viên ${result.updatedUser.name} về bản Tiêu Chuẩn. Đã cập nhật mục Quản lý mua bản quyền!`
        );
      }
    }
    setIsConfirmVersionOpen(false);
    setUserToConfirmVersion(null);
  };

  // Handlers for Licenses
  const handleActivateLicense = (licId: string) => {
    activateLicenseSubscription(licId);
    setLicensesList(getLicenseSubscriptions());
    setUsersList(getAllUsersList());
    showToast("Đã kích hoạt bản quyền Pro (thời hạn 1 năm) cho giáo viên thành công!");
  };


  // Filtered Pending Questions
  const filteredPending = useMemo(() => {
    return pendingList.filter((p) => {
      if (pendingSubjectFilter !== "ALL" && p.questionItem.question.subject?.id !== pendingSubjectFilter) {
        return false;
      }
      if (pendingSearch.trim()) {
        const q = pendingSearch.toLowerCase();
        const matchText = p.questionItem.question.question.toLowerCase().includes(q);
        const matchAuthor = p.submittedBy.userName.toLowerCase().includes(q);
        const matchSchool = p.submittedBy.school.toLowerCase().includes(q);
        if (!matchText && !matchAuthor && !matchSchool) return false;
      }
      return true;
    });
  }, [pendingList, pendingSubjectFilter, pendingSearch]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      if (userRoleFilter !== "ALL" && u.role !== userRoleFilter) return false;
      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchSchool = u.school.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchSchool) return false;
      }
      return true;
    });
  }, [usersList, userRoleFilter, userSearch]);

  // Filtered Global Bank for Admin
  const filteredAdminBank = useMemo(() => {
    return globalQuestions.filter((item) => {
      if (bankSubjectFilter !== "ALL" && item.question.subject?.id !== bankSubjectFilter) {
        return false;
      }
      if (bankSearch.trim()) {
        const q = bankSearch.toLowerCase();
        const matchQ = item.question.question.toLowerCase().includes(q);
        const matchSubject = item.question.subject?.name.toLowerCase().includes(q);
        if (!matchQ && !matchSubject) return false;
      }
      return true;
    });
  }, [globalQuestions, bankSubjectFilter, bankSearch]);

  // Checkbox select all pending
  const isAllPendingSelected =
    filteredPending.length > 0 &&
    filteredPending.every((p) => selectedPendingIds.includes(p.id));

  const toggleSelectAllPending = () => {
    if (isAllPendingSelected) {
      setSelectedPendingIds([]);
    } else {
      setSelectedPendingIds(filteredPending.map((p) => p.id));
    }
  };

  const toggleSelectPending = (id: string) => {
    setSelectedPendingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Top Dashboard Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Hệ thống Quản trị viên (Admin Portal)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Trung Tâm Quản Trị Hệ Thống Trộn Đề
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Quản lý tài khoản giáo viên, phê duyệt câu hỏi đóng góp, ngân hàng đề thi chung và bản quyền.
            </p>
          </div>

          {onSwitchToMixer && (
            <button
              onClick={onSwitchToMixer}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md transition-all cursor-pointer text-white shrink-0 group"
            >
              <span>Vào không gian Trộn đề thi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          {/* Card 1: Pending Approvals */}
          <div
            onClick={() => setAdminTab("approvals")}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              adminTab === "approvals"
                ? "bg-amber-500/20 border-amber-400/60 shadow-lg shadow-amber-500/10"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Chờ phê duyệt</span>
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {pendingList.length}
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Câu hỏi GV gửi lên</div>
          </div>

          {/* Card 2: Users */}
          <div
            onClick={() => setAdminTab("users")}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              adminTab === "users"
                ? "bg-indigo-500/20 border-indigo-400/60 shadow-lg shadow-indigo-500/10"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Tài khoản</span>
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1">
              {usersList.length}
            </div>
            <div className="text-[11px] text-indigo-200/80 mt-0.5">
              {usersList.filter((u) => u.role === "teacher").length} giáo viên
            </div>
          </div>

          {/* Card 3: Global Question Bank */}
          <div
            onClick={() => setAdminTab("bank")}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              adminTab === "bank"
                ? "bg-teal-500/20 border-teal-400/60 shadow-lg shadow-teal-500/10"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Ngân hàng chung</span>
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                <Database className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
              {globalQuestions.length}
            </div>
            <div className="text-[11px] text-teal-200/80 mt-0.5">11 bộ môn chính thức</div>
          </div>

          {/* Card 4: Licenses */}
          <div
            onClick={() => setAdminTab("licenses")}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              adminTab === "licenses"
                ? "bg-rose-500/20 border-rose-400/60 shadow-lg shadow-rose-500/10"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Gói bản quyền</span>
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-300 mt-1">
              {licensesList.filter((l) => l.status === "active").length} / {licensesList.length}
            </div>
            <div className="text-[11px] text-rose-200/80 mt-0.5">
              {licensesList.filter((l) => l.status === "pending").length} đơn chờ kích hoạt
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab("approvals")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            adminTab === "approvals"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Phê duyệt câu hỏi đóng góp</span>
          {pendingList.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                adminTab === "approvals"
                  ? "bg-white text-amber-700"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
              }`}
            >
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            adminTab === "users"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản lý người dùng ({usersList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("bank")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            adminTab === "bank"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Quản lý ngân hàng câu hỏi ({globalQuestions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("licenses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            adminTab === "licenses"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quản lý mua bản quyền</span>
          {licensesList.some((l) => l.status === "pending") && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* TAB 1: PHÊ DUYỆT CÂU HỎI ĐÓNG GÓP (TÍNH NĂNG CHỦ CHỐT) */}
      {adminTab === "approvals" && (
        <div className="space-y-4">
          {/* Action and Filter Header */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                  <span>Danh sách câu hỏi giáo viên gửi lên chờ duyệt</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Admin xem xét các câu hỏi được giáo viên thêm vào. Khi phê duyệt, câu hỏi sẽ được lưu vào ngân hàng chung và tự động xóa khỏi cache của giáo viên để nhẹ database.
                </p>
              </div>

              {/* 2 Cách Phê Duyệt theo đúng yêu cầu người dùng */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={handleApproveSelected}
                  disabled={selectedPendingIds.length === 0}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                    selectedPendingIds.length > 0
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                  title="Cách 1: Phê duyệt những câu đang chọn (các câu chưa chọn giữ nguyên)"
                >
                  <Check className="w-4 h-4" />
                  <span>Phê duyệt câu đã chọn ({selectedPendingIds.length})</span>
                </button>

                <button
                  onClick={handleApproveAll}
                  disabled={pendingList.length === 0}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                    pendingList.length > 0
                      ? "bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white active:scale-95"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                  title="Cách 2: Phê duyệt tất cả các câu hỏi"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Phê duyệt tất cả ({pendingList.length})</span>
                </button>

                {selectedPendingIds.length > 0 && (
                  <button
                    onClick={handleRejectSelected}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors cursor-pointer"
                    title="Từ chối những câu hỏi không đạt tiêu chuẩn"
                  >
                    <X className="w-4 h-4" />
                    <span>Từ chối</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  placeholder="Tìm theo nội dung câu hỏi, tên giáo viên, trường học..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="w-full sm:w-56">
                <CustomSelect
                  value={pendingSubjectFilter}
                  onChange={(val) => setPendingSubjectFilter(String(val))}
                  options={[
                    { value: "ALL", label: "Tất cả môn học" },
                    ...SUBJECTS.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Pending Questions Table / Cards */}
          {filteredPending.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-200">
                Không có câu hỏi nào đang chờ phê duyệt
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Tất cả câu hỏi đóng góp từ giáo viên đã được phê duyệt vào ngân hàng câu hỏi chung của hệ thống.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAllPendingSelected}
                    onChange={toggleSelectAllPending}
                    className="w-4 h-4 rounded text-amber-600 cursor-pointer"
                  />
                  <span>
                    Chọn tất cả ({selectedPendingIds.length}/{filteredPending.length})
                  </span>
                </div>
                <span>Hiển thị {filteredPending.length} câu hỏi chờ duyệt</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPending.map((item, idx) => {
                  const isChecked = selectedPendingIds.includes(item.id);
                  const q = item.questionItem.question;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 transition-colors ${
                        isChecked
                          ? "bg-amber-50/50 dark:bg-amber-950/20"
                          : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectPending(item.id)}
                          className="w-4 h-4 rounded text-amber-600 mt-1 cursor-pointer shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Top row: Badges & Submitter */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="font-extrabold text-slate-700 dark:text-slate-300">
                                #{idx + 1}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                {q.subject?.name} - {q.grade?.name}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {q.level?.name}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                {q.type?.name}
                              </span>
                              {q.lesson && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={q.lesson}>
                                  {q.lesson}
                                </span>
                              )}
                            </div>

                            {/* Submitter info */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {item.submittedBy.userName}
                                </span>
                              </div>
                              <span>•</span>
                              <span className="text-[11px] truncate max-w-[150px]">
                                {item.submittedBy.school}
                              </span>
                              <span>•</span>
                              <span className="text-[11px]">{item.submittedAt}</span>
                            </div>
                          </div>

                          {/* Question text */}
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                            {q.question}
                          </p>

                          {/* Preview Content snippet */}
                          {q.content && (
                            <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 max-h-24 overflow-y-auto">
                              {q.content}
                            </pre>
                          )}

                          {/* Answer summary */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              Đáp án: {q.answer}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPreviewItem(item.questionItem)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem chi tiết</span>
                              </button>

                              <button
                                onClick={() => approvePendingQuestions([item.id], globalQuestions)}
                                className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                              >
                                Duyệt câu này
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT) */}
      {adminTab === "users" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Danh sách tài khoản trong hệ thống ({filteredUsers.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quản lý danh sách giáo viên, chỉnh sửa thông tin hồ sơ và nâng cấp gói bản quyền.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Tìm tên, email, trường..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Họ và tên</th>
                    <th className="p-3.5">Đơn vị & Bộ môn</th>
                    <th className="p-3.5">Vai trò</th>
                    <th className="p-3.5">Gói phiên bản</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                            {u.avatar || u.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-slate-100">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {u.school}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                          {u.department} ({u.subject?.name || "Toán"})
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black ${
                            u.role === "admin"
                              ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                              : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{u.role === "admin" ? "Quản trị viên" : "Giáo viên"}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        {(() => {
                          const isPro = u.version === "pro";
                          const expiryInfo = isPro ? getUserProExpiryInfo(u) : null;
                          return (
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black ${
                                  isPro
                                    ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                                }`}
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>{isPro ? "Bản Pro" : "Bản Tiêu Chuẩn"}</span>
                              </span>
                              {isPro && expiryInfo && (
                                <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                                  <span>
                                    {u.role === "admin"
                                      ? "Vĩnh viễn (Admin)"
                                      : `${expiryInfo.text} (Hạn: ${expiryInfo.formattedExpiryDate})`}
                                  </span>
                                </div>
                              )}
                              {!isPro && (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                                  Chưa mua bản quyền Pro
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      <td className="p-3.5 text-right">
                        {u.role === "admin" ? (
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 italic px-2 py-1 select-none">
                            Quản trị viên (Cố định)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                              title="Chỉnh sửa thông tin giáo viên"
                            >
                              <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Sửa thông tin</span>
                            </button>
                            <button
                              onClick={() => handlePromptToggleUserVersion(u)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                                u.version === "pro"
                                  ? "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  : "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 hover:bg-amber-100"
                              }`}
                              title={
                                u.version === "pro"
                                  ? "Chuyển về bản Tiêu Chuẩn (Yêu cầu xác nhận)"
                                  : "Nâng lên bản Pro 1 năm (Yêu cầu xác nhận)"
                              }
                            >
                              {u.version === "pro" ? "Về Tiêu chuẩn" : "Nâng Pro"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ NGÂN HÀNG CÂU HỎI CHUNG (GLOBAL BANK) */}
      {adminTab === "bank" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                <span>Toàn bộ ngân hàng câu hỏi hệ thống ({filteredAdminBank.length} câu)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quản trị viên có toàn quyền kiểm tra, thêm, chỉnh sửa hoặc xóa câu hỏi của tất cả 11 môn học.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenQuestionModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Thêm câu hỏi chung</span>
              </button>

              <div className="w-44">
                <CustomSelect
                  value={bankSubjectFilter}
                  onChange={(val) => setBankSubjectFilter(String(val))}
                  options={[
                    { value: "ALL", label: "Tất cả môn học" },
                    ...SUBJECTS.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAdminBank.slice(0, 30).map((item, idx) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">#{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {item.question.subject?.name} - {item.question.grade?.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.question.level?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenEditQuestion(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Sửa câu hỏi"
                    >
                      <FileQuestion className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {item.question.question}
                </p>

                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>Đáp án đúng: {item.question.answer}</span>
                  <span className="text-slate-400 font-normal">{item.author.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUẢN LÝ MUA BẢN QUYỀN (LICENSE MANAGEMENT) */}
      {adminTab === "licenses" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                <span>Quản lý Đăng ký & Kích hoạt bản quyền Pro ({licensesList.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Xem xét và duyệt các yêu cầu mua bản quyền Pro từ giáo viên. Kích hoạt tức thì để mở khóa tính năng nâng cao.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {licensesList.map((lic) => {
              const isPending = lic.status === "pending";
              const targetUser = usersList.find((usr) => usr.id === lic.userId);
              const subjectName = targetUser?.subject?.name || "Toán học";
              const expiryInfo = targetUser
                ? getUserProExpiryInfo(targetUser)
                : getLicenseExpiryInfo(lic.expiryDate);

              return (
                <div
                  key={lic.id}
                  className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs space-y-3 transition-all ${
                    isPending
                      ? "border-amber-300 dark:border-amber-800 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/10"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isPending
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      }`}
                    >
                      {isPending ? "Chờ mua bản quyền" : `Đang hoạt động • ${expiryInfo?.text || "Pro"}`}
                    </span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {lic.price.toLocaleString("vi-VN")} đ / năm
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{lic.userName}</span>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                        {subjectName}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lic.userEmail}</p>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{lic.school}</span>
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>Thời hạn bản quyền:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {lic.durationMonths} tháng ({Math.max(1, Math.round(lic.durationMonths / 12))} năm)
                      </span>
                    </div>

                    {!isPending && expiryInfo && (
                      <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                        <span className="flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Thời gian còn lại:
                        </span>
                        <span className="text-[11px] font-black">{expiryInfo.text}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>{isPending ? "Ngày gửi / Thay đổi:" : "Ngày kích hoạt:"}</span>
                      <span>{isPending ? lic.requestDate : lic.activatedDate || lic.requestDate}</span>
                    </div>

                    {!isPending && (lic.expiryDate || expiryInfo?.formattedExpiryDate) && (
                      <div className="flex justify-between">
                        <span>Ngày hết hạn:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {lic.expiryDate || expiryInfo?.formattedExpiryDate}
                        </span>
                      </div>
                    )}

                    {lic.note && (
                      <p className="italic text-[10px] text-slate-600 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                        {lic.note}
                      </p>
                    )}
                  </div>

                  {isPending && (
                    <button
                      onClick={() => handleActivateLicense(lic.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mua bản quyền / Kích hoạt Pro 1 năm</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Preview Detail */}
      <QuestionDetailModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={(item) => {
          setPreviewItem(null);
          onOpenEditQuestion(item);
        }}
      />

      {/* Modal Chỉnh Sửa Thông Tin Giáo Viên */}
      <EditUserModal
        isOpen={isEditUserOpen}
        user={userToEdit}
        onClose={() => {
          setIsEditUserOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Modal Xác Nhận Chuyển Đổi Gói Bản Quyền (Normal <-> Pro) */}
      <ConfirmChangeVersionModal
        isOpen={isConfirmVersionOpen}
        user={userToConfirmVersion}
        targetVersion={targetVersionToConfirm}
        onConfirm={handleConfirmChangeVersion}
        onCancel={() => {
          setIsConfirmVersionOpen(false);
          setUserToConfirmVersion(null);
        }}
      />
    </div>
  );
}
