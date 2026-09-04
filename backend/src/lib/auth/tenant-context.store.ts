import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { SessionContext } from './session-context';

@Injectable()
export class TenantContextStore {
  private readonly storage = new AsyncLocalStorage<SessionContext>();

  enter(context: SessionContext): void {
    this.storage.enterWith(context);
  }

  get(): SessionContext | undefined {
    return this.storage.getStore();
  }
}
