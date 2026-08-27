import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Bell,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error" | "promo" | "cart" | "order";
  timestamp: Date;
  actionLabel?: string;
  onAction?: () => void;
}

interface VisualNotificationToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const VisualNotificationToast: React.FC<VisualNotificationToastProps> = ({
  toasts,
  onDismiss,
  soundEnabled = true,
  onToggleSound,
}) => {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "cart":
        return <ShoppingBag className="w-4 h-4 text-orange-400" />;
      case "order":
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "promo":
        return <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />;
      case "warning":
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBorderAndBg = (type: string) => {
    switch (type) {
      case "cart":
        return "border-orange-500/40 bg-slate-950/95 text-white shadow-orange-500/10";
      case "order":
      case "success":
        return "border-emerald-500/40 bg-slate-950/95 text-white shadow-emerald-500/10";
      case "promo":
        return "border-amber-500/40 bg-slate-950/95 text-white shadow-amber-500/10";
      case "warning":
      case "error":
        return "border-red-500/40 bg-slate-950/95 text-white shadow-red-500/10";
      default:
        return "border-slate-800 bg-slate-950/95 text-white shadow-slate-950/50";
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            layout
            className={`p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 pointer-events-auto ${getBorderAndBg(
              toast.type
            )}`}
          >
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              {getIcon(toast.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {toast.title}
                </h4>
                <div className="flex items-center gap-1 shrink-0">
                  {onToggleSound && (
                    <button
                      onClick={onToggleSound}
                      className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
                      title={soundEnabled ? "Couper le son" : "Activer le son"}
                    >
                      {soundEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>

              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                  className="mt-2 px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-[11px] transition cursor-pointer shadow-sm"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
