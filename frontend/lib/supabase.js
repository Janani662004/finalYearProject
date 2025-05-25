// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfdtkaiekghgymciyqxd.supabase.co'; // ← Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHRrYWlla2doZ3ltY2l5cXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTcxNTEsImV4cCI6MjA1OTI3MzE1MX0.dGDqSh2ZsNsX88U6BuWgyWtGfwa1dxlSZfP_uGdzkyY'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

