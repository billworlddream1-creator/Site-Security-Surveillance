export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Security Dashboard',
    security: 'Threat Surveillance',
    reports: 'Intelligence Reports',
    admin: 'Admin Portal',
    monitorSite: 'Monitor Site',
    activeProperties: 'Active Properties',
    wallet: 'Wallet',
    systemsOperational: 'Systems operational',
    plan: 'Plan',
    threatLevel: 'Threat Level',
    nominal: 'Nominal',
    noActiveBreaches: 'No active breaches',
    backToOverview: 'Back to Overview',
    language: 'Language',
    selectLanguage: 'Select Language'
  },
  es: {
    dashboard: 'Panel de Seguridad',
    security: 'Vigilancia de Amenazas',
    reports: 'Informes de Inteligencia',
    admin: 'Portal de Administración',
    monitorSite: 'Monitorear Sitio',
    activeProperties: 'Propiedades Activas',
    wallet: 'Billetera',
    systemsOperational: 'Sistemas operativos',
    plan: 'Plan',
    threatLevel: 'Nivel de Amenaza',
    nominal: 'Nominal',
    noActiveBreaches: 'Sin infracciones activas',
    backToOverview: 'Volver al Resumen',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma'
  },
  fr: {
    dashboard: 'Tableau de bord Sécurité',
    security: 'Surveillance des Menaces',
    reports: 'Rapports d\'Intelligence',
    admin: 'Portail d\'Administration',
    monitorSite: 'Surveiller un Site',
    activeProperties: 'Propriétés Actives',
    wallet: 'Portefeuille',
    systemsOperational: 'Systèmes opérationnels',
    plan: 'Abonnement',
    threatLevel: 'Niveau de Menace',
    nominal: 'Nominal',
    noActiveBreaches: 'Aucune violation active',
    backToOverview: 'Retour à la vue d\'ensemble',
    language: 'Langue',
    selectLanguage: 'Choisir la langue'
  },
  de: {
    dashboard: 'Sicherheits-Dashboard',
    security: 'Bedrohungsüberwachung',
    reports: 'Geheimdienst-Berichte',
    admin: 'Admin-Portal',
    monitorSite: 'Website überwachen',
    activeProperties: 'Aktive Objekte',
    wallet: 'Brieftasche',
    systemsOperational: 'Systeme betriebsbereit',
    plan: 'Tarif',
    threatLevel: 'Bedrohungsstufe',
    nominal: 'Nominal',
    noActiveBreaches: 'Keine aktiven Verstöße',
    backToOverview: 'Zurück zur Übersicht',
    language: 'Sprache',
    selectLanguage: 'Sprache auswählen'
  },
  ja: {
    dashboard: 'セキュリティダッシュボード',
    security: '脅威サーベイランス',
    reports: 'インテリジェンスレポート',
    admin: '管理者ポータル',
    monitorSite: 'サイトを監視',
    activeProperties: 'アクティブプロパティ',
    wallet: 'ウォレット',
    systemsOperational: 'システム正常稼働中',
    plan: 'プラン',
    threatLevel: '脅威レベル',
    nominal: '正常',
    noActiveBreaches: 'アクティブな侵害なし',
    backToOverview: '概要に戻る',
    language: '言語',
    selectLanguage: '言語を選択'
  },
  zh: {
    dashboard: '安全仪表板',
    security: '威胁监控',
    reports: '情报报告',
    admin: '管理门户',
    monitorSite: '监控网站',
    activeProperties: '活动资产',
    wallet: '钱包',
    systemsOperational: '系统正常运行',
    plan: '计划',
    threatLevel: '威胁级别',
    nominal: '正常',
    noActiveBreaches: '无活动入侵',
    backToOverview: '返回概览',
    language: '语言',
    selectLanguage: '选择语言'
  }
};
