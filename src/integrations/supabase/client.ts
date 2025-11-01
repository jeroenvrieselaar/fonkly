import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ijzkbmnonaraynlfctad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemtibW5vbmFyYXlubGZjdGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NDcxNTUsImV4cCI6MjA3NzUyMzE1NX0.PYEWHtcckwZUJZsQ0GPnk6nSOr2zG9JK3i7Yaz8Ywwc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
