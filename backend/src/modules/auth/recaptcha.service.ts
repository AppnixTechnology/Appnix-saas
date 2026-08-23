import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);
  private readonly secretKey: string | undefined;
  private readonly siteVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    if (this.secretKey) {
      this.logger.log('✅ Google reCAPTCHA v3 verification service initialized');
    }
  }

  /**
   * Validates reCAPTCHA v3 response token against Google verify API
   */
  async verifyToken(token?: string, expectedAction?: string): Promise<boolean> {
    // If secret key is not configured, bypass gracefully in local development
    if (!this.secretKey) {
      return true;
    }

    if (!token) {
      this.logger.warn('⚠️ reCAPTCHA token missing in request payload');
      return true; // Graceful pass if not provided, or strict if required
    }

    try {
      const params = new URLSearchParams();
      params.append('secret', this.secretKey);
      params.append('response', token);

      const response = await fetch(this.siteVerifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        this.logger.error(`reCAPTCHA API responded with HTTP status ${response.status}`);
        return false;
      }

      const result: RecaptchaVerifyResponse = await response.json();

      if (!result.success) {
        this.logger.warn(`reCAPTCHA verification failed: ${JSON.stringify(result['error-codes'])}`);
        return false;
      }

      if (typeof result.score === 'number' && result.score < 0.3) {
        this.logger.warn(`reCAPTCHA score too low (${result.score}) for action: ${result.action}`);
        return false;
      }

      this.logger.log(`🛡️ reCAPTCHA v3 passed (score: ${result.score ?? 'N/A'}, action: ${result.action ?? expectedAction ?? 'N/A'})`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error verifying reCAPTCHA token with Google API: ${error.message}`);
      return true; // Graceful fallback on network timeout
    }
  }
}
