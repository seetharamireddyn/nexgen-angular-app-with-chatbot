
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  EventsService,
  EventItem
} from '../../services/event.service';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './event-registration.html',
  styleUrl: './event-registration.css'
})
export class EventRegistration implements OnChanges {

  @Input() selectedEvent: EventItem | null = null;

  @Output() close = new EventEmitter<void>();

  eventMessage = '';
  eventMessageType: 'success' | 'error' = 'success';
  eventSubmitting = false;

  newRegistration = {
    eventId: '',
    fullName: '',
    email: '',
    mobile: '',
    company: '',
    eventTitle: ''
  };

  constructor(
    private eventsService: EventsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedEvent'] && this.selectedEvent) {

      this.newRegistration = {
        eventId: this.selectedEvent.id,
        fullName: '',
        email: '',
        mobile: '',
        company: '',
        eventTitle: this.selectedEvent.title
      };

      this.eventMessage = '';
      this.eventMessageType = 'success';
    }
  }

  closeEventRegistration(): void {
    this.close.emit();
  }

  async submitEventRegistration(form: any): Promise<void> {

    if (form.invalid || this.eventSubmitting) {
      form.control.markAllAsTouched();
      return;
    }

    this.eventSubmitting = true;
    this.eventMessage = '';

    try {

      await this.eventsService.registerForEvent(
        this.newRegistration
      );

      window.alert(
        'Thank you! Your registration has been submitted successfully.'
      );

      form.resetForm();

      this.close.emit();

    } catch (error: any) {

      console.error('Registration failed:', error);

      const errorMessage =
        error?.code === '23505'
          ? 'This email is already registered for this event.'
          : error?.message ||
            'Unable to submit registration. Please try again.';

      this.eventMessageType = 'error';
      this.eventMessage = errorMessage;

      window.alert(errorMessage);

    } finally {

      this.eventSubmitting = false;
      this.cdr.markForCheck();

    }
  }
}
