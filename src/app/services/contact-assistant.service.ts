import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactAssistantService {
  private readonly openRequests = new Subject<string | undefined>();
  readonly openRequests$ = this.openRequests.asObservable();

  open(topic?: string): void {
    this.openRequests.next(topic);
  }
}
