import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService, Review } from
  './services/review.service';
import emailjs from '@emailjs/browser';

type ChatStep = 'welcome' | 'inquiry';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
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

  newReview = {
    name: '',
    company: '',
    rating: 5,
    message: ''
  };

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadReviews();
  }

  inquiry = {
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  };

  openReviewForm(): void {
    this.showReviewForm = true;
    this.scrollTo('review-form');
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
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
}
