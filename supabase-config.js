const SUPABASE_URL = 'https://qcxtxuesbvuhraokyzyu.supabase.co';

const SUPABASE_KEY = 'sb_publishable_yCHUbgjbnsMNlZWlimYJQg_LlzkSpyE';

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
