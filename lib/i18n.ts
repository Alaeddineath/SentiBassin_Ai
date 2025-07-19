export type Language = "en" | "fr" | "ar"

export interface Translations {
  // Navigation
  home: string
  liveMonitor: string
  settings: string
  profile: string
  logout: string

  // Dashboard
  dashboard: string
  totalBassins: string
  activeBassins: string
  activeAlerts: string
  bassinOverview: string
  quickActions: string
  viewReports: string
  systemSettings: string
  alertManagement: string
  dataExport: string

  // Bassin Details
  bassinDetails: string
  fishType: string
  capacity: string
  temperature: string
  phLevel: string
  dissolvedOxygen: string
  waterLevel: string
  ammonia: string
  nitrite: string
  nitrate: string
  turbidity: string
  lastUpdated: string
  created: string

  // Status
  excellent: string
  good: string
  warning: string
  poor: string
  safe: string
  danger: string

  // Actions
  addNewBassin: string
  editProfile: string
  saveChanges: string
  cancel: string
  delete: string
  export: string
  filter: string
  search: string

  // History
  history: string
  dataHistory: string
  selectBassin: string
  timeRange: string
  from: string
  to: string
  totalRecords: string
  dateRange: string
  avgTemperature: string
  showHistory: string
  hideHistory: string
  exportCsv: string

  // Alerts
  alerts: string
  notifications: string
  critical: string
  noActiveAlerts: string
  markAsRead: string
  markAllRead: string
  clearAll: string

  // Water Quality
  waterQuality: string
  aiPrediction: string
  confidence: string
  bacterialCount: string
  trends24h: string

  // Time
  justNow: string
  minutesAgo: string
  hoursAgo: string
  daysAgo: string

  // Units
  celsius: string
  mgPerL: string
  percent: string
  ntu: string

  // Messages
  loading: string
  noData: string
  error: string
  success: string

  // Forms
  name: string
  location: string
  description: string
  email: string
  password: string
  confirmPassword: string
  required: string

  // Locations
  northSection: string
  southSection: string
  eastSection: string
  westSection: string
  centralSection: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: "Home",
    liveMonitor: "Live Monitor",
    settings: "Settings",
    profile: "Profile",
    logout: "Log Out",

    // Dashboard
    dashboard: "Dashboard",
    totalBassins: "Total Bassins",
    activeBassins: "Active Bassins",
    activeAlerts: "Active Alerts",
    bassinOverview: "Bassin Overview",
    quickActions: "Quick Actions",
    viewReports: "View Reports",
    systemSettings: "System Settings",
    alertManagement: "Alert Management",
    dataExport: "Data Export",

    // Bassin Details
    bassinDetails: "Bassin Details",
    fishType: "Fish Type",
    capacity: "Capacity",
    temperature: "Temperature",
    phLevel: "pH Level",
    dissolvedOxygen: "Dissolved Oxygen",
    waterLevel: "Water Level",
    ammonia: "Ammonia",
    nitrite: "Nitrite",
    nitrate: "Nitrate",
    turbidity: "Turbidity",
    lastUpdated: "Last updated",
    created: "Created",

    // Status
    excellent: "Excellent",
    good: "Good",
    warning: "Warning",
    poor: "Poor",
    safe: "Safe",
    danger: "Danger",

    // Actions
    addNewBassin: "Add New Bassin",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    export: "Export",
    filter: "Filter",
    search: "Search",

    // History
    history: "History",
    dataHistory: "Data History",
    selectBassin: "Select Bassin",
    timeRange: "Time Range",
    from: "From",
    to: "To",
    totalRecords: "Total Records",
    dateRange: "Date Range",
    avgTemperature: "Avg Temperature",
    showHistory: "Show History",
    hideHistory: "Hide History",
    exportCsv: "Export CSV",

    // Alerts
    alerts: "Alerts",
    notifications: "Notifications",
    critical: "Critical",
    noActiveAlerts: "No active alerts",
    markAsRead: "Mark as read",
    markAllRead: "Mark All Read",
    clearAll: "Clear All",

    // Water Quality
    waterQuality: "Water Quality",
    aiPrediction: "AI Water Quality Prediction",
    confidence: "Confidence",
    bacterialCount: "Estimated Bacterial Count",
    trends24h: "24-Hour Trends",

    // Time
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",

    // Units
    celsius: "°C",
    mgPerL: "mg/L",
    percent: "%",
    ntu: "NTU",

    // Messages
    loading: "Loading...",
    noData: "No data available",
    error: "Error",
    success: "Success",

    // Forms
    name: "Name",
    location: "Location",
    description: "Description",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    required: "Required",

    // Locations
    northSection: "North Section",
    southSection: "South Section",
    eastSection: "East Section",
    westSection: "West Section",
    centralSection: "Central Section",
  },

  fr: {
    // Navigation
    home: "Accueil",
    liveMonitor: "Surveillance en Direct",
    settings: "Paramètres",
    profile: "Profil",
    logout: "Déconnexion",

    // Dashboard
    dashboard: "Tableau de Bord",
    totalBassins: "Total des Bassins",
    activeBassins: "Bassins Actifs",
    activeAlerts: "Alertes Actives",
    bassinOverview: "Aperçu des Bassins",
    quickActions: "Actions Rapides",
    viewReports: "Voir les Rapports",
    systemSettings: "Paramètres Système",
    alertManagement: "Gestion des Alertes",
    dataExport: "Export de Données",

    // Bassin Details
    bassinDetails: "Détails du Bassin",
    fishType: "Type de Poisson",
    capacity: "Capacité",
    temperature: "Température",
    phLevel: "Niveau pH",
    dissolvedOxygen: "Oxygène Dissous",
    waterLevel: "Niveau d'Eau",
    ammonia: "Ammoniac",
    nitrite: "Nitrite",
    nitrate: "Nitrate",
    turbidity: "Turbidité",
    lastUpdated: "Dernière mise à jour",
    created: "Créé",

    // Status
    excellent: "Excellent",
    good: "Bon",
    warning: "Attention",
    poor: "Mauvais",
    safe: "Sûr",
    danger: "Danger",

    // Actions
    addNewBassin: "Ajouter un Nouveau Bassin",
    editProfile: "Modifier le Profil",
    saveChanges: "Sauvegarder",
    cancel: "Annuler",
    delete: "Supprimer",
    export: "Exporter",
    filter: "Filtrer",
    search: "Rechercher",

    // History
    history: "Historique",
    dataHistory: "Historique des Données",
    selectBassin: "Sélectionner un Bassin",
    timeRange: "Période",
    from: "De",
    to: "À",
    totalRecords: "Total des Enregistrements",
    dateRange: "Plage de Dates",
    avgTemperature: "Température Moyenne",
    showHistory: "Afficher l'Historique",
    hideHistory: "Masquer l'Historique",
    exportCsv: "Exporter CSV",

    // Alerts
    alerts: "Alertes",
    notifications: "Notifications",
    critical: "Critique",
    noActiveAlerts: "Aucune alerte active",
    markAsRead: "Marquer comme lu",
    markAllRead: "Tout Marquer comme Lu",
    clearAll: "Tout Effacer",

    // Water Quality
    waterQuality: "Qualité de l'Eau",
    aiPrediction: "Prédiction IA de la Qualité de l'Eau",
    confidence: "Confiance",
    bacterialCount: "Nombre Bactérien Estimé",
    trends24h: "Tendances 24h",

    // Time
    justNow: "À l'instant",
    minutesAgo: "min",
    hoursAgo: "h",
    daysAgo: "j",

    // Units
    celsius: "°C",
    mgPerL: "mg/L",
    percent: "%",
    ntu: "NTU",

    // Messages
    loading: "Chargement...",
    noData: "Aucune donnée disponible",
    error: "Erreur",
    success: "Succès",

    // Forms
    name: "Nom",
    location: "Emplacement",
    description: "Description",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    required: "Requis",

    // Locations
    northSection: "Section Nord",
    southSection: "Section Sud",
    eastSection: "Section Est",
    westSection: "Section Ouest",
    centralSection: "Section Centrale",
  },

  ar: {
    // Navigation
    home: "الرئيسية",
    liveMonitor: "المراقبة المباشرة",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",

    // Dashboard
    dashboard: "لوحة التحكم",
    totalBassins: "إجمالي الأحواض",
    activeBassins: "الأحواض النشطة",
    activeAlerts: "التنبيهات النشطة",
    bassinOverview: "نظرة عامة على الأحواض",
    quickActions: "الإجراءات السريعة",
    viewReports: "عرض التقارير",
    systemSettings: "إعدادات النظام",
    alertManagement: "إدارة التنبيهات",
    dataExport: "تصدير البيانات",

    // Bassin Details
    bassinDetails: "تفاصيل الحوض",
    fishType: "نوع السمك",
    capacity: "السعة",
    temperature: "درجة الحرارة",
    phLevel: "مستوى الحموضة",
    dissolvedOxygen: "الأكسجين المذاب",
    waterLevel: "مستوى الماء",
    ammonia: "الأمونيا",
    nitrite: "النتريت",
    nitrate: "النترات",
    turbidity: "العكارة",
    lastUpdated: "آخر تحديث",
    created: "تم الإنشاء",

    // Status
    excellent: "ممتاز",
    good: "جيد",
    warning: "تحذير",
    poor: "ضعيف",
    safe: "آمن",
    danger: "خطر",

    // Actions
    addNewBassin: "إضافة حوض جديد",
    editProfile: "تعديل الملف الشخصي",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    delete: "حذف",
    export: "تصدير",
    filter: "تصفية",
    search: "بحث",

    // History
    history: "التاريخ",
    dataHistory: "تاريخ البيانات",
    selectBassin: "اختر الحوض",
    timeRange: "النطاق الزمني",
    from: "من",
    to: "إلى",
    totalRecords: "إجمالي السجلات",
    dateRange: "نطاق التاريخ",
    avgTemperature: "متوسط درجة الحرارة",
    showHistory: "إظهار التاريخ",
    hideHistory: "إخفاء التاريخ",
    exportCsv: "تصدير CSV",

    // Alerts
    alerts: "التنبيهات",
    notifications: "الإشعارات",
    critical: "حرج",
    noActiveAlerts: "لا توجد تنبيهات نشطة",
    markAsRead: "تحديد كمقروء",
    markAllRead: "تحديد الكل كمقروء",
    clearAll: "مسح الكل",

    // Water Quality
    waterQuality: "جودة المياه",
    aiPrediction: "توقع الذكاء الاصطناعي لجودة المياه",
    confidence: "الثقة",
    bacterialCount: "العدد البكتيري المقدر",
    trends24h: "اتجاهات 24 ساعة",

    // Time
    justNow: "الآن",
    minutesAgo: "د",
    hoursAgo: "س",
    daysAgo: "ي",

    // Units
    celsius: "°م",
    mgPerL: "مغ/ل",
    percent: "%",
    ntu: "وحدة عكارة",

    // Messages
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات متاحة",
    error: "خطأ",
    success: "نجح",

    // Forms
    name: "الاسم",
    location: "الموقع",
    description: "الوصف",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    required: "مطلوب",

    // Locations
    northSection: "القسم الشمالي",
    southSection: "القسم الجنوبي",
    eastSection: "القسم الشرقي",
    westSection: "القسم الغربي",
    centralSection: "القسم المركزي",
  },
}

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language][key] || translations.en[key] || key
}

export function formatTimeAgo(timestamp: string, language: Language): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return getTranslation(language, "justNow")
  if (diffInMinutes < 60) return `${diffInMinutes}${getTranslation(language, "minutesAgo")}`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${getTranslation(language, "hoursAgo")}`
  return `${Math.floor(diffInMinutes / 1440)}${getTranslation(language, "daysAgo")}`
}
