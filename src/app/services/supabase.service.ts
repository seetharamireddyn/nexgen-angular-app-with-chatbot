
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient = createClient(
    'https://bkmbojmjdpicfzkwdzpq.supabase.co',
    'sb_publishable_Hn1r9pf3dI1q3XLQ3r76fw_uHF2DFbA'
  );

  get client(): SupabaseClient {
    return this.supabase;
  }
}
