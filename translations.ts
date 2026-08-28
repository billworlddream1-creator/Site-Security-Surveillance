export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  dashboard: string;
  threatSurveillance: string;
  intelligenceReports: string;
  adminPortal: string;
  monitorSite: string;
  upgradePlan: string;
  walletBalance: string;
  activeProperties: string;
  totalMonitored: string;
  avgUptime: string;
  avgResponse: string;
  threatLevel: string;
  nominal: string;
  noActiveBreaches: string;
  backToOverview: string;
  loginTitle: string;
  emailLabel: string;
  passwordLabel: string;
  loginButton: string;
  resetPassword: string;
  language: string;
  downloadApp: string;
  selectLanguage: string;
}

export const languages: { code: Language; name: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appTitle: 'Site Security and Surveillance (GMT SSS)',
    appSubtitle: 'Systems operational • Plan:',
    dashboard: 'Security Dashboard',
    threatSurveillance: 'Threat Surveillance',
    intelligenceReports: 'Intelligence Reports',
    adminPortal: 'Admin Portal',
    monitorSite: 'Monitor Site',
    upgradePlan: 'Upgrade Plan',
    walletBalance: 'Wallet Balance',
    activeProperties: 'Active Properties',
    totalMonitored: 'Total Monitored',
    avgUptime: 'Average Uptime',
    avgResponse: 'Average Latency',
    threatLevel: 'Threat Level',
    nominal: 'Nominal',
    noActiveBreaches: 'No active breaches detected',
    backToOverview: 'Back to Overview',
    loginTitle: 'GMT SSS Portal Login',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    loginButton: 'Sign In',
    resetPassword: 'Reset Password',
    language: 'Language',
    downloadApp: 'Download Native App',
    selectLanguage: 'Select Language'
  },
  es: {
    appTitle: 'Seguridad y Vigilancia del Sitio (GMT SSS)',
    appSubtitle: 'Sistemas operativos • Plan:',
    dashboard: 'Panel de Control de Seguridad',
    threatSurveillance: 'Vigilancia de Amenazas',
    intelligenceReports: 'Informes de Inteligencia',
    adminPortal: 'Portal de Administración',
    monitorSite: 'Monitorear Sitio',
    upgradePlan: 'Actualizar Plan',
    walletBalance: 'Saldo de Billetera',
    activeProperties: 'Propiedades Activas',
    totalMonitored: 'Total Monitoreado',
    avgUptime: 'Tiempo de Actividad Promedio',
    avgResponse: 'Latencia Promedio',
    threatLevel: 'Nivel de Amenaza',
    nominal: 'Nominal',
    noActiveBreaches: 'No se detectaron brechas activas',
    backToOverview: 'Volver a la vista general',
    loginTitle: 'Inicio de Sesión Portal GMT SSS',
    emailLabel: 'Correo Electrónico',
    passwordLabel: 'Contraseña',
    loginButton: 'Iniciar Sesión',
    resetPassword: 'Restablecer Contraseña',
    language: 'Idioma',
    downloadApp: 'Descargar Aplicación Nativa',
    selectLanguage: 'Seleccionar Idioma'
  },
  fr: {
    appTitle: 'Sécurité et Surveillance del App (GMT SSS)',
    appSubtitle: 'Systèmes opérationnels • Forfait:',
    dashboard: 'Tableau de Bord de Sécurité',
    threatSurveillance: 'Surveillance des Menaces',
    intelligenceReports: 'Rapports d\'Intelligence',
    adminPortal: 'Portail d\'Administration',
    monitorSite: 'Surveiller un Site',
    upgradePlan: 'Mettre à Niveau',
    walletBalance: 'Solde du Portefeuille',
    activeProperties: 'Propriétés Actives',
    totalMonitored: 'Total Surveillé',
    avgUptime: 'Disponibilité Moyenne',
    avgResponse: 'Latence Moyenne',
    threatLevel: 'Niveau de Menace',
    nominal: 'Nominal',
    noActiveBreaches: 'Aucune violation active détectée',
    backToOverview: 'Retour à l\'aperçu',
    loginTitle: 'Connexion Portail GMT SSS',
    emailLabel: 'Adresse E-mail',
    passwordLabel: 'Mot de Passe',
    loginButton: 'Se Connecter',
    resetPassword: 'Réinitialiser le Mot de Passe',
    language: 'Langue',
    downloadApp: 'Télécharger l\'Application Native',
    selectLanguage: 'Choisir la Langue'
  },
  de: {
    appTitle: 'Website-Sicherheit und Überwachung (GMT SSS)',
    appSubtitle: 'Systeme betriebsbereit • Tarif:',
    dashboard: 'Sicherheits-Dashboard',
    threatSurveillance: 'Bedrohungsüberwachung',
    intelligenceReports: 'Intelligenzberichte',
    adminPortal: 'Admin-Portal',
    monitorSite: 'Website Überwachen',
    upgradePlan: 'Tarif Upgraden',
    walletBalance: 'Guthaben',
    activeProperties: 'Aktive Objekte',
    totalMonitored: 'Gesamt Überwacht',
    avgUptime: 'Durchschnittliche Betriebszeit',
    avgResponse: 'Durchschnittliche Latenz',
    threatLevel: 'Bedrohungsstufe',
    nominal: 'Nominal',
    noActiveBreaches: 'Keine aktiven Verstöße erkannt',
    backToOverview: 'Zurück zur Übersicht',
    loginTitle: 'GMT SSS Portal Anmeldung',
    emailLabel: 'E-Mail-Adresse',
    passwordLabel: 'Passwort',
    loginButton: 'Anmelden',
    resetPassword: 'Passwort Zurücksetzen',
    language: 'Sprache',
    downloadApp: 'Native App Herunterladen',
    selectLanguage: 'Sprache Auswählen'
  },
  ja: {
    appTitle: 'サイトセキュリティ＆監視 (GMT SSS)',
    appSubtitle: 'システム正常稼働中 • プラン:',
    dashboard: 'セキュリティダッシュボード',
    threatSurveillance: '脅威の監視',
    intelligenceReports: 'インテリジェンスレポート',
    adminPortal: '管理ポータル',
    monitorSite: 'サイトを監視',
    upgradePlan: 'プランをアップグレード',
    walletBalance: 'ウォレット残高',
    activeProperties: 'アクティブなプロパティ',
    totalMonitored: '監視対象合計',
    avgUptime: '平均稼働時間',
    avgResponse: '平均レイテンシ',
    threatLevel: '脅威レベル',
    nominal: '正常',
    noActiveBreaches: 'アクティブな侵害は検出されていません',
    backToOverview: '概要に戻る',
    loginTitle: 'GMT SSS ポータル ログイン',
    emailLabel: 'メールアドレス',
    passwordLabel: 'パスワード',
    loginButton: 'ログイン',
    resetPassword: 'パスワードの再設定',
    language: '言語',
    downloadApp: 'ネイティブアプリをダウンロード',
    selectLanguage: '言語を選択'
  },
  zh: {
    appTitle: '网站安全与监控 (GMT SSS)',
    appSubtitle: '系统运行正常 • 套餐:',
    dashboard: '安全仪表板',
    threatSurveillance: '威胁监控',
    intelligenceReports: '情报报告',
    adminPortal: '管理门户',
    monitorSite: '监控网站',
    upgradePlan: '升级套餐',
    walletBalance: '钱包余额',
    activeProperties: '活动属性',
    totalMonitored: '监控总数',
    avgUptime: '平均运行时间',
    avgResponse: '平均延迟',
    threatLevel: '威胁级别',
    nominal: '正常',
    noActiveBreaches: '未检测到活跃的安全漏洞',
    backToOverview: '返回概览',
    loginTitle: 'GMT SSS 门户登录',
    emailLabel: '电子邮件',
    passwordLabel: '密码',
    loginButton: '登录',
    resetPassword: '重置密码',
    language: '语言',
    downloadApp: '下载原生应用',
    selectLanguage: '选择语言'
  },
  ar: {
    appTitle: 'أمن ومراقبة المواقع (GMT SSS)',
    appSubtitle: 'الأنظمة تعمل • الخطة:',
    dashboard: 'لوحة تحكم الأمان',
    threatSurveillance: 'مراقبة التهديدات',
    intelligenceReports: 'تقارير الاستخبارات',
    adminPortal: 'بوابة الإدارة',
    monitorSite: 'مراقبة موقع',
    upgradePlan: 'ترقية الخطة',
    walletBalance: 'رصيد المحفظة',
    activeProperties: 'المواقع النشطة',
    totalMonitored: 'إجمالي المراقبة',
    avgUptime: 'متوسط وقت التشغيل',
    avgResponse: 'متوسط الاستجابة',
    threatLevel: 'مستوى التهديد',
    nominal: 'طبيعي',
    noActiveBreaches: 'لم يتم اكتشاف أي اختراقات نشطة',
    backToOverview: 'العودة إلى نظرة عامة',
    loginTitle: 'تسجيل الدخول إلى GMT SSS',
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    resetPassword: 'إعادة ضبط كلمة المرور',
    language: 'اللغة',
    downloadApp: 'تحميل التطبيق الأصلي',
    selectLanguage: 'اختر اللغة'
  }
};
