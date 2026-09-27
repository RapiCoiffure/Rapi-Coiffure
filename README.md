# Rapi Coiffure — Website

Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser, or upload the folder to any web host.

## Files

```
index.html              The website
admin.html              Page to confirm / cancel appointment requests
css/style.css           Design (brand colours at the top)
js/config.js            ★ ALL SETTINGS: barbers, services, prices, hours, WhatsApp, gallery, contact
js/translations.js      All texts in French and English
js/storage.js           Where bookings are saved (demo or database)
js/app.js               Website logic (no need to edit)
js/admin.js             Admin page logic
backend/supabase-schema.sql   Database setup for production
assets/img/             Logo files (made from your logo, transparent background)
images/                 Your photos (barbers, gallery, about)
```

## Changing things (all in `js/config.js`)

| What | Where |
|---|---|
| WhatsApp number | `businessSettings.whatsappNumber` |
| Opening / closing time, last appointment time | `businessSettings.openingTime`, `closingTime`, `lastAppointmentTime` |
| Time between slots (30 min) | `businessSettings.slotInterval` |
| Holidays / closed days | `businessSettings.closedDates` — e.g. `["2026-12-25"]` |
| Barber names and photos | `barbers` |
| Services, prices, durations, descriptions | `services` (`price: null` shows "On request") |
| Gallery | `galleryImages` |
| Phone, email, address, map, social media | `contactInfo` |

The prices in `config.js` are **placeholders** — replace them with your real prices.

## Photos

Put these files in the `images` folder (the names must match `config.js`):

- `barber1.jpg`, `barber2.jpg`, `barber3.jpg` — portrait, ideally 800 × 1000 px
- `gallery1.jpg` … `gallery6.jpg` — at least 1200 px wide
- `about.jpg` — portrait, 800 × 1000 px

Until a photo exists, an elegant placeholder with the barber pole is shown. Compress photos (e.g. squoosh.app) so the site stays fast on phones.

## How booking works

1. Barber → 2. Service → 3. Date → 4. Time → 5. Details → 6. Summary → **Confirm Appointment Request**
2. The request is saved with status **Pending confirmation**. That barber's slot becomes **Unavailable** immediately (other barbers stay available). Services longer than one slot block the following slots too (a 60‑min service at 14:00 blocks 14:00 and 14:30).
3. WhatsApp opens with the request already written to your number. The customer taps **Send**.
4. You open `admin.html`, press **Confirm** → the status becomes Confirmed and WhatsApp opens with a confirmation message for the client, in the language they booked in. **Cancel** frees the slot again and prepares a message for the client.

## ⚠ Demo mode vs. production

Out of the box, bookings are stored in the visitor's own browser (`localStorage`). This survives a page refresh, but **different customers and devices do not share bookings**, and `admin.html` only sees requests made in the same browser. It's for testing only.

**For the real website, connect the database** (free Supabase plan is enough):

1. Create a project at <https://supabase.com>.
2. Supabase → **SQL Editor** → paste `backend/supabase-schema.sql` → **Run**.
   The database itself refuses two overlapping bookings for the same barber, so double bookings are impossible even if two customers click at the same second. Customers can only see *which times are taken*, never other customers' names or phone numbers.
3. Supabase → **Project Settings → API**: copy the *Project URL* and the *anon public* key into `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `js/storage.js`.
4. At the bottom of `js/storage.js`, change `const BookingStore = LocalStorageStore;` to `const BookingStore = SupabaseStore;`
5. In `index.html` **and** `admin.html`, un-comment the line `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
6. Supabase → **Authentication → Users → Add user**: create your admin login (email + password). Then in **Authentication → Providers → Email**, turn off new sign-ups so nobody else can create an account. Log in on `admin.html` with that account.

Prefer Firebase or your own server? Only `js/storage.js` needs to change: write an object with the same four functions (`getBusySlots`, `createBooking`, `listBookings`, `updateStatus`) and make sure the server rejects overlapping bookings for the same barber.

## WhatsApp

The site uses `wa.me` links: free, no server needed, works on phones and computers. WhatsApp opens with the message pre-filled, but **the customer must press Send** — a website is not allowed to send WhatsApp messages by itself.

Fully automatic messages (sent without the customer pressing anything, or automatic confirmations to the client) need the **WhatsApp Business Platform (Cloud API)** from Meta: a verified Meta Business account, a dedicated phone number, approved message templates, and a server that holds the secret access token (never put it in the website code). With Supabase, that server would be an *Edge Function* called from `request_booking` / on status change. Meta charges per conversation. For a barbershop, the `wa.me` approach plus the admin page is usually enough.

## Putting it online

Any static host works: Netlify (drag & drop the folder on app.netlify.com/drop), Vercel, GitHub Pages, or your own hosting via FTP. Connect your domain (e.g. `rapicoiffure.ch`) in the host's settings.

Keep `admin.html` private: don't link to it from the site. With Supabase, it's protected by the login.
