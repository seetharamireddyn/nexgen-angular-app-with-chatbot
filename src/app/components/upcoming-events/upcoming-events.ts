
import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
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

  constructor(
    private eventsService: EventsService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadUpcomingEvents();
  }

  showUpcomingEvents = false;

  upcomingEvents: EventItem[] = [];

  selectedEvent: EventItem | null = null;

  showEventRegistration = false;

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
