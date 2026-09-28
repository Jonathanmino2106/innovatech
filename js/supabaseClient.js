// src/js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://mrglvycsojxumkdbsmks.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZjE4lN1OBfPVP_lwGgWuNw_hpsUSfb2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);