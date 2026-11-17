import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface EventItem {
    id: string;
    title: string;
    category: string;
    description: string;
    event_date: string;
    start_time?: string | null;
    end_time?: string | null;
    mode: 'online' | 'offline' | 'hybrid';
    location?: string | null;
    poster_url?: string | null;
    duration?: string | null;
    training_fee?: string | null;
    certificate?: string | null;
    learning_topics?: string[] | null;
    registration_url?: string | null;
    capacity?: number | null;
    status: 'upcoming' | 'completed' | 'cancelled';
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface EventRegistration {
    id?: string;
    event_id: string;
    full_name: string;
    email: string;
    phone: string;
    company?: string;
    created_at?: string;
}

export interface EventRegistrationInput {
    eventId: string;
    fullName: string;
    email: string;
    mobile: string;
    company?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(
  private supabaseService: SupabaseService
) {}
    // Get published upcoming events for website visitors
 async getUpcomingEvents(): Promise<EventItem[]> {
  const { data, error } = await this.supabaseService.client
    .from('events')
    .select('*')
    .eq('is_published', true)
    .eq('status', 'upcoming')
    .order('event_date', { ascending: true });

  console.log('Events from Supabase:', data);
  console.log('Supabase error:', error);

  if (error) {
    throw error;
  }

  return (data ?? []) as EventItem[];
}

    // Submit customer event registration
    async registerForEvent(
        registration: EventRegistrationInput
    ): Promise<void> {

        const { error } = await this.supabaseService.client
            .from('event_registrations')
            .insert({
                event_id: registration.eventId,
                full_name: registration.fullName.trim(),
                email: registration.email.trim().toLowerCase(),
                phone: registration.mobile.trim(),
                company: registration.company?.trim() || null
            });

        if (error) {
            throw error;
        }
    }

    // Get all events - admin access only
    async getAllEvents(): Promise<EventItem[]> {

        const { data, error } = await this.supabaseService.client
            .from('events')
            .select('*')
            .eq('is_published', true)
            .eq('status', 'upcoming')
            .order('event_date', { ascending: true });

        if (error) {
            throw error;
        }

        return (data ?? []) as EventItem[];
    }

    // Add a new event - admin access only
    async addEvent(
        event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>
    ): Promise<void> {

        const { error } = await this.supabaseService.client
            .from('events')
            .insert(event);

        if (error) {
            throw error;
        }
    }

    // Update an existing event - admin access only
    async updateEvent(
        id: string,
        event: Partial<EventItem>
    ): Promise<void> {

        const { id: _id, created_at, updated_at, ...changes } = event;

        const { error } = await this.supabaseService.client
            .from('events')
            .update(changes)
            .eq('id', id);

        if (error) {
            throw error;
        }
    }

    // Cancel an event instead of deleting it
    async cancelEvent(id: string): Promise<void> {

        const { error } = await this.supabaseService.client
            .from('events')
            .update({
                status: 'cancelled',
                is_published: false
            })
            .eq('id', id);

        if (error) {
            throw error;
        }
    }

    // Get registrations for an event - admin access only
    async getEventRegistrations(
        eventId: string
    ): Promise<EventRegistration[]> {

        const { data, error } = await this.supabaseService.client
            .from('event_registrations')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return (data ?? []) as EventRegistration[];
    }

   
}
