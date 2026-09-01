export type SupportedLanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "gu"
  | "ta"
  | "te"
  | "kn"
  | "pa";

export interface LanguageInfo {
  code: SupportedLanguageCode;
  name: string; // English name e.g. "Hindi"
  nativeName: string; // Native script e.g. "हिन्दी"
  script: string;
  region: string;
  isRTL?: boolean;
}

export interface TranslationDictionary {
  nav: {
    features: string;
    channels: string;
    crmBots: string;
    pricing: string;
    bookDemo: string;
    signIn: string;
    startFreeTrial: string;
    unifiedInbox: string;
    unifiedInboxDesc: string;
    campaignManager: string;
    campaignManagerDesc: string;
    automationBuilder: string;
    automationBuilderDesc: string;
    analyticsDashboard: string;
    analyticsDashboardDesc: string;
    howItWorks: string;
    howItWorksDesc: string;
    whiteLabel: string;
    whiteLabelDesc: string;
    testimonials: string;
    testimonialsDesc: string;
    faq: string;
    faqDesc: string;
    whatsappApi: string;
    whatsappApiDesc: string;
    rcsMessaging: string;
    rcsMessagingDesc: string;
    instagramDirect: string;
    instagramDirectDesc: string;
    facebookMessenger: string;
    facebookMessengerDesc: string;
    crmContact: string;
    crmContactDesc: string;
    botBuilder: string;
    botBuilderDesc: string;
    officialApi: string;
    googleVerified: string;
    metaDirect: string;
    metaApi: string;
  };
  suggestion: {
    availableIn: string; // "Appnix is available in {language}"
    preferLang: string; // "Prefer {language}?"
    switchTo: string; // "Switch to {language}"
    keepEnglish: string; // "Keep English"
    dismiss: string; // "Dismiss"
  };
  languageSelector: {
    label: string;
    selectLanguage: string;
    currentLanguage: string;
  };
  hero: {
    announcement: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaHint: string;
    livePlatform: string;
    channelStatus: string;
    activeChannels: string;
    storyStep1: string;
    storyStep2: string;
    storyStep3: string;
    storyStep4: string;
  };
  trustMetrics: {
    badge: string;
    title: string;
    stat1Value: string;
    stat1Label: string;
    stat1Sub: string;
    stat2Value: string;
    stat2Label: string;
    stat2Sub: string;
    stat3Value: string;
    stat3Label: string;
    stat3Sub: string;
    stat4Value: string;
    stat4Label: string;
    stat4Sub: string;
  };
  channelDemo: {
    badge: string;
    title: string;
    subtitle: string;
    whatsappTab: string;
    rcsTab: string;
    instagramTab: string;
    facebookTab: string;
    tryLiveDemo: string;
  };
  featureGrid: {
    badge: string;
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    feature5Title: string;
    feature5Desc: string;
    feature6Title: string;
    feature6Desc: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Number: string;
    step1Title: string;
    step1Desc: string;
    step2Number: string;
    step2Title: string;
    step2Desc: string;
    step3Number: string;
    step3Title: string;
    step3Desc: string;
  };
  crmShowcase: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  automationShowcase: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  campaignShowcase: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  whiteLabel: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  whyAppnix: {
    badge: string;
    title: string;
    subtitle: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    starterPlan: string;
    starterDesc: string;
    proPlan: string;
    proDesc: string;
    enterprisePlan: string;
    enterpriseDesc: string;
    monthly: string;
    annual: string;
    popular: string;
    getStarted: string;
    bookEnterprise: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    stillQuestions: string;
    talkToExpert: string;
  };
  finalCta: {
    badge: string;
    title: string;
    subtitle: string;
    primaryBtn: string;
    secondaryBtn: string;
    hint: string;
  };
  footer: {
    tagline: string;
    productCol: string;
    solutionsCol: string;
    resourcesCol: string;
    companyCol: string;
    legalCol?: string;
    copyright: string;
    allRightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
    termsAndConditions?: string;
    dataDeletion?: string;
  };
  leadModal: {
    title: string;
    subtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    close: string;
  };
  stickyMobile: {
    talkToTeam: string;
    startTrial: string;
  };
  auth: {
    welcomeBack: string;
    signInSubtitle: string;
    createAccount: string;
    signUpSubtitle: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    workspaceName: string;
    rememberMe: string;
    forgotPassword: string;
    signInButton: string;
    signUpButton: string;
    signInWithGoogle: string;
    orContinueWith: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    agreeTerms: string;
    signingIn: string;
    creatingAccount: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    totalConversations: string;
    activeCampaigns: string;
    botInteractions: string;
    automationsRunning: string;
    quickActions: string;
    startCampaign: string;
    connectChannel: string;
    createBot: string;
    recentActivity: string;
    channelPerformance: string;
    liveChat: string;
    contacts: string;
    searchPlaceholder: string;
  };
  sidebar: {
    menu: string;
    dashboard: string;
    channels: string;
    crm: string;
    chatbots: string;
    automations: string;
    products: string;
    voiceAi: string;
    department: string;
    settings: string;
    workspace: string;
    logout: string;
  };
}
