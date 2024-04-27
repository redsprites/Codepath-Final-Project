
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

const URL = import.meta.env.VITE_APP_URL;
const API_KEY = import.meta.env.VITE_APP_API_KEY;

const supabaseInstance = () => {

    if (!supabase) {
        supabase = createClient(URL, API_KEY);
    }
    return supabase;
};

export default supabaseInstance;
