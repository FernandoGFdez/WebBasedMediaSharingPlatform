import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjporfikmdnxbkxqmopi.supabase.co'; // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcG9yZmlrbWRueGJreHFtb3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzUxMDMsImV4cCI6MjA2MDQxMTEwM30.VUGHz0U1D_UYIlCgftTgwoRUvLxdqiIQZbPfrGwihhY'; // Replace with your Supabase anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
