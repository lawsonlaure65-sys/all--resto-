import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Flame,
  Leaf,
  Clock,
  Sparkles,
  DollarSign,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Camera,
  Layers,
  Utensils,
  FolderOpen,
  Wheat,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MenuItem, DishCategory, MenuItemOption } from "../types";

interface DishManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDish: (dish: MenuItem) => void;
  initialDish?: MenuItem | null;
}

// Preset high quality photo bank for quick inspiration
const PRESET_PHOTO_GALLERY: { category: string; label: string; url: string }[] = [
  {
    category: "petit_dejeuner",
    label: "Petit Déj Sahélien (Omelette & Café)",
    url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "petit_dejeuner",
    label: "Croissants & Viennoiseries Pur Beurre",
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "petit_dejeuner",
    label: "Bouillie de Mil & Lait Caillé",
    url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "menu_du_jour",
    label: "⭐ Menu du Jour Complet (Plat + Boisson)",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "menu_du_jour",
    label: "⭐ Plat du Jour Capitaine & Riz Gourmand",
    url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "africain",
    label: "Choukouya Braisé d'Agneau",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "africain",
    label: "Dambou Royal au Moringa",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "africain",
    label: "Riz Gras Jollof & Poulet",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "africain",
    label: "Capitaine Braisé du Fleuve",
    url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "europeen",
    label: "Entrecôte Grillée & Frites",
    url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "europeen",
    label: "Pâtes Crémeuses aux Champignons",
    url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "europeen",
    label: "Burger Gourmet Double Cheddar",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "europeen",
    label: "Pizza Feu de Bois",
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "entrees",
    label: "Pastels Dorés Croustillants",
    url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "entrees",
    label: "Salade Fraîcheur Avocat",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "boissons",
    label: "Jus de Bissap & Menthe Fraîche",
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "boissons",
    label: "Cocktail Gingembre Ananas",
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "desserts",
    label: "Dégué Onctueux au Yaourt",
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "desserts",
    label: "Fondant Chocolat Gourmand",
    url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "accompagnements",
    label: "Allocos Banane Plantain Dorés",
    url: "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=700&auto=format&fit=crop&q=80",
  },
  {
    category: "accompagnements",
    label: "Frites Fraîches Croustillantes",
    url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&auto=format&fit=crop&q=80",
  },
];

export const CATEGORIES_CONFIG: { id: DishCategory; label: string; icon: string; desc: string }[] = [
  { id: "petit_dejeuner", label: "Petit Déjeuner", icon: "🌅", desc: "Omelettes, Viennoiseries, Bouillie mil, Thé & Café" },
  { id: "menu_du_jour", label: "Menu / Plat du Jour", icon: "⭐", desc: "Formules complètes du jour, Entrée + Plat + Boisson" },
  { id: "africain", label: "Plats Africains", icon: "🍲", desc: "Dambou, Choukouya, Riz Gras, Sauces du terroir" },
  { id: "europeen", label: "Plats Européens", icon: "🥩", desc: "Steaks, Pâtes, Burgers, Salades composées" },
  { id: "entrees", label: "Entrées & Tapas", icon: "🥟", desc: "Pastels, Samoussas, Beignets, Salades fraîches" },
  { id: "boissons", label: "Boissons & Jus", icon: "🍹", desc: "Bissap, Baobab, Gingembre, Jus frais, Eaux" },
  { id: "desserts", label: "Desserts & Douceurs", icon: "🍮", desc: "Dégué, Thiakry, Fondant chocolat, Fruits" },
  { id: "accompagnements", label: "Accompagnements", icon: "🍟", desc: "Allocos, Dambou kopto, Attiéké, Frites" },
  { id: "grillades", label: "Grillades & Braisés", icon: "🔥", desc: "Choukouya agneau, Pintade braisée, Dibi" },
];

export const DishManagementModal: React.FC<DishManagementModalProps> = ({
  isOpen,
  onClose,
  onSaveDish,
  initialDish,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresetGallery, setShowPresetGallery] = useState(false);

  // Form Fields
  const [name, setName] = useState(initialDish?.name || "");
  const [description, setDescription] = useState(initialDish?.description || "");
  const [price, setPrice] = useState<number>(initialDish?.price || 3500);
  const [dishCategory, setDishCategory] = useState<DishCategory>(initialDish?.dishCategory || "africain");
  const [image, setImage] = useState<string>(
    initialDish?.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80"
  );
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageFileSize, setImageFileSize] = useState<string | null>(null);

  // Dietary & Taste Filters
  const [isSpicy, setIsSpicy] = useState<boolean>(initialDish?.isSpicy ?? false);
  const [spiceLevel, setSpiceLevel] = useState<number>(initialDish?.spiceLevel ?? (initialDish?.isSpicy ? 2 : 0));
  const [isVegetarian, setIsVegetarian] = useState<boolean>(initialDish?.isVegetarian ?? false);
  const [isVegan, setIsVegan] = useState<boolean>(initialDish?.isVegan ?? false);
  const [isHalal, setIsHalal] = useState<boolean>(initialDish?.isHalal ?? true);
  const [isGlutenFree, setIsGlutenFree] = useState<boolean>(initialDish?.isGlutenFree ?? false);
  const [isNigerLocal, setIsNigerLocal] = useState<boolean>(initialDish?.isNigerLocal ?? true);
  const [isExpress, setIsExpress] = useState<boolean>(initialDish?.isExpress ?? false);
  const [isChefSpecial, setIsChefSpecial] = useState<boolean>(initialDish?.isChefSpecial ?? false);
  const [isDailySpecial, setIsDailySpecial] = useState<boolean>(initialDish?.isDailySpecial ?? false);
  const [isAvailable, setIsAvailable] = useState<boolean>(initialDish?.isAvailable ?? true);

  // Moments de service & Menu du Jour
  const [mealMoments, setMealMoments] = useState<Array<"petit_dejeuner" | "dejeuner" | "diner" | "menu_du_jour">>(
    initialDish?.mealMoments || (initialDish?.dishCategory === "petit_dejeuner" ? ["petit_dejeuner"] : ["dejeuner", "diner"])
  );
  const [isMenuDuJour, setIsMenuDuJour] = useState<boolean>(
    initialDish?.isMenuDuJour ?? (initialDish?.dishCategory === "menu_du_jour" || false)
  );
  const [menuDuJourIncludes, setMenuDuJourIncludes] = useState<string>(
    initialDish?.menuDuJourIncludes || "Entrée + Plat au choix + Boisson fraîche offerte"
  );
  const [mealServiceTime, setMealServiceTime] = useState<string>(initialDish?.mealServiceTime || "");

  // Operational Specs
  const [preparationTime, setPreparationTime] = useState<number>(initialDish?.preparationTime || 15);
  const [calories, setCalories] = useState<number | undefined>(initialDish?.calories);

  // Custom Options
  const [options, setOptions] = useState<MenuItemOption[]>(initialDish?.options || []);
  const [newOptionName, setNewOptionName] = useState("");
  const [newChoiceLabel, setNewChoiceLabel] = useState("");
  const [newChoiceExtra, setNewChoiceExtra] = useState(0);

  // Error & Success feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local gallery photo file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedImageFile(file);
    }
  };

  const processSelectedImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Le fichier sélectionné doit être une image (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("L'image est trop volumineuse (> 10 Mo). Veuillez choisir une photo optimisée.");
      return;
    }

    setErrorMessage(null);
    setImageFileName(file.name);
    setImageFileSize(`${(file.size / 1024).toFixed(1)} Ko`);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedImageFile(file);
    }
  };

  // Add Option Group
  const handleAddOptionGroup = () => {
    if (!newOptionName.trim()) return;
    setOptions([
      ...options,
      {
        name: newOptionName.trim(),
        choices: [
          { label: "Option standard incluse", extraPrice: 0 },
        ],
      },
    ]);
    setNewOptionName("");
  };

  const handleAddChoiceToOption = (optionIndex: number) => {
    if (!newChoiceLabel.trim()) return;
    const updated = [...options];
    updated[optionIndex].choices.push({
      label: newChoiceLabel.trim(),
      extraPrice: Number(newChoiceExtra) || 0,
    });
    setOptions(updated);
    setNewChoiceLabel("");
    setNewChoiceExtra(0);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleRemoveChoice = (optionIndex: number, choiceIndex: number) => {
    const updated = [...options];
    updated[optionIndex].choices = updated[optionIndex].choices.filter((_, i) => i !== choiceIndex);
    setOptions(updated);
  };

  // Save Dish Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Veuillez renseigner le nom du plat.");
      return;
    }

    if (price <= 0) {
      setErrorMessage("Le prix doit être supérieur à 0 FCFA.");
      return;
    }

    const categoryObj = CATEGORIES_CONFIG.find((c) => c.id === dishCategory);
    const categoryLabel = categoryObj ? categoryObj.label : "Plats Africains";

    const newDish: MenuItem = {
      id: initialDish?.id || `dish-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "Spécialité fraîche préparée avec des ingrédients soigneusement sélectionnés à Niamey.",
      price: Number(price),
      category: categoryLabel,
      dishCategory,
      image,
      isSpicy: spiceLevel > 0,
      spiceLevel,
      isVegetarian,
      isVegan,
      isHalal,
      isGlutenFree,
      isNigerLocal,
      isExpress,
      isChefSpecial,
      isDailySpecial,
      isMenuDuJour,
      menuDuJourIncludes: isMenuDuJour ? menuDuJourIncludes.trim() : undefined,
      mealMoments: mealMoments.length > 0 ? mealMoments : undefined,
      mealServiceTime: mealServiceTime.trim() || undefined,
      isAvailable,
      preparationTime: Number(preparationTime) || 15,
      calories: calories ? Number(calories) : undefined,
      options: options.length > 0 ? options : undefined,
    };

    onSaveDish(newDish);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {initialDish ? "Modifier le Plat" : "Ajouter un Plat au Menu"}
              </h2>
              <p className="text-xs text-slate-400">
                Photo galerie, classification des catégories &amp; filtres alimentaires experts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-xs text-rose-200 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: PHOTO DU PLAT (GALERIE & FICHIER DIRECT) */}
          {/* ======================================================== */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-black text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>Photo Officielle du Plat (Galerie &amp; Téléversement)</span>
                </label>
                <p className="text-xs text-slate-400">
                  Importez votre photo réelle depuis votre téléphone/PC ou choisissez dans notre photothèque gastronomique.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPresetGallery(!showPresetGallery)}
                className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{showPresetGallery ? "Masquer Photothèque" : "Photothèque Exemples"}</span>
              </button>
            </div>

            {/* Main Upload / Drag & Drop Zone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Photo Preview Card */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 aspect-video md:aspect-square flex items-center justify-center group shadow-inner">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Aperçu plat"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3">
                      <span className="text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-700 w-fit">
                        {imageFileName || "Photo Actuelle"}
                      </span>
                      {imageFileSize && (
                        <span className="text-[9px] text-slate-300 mt-0.5">{imageFileSize}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <span className="text-xs">Aucune photo sélectionnée</span>
                  </div>
                )}
              </div>

              {/* Upload Dropzone & Action buttons */}
              <div className="md:col-span-2 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    isDragOver
                      ? "border-orange-500 bg-orange-500/10 text-orange-300"
                      : "border-slate-700 hover:border-orange-500/50 bg-slate-900/50 hover:bg-slate-900 text-slate-300"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/10">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Cliquez pour parcourir votre Galerie Photos
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ou glissez-déposez l'image directement ici (JPG, PNG, WebP)
                    </span>
                  </div>
                </div>

                {/* Direct Image URL input as quick alternative */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ou collez un lien URL d'image web..."
                      value={image.startsWith("data:") ? "" : image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setImageFileName(null);
                        setImageFileSize(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage("");
                        setImageFileName(null);
                        setImageFileSize(null);
                      }}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs transition cursor-pointer"
                      title="Effacer l'image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preset Photo Bank Drawer */}
            {showPresetGallery && (
              <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Photothèque Allôresto Niamey (Sélectionnez en 1 clic) :
                  </span>
                  <span className="text-[10px] text-orange-400 font-semibold">
                    Haute résolution &bull; Optimisé mobile
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                  {PRESET_PHOTO_GALLERY.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImage(preset.url);
                        setImageFileName(preset.label);
                        setImageFileSize("Preset HD");
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-video bg-slate-900 border cursor-pointer group transition-all ${
                        image === preset.url
                          ? "border-orange-500 ring-2 ring-orange-500/50 scale-95"
                          : "border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-white line-clamp-1">
                          {preset.label}
                        </span>
                      </div>
                      {image === preset.url && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: INFORMATIONS GÉNÉRALES & PRIX */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Nom du Plat *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Choukouya d'Agneau au Véritable Kan-Kan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Prix de vente (FCFA) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={100}
                  step={100}
                  placeholder="3500"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-orange-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-orange-400">
                  FCFA
                </span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Description savoureuse &amp; Ingrédients
              </label>
              <textarea
                rows={2}
                placeholder="Détaillez la cuisson, les marinades, garnitures incluses et les arômes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: SÉLECTEUR DE CATÉGORIES OFFICIELLES */}
          {/* ======================================================== */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Catégorie du Plat</span>
              </label>
              <span className="text-[10px] text-slate-400">
                Affecte le classement et les filtres de recherche
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATEGORIES_CONFIG.map((cat) => {
                const isSelected = dishCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setDishCategory(cat.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-orange-500/20 border-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{cat.icon}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <div className="mt-2">
                      <h4 className="text-xs font-bold text-white">{cat.label}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: FILTRES EXPERTS (ÉPICÉ, VÉGÉTARIEN, HALAL...) */}
          {/* ======================================================== */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Filtres de Goût, Régimes &amp; Touche d&apos;Expertise</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Activez les étiquettes alimentaires pour faciliter la sélection des clients selon leurs exigences.
              </p>
            </div>

            {/* Spice Level Control */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-white">Niveau de Piquant / Épices :</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40">
                  {spiceLevel === 0 && "🌿 Non Épicé / Doux"}
                  {spiceLevel === 1 && "🌶️ Légèrement Relevé"}
                  {spiceLevel === 2 && "🌶️🌶️ Piquant Sahélien"}
                  {spiceLevel === 3 && "🔥🔥 Kan-Kan Volcanique"}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { level: 0, label: "0. Doux", desc: "Sans piment" },
                  { level: 1, label: "1. Relevé", desc: "Aromates" },
                  { level: 2, label: "2. Épicé", desc: "Piment moyen" },
                  { level: 3, label: "3. Volcan", desc: "Kan-Kan fort" },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => {
                      setSpiceLevel(item.level);
                      setIsSpicy(item.level > 0);
                    }}
                    className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      spiceLevel === item.level
                        ? "bg-red-500 text-white font-black border-red-400 shadow-md shadow-red-500/20"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[9px] opacity-80 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Multi Tag Checkbox Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Halal */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isHalal
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isHalal}
                  onChange={(e) => setIsHalal(e.target.checked)}
                  className="hidden"
                />
                <ShieldCheck className={`w-4 h-4 shrink-0 ${isHalal ? "text-emerald-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">100% Halal</span>
                  <span className="text-[9px] opacity-75">Certifié</span>
                </div>
              </label>

              {/* Terroir Niger */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isNigerLocal
                    ? "bg-amber-950/60 border-amber-500 text-amber-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isNigerLocal}
                  onChange={(e) => setIsNigerLocal(e.target.checked)}
                  className="hidden"
                />
                <span className="text-base shrink-0">🇳🇪</span>
                <div>
                  <span className="text-xs font-bold block">Terroir Niger</span>
                  <span className="text-[9px] opacity-75">Recette locale</span>
                </div>
              </label>

              {/* Végétarien */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isVegetarian
                    ? "bg-green-950/60 border-green-500 text-green-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => {
                    setIsVegetarian(e.target.checked);
                    if (!e.target.checked) setIsVegan(false);
                  }}
                  className="hidden"
                />
                <Leaf className={`w-4 h-4 shrink-0 ${isVegetarian ? "text-green-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">Végétarien</span>
                  <span className="text-[9px] opacity-75">Sans viande</span>
                </div>
              </label>

              {/* Végan */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isVegan
                    ? "bg-green-950/60 border-green-500 text-green-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isVegan}
                  onChange={(e) => {
                    setIsVegan(e.target.checked);
                    if (e.target.checked) setIsVegetarian(true);
                  }}
                  className="hidden"
                />
                <Leaf className={`w-4 h-4 shrink-0 ${isVegan ? "text-green-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">Végan</span>
                  <span className="text-[9px] opacity-75">100% végétal</span>
                </div>
              </label>

              {/* Sans Gluten */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isGlutenFree
                    ? "bg-yellow-950/60 border-yellow-500 text-yellow-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isGlutenFree}
                  onChange={(e) => setIsGlutenFree(e.target.checked)}
                  className="hidden"
                />
                <Wheat className={`w-4 h-4 shrink-0 ${isGlutenFree ? "text-yellow-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">Sans Gluten</span>
                  <span className="text-[9px] opacity-75">Gluten-free</span>
                </div>
              </label>

              {/* Formule Express 15 min */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isExpress
                    ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="hidden"
                />
                <Zap className={`w-4 h-4 shrink-0 ${isExpress ? "text-cyan-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">Express &lt; 15 min</span>
                  <span className="text-[9px] opacity-75">Midi rapide</span>
                </div>
              </label>

              {/* Plat du Chef / Signature */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isChefSpecial
                    ? "bg-purple-950/60 border-purple-500 text-purple-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChefSpecial}
                  onChange={(e) => setIsChefSpecial(e.target.checked)}
                  className="hidden"
                />
                <Sparkles className={`w-4 h-4 shrink-0 ${isChefSpecial ? "text-purple-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">Choix du Chef</span>
                  <span className="text-[9px] opacity-75">Coup de cœur</span>
                </div>
              </label>

              {/* Plat du Jour Promo */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isDailySpecial
                    ? "bg-orange-950/60 border-orange-500 text-orange-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDailySpecial}
                  onChange={(e) => setIsDailySpecial(e.target.checked)}
                  className="hidden"
                />
                <Flame className={`w-4 h-4 shrink-0 ${isDailySpecial ? "text-orange-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">⭐ Plat du Jour</span>
                  <span className="text-[9px] opacity-75">En vedette midi</span>
                </div>
              </label>

              {/* Formule Menu du Jour Complet */}
              <label
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                  isMenuDuJour
                    ? "bg-amber-950/60 border-amber-500 text-amber-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isMenuDuJour}
                  onChange={(e) => setIsMenuDuJour(e.target.checked)}
                  className="hidden"
                />
                <Sparkles className={`w-4 h-4 shrink-0 ${isMenuDuJour ? "text-amber-400" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold block">⭐ Menu du Jour</span>
                  <span className="text-[9px] opacity-75">Formule complète</span>
                </div>
              </label>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4.5: MOMENTS DE SERVICE (PETIT DÉJEUNER, DÉJEUNER, DÎNER) */}
          {/* ======================================================== */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Horaires &amp; Moments de Dégustation</span>
              </h3>
              <span className="text-[10px] text-slate-400">
                Définissez les créneaux où ce plat est disponible à la commande
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Petit Déjeuner */}
              <label
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                  mealMoments.includes("petit_dejeuner")
                    ? "bg-amber-950/40 border-amber-500 text-white shadow-md shadow-amber-500/10"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌅</span>
                  <input
                    type="checkbox"
                    checked={mealMoments.includes("petit_dejeuner")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMealMoments([...mealMoments, "petit_dejeuner"]);
                      } else {
                        setMealMoments(mealMoments.filter((m) => m !== "petit_dejeuner"));
                      }
                    }}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Petit Déjeuner</h4>
                  <p className="text-[10px] text-amber-300/80 font-mono">06h30 &ndash; 11h00</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Omelettes, viennoiseries, café &amp; bouillie</p>
                </div>
              </label>

              {/* Déjeuner */}
              <label
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                  mealMoments.includes("dejeuner")
                    ? "bg-orange-950/40 border-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">☀️</span>
                  <input
                    type="checkbox"
                    checked={mealMoments.includes("dejeuner")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMealMoments([...mealMoments, "dejeuner"]);
                      } else {
                        setMealMoments(mealMoments.filter((m) => m !== "dejeuner"));
                      }
                    }}
                    className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Déjeuner</h4>
                  <p className="text-[10px] text-orange-300/80 font-mono">11h30 &ndash; 15h30</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Formules midi, plats du jour &amp; braisés</p>
                </div>
              </label>

              {/* Dîner */}
              <label
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                  mealMoments.includes("diner")
                    ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌙</span>
                  <input
                    type="checkbox"
                    checked={mealMoments.includes("diner")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMealMoments([...mealMoments, "diner"]);
                      } else {
                        setMealMoments(mealMoments.filter((m) => m !== "diner"));
                      }
                    }}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Dîner</h4>
                  <p className="text-[10px] text-indigo-300/80 font-mono">18h30 &ndash; 23h30</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Grillades nocturnes, soupes &amp; festins</p>
                </div>
              </label>
            </div>

            {/* Menu du Jour composition note */}
            {isMenuDuJour && (
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5 animate-fadeIn">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Composition du Menu du Jour (Inclus dans la formule) :</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Entrée au choix + Plat du jour + Jus frais Bissap 33cl offert"
                  value={menuDuJourIncludes}
                  onChange={(e) => setMenuDuJourIncludes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SECTION 5: OPTIONS & GARNITURES PERSONNALISABLES */}
          {/* ======================================================== */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Options &amp; Choix au Choix du Client (Ex: Garniture, Cuisson, Sauce)
                </h3>
                <p className="text-[10px] text-slate-400">
                  Permettez au client de composer son plat lors de la commande.
                </p>
              </div>
            </div>

            {/* List Existing Options */}
            {options.map((opt, optIdx) => (
              <div key={optIdx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{opt.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(optIdx)}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Supprimer ce groupe
                  </button>
                </div>

                <div className="space-y-1">
                  {opt.choices.map((ch, chIdx) => (
                    <div key={chIdx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span>{ch.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-orange-400">
                          {ch.extraPrice > 0 ? `+${ch.extraPrice.toLocaleString()} FCFA` : "Inclus (Gratuit)"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(optIdx, chIdx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add choice inside option */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Nom du choix (ex: Alloco doré, Riz blanc)"
                    value={newChoiceLabel}
                    onChange={(e) => setNewChoiceLabel(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Supplément FCFA"
                    value={newChoiceExtra}
                    onChange={(e) => setNewChoiceExtra(Number(e.target.value))}
                    className="w-28 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddChoiceToOption(optIdx)}
                    className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold cursor-pointer"
                  >
                    + Choix
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Option Group */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Nouveau groupe d'options (ex: Choix de la garniture, Sauce supplémentaire)"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddOptionGroup}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer Groupe</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 6: TEMPS DE PRÉPARATION & DISPONIBILITÉ */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Temps de préparation moyen (minutes)</span>
              </label>
              <input
                type="number"
                min={2}
                max={90}
                value={preparationTime}
                onChange={(e) => setPreparationTime(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-white block">
                  Disponibilité en cuisine
                </label>
                <span className="text-[11px] text-slate-400">
                  {isAvailable ? "Actif & commandable" : "En rupture de stock temporaire"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isAvailable
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                }`}
              >
                {isAvailable ? "En Stock" : "Rupture"}
              </button>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/30 transition cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{initialDish ? "Mettre à jour le plat" : "Enregistrer et publier le plat"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
