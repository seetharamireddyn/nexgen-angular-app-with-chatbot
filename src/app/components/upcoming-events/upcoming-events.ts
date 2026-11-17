
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

const legacySapLearningTopics = [
  'SAP in GxP Environments',
  'SAP Validation Lifecycle',
  'SAP FI/CO, MM, SD, QM and PP',
  'LIMS and MES Integration',
  'Risk Assessment and Impact Analysis',
  'Data Integrity and Change Control',
  'Testing and Documentation',
  '21 CFR Part 11, EU Annex 11 and GAMP 5'
];

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

  formatEventMode(mode: EventItem['mode']): string {
    const labels: Record<EventItem['mode'], string> = {
      online: 'Online Session',
      offline: 'In Person',
      hybrid: 'Hybrid'
    };

    return labels[mode];
  }

  closeEventRegistration(): void {
    this.showEventRegistration = false;
    this.selectedEvent = null;
  }

  async loadUpcomingEvents(): Promise<void> {
    try {
      const events = await this.eventsService.getUpcomingEvents();
      this.upcomingEvents = events.map((event) => this.restoreLegacySapDetails(event));

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

  private restoreLegacySapDetails(event: EventItem): EventItem {
    if (event.title !== 'SAP Validation Approach') {
      return event;
    }

    return {
      ...event,
      poster_url: event.poster_url?.trim() || 'assets/sap-validation-approach.jpeg',
      duration: event.duration?.trim() || '2 Hours',
      training_fee: event.training_fee?.trim() || '₹2,000/-',
      certificate: event.certificate?.trim() || 'Participation',
      learning_topics: event.learning_topics?.length
        ? event.learning_topics
        : legacySapLearningTopics
    };
  }
}
