import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService, Review } from
  './services/review.service';
import { EventsService, EventItem } from
  './services/event.service';
import { CommonModule, DatePipe } from '@angular/common';

type ChatStep = 'welcome' | 'inquiry';

export interface EventItem1 {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  mode: string;
  location: string | null;
  capacity: number | null;
  published: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly year = new Date().getFullYear();

  isChatOpen = false;
  chatStep: ChatStep = 'welcome';
  selectedTopic = '';
  reviews: any[] = [];
  reviewsLoading = true;
  showReviewForm = false;

  reviewSubmitting = false;
  reviewMessage = '';
  showUpcomingEvents = false;

  newReview = {
    name: '',
    company: '',
    rating: 5,
    message: ''
  };

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef,
    private eventsService: EventsService
  ) {
    this.loadReviews();
    this.loadUpcomingEvents();
  }
  inquiry = {
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  };

  upcomingEvents: EventItem[] = [];

  showEventRegistration = false;
  selectedEvent: EventItem | null = null;

  eventSubmitting = false;
  eventMessage = '';

  newRegistration = {
    eventId: '',
    fullName: '',
    email: '',
    mobile: '',
    company: '',
    eventTitle: ''
  };

  eventMessageType: 'success' | 'error' = 'success';
  isMobileMenuOpen = false;

toggleMobileMenu(): void {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

mobileNavigate(sectionId: string): void {
  this.isMobileMenuOpen = false;

  setTimeout(() => {
    this.scrollTo(sectionId);
  }, 100);
}
  openReviewForm(): void {
    this.showReviewForm = true;
    this.scrollTo('review-form');
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
  }

  toggleUpcomingEvents(): void {
  this.showUpcomingEvents = !this.showUpcomingEvents;

  if (this.showUpcomingEvents) {
    setTimeout(() => {
      this.scrollTo('events');
    }, 50);
  }
}

  async loadReviews(): Promise<void> {
    this.reviewsLoading = true;
    this.cdr.markForCheck();

    try {
      this.reviews = await this.reviewService.getApprovedReviews();

      console.log('Loaded reviews:', this.reviews);

    } catch (error) {
      console.error('Failed to load reviews:', error);
      this.reviews = [];

    } finally {
      this.reviewsLoading = false;
      this.cdr.markForCheck();
    }
  }

  async submitReview(): Promise<void> {
    this.reviewSubmitting = true;
    this.reviewMessage = '';
    this.cdr.markForCheck();

    try {
      await this.reviewService.submitReview(this.newReview);

      this.reviewMessage =
        'Thank you! Your review has been submitted for approval.';

      this.newReview = {
        name: '',
        company: '',
        rating: 5,
        message: ''
      };
      this.showReviewForm = false;

    } catch (error) {
      console.error('Review submission failed', error);

      this.reviewMessage =
        'Unable to submit your review. Please try again.';

    } finally {
      this.reviewSubmitting = false;
      this.cdr.markForCheck();
    }
  }


  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openChat(topic?: string): void {
    this.isChatOpen = true;
    this.chatStep = topic ? 'inquiry' : 'welcome';

    if (topic) {
      this.selectedTopic = topic;
      this.inquiry.message = `I'm interested in ${topic}.`;
    }
  }

  closeChat(): void {
    this.isChatOpen = false;
  }

  chooseTopic(topic: string): void {
    this.selectedTopic = topic;
    this.chatStep = 'inquiry';
    this.inquiry.message = `I'm interested in ${topic}.`;
  }

  startInquiry(): void {
    this.selectedTopic = '';
    this.chatStep = 'inquiry';
    this.inquiry.message = '';
  }

  sendInquiry(): void {
    const subject = encodeURIComponent(
      `Qyveriq Inquiry${this.selectedTopic ? ` - ${this.selectedTopic}` : ''}`
    );

    const body = encodeURIComponent(
      `Name: ${this.inquiry.name}\n` +
      `Email: ${this.inquiry.email}\n` +
      `Company: ${this.inquiry.company || 'Not provided'}\n` +
      `Phone: ${this.inquiry.phone || 'Not provided'}\n` +
      `Interest: ${this.selectedTopic || 'General Inquiry'}\n\n` +
      `Message:\n${this.inquiry.message}`
    );
    window.location.href = `mailto:info@qyveriq.com?subject=${subject}&body=${body}`;
  }



  openEventRegistration(event: EventItem): void {
    console.log('Register button clicked:', event);

    this.selectedEvent = event;

    this.newRegistration = {
      eventId: event.id,
      fullName: '',
      email: '',
      mobile: '',
      company: '',
      eventTitle: event.title
    };

    this.eventMessage = '';
    this.eventMessageType = 'success';
    this.showEventRegistration = true;
  }


  closeEventRegistration(): void {
    this.showEventRegistration = false;
    this.eventMessage = '';
    this.selectedEvent = null;
  }


  async submitEventRegistration(form: any): Promise<void> {

    if (form.invalid || this.eventSubmitting) {
      form.control.markAllAsTouched();
      return;
    }

    this.eventSubmitting = true;
    this.eventMessage = '';

    try {
      // Insert registration into Supabase
      await this.eventsService.registerForEvent(
        this.newRegistration
      );

      // Registration successful
      this.eventSubmitting = false;

      window.alert(
        'Thank you! Your registration has been submitted successfully.'
      );

      // Close popup and reset registration details
      this.closeEventRegistration();

      this.newRegistration = {
        eventId: '',
        fullName: '',
        email: '',
        mobile: '',
        company: '',
        eventTitle: ''
      };

      form.resetForm();

    } catch (error: any) {

      console.error('Registration failed:', error);

      const errorMessage =
        error?.code === '23505'
          ? 'This email is already registered for this event.'
          : error?.message ||
          'Unable to submit registration. Please try again.';

      window.alert(errorMessage);

      // Keep popup open so customer can retry
      this.eventMessageType = 'error';
      this.eventMessage = errorMessage;

    } finally {
      this.eventSubmitting = false;
      this.cdr.markForCheck();
    }
  }



  async loadUpcomingEvents(): Promise<void> {
    try {
      this.upcomingEvents =
        await this.eventsService.getUpcomingEvents();

    } catch (error) {
      console.error('Failed to load upcoming events:', error);
      this.upcomingEvents = [];
    }

    this.cdr.markForCheck();
  }
}
