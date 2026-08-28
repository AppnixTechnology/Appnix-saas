import {
  WhatsAppTemplate,
  TemplateCategory,
  TemplateContentType,
  WhatsAppTemplateStatus,
  ValidationError,
  TemplateVariable,
} from '@/types/whatsapp-template';

export const SUPPORTED_LANGUAGES = [
  { code: 'en_US', label: 'English (US)' },
  { code: 'en_GB', label: 'English (UK)' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'hinglish', label: 'Hinglish (Hindi in Latin script)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'ar', label: 'Arabic (العربية)' },
  { code: 'pt_BR', label: 'Portuguese (Brasil)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
];

export const CATEGORY_DETAILS: Record<
  TemplateCategory,
  { title: string; subtitle: string; example: string; badgeColor: string }
> = {
  AUTHENTICATION: {
    title: 'Authentication',
    subtitle: 'OTP, login verification and account security messages.',
    example: 'Your login OTP is {{1}}. Valid for 10 mins.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300',
  },
  MARKETING: {
    title: 'Marketing',
    subtitle: 'Promotional offers, campaigns and customer engagement.',
    example: 'Enjoy 30% OFF this weekend with code {{1}}!',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300',
  },
  UTILITY: {
    title: 'Utility',
    subtitle: 'Order updates, reminders, confirmations and transactional messages.',
    example: 'Your order #{{1}} has been confirmed and shipped.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300',
  },
};

export const STANDARD_DATA_SOURCES = [
  { id: 'contact.name', label: 'Customer Full Name', defaultSample: 'Jitendra Kumar' },
  { id: 'contact.first_name', label: 'Customer First Name', defaultSample: 'Jitendra' },
  { id: 'contact.phone', label: 'Customer Phone Number', defaultSample: '+91 98765 43210' },
  { id: 'order.id', label: 'Order ID', defaultSample: 'ORD-12345' },
  { id: 'order.total', label: 'Order Amount', defaultSample: '₹7,999' },
  { id: 'order.date', label: 'Order Date', defaultSample: '29 Aug 2026' },
  { id: 'order.delivery_date', label: 'Estimated Delivery Date', defaultSample: 'Tomorrow, 5 PM' },
  { id: 'company.name', label: 'Company / Brand Name', defaultSample: 'Appnix Technologies' },
  { id: 'auth.otp', label: 'OTP Code', defaultSample: '849201' },
  { id: 'offer.discount', label: 'Discount Percentage', defaultSample: '25%' },
  { id: 'offer.code', label: 'Promo Code', defaultSample: 'FESTIVE25' },
  { id: 'custom', label: 'Custom Variable (Manual input)', defaultSample: 'Sample Value' },
];

export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    channelId: '1',
    name: 'order_confirmation_v2',
    category: 'UTILITY',
    language: 'en_US',
    contentType: 'TEXT',
    header: {
      type: 'TEXT',
      text: 'Order Confirmed - Appnix Store',
    },
    body: 'Hello {{1}},\n\nThank you for choosing Appnix! Your order #{{2}} amounting to {{3}} has been successfully placed and is being prepared.\n\nEstimated delivery date: *{{4}}*.\n\nWe will notify you once your package is dispatched.',
    variables: [
      { index: 1, name: 'Customer Name', sampleValue: 'Jitendra Kumar', dataSource: 'contact.name' },
      { index: 2, name: 'Order ID', sampleValue: 'ORD12345', dataSource: 'order.id' },
      { index: 3, name: 'Order Amount', sampleValue: '₹7,999', dataSource: 'order.total' },
      { index: 4, name: 'Delivery Date', sampleValue: 'Tomorrow, 5:00 PM', dataSource: 'order.delivery_date' },
    ],
    variableMappings: {
      '1': 'Customer Name',
      '2': 'Order ID',
      '3': 'Order Amount',
      '4': 'Delivery Date',
    },
    footer: 'Appnix Technologies • 24x7 Support',
    buttons: [
      {
        id: 'btn-1',
        type: 'URL',
        text: 'Track Order',
        url: 'https://appnix.io/track/{{1}}',
        urlType: 'DYNAMIC',
      },
      {
        id: 'btn-2',
        type: 'PHONE_NUMBER',
        text: 'Call Support',
        phoneNumber: '+918062765557',
        countryCode: '+91',
      },
    ],
    status: 'APPROVED',
    metaTemplateId: 'meta_tpl_98421001',
    preview: 'Hello Jitendra Kumar, Thank you for choosing Appnix! Your order #ORD12345 amounting to ₹7,999 has been successfully placed...',
    qualityScore: 'GREEN',
    createdAt: '2026-08-20T10:30:00Z',
    updatedAt: '2026-08-20T10:35:00Z',
    submittedAt: '2026-08-20T10:31:00Z',
    approvedAt: '2026-08-20T10:35:00Z',
  },
  {
    id: 'tpl-2',
    channelId: '1',
    name: 'festive_season_promo',
    category: 'MARKETING',
    language: 'en_US',
    contentType: 'MEDIA',
    header: {
      type: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
      mediaFileName: 'festive_offer_banner.jpg',
    },
    body: '🎉 Mega Festive Sale is Live for {{1}}!\n\nGet FLAT {{2}}% OFF on all SaaS workflow bots and WhatsApp automation packages.\n\nUse Promo Code: *{{3}}*\nOffer expires on: {{4}}.\n\nBoost your sales today!',
    variables: [
      { index: 1, name: 'Customer Name', sampleValue: 'Priya Sharma', dataSource: 'contact.name' },
      { index: 2, name: 'Discount Percent', sampleValue: '35', dataSource: 'offer.discount' },
      { index: 3, name: 'Promo Code', sampleValue: 'FESTIVE35', dataSource: 'offer.code' },
      { index: 4, name: 'Expiry Date', sampleValue: '31st August 2026', dataSource: 'offer.expiry' },
    ],
    variableMappings: {
      '1': 'Customer Name',
      '2': 'Discount Percent',
      '3': 'Promo Code',
      '4': 'Expiry Date',
    },
    footer: 'Reply STOP to opt out of promotions',
    buttons: [
      {
        id: 'btn-promo-1',
        type: 'URL',
        text: 'Claim Offer Now',
        url: 'https://appnix.io/festive-deal',
        urlType: 'STATIC',
      },
      {
        id: 'btn-promo-2',
        type: 'QUICK_REPLY',
        text: 'Chat with Sales',
        payload: 'TALK_TO_SALES',
      },
    ],
    status: 'APPROVED',
    metaTemplateId: 'meta_tpl_98421002',
    preview: 'Mega Festive Sale is Live for Priya Sharma! Get FLAT 35% OFF on all SaaS workflow bots...',
    qualityScore: 'GREEN',
    createdAt: '2026-08-22T14:10:00Z',
    updatedAt: '2026-08-22T14:20:00Z',
    submittedAt: '2026-08-22T14:12:00Z',
    approvedAt: '2026-08-22T14:20:00Z',
  },
  {
    id: 'tpl-3',
    channelId: '1',
    name: 'account_verification_otp',
    category: 'AUTHENTICATION',
    language: 'en_US',
    contentType: 'TEXT',
    header: {
      type: 'NONE',
    },
    body: '{{1}} is your Appnix account verification code. Do NOT share this code with anyone including staff. Valid for 10 minutes.',
    variables: [
      { index: 1, name: 'OTP Code', sampleValue: '619842', dataSource: 'auth.otp' },
    ],
    variableMappings: {
      '1': 'OTP Code',
    },
    footer: 'Appnix Security Alert',
    buttons: [
      {
        id: 'btn-auth-1',
        type: 'COPY_CODE',
        text: 'Copy Code',
        payload: '{{1}}',
      },
    ],
    status: 'APPROVED',
    metaTemplateId: 'meta_tpl_98421003',
    preview: '619842 is your Appnix account verification code. Do NOT share this code with anyone...',
    qualityScore: 'GREEN',
    createdAt: '2026-08-24T09:00:00Z',
    updatedAt: '2026-08-24T09:05:00Z',
    submittedAt: '2026-08-24T09:01:00Z',
    approvedAt: '2026-08-24T09:05:00Z',
  },
  {
    id: 'tpl-4',
    channelId: '1',
    name: 'shipping_dispatch_express',
    category: 'UTILITY',
    language: 'en_US',
    contentType: 'TEXT',
    header: {
      type: 'TEXT',
      text: 'Package Out for Delivery 📦',
    },
    body: 'Hello {{1}}, good news! Your parcel #{{2}} is out for delivery with courier partner {{3}}. Courier Contact: {{4}}.\n\nPlease keep OTP ready at delivery.',
    variables: [
      { index: 1, name: 'Customer Name', sampleValue: 'Rohan Gupta', dataSource: 'contact.name' },
      { index: 2, name: 'Order Number', sampleValue: 'ORD-88192', dataSource: 'order.id' },
      { index: 3, name: 'Courier Partner', sampleValue: 'BlueDart Express', dataSource: 'custom' },
      { index: 4, name: 'Driver Number', sampleValue: '+91 99887 76655', dataSource: 'custom' },
    ],
    variableMappings: {
      '1': 'Customer Name',
      '2': 'Order Number',
      '3': 'Courier Partner',
      '4': 'Driver Number',
    },
    footer: 'Appnix Logistics Team',
    buttons: [
      {
        id: 'btn-ship-1',
        type: 'URL',
        text: 'Track Live Map',
        url: 'https://appnix.io/track/{{2}}',
        urlType: 'DYNAMIC',
      },
    ],
    status: 'PENDING',
    metaTemplateId: 'meta_tpl_98421004',
    preview: 'Hello Rohan Gupta, good news! Your parcel #ORD-88192 is out for delivery...',
    createdAt: '2026-08-28T18:00:00Z',
    updatedAt: '2026-08-28T18:00:00Z',
    submittedAt: '2026-08-28T18:00:00Z',
  },
  {
    id: 'tpl-5',
    channelId: '1',
    name: 'flash_discount_rejected_example',
    category: 'UTILITY',
    language: 'en_US',
    contentType: 'TEXT',
    header: {
      type: 'TEXT',
      text: 'SUPER 50% DISCOUNT TODAY!',
    },
    body: 'Hey {{1}}, buy now and get a 50% discount on all cloud automation products! Click the link below to purchase immediately.',
    variables: [
      { index: 1, name: 'Customer Name', sampleValue: 'Customer', dataSource: 'contact.name' },
    ],
    variableMappings: {
      '1': 'Customer Name',
    },
    buttons: [
      {
        id: 'btn-rej-1',
        type: 'URL',
        text: 'Shop Now',
        url: 'https://example.com/flash-sale',
        urlType: 'STATIC',
      },
    ],
    status: 'REJECTED',
    metaTemplateId: 'meta_tpl_98421005',
    rejectionReason: 'Category Mismatch: The template contains promotional marketing content, discounts, and calls-to-purchase, but was submitted under UTILITY category.',
    rejectionDetails: {
      code: 'CATEGORY_MISMATCH_PROMOTIONAL',
      reason: 'WhatsApp template policy requires all promotional, marketing, and discount messages to be submitted under the MARKETING category.',
      recommendation: 'Change category from UTILITY to MARKETING, ensure opt-out footer is provided, and resubmit.',
      date: '2026-08-26T15:45:00Z',
    },
    preview: 'Hey Customer, buy now and get a 50% discount on all cloud automation products...',
    createdAt: '2026-08-26T15:30:00Z',
    updatedAt: '2026-08-26T15:45:00Z',
    submittedAt: '2026-08-26T15:32:00Z',
  },
  {
    id: 'tpl-6',
    channelId: '1',
    name: 'automation_carousel_suite',
    category: 'MARKETING',
    language: 'en_US',
    contentType: 'CAROUSEL',
    header: {
      type: 'NONE',
    },
    body: 'Hi {{1}}, discover our best automation plans designed to accelerate your business growth:',
    variables: [
      { index: 1, name: 'Customer Name', sampleValue: 'Amit Shah', dataSource: 'contact.name' },
    ],
    variableMappings: {
      '1': 'Customer Name',
    },
    buttons: [],
    carouselCards: [
      {
        id: 'card-1',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        header: 'WhatsApp AI Bot Pro',
        body: 'Automate 90% of customer chats with custom ChatGPT flows and instant lead booking.',
        buttons: [
          { id: 'cbtn-1', type: 'URL', text: 'View Bot Demo', url: 'https://appnix.io/bot-demo', urlType: 'STATIC' },
          { id: 'cbtn-2', type: 'QUICK_REPLY', text: 'Get Bot', payload: 'BUY_BOT' },
        ],
      },
      {
        id: 'card-2',
        mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        header: 'Omnichannel CRM Suite',
        body: 'Manage WhatsApp, Instagram, Facebook, and RCS conversations in one unified inbox.',
        buttons: [
          { id: 'cbtn-3', type: 'URL', text: 'Explore CRM', url: 'https://appnix.io/crm-suite', urlType: 'STATIC' },
          { id: 'cbtn-4', type: 'QUICK_REPLY', text: 'Contact Us', payload: 'CONTACT_CRM' },
        ],
      },
    ],
    footer: 'Appnix Cloud Automation • Scale your sales',
    status: 'APPROVED',
    metaTemplateId: 'meta_tpl_98421006',
    preview: 'Hi Amit Shah, discover our best automation plans designed to accelerate your business growth...',
    qualityScore: 'GREEN',
    createdAt: '2026-08-21T11:00:00Z',
    updatedAt: '2026-08-21T11:15:00Z',
    submittedAt: '2026-08-21T11:05:00Z',
    approvedAt: '2026-08-21T11:15:00Z',
  },
  {
    id: 'tpl-7',
    channelId: '1',
    name: 'draft_survey_feedback',
    category: 'UTILITY',
    language: 'en_US',
    contentType: 'TEXT',
    header: {
      type: 'TEXT',
      text: 'How was your experience?',
    },
    body: 'Hi {{1}}, we hope you enjoyed your recent purchase #{{2}}. Could you take 30 seconds to rate your experience with Appnix?',
    variables: [
      { index: 1, name: 'Customer Name', sampleValue: 'Kavita', dataSource: 'contact.name' },
      { index: 2, name: 'Order ID', sampleValue: 'ORD-44120', dataSource: 'order.id' },
    ],
    variableMappings: {
      '1': 'Customer Name',
      '2': 'Order ID',
    },
    footer: 'Your feedback helps us improve',
    buttons: [
      {
        id: 'btn-draft-1',
        type: 'URL',
        text: 'Rate Us (5 Stars ⭐)',
        url: 'https://appnix.io/feedback/{{2}}',
        urlType: 'DYNAMIC',
      },
    ],
    status: 'DRAFT',
    preview: 'Hi Kavita, we hope you enjoyed your recent purchase #ORD-44120...',
    createdAt: '2026-08-29T00:45:00Z',
    updatedAt: '2026-08-29T00:45:00Z',
  },
];

const STORAGE_KEY = 'appnix_whatsapp_templates';

export function getStoredTemplates(): WhatsAppTemplate[] {
  if (typeof window === 'undefined') return INITIAL_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEMPLATES));
      return INITIAL_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEMPLATES));
    return INITIAL_TEMPLATES;
  } catch (err) {
    console.error('Error loading stored templates:', err);
    return INITIAL_TEMPLATES;
  }
}

export function saveStoredTemplates(templates: WhatsAppTemplate[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (err) {
    console.error('Error saving templates to localStorage:', err);
  }
}

/**
 * Extracts {{1}}, {{2}}, etc. from text strings.
 */
export function extractVariablesFromText(text: string): number[] {
  if (!text) return [];
  const regex = /\{\{(\d+)\}\}/g;
  const indices: number[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const num = parseInt(match[1], 10);
    if (!indices.includes(num)) {
      indices.push(num);
    }
  }
  return indices.sort((a, b) => a - b);
}

/**
 * Interpolates variables in a string with sample values.
 */
export function interpolateVariables(
  text: string,
  variables: TemplateVariable[],
  customOverrides?: Record<string, string>
): string {
  if (!text) return '';
  let result = text;
  variables.forEach((v) => {
    const placeholder = `{{${v.index}}}`;
    const val = customOverrides?.[v.index] || v.sampleValue || `[${v.name || `Var ${v.index}`}]`;
    result = result.replaceAll(placeholder, val);
  });
  return result;
}

/**
 * Formats WhatsApp text markup (*bold*, _italic_, ~strike~, ```code```)
 */
export function parseWhatsAppFormatting(text: string): string {
  if (!text) return '';
  let formatted = text
    // Monospace
    .replace(/```([\s\S]*?)```/g, '<code class="font-mono bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">$1</code>')
    // Bold
    .replace(/\*([^\*]+)\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/_([^_]+)_/g, '<em class="italic">$1</em>')
    // Strikethrough
    .replace(/~([^~]+)~/g, '<del class="line-through text-muted-foreground/80">$1</del>');

  // Newlines to <br/>
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
}

/**
 * Complete Meta Validation Rules Check
 */
export function validateTemplate(template: Partial<WhatsAppTemplate>): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1. Name validation
  if (!template.name || !template.name.trim()) {
    errors.push({ field: 'name', message: 'Template name is required' });
  } else {
    const nameTrimmed = template.name.trim();
    if (!/^[a-z0-9_]+$/.test(nameTrimmed)) {
      errors.push({
        field: 'name',
        message: 'Template name can only contain lowercase letters, numbers, and underscores (no spaces or special chars)',
      });
    }
    if (nameTrimmed.length > 512) {
      errors.push({ field: 'name', message: 'Template name cannot exceed 512 characters' });
    }
  }

  // 2. Category
  if (!template.category) {
    errors.push({ field: 'category', message: 'Please select a template category' });
  }

  // 3. Language
  if (!template.language) {
    errors.push({ field: 'language', message: 'Please select a template language' });
  }

  // 4. Content Type & Body
  if (template.contentType !== 'CATALOG') {
    if (!template.body || !template.body.trim()) {
      errors.push({ field: 'body', message: 'Message body text is required' });
    } else {
      if (template.body.length > 1024) {
        errors.push({
          field: 'body',
          message: `Body text exceeds Meta limit of 1024 characters (currently ${template.body.length})`,
        });
      }

      // Check variable sequential numbering
      const bodyVars = extractVariablesFromText(template.body);
      if (bodyVars.length > 0) {
        // Must start with 1
        if (bodyVars[0] !== 1) {
          errors.push({
            field: 'body',
            message: 'Variables must start with {{1}} sequentially without skipping numbers',
          });
        }
        // Must not have gaps
        for (let i = 0; i < bodyVars.length; i++) {
          if (bodyVars[i] !== i + 1) {
            errors.push({
              field: 'body',
              message: `Variable sequence is broken: found {{${bodyVars[i]}}} instead of {{${i + 1}}}`,
            });
            break;
          }
        }
      }
    }
  }

  // 5. Header validation
  if (template.header) {
    if (template.header.type === 'TEXT') {
      if (!template.header.text || !template.header.text.trim()) {
        errors.push({ field: 'header.text', message: 'Header text is required when Text Header is selected' });
      } else if (template.header.text.length > 60) {
        errors.push({
          field: 'header.text',
          message: `Header text exceeds 60 characters (currently ${template.header.text.length})`,
        });
      }
    }
    if (template.contentType === 'MEDIA' && template.header.type === 'NONE') {
      errors.push({
        field: 'header.type',
        message: 'Media message requires selecting an Image, Video, or Document header',
      });
    }
  }

  // 6. Footer validation
  if (template.footer && template.footer.length > 60) {
    errors.push({
      field: 'footer',
      message: `Footer text exceeds 60 characters (currently ${template.footer.length})`,
    });
  }

  // 7. Buttons validation
  if (template.buttons && template.buttons.length > 0) {
    const urlButtons = template.buttons.filter((b) => b.type === 'URL');
    const phoneButtons = template.buttons.filter((b) => b.type === 'PHONE_NUMBER');
    const quickReplies = template.buttons.filter((b) => b.type === 'QUICK_REPLY');

    if (urlButtons.length > 2) {
      errors.push({ field: 'buttons', message: 'Meta allows a maximum of 2 URL CTA buttons' });
    }
    if (phoneButtons.length > 1) {
      errors.push({ field: 'buttons', message: 'Meta allows a maximum of 1 Phone Call button' });
    }
    if (quickReplies.length > 10) {
      errors.push({ field: 'buttons', message: 'Meta allows a maximum of 10 Quick Reply buttons' });
    }

    template.buttons.forEach((btn, idx) => {
      if (!btn.text || !btn.text.trim()) {
        errors.push({ field: `buttons.${idx}.text`, message: `Button #${idx + 1} text is required` });
      } else if (btn.text.length > 25) {
        errors.push({
          field: `buttons.${idx}.text`,
          message: `Button #${idx + 1} text exceeds 25 characters`,
        });
      }

      if (btn.type === 'URL') {
        if (!btn.url || !btn.url.trim()) {
          errors.push({ field: `buttons.${idx}.url`, message: `Button #${idx + 1} URL is required` });
        } else if (!/^https?:\/\//i.test(btn.url.trim())) {
          errors.push({
            field: `buttons.${idx}.url`,
            message: `Button #${idx + 1} URL must start with http:// or https://`,
          });
        }
      }

      if (btn.type === 'PHONE_NUMBER') {
        if (!btn.phoneNumber || !btn.phoneNumber.trim()) {
          errors.push({
            field: `buttons.${idx}.phoneNumber`,
            message: `Button #${idx + 1} Phone Number is required`,
          });
        }
      }
    });
  }

  // 8. Carousel validation
  if (template.contentType === 'CAROUSEL') {
    const cards = template.carouselCards || [];
    if (cards.length < 2) {
      errors.push({
        field: 'carousel',
        message: 'Carousel requires a minimum of 2 cards (up to 10 cards allowed)',
      });
    } else if (cards.length > 10) {
      errors.push({
        field: 'carousel',
        message: 'Carousel exceeds maximum limit of 10 cards',
      });
    }

    cards.forEach((card, idx) => {
      if (!card.body || !card.body.trim()) {
        errors.push({ field: `carousel.${idx}.body`, message: `Carousel Card #${idx + 1} body is required` });
      }
      if (card.buttons && card.buttons.length > 2) {
        errors.push({
          field: `carousel.${idx}.buttons`,
          message: `Carousel Card #${idx + 1} can have at most 2 CTA buttons`,
        });
      }
    });
  }

  // 9. Catalog validation
  if (template.contentType === 'CATALOG') {
    if (!template.catalog?.catalogId) {
      errors.push({ field: 'catalog.catalogId', message: 'Please select a WhatsApp Business Catalog' });
    }
  }

  return errors;
}
