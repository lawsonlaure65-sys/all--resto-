import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  Image as ImageIcon,
  Smartphone,
  Upload,
  Check,
  RotateCcw,
  Sparkles,
  Clock,
  Flame,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Tag,
  DollarSign,
  Utensils,
  Store,
  Layers,
  FileCheck,
  Eye,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DailySpecial } from "../types";
import { compressImageBase64 } from "../services/dishStorageService";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface DailySpecialCardEditProps {
  isOpen: boolean;
  special: DailySpecial | null;
  onClose: () => void;
  onSave: (updatedSpecial: DailySpecial) => void;
}

export const DailySpecialCardEdit: React.FC<DailySpecialCardEditProps> = ({
  isOpen,
  special,
  onClose,
  onSave,
}) => {
  // Form state initialized with the current special or default values
  const [title, setTitle] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(3500);
  const [originalPrice, setOriginalPrice] = useState<number>(4500);
  const [image, setImage] = useState<string>("");
  const [servingsLeft, setServingsLeft] = useState<number>(20);
  const [availableUntil, setAvailableUntil] = useState<string>("15h00");
  const [accompaniedBy, setAccompaniedBy] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>("");

  // Photo Selector State
  const [photoSourceLabel, setPhotoSourceLabel] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [photoFileSize, setPhotoFileSize] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [previewTab, setPreviewTab] = useState<"editor" | "live_preview">("editor");

  // Feedback & Save status
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Hidden native file inputs
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraFileInputRef = useRef<HTMLInputElement | null>(null);

  // Check if Native File System Access API is supported
  const isFileSystemAccessSupported =
    typeof window !== "undefined" && "showOpenFilePicker" in window;

  // Initialize form when a special is selected
  useEffect(() => {
    if (special) {
      setTitle(special.title || "");
      setRestaurantName(special.restaurantName || "Khady's Food & Event");
      setRestaurantId(special.restaurantId || "resto-khadys-food");
      setDescription(special.description || "");
      setPrice(special.price || 3500);
      setOriginalPrice(special.originalPrice || Math.round((special.price || 3500) * 1.25));
      setImage(
        special.image ||
          "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=1000&auto=format&fit=crop&q=80"
      );
      setServingsLeft(special.servingsLeft ?? 25);
      setAvailableUntil(special.availableUntil || "15h00");
      setAccompaniedBy(special.accompaniedBy || "Alloco doré croustillant + Piment vert maison");
      setTags(
        special.tags && special.tags.length > 0
          ? [...special.tags]
          : ["👑 Khady's Food", "🔥 Plat du Jour", "✨ Chef Recommande", "⚡ Service 11h-15h"]
      );
      setPhotoSourceLabel(null);
      setPhotoFileName(null);
      setPhotoFileSize(null);
      setStatusMessage(null);
    }
  }, [special, isOpen]);

  if (!isOpen || !special) return null;

  /**
   * Traitement d'un fichier photo sélectionné avec compression HD
   */
  const handleProcessImageFile = async (file: File, sourceName: string) => {
    if (!file.type.startsWith("image/")) {
      setStatusMessage({
        type: "error",
        text: "Veuillez sélectionner un format d'image valide (JPG, PNG, WebP, HEIC).",
      });
      return;
    }

    setIsCompressing(true);
    setStatusMessage({
      type: "info",
      text: `Optimisation de l'image (${(file.size / 1024).toFixed(0)} Ko) en cours...`,
    });

    const originalSizeKb = Math.round(file.size / 1024);

    try {
      // Compression optimisée (1200px max, 85% de qualité pour affichage net & chargement rapide à Niamey)
      const compressedBase64 = await compressImageBase64(file, 1200, 900, 0.85);
      const approxCompressedKb = Math.round((compressedBase64.length * 0.75) / 1024);

      setImage(compressedBase64);
      setPhotoSourceLabel(sourceName);
      setPhotoFileName(file.name);
      setPhotoFileSize(
        `${approxCompressedKb} Ko (source native : ${originalSizeKb > 1024 ? (originalSizeKb / 1024).toFixed(1) + " Mo" : originalSizeKb + " Ko"})`
      );
      setStatusMessage({
        type: "success",
        text: `Photo importée avec succès depuis ${sourceName} !`,
      });
    } catch (err) {
      console.warn("Échec compression, repli vers FileReader brut:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
          setPhotoSourceLabel(sourceName);
          setPhotoFileName(file.name);
          setPhotoFileSize(`${originalSizeKb} Ko`);
          setStatusMessage({
            type: "success",
            text: `Photo importée depuis ${sourceName} !`,
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  /**
   * Sélecteur de photos via l'API Native File System Access (window.showOpenFilePicker)
   * avec repli automatique vers l'input de fichier standard (Galerie / Google Photos du téléphone)
   */
  const handleOpenNativePhotoPicker = async () => {
    if (isFileSystemAccessSupported) {
      try {
        const pickerOpts = {
          types: [
            {
              description: "Photos de plats (Google Photos, Galerie)",
              accept: {
                "image/*": [".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif", ".avif"],
              },
            },
          ],
          excludeAcceptAllOption: false,
          multiple: false,
        };
        // Appel natif de l'API de sélection de fichier
        const [fileHandle] = await (window as any).showOpenFilePicker(pickerOpts);
        if (fileHandle) {
          const file = await fileHandle.getFile();
          await handleProcessImageFile(file, "Google Photos / Galerie locale");
          return;
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // L'administrateur a simplement fermé la boîte de dialogue de sélection
          return;
        }
        console.warn("API showOpenFilePicker non supportée ou refusée, repli vers sélecteur natif standard:", err);
      }
    }

    // Repli natif pour téléphones mobiles (Android / iOS) : ouvre le sélecteur système comprenant Google Photos
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.click();
    }
  };

  /**
   * Sélecteur pour prise de photo en direct avec la caméra
   */
  const handleOpenCameraCapture = () => {
    if (cameraFileInputRef.current) {
      cameraFileInputRef.current.click();
    }
  };

  /**
   * Gestion du glisser-déposer de photos
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessImageFile(file, "Glisser-Déposer");
    }
  };

  /**
   * Application d'une URL personnalisée
   */
  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      setImage(customUrl.trim());
      setPhotoSourceLabel("Lien Web / CDN externe");
      setPhotoFileName(null);
      setPhotoFileSize(null);
      setShowUrlInput(false);
      setCustomUrl("");
      setStatusMessage({
        type: "success",
        text: "URL de la photo appliquée avec succès.",
      });
    }
  };

  /**
   * Préréglages rapides de photos gastronomiques de référence
   */
  const PHOTO_PRESETS = [
    {
      name: "Tiep Rouge Royal",
      url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=1000&auto=format&fit=crop&q=80",
    },
    {
      name: "Doukounou Moelleux",
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80",
    },
    {
      name: "Attiéké Capitaine Braisé",
      url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000&auto=format&fit=crop&q=80",
    },
    {
      name: "Dibi d'Agneau Braisé",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
    },
  ];

  /**
   * Ajout d'une étiquette (tag)
   */
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  /**
   * Enregistrement complet du plat du jour
   */
  const handleSave = async () => {
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Le nom du plat est obligatoire." });
      return;
    }
    if (!price || price <= 0) {
      setStatusMessage({ type: "error", text: "Le prix doit être supérieur à 0 FCFA." });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const updatedSpecial: DailySpecial = {
      ...special,
      title: title.trim(),
      restaurantName: restaurantName.trim() || "Khady's Food & Event",
      restaurantId: restaurantId || "resto-khadys-food",
      description: description.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.25),
      image: image || special.image,
      servingsLeft: Number(servingsLeft) || 0,
      availableUntil: availableUntil.trim() || "15h00",
      accompaniedBy: accompaniedBy.trim() || "Alloco doré + Piment vert",
      tags: tags.length > 0 ? tags : ["👑 Khady's Food", "🔥 Plat du Jour"],
    };

    // Synchronisation active dans le localStorage
    try {
      const planToStore = {
        id: updatedSpecial.id,
        targetDate: new Date().toISOString().split("T")[0],
        restaurantId: updatedSpecial.restaurantId,
        restaurantName: updatedSpecial.restaurantName,
        dishName: updatedSpecial.title,
        priceFcfa: updatedSpecial.price,
        description: updatedSpecial.description,
        starter: updatedSpecial.accompaniedBy,
        mainCourse: updatedSpecial.description,
        drinkOrDessert: "Jus local offert",
        availablePortions: updatedSpecial.servingsLeft,
        chefNote: `Modifié par l'administrateur (${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })})`,
        imageUrl: updatedSpecial.image,
        marketingMessage: `Le Plat du Jour (${updatedSpecial.title}) est prêt à être commandé !`,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("alloresto_active_daily_special", JSON.stringify(planToStore));
      window.dispatchEvent(
        new CustomEvent("alloresto_daily_special_updated", { detail: planToStore })
      );
    } catch (e) {
      console.warn("Erreur synchronisation localStorage:", e);
    }

    // Synchronisation Supabase si activé
    if (isSupabaseConfigured()) {
      try {
        const today = new Date().toISOString().split("T")[0];
        await (supabase.from("daily_menus") as any).upsert({
          restaurant_id: updatedSpecial.restaurantId,
          menu_date: today,
          title: updatedSpecial.title,
          description: updatedSpecial.description,
          price_xof: updatedSpecial.price,
          photo_url: updatedSpecial.image,
          status: "published",
          updated_at: new Date().toISOString(),
        });
      } catch (sbErr) {
        console.warn("Avertissement Supabase:", sbErr);
      }
    }

    onSave(updatedSpecial);
    setIsSaving(false);
    onClose();
  };

  return (
    <div
      id="daily-special-card-edit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-slate-900 border border-orange-500/40 shadow-2xl flex flex-col my-auto"
      >
        {/* Entête du modal */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                  Éditeur Administrateur
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Plat du Jour
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Modifier le Plat du Jour &amp; Photos
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Onglet Aperçu */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewTab("editor")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  previewTab === "editor"
                    ? "bg-orange-500 text-slate-950 font-black shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Formulaire
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("live_preview")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  previewTab === "live_preview"
                    ? "bg-orange-500 text-slate-950 font-black shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu Client</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b shrink-0 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : statusMessage.type === "error"
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                : "bg-sky-500/20 border-sky-500/40 text-sky-300"
            }`}
          >
            {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {statusMessage.type === "error" && <AlertCircle className="w-4 h-4 shrink-0" />}
            {statusMessage.type === "info" && <Sparkles className="w-4 h-4 shrink-0" />}
            <span className="flex-1">{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Inputs cachés pour l'accès natif aux fichiers */}
        <input
          ref={galleryFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleProcessImageFile(file, "Google Photos / Galerie");
            }
            e.target.value = "";
          }}
        />

        <input
          ref={cameraFileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleProcessImageFile(file, "Caméra en direct");
            }
            e.target.value = "";
          }}
        />

        {/* Contenu principal scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {previewTab === "live_preview" ? (
            /* Mode Aperçu Client */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Rendu direct tel qu&apos;il apparaîtra sur la page d&apos;accueil d&apos;Allôresto :</span>
                <button
                  type="button"
                  onClick={() => setPreviewTab("editor")}
                  className="text-orange-400 hover:underline font-bold"
                >
                  Revenir à l&apos;édition &rarr;
                </button>
              </div>

              {/* Rendu miniature de la carte */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-orange-500/40 p-5 sm:p-7 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 relative">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-orange-500/30 shadow-md">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-slate-950 text-xs font-black shadow-md">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>PLAT DU JOUR</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Dispo jusqu&apos;à {availableUntil}</span>
                        </span>
                        <span className="font-semibold text-emerald-400">
                          {servingsLeft} portions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/40">
                        👑 {restaurantName}
                      </span>
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[11px] font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white">{title || "Nom du Plat"}</h3>
                    <p className="text-xs sm:text-sm text-slate-300">{description || "Description..."}</p>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Inclus :</strong> {accompaniedBy}</span>
                    </div>

                    <div className="pt-2 flex items-baseline gap-2.5">
                      <span className="text-2xl font-black text-orange-400">
                        {price.toLocaleString()} FCFA
                      </span>
                      {originalPrice > price && (
                        <span className="text-sm font-semibold text-slate-500 line-through">
                          {originalPrice.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mode Éditeur complet */
            <>
              {/* SECTION 1: SÉLECTEUR DE PHOTOS (GOOGLE PHOTOS & GALERIE NATIVE) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-orange-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>Photo du Plat</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          API Fichiers Native
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Sélectionnez depuis votre téléphone (Google Photos, Galerie locale) ou caméra
                      </p>
                    </div>
                  </div>

                  {photoSourceLabel && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{photoSourceLabel}</span>
                    </span>
                  )}
                </div>

                {/* Grille : Aperçu Visuel + Commandes Natives */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Prévisualisation de l'image actuelle */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all group ${
                      isDragOver
                        ? "border-orange-400 bg-orange-500/10 scale-[1.01]"
                        : "border-slate-800 hover:border-orange-500/50 bg-slate-900"
                    }`}
                  >
                    <img
                      src={image}
                      alt={title || "Aperçu plat"}
                      className="w-full h-full object-cover"
                    />

                    {isCompressing && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-orange-400">
                        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-white">Traitement &amp; Compression HD...</span>
                      </div>
                    )}

                    {/* Overlay info photo */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between text-[11px] text-slate-200">
                      <div>
                        {photoFileName ? (
                          <span className="font-semibold block truncate max-w-[180px]">
                            {photoFileName}
                          </span>
                        ) : (
                          <span className="text-slate-400">Photo actuelle</span>
                        )}
                        {photoFileSize && (
                          <span className="text-[10px] text-emerald-400 block font-bold">
                            {photoFileSize}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenNativePhotoPicker}
                        className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-[10px] transition cursor-pointer shadow"
                      >
                        Changer
                      </button>
                    </div>
                  </div>

                  {/* Boutons d'action pour choisir la photo */}
                  <div className="md:col-span-7 space-y-2.5">
                    {/* BOUTON PRINCIPAL : GOOGLE PHOTOS OU GALERIE DU TÉLÉPHONE */}
                    <button
                      type="button"
                      onClick={handleOpenNativePhotoPicker}
                      disabled={isCompressing}
                      className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 rounded-xl bg-slate-950/20 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block leading-tight font-black">
                            📱 Google Photos &amp; Galerie locale
                          </span>
                          <span className="block text-[11px] text-slate-950/80 font-semibold">
                            {isFileSystemAccessSupported
                              ? "Via l'API d'accès aux fichiers native du navigateur"
                              : "Sélecteur multimédia natif du smartphone"}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-950 text-amber-300 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 border border-amber-400/40">
                        Choisir
                      </span>
                    </button>

                    {/* BOUTON SECONDAIRE : PRENDRE EN DIRECT AVEC LA CAMÉRA */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleOpenCameraCapture}
                        disabled={isCompressing}
                        className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer hover:border-orange-500/40 disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4 text-orange-400 shrink-0" />
                        <span>Prendre photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer hover:border-orange-500/40"
                      >
                        <ExternalLink className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>Lien Web / URL</span>
                      </button>
                    </div>

                    {/* Zone de saisie d'URL externe */}
                    {showUrlInput && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2 animate-fade-in">
                        <label className="text-[11px] font-semibold text-slate-300 block">
                          Collez l&apos;URL de la photo (Google Photos public, Unsplash, Cloudinary...) :
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustomUrl}
                            className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs cursor-pointer"
                          >
                            Appliquer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Préréglages rapides en un clic */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Suggestions HD de dépannage rapide :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PHOTO_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImage(preset.url);
                              setPhotoSourceLabel(`Suggestion : ${preset.name}`);
                              setPhotoFileName(null);
                              setPhotoFileSize(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                          >
                            <span>🍲</span>
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: INFORMATIONS GASTRONOMIQUES ET TARIFS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom du plat */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-orange-400" />
                    <span>Nom du Plat du Jour *</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Tiep Rouge Royal au Capitaine"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                {/* Nom du Restaurant */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span>Restaurant Partenaire</span>
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Ex: Khady's Food & Event"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Heure limite de service */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Heure limite de service midi</span>
                  </label>
                  <input
                    type="text"
                    value={availableUntil}
                    onChange={(e) => setAvailableUntil(e.target.value)}
                    placeholder="Ex: 15h00"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Prix du Jour (Promo FCFA) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-orange-400" />
                    <span>Prix Spécial du Jour (FCFA) *</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    step="250"
                    min="500"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-black text-orange-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Prix régulier barré */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="line-through text-slate-500">Prix barré</span>
                    <span className="text-slate-400">(FCFA)</span>
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    step="250"
                    min="500"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Description appétissante */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">
                    Description gastronomique &amp; ingrédients :
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez la recette, les épices, la cuisson..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Accompagnements inclus */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Accompagnements &amp; Inclus d&apos;office dans la formule</span>
                  </label>
                  <input
                    type="text"
                    value={accompaniedBy}
                    onChange={(e) => setAccompaniedBy(e.target.value)}
                    placeholder="Ex: Alloco doré croustillant + Piment vert de la Cheffe + Bissap frais"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Portions restantes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">
                    Portions préparées / restantes en cuisine :
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setServingsLeft(Math.max(0, servingsLeft - 5))}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                    >
                      -5
                    </button>
                    <input
                      type="number"
                      value={servingsLeft}
                      onChange={(e) => setServingsLeft(Math.max(0, Number(e.target.value)))}
                      min="0"
                      className="w-24 text-center px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setServingsLeft(servingsLeft + 5)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* Gestion des tags */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Badges &amp; Tags visibles</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Ajouter un tag..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 text-amber-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-700"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-400 text-slate-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pied de page avec boutons de validation */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Annuler
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isCompressing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-orange-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Enregistrer le Plat du Jour</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
