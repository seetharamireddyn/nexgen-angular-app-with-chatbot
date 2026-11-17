import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  reviews: any[] = [];
  reviewsLoading = true;
  showReviewForm = false;
  reviewSubmitting = false;
  reviewMessage = '';

  newReview = { name: '', company: '', rating: 5, message: '' };

  constructor(private reviewService: ReviewService, private cdr: ChangeDetectorRef) {
    this.loadReviews();
  }

  openReviewForm(): void {
    this.showReviewForm = true;
    setTimeout(() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
  }

  async loadReviews(): Promise<void> {
    this.reviewsLoading = true;
    try {
      this.reviews = await this.reviewService.getApprovedReviews();
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
    try {
      await this.reviewService.submitReview(this.newReview);
      this.reviewMessage = 'Thank you! Your review has been submitted for approval.';
      this.newReview = { name: '', company: '', rating: 5, message: '' };
      this.showReviewForm = false;
    } catch (error) {
      console.error('Review submission failed', error);
      this.reviewMessage = 'Unable to submit your review. Please try again.';
    } finally {
      this.reviewSubmitting = false;
      this.cdr.markForCheck();
    }
  }
}
