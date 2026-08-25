import React, { useEffect } from "react";
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
import { soundManager } from "../utils/audioNotifications";

export interface VisualNotification {
  id: string;
  type: "success" | "info" | "promo" | "cart" | "order";
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface VisualNotificationToastProps {
  notification: VisualNotification | null;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const VisualNotificationToast: React.FC<VisualNotificationToastProps> = ({
  notification,
  onClose,
  soundEnabled,
  onToggleSound,
}) => {
  useEffect(() => {
    if (!notification) return;

    // Play appropriate sound based on notification type
    if (soundEnabled) {
      if (notification.type === "cart") {
        soundManager.playCartAdd();
      } else if (notification.type === "order" || notification.type === "success") {
        soundManager.playOrderSuccess();
      } else if (notification.type === "promo") {
        soundManager.playPromoAlert();
      } else {
        soundManager.playStatusUpdate();
      }
    }

    const timer = setTimeout(() => {
      onClose();
    }, notification.duration || 4500);

    return () => clearTimeout(timer);
  }, [notification, soundEnabled, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "cart":
        return <ShoppingBag className="w-5 h-5 text-orange-400" />;
      case "order":
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "promo":
        return <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case "cart":
        return "border-orange-500/40 bg-slate-950/95 text-white shadow-orange-500/20";
      case "order":
      case "success":
        return "border-emerald-500/40 bg-slate-950/95 text-white shadow-emerald-500/20";
      case "promo":
        return "border-amber-500/40 bg-slate-950/95 text-white shadow-amber-500/20";
      default:
        return "border-slate-700 bg-slate-950/95 text-white shadow-slate-950/50";
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full pointer-events-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3.5 ${getBorderColor()}`}
        >
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black text-white truncate">
                {notification.title}
              </h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onToggleSound}
                  className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
                  title={soundEnabled ? "Couper le son des notifications" : "Activer le son des notifications"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {notification.message}
            </p>

            {notification.actionLabel && notification.onAction && (
              <button
                onClick={() => {
                  notification.onAction?.();
                  onClose();
                }}
                className="mt-2.5 px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-[11px] transition cursor-pointer shadow-sm"
              >
                {notification.actionLabel}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
