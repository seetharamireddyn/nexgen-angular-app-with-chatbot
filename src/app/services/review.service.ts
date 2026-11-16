
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Review {
    id?: number;
    name: string;
    company?: string;
    rating: number;
    message: string;
    created_at?: string;
    approved?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    constructor(private supabaseService: SupabaseService) { }

    async getApprovedReviews() {
        const { data, error } = await this.supabaseService.client
            .from('reviews')
            .select('id, name, company, rating, message, created_at')
            .eq('approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data ?? [];
    }

    async submitReview(review: {
        name: string;
        company: string;
        rating: number;
        message: string;
    }): Promise<void> {

        const { error } = await this.supabaseService.client
            .from('reviews')
            .insert({
                name: review.name,
                company: review.company,
                rating: review.rating,
                message: review.message
            });

        if (error) {
            throw error;
        }
    }
}
