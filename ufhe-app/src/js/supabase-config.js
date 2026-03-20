// ═══════════════════════════════════════════════
// UFHE — Supabase Configuration & Complaints API
// ═══════════════════════════════════════════════

const SUPABASE_URL = 'https://kmfpjssvxshypyudaibv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZnBqc3N2eHNoeXB5dWRhaWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjA4MDMsImV4cCI6MjA4OTM5NjgwM30.7h7tVk68u-xHCiaBrtFreV17WSkBSoAJE_fp0TO2lpM';

// Initialize Supabase client (loaded via CDN as window.supabase)
let supabaseClient = null;

function getSupabase() {
    if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

// ─── Submit Complaint to Supabase ──────────
export async function submitComplaint(complaint) {
    const sb = getSupabase();
    if (!sb) {
        console.warn('[Supabase] Client not available — storing locally only');
        return { success: false, error: 'Supabase not loaded' };
    }

    try {
        const { data, error } = await sb
            .from('complaints')
            .insert([{
                complaint_id: complaint.id,
                citizen_name: complaint.citizen,
                phone: complaint.phone,
                ward: complaint.ward,
                type: complaint.type,
                description: complaint.desc,
                lat: complaint.lat,
                lng: complaint.lng,
                status: complaint.status || 'OPEN',
                has_image: complaint.hasImage || false,
                upvotes: 0,
                city: complaint.city || 'mumbai',
            }])
            .select();

        if (error) throw error;
        console.log('[Supabase] Complaint inserted:', data);
        return { success: true, data };
    } catch (err) {
        console.error('[Supabase] Insert failed:', err.message);
        return { success: false, error: err.message };
    }
}

// ─── Fetch Complaints from Supabase ──────────
export async function fetchComplaints(city = 'mumbai') {
    const sb = getSupabase();
    if (!sb) {
        console.warn('[Supabase] Client not available');
        return { success: false, data: [], error: 'Supabase not loaded' };
    }

    try {
        const { data, error } = await sb
            .from('complaints')
            .select('*')
            .eq('city', city)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error('[Supabase] Fetch failed:', err.message);
        return { success: false, data: [], error: err.message };
    }
}

// ─── Upvote a Complaint ──────────────────────
export async function upvoteComplaint(complaintId) {
    const sb = getSupabase();
    if (!sb) return { success: false };

    try {
        // First get current upvotes
        const { data: existing, error: fetchErr } = await sb
            .from('complaints')
            .select('upvotes')
            .eq('complaint_id', complaintId)
            .single();

        if (fetchErr) throw fetchErr;

        const { data, error } = await sb
            .from('complaints')
            .update({ upvotes: (existing.upvotes || 0) + 1 })
            .eq('complaint_id', complaintId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error('[Supabase] Upvote failed:', err.message);
        return { success: false, error: err.message };
    }
}

// ─── Update Complaint Status ─────────────────
export async function updateComplaintStatus(complaintId, newStatus) {
    const sb = getSupabase();
    if (!sb) return { success: false };

    try {
        const { data, error } = await sb
            .from('complaints')
            .update({ status: newStatus })
            .eq('complaint_id', complaintId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error('[Supabase] Status update failed:', err.message);
        return { success: false, error: err.message };
    }
}
