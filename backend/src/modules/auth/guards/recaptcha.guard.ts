import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { RecaptchaService } from '../recaptcha.service';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private recaptchaService: RecaptchaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request.body?.recaptchaToken ||
      request.headers['x-recaptcha-token'] ||
      request.query?.recaptchaToken;

    const isValid = await this.recaptchaService.verifyToken(token);
    if (!isValid) {
      throw new BadRequestException('Security verification (Google reCAPTCHA v3) failed. Please try again.');
    }
    return true;
  }
}
