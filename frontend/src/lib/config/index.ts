export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1",
    proxyPrefix: "/api/proxy",
    timeout: 30000,
  },
  app: {
    name: "Appnix",
    description: "Unified Business Messaging & Marketing Platform",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  auth: {
    tokenKey: "appnix_auth_token",
    refreshTokenKey: "appnix_refresh_token",
    userKey: "appnix_user",
    googleOAuthUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1"}/auth/google`,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfVco0tAAAAAGeR2tdcUwtC_vJvXWV_cZ2ZPW8R",
  },
  theme: {
    defaultTheme: "system",
    storageKey: "appnix_theme",
  },
} as const;

export type Config = typeof config;