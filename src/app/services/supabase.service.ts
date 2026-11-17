
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient = createClient(
    'https://bkmbojmjdpicfzkwdzpq.supabase.co',
    '*******'
  );

  get client(): SupabaseClient {
    return this.supabase;
  }
}
