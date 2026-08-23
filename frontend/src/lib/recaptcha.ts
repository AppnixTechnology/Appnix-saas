"use client";

import { config } from "@/lib/config";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let recaptchaLoaded = false;
let recaptchaPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Google reCAPTCHA v3 script in non-blocking async mode
 */
export function loadRecaptchaScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (recaptchaLoaded && window.grecaptcha) {
    return Promise.resolve();
  }

  if (recaptchaPromise) {
    return recaptchaPromise;
  }

  const siteKey = config.auth.recaptchaSiteKey;
  if (!siteKey) {
    return Promise.resolve();
  }

  recaptchaPromise = new Promise((resolve) => {
    // Check if script element already exists in DOM
    const existingScript = document.getElementById("google-recaptcha-v3");
    if (existingScript) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          recaptchaLoaded = true;
          resolve();
        });
      } else {
        existingScript.addEventListener("load", () => {
          window.grecaptcha?.ready(() => {
            recaptchaLoaded = true;
            resolve();
          });
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "google-recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha?.ready(() => {
        recaptchaLoaded = true;
        resolve();
      });
    };
    script.onerror = () => {
      console.warn("[reCAPTCHA] Failed to load Google reCAPTCHA v3 script. Proceeding in fallback mode.");
      resolve();
    };

    document.head.appendChild(script);
  });

  return recaptchaPromise;
}

/**
 * Executes Google reCAPTCHA v3 for the given action and returns verification token
 */
export async function getRecaptchaToken(action = "submit"): Promise<string | undefined> {
  const siteKey = config.auth.recaptchaSiteKey;
  if (!siteKey || typeof window === "undefined") {
    return undefined;
  }

  try {
    await loadRecaptchaScript();

    if (!window.grecaptcha) {
      return undefined;
    }

    return await new Promise<string>((resolve) => {
      window.grecaptcha?.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(siteKey, { action });
          resolve(token);
        } catch (err) {
          console.warn("[reCAPTCHA execution error]", err);
          resolve("");
        }
      });
    });
  } catch (error) {
    console.warn("[reCAPTCHA error]", error);
    return undefined;
  }
}
