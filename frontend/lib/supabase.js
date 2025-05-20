// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfdtkaiekghgymciyqxd.supabase.co'; // ← Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHRrYWlla2doZ3ltY2l5cXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY5NzE1MSwiZXhwIjoyMDU5MjczMTUxfQ.-XBNHaPzvLgfU8jneukdfdoHG-GUjBi514vSD5c8jzI'; // ← Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

