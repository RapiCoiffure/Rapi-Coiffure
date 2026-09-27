/* ==========================================================================
   BOOKING STORAGE
   --------------------------------------------------------------------------
   The rest of the website only talks to `BookingStore` below, through
   these 4 functions:

       BookingStore.getBusySlots(barberId, date)  → [{ time, duration }]
       BookingStore.createBooking(booking)        → saved booking (or throws SLOT_TAKEN)
       BookingStore.listBookings()                → all bookings   (admin page)
       BookingStore.updateStatus(id, status)      → updated booking (admin page)

   ⚠ DEMO MODE (active by default): bookings are saved in the visitor's
   browser (localStorage). They survive a page refresh, but they are NOT
   shared between different customers or devices.

   ✅ PRODUCTION: switch to the Supabase store at the bottom of this file
   (see README.md → "Connecting a database"). Then every customer sees the
   same availability and double bookings are blocked by the database.
   ========================================================================== */

const STORAGE_KEY = "rapi-coiffure-bookings-v1";

/* Helpers shared by every store ------------------------------------------ */
const BookingUtils = {
    toMinutes(hhmm) {
        const [h, m] = hhmm.split(":").map(Number);
        return h * 60 + m;
    },
    // Do two appointments overlap? (start in "HH:MM", duration in minutes)
    overlaps(startA, durA, startB, durB) {
        const a = this.toMinutes(startA), b = this.toMinutes(startB);
        return a < b + durB && b < a + durA;
    },
    // Short, readable reference such as "RC-4K7Q2"
    makeReference() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let ref = "";
        for (let i = 0; i < 5; i++) ref += chars[Math.floor(Math.random() * chars.length)];
        return "RC-" + ref;
    }
};

class SlotTakenError extends Error {
    constructor() { super("SLOT_TAKEN"); this.code = "SLOT_TAKEN"; }
}


/* ==========================================================================
   A) DEMO STORE — localStorage (works without any server)
   ========================================================================== */
const LocalStorageStore = {
    _read() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch (e) { return []; }
    },
    _write(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    },

    async getBusySlots(barberId, date) {
        return this._read()
            .filter(b => b.barberId === barberId && b.date === date && b.status !== "cancelled")
            .map(b => ({ time: b.time, duration: b.duration }));
    },

    async createBooking(data) {
        const list = this._read();
        // Final double-booking check, right before saving.
        const clash = list.some(b =>
            b.barberId === data.barberId &&
            b.date === data.date &&
            b.status !== "cancelled" &&
            BookingUtils.overlaps(b.time, b.duration, data.time, data.duration)
        );
        if (clash) throw new SlotTakenError();

        const booking = {
            ...data,
            id: BookingUtils.makeReference(),
            status: "pending",               // pending → confirmed / cancelled by the admin
            createdAt: new Date().toISOString()
        };
        list.push(booking);
        this._write(list);
        return booking;
    },

    async listBookings() {
        return this._read().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    },

    async updateStatus(id, status) {
        const list = this._read();
        const booking = list.find(b => b.id === id);
        if (!booking) throw new Error("NOT_FOUND");
        booking.status = status;
        this._write(list);
        return booking;
    },

    // Refresh the time slots when another tab books something.
    onChange(callback) {
        window.addEventListener("storage", e => { if (e.key === STORAGE_KEY) callback(); });
    }
};


/* ==========================================================================
   B) PRODUCTION STORE — Supabase (free tier is enough for a barbershop)
   --------------------------------------------------------------------------
   1. Create a project at https://supabase.com
   2. Run  backend/supabase-schema.sql  in Supabase → SQL Editor
   3. In index.html, un-comment the Supabase <script> tag
   4. Fill in SUPABASE_URL and SUPABASE_ANON_KEY below
   5. Change the last line of this file to:  const BookingStore = SupabaseStore;
   ========================================================================== */
const SUPABASE_URL = "";          // e.g. "https://abcdefgh.supabase.co"
const SUPABASE_ANON_KEY = "";     // Project Settings → API → anon public key

const SupabaseStore = {
    _client() {
        if (!this.__c) this.__c = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return this.__c;
    },

    async getBusySlots(barberId, date) {
        // Only times are returned — never other customers' names or phones.
        const { data, error } = await this._client()
            .rpc("get_busy_slots", { p_barber: barberId, p_date: date });
        if (error) throw error;
        return data.map(r => ({ time: r.start_time.slice(0, 5), duration: r.duration_min }));
    },

    async createBooking(d) {
        const reference = BookingUtils.makeReference();
        const { error } = await this._client().rpc("request_booking", {
            p_reference: reference,
            p_barber: d.barberId,
            p_service: d.serviceId,
            p_date: d.date,
            p_time: d.time,
            p_duration: d.duration,
            p_name: d.customer.name,
            p_phone: d.customer.phone,
            p_email: d.customer.email || null,
            p_notes: d.customer.notes || null,
            p_lang: d.lang
        });
        if (error) {
            if (String(error.message).includes("SLOT_TAKEN")) throw new SlotTakenError();
            throw error;
        }
        return { ...d, id: reference, status: "pending", createdAt: new Date().toISOString() };
    },

    // The admin functions need a logged-in admin (Supabase Auth). See README.
    async listBookings() {
        const { data, error } = await this._client()
            .from("bookings").select("*").order("booking_date").order("start_time");
        if (error) throw error;
        return data.map(r => ({
            id: r.reference, barberId: r.barber_id, serviceId: r.service_id,
            date: r.booking_date, time: r.start_time.slice(0, 5), duration: r.duration_min,
            status: r.status, lang: r.lang, createdAt: r.created_at,
            customer: { name: r.customer_name, phone: r.customer_phone, email: r.customer_email, notes: r.notes }
        }));
    },

    async updateStatus(id, status) {
        const { error } = await this._client()
            .from("bookings").update({ status }).eq("reference", id);
        if (error) throw error;
        return { id, status };
    },

    onChange(callback) {
        // Customers can't read the bookings table directly (privacy), so the
        // availability is simply refreshed every 30 s and when the tab regains focus.
        setInterval(callback, 30000);
        window.addEventListener("focus", callback);
    }
};


/* ==========================================================================
   ▶ ACTIVE STORE — change to SupabaseStore when your database is ready
   ========================================================================== */
const BookingStore = LocalStorageStore;
