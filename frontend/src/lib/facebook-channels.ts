import {
  FacebookPage,
  FacebookUserProfile,
  FacebookChannelConfig,
  WebhookHandshakeStep,
} from '@/types/facebook-channel';
import { Channel } from '@/components/channels/channel-manager';

export const MOCK_FB_USER: FacebookUserProfile = {
  id: 'fb_user_10283419028',
  name: 'Jitendra Kumar',
  email: 'jitendra@appnix.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  connectedAt: new Date().toISOString(),
};

export const INITIAL_FACEBOOK_PAGES: FacebookPage[] = [
  {
    id: '896015703596388',
    name: 'Appnix Official Page',
    category: 'Software & Technology',
    avatarUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followerCount: 18200,
    likesCount: 17400,
    hasAdminPermission: true,
    isConnectedToCurrentWorkspace: true,
    isConnectedToOtherWorkspace: false,
    accessTokenStatus: 'valid',
  },
  {
    id: '928104571930211',
    name: 'Appnix Technologies Support',
    category: 'Customer Support & Consulting',
    avatarUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    followerCount: 12450,
    likesCount: 11900,
    hasAdminPermission: true,
    isConnectedToCurrentWorkspace: false,
    isConnectedToOtherWorkspace: false,
    accessTokenStatus: 'valid',
  },
  {
    id: '740192837410293',
    name: 'Appnix Global Deals & Community',
    category: 'E-commerce & Digital Services',
    avatarUrl:
      'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=150&auto=format&fit=crop&q=80',
    followerCount: 45800,
    likesCount: 44200,
    hasAdminPermission: true,
    isConnectedToCurrentWorkspace: false,
    isConnectedToOtherWorkspace: false,
    accessTokenStatus: 'valid',
  },
  {
    id: '601928472918340',
    name: 'NextGen Cloud Automation',
    category: 'Internet Tech & AI',
    avatarUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    followerCount: 8900,
    likesCount: 8500,
    hasAdminPermission: true,
    isConnectedToCurrentWorkspace: false,
    isConnectedToOtherWorkspace: true,
    connectedWorkspaceName: 'Global Agency Workspace',
    accessTokenStatus: 'valid',
  },
  {
    id: '519283746102938',
    name: 'DevOps & AI Masterclass',
    category: 'Education & Community',
    avatarUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80',
    followerCount: 5120,
    likesCount: 4900,
    hasAdminPermission: true,
    isConnectedToCurrentWorkspace: false,
    isConnectedToOtherWorkspace: false,
    accessTokenStatus: 'valid',
  },
];

export const COLOR_SWATCH_PRESETS = [
  { id: 'blue', hex: '#2563EB', name: 'Meta Blue' },
  { id: 'emerald', hex: '#059669', name: 'Emerald' },
  { id: 'purple', hex: '#7C3AED', name: 'Royal Purple' },
  { id: 'amber', hex: '#D97706', name: 'Amber Gold' },
  { id: 'rose', hex: '#E11D48', name: 'Rose Red' },
  { id: 'cyan', hex: '#0891B2', name: 'Cyan Teal' },
  { id: 'indigo', hex: '#4F46E5', name: 'Indigo Deep' },
];

const FB_AUTH_KEY = 'appnix_fb_auth_user';
const FB_PAGES_KEY = 'appnix_fb_pages_list';

export function getStoredFacebookUser(): FacebookUserProfile | null {
  if (typeof window === 'undefined') return MOCK_FB_USER;
  try {
    const raw = localStorage.getItem(FB_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Facebook user profile', e);
    return null;
  }
}

export function saveStoredFacebookUser(user: FacebookUserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(FB_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(FB_AUTH_KEY);
    }
  } catch (e) {
    console.error('Failed to save Facebook user profile', e);
  }
}

export function getStoredFacebookPages(): FacebookPage[] {
  if (typeof window === 'undefined') return INITIAL_FACEBOOK_PAGES;
  try {
    const raw = localStorage.getItem(FB_PAGES_KEY);
    if (!raw) {
      localStorage.setItem(FB_PAGES_KEY, JSON.stringify(INITIAL_FACEBOOK_PAGES));
      return INITIAL_FACEBOOK_PAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Facebook pages', e);
    return INITIAL_FACEBOOK_PAGES;
  }
}

export function markPageAsConnected(pageId: string): void {
  const pages = getStoredFacebookPages();
  const updated = pages.map((p) =>
    p.id === pageId ? { ...p, isConnectedToCurrentWorkspace: true } : p
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(FB_PAGES_KEY, JSON.stringify(updated));
  }
}
