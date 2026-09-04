import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionContextResolver } from '../../../lib/auth/session-context';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  constructor(private readonly sessionContextResolver: SessionContextResolver) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = (await super.canActivate(context)) as boolean;
    if (authenticated) {
      const request = context.switchToHttp().getRequest();
      // Controllers continue to receive req.user, now containing only a
      // server-derived effective tenant context.
      request.user = this.sessionContextResolver.resolve(request);
    }
    return authenticated;
  }
}
