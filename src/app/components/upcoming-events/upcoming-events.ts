
import {
  Component,
  ChangeDetectorRef,
  DestroyRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import {
  EventsService,
  EventItem
} from '../../services/event.service';

import {
  EventRegistration
} from '../event-registration/event-registration';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [
    CommonModule,
    EventRegistration
  ],
  templateUrl: './upcoming-events.html',
  styleUrl: './upcoming-events.css'
})
export class UpcomingEvents {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private openedFromEventsLink = false;

  constructor(
    private eventsService: EventsService,
    private cdr: ChangeDetectorRef
  ) {
    this.syncWithRoute();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.syncWithRoute());

    this.loadUpcomingEvents();
  }

  showUpcomingEvents = false;

  upcomingEvents: EventItem[] = [];

  selectedEvent: EventItem | null = null;

  showEventRegistration = false;

  private syncWithRoute(): void {
    const [urlPath, query = ''] = this.router.url.split('?');
    const path = urlPath.split('#')[0].replace(/\/+$/, '');
    const showEventsParam = new URLSearchParams(query.split('#')[0]).get('showEvents');
    const shouldOpenEvents = path === '/events' || showEventsParam === '1';

    if (shouldOpenEvents) {
      this.openedFromEventsLink = true;
      this.showUpcomingEvents = true;
      setTimeout(() => this.scrollTo('events'), 50);
    } else if (this.openedFromEventsLink) {
      this.openedFromEventsLink = false;
      this.showUpcomingEvents = false;
    }
  }

  toggleUpcomingEvents(): void {
    this.showUpcomingEvents = !this.showUpcomingEvents;

    if (this.showUpcomingEvents) {
      setTimeout(() => {
        this.scrollTo('events');
      }, 50);
    }
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  openEventRegistration(event: EventItem): void {

    this.selectedEvent = event;

    // This was missing in your original code
    this.showEventRegistration = true;

  }

  closeEventRegistration(): void {
    this.showEventRegistration = false;
    this.selectedEvent = null;
  }

  async loadUpcomingEvents(): Promise<void> {
    try {
      this.upcomingEvents =
        await this.eventsService.getUpcomingEvents();

    } catch (error) {
      console.error(
        'Failed to load upcoming events:',
        error
      );

      this.upcomingEvents = [];

    } finally {
      this.cdr.markForCheck();
    }
  }
}
