// src/js/supabaseClient.js
// Conexión segura a Supabase mediante variables de entorno (ver build.js y .env.example).
// Las credenciales NUNCA se escriben a mano en este archivo.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIGURED } from './config.js';

// Si no hay credenciales configuradas, el cliente queda en null y la app
// opera en modo solo-local (localStorage) sin romperse.
export const supabase = SUPABASE_CONFIGURED ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export const isSupabaseConfigured = SUPABASE_CONFIGURED;
