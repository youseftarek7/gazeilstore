import React, { createContext, useContext, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const ToastContext = createContext<(message: string, type?: Toast["type"]) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((items) => items.filter((toast) => toast.id !== id));
    }, 3200);
  };

  return (
    <ToastContext.Provider value={pushToast}>
      {children}
      <div className="fixed right-4 top-4 z-[90] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex min-w-72 items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg ${
              toast.type === "success" ? "border-emerald-100 text-emerald-700" : "border-red-100 text-red-700"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/10";

export function usePagination<T>(rows: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const maxPage = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [page, pageSize, rows]);
  return { page, setPage, maxPage, currentRows };
}

export function Pagination({
  page,
  maxPage,
  setPage,
}: {
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3 text-sm">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="rounded-md border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-slate-500">
        Page {page} of {maxPage}
      </span>
      <button
        disabled={page === maxPage}
        onClick={() => setPage(page + 1)}
        className="rounded-md border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
