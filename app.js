/* ==========================================================================
   RAPI COIFFURE — APPLICATION LOGIC
   You normally don't need to edit this file.
   → Settings, barbers, services, prices:  js/config.js
   → Texts in French / English:             js/translations.js
   → Where bookings are saved:              js/storage.js
   ========================================================================== */
(function () {
    "use strict";

    document.documentElement.classList.add("js");

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const LANG_KEY = "rapi-coiffure-lang";
    const POLE_IMAGE = "assets/img/logo-pole.png";
    const STEP_NAMES = ["barber", "service", "date", "time", "details", "summary"];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Give every barber an id (used to keep availability separate per barber)
    barbers.forEach((b, i) => { if (!b.id) b.id = "barber-" + (i + 1); });

    const state = {
        lang: loadLanguage(),
        step: 1,
        barberId: null,
        serviceId: null,
        date: null,          // "YYYY-MM-DD"
        time: null,          // "HH:MM"
        customer: { name: "", phone: "", email: "", notes: "" },
        calMonth: null,      // Date: first day of the month shown in the calendar
        busy: [],            // [{ time, duration }] for the selected barber + date
        slotsToken: 0,
        submitting: false,
        whatsappUrl: ""
    };

    /* ======================================================================
       Helpers
       ====================================================================== */
    function loadLanguage() {
        try {
            const saved = localStorage.getItem(LANG_KEY);
            if (saved && translations[saved]) return saved;
        } catch (e) { /* storage blocked */ }
        return businessSettings.defaultLanguage || "fr";
    }

    function t(key, vars) {
        let s = (translations[state.lang] || {})[key];
        if (s === undefined) s = translations.fr[key];
        if (s === undefined) s = key;
        if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
        return s;
    }
    // Pick the right language from a { fr, en } object
    function tr(value) {
        if (value == null) return "";
        if (typeof value === "string") return value;
        return value[state.lang] || value.fr || "";
    }
    function esc(str) {
        return String(str == null ? "" : str).replace(/[&<>"']/g, c =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }
    const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

    const getBarber = id => barbers.find(b => b.id === id);
    const getService = id => services.find(s => s.id === id);

    /* Dates & times (always local time, never UTC) */
    const pad = n => String(n).padStart(2, "0");
    const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    function parseDate(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
    function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
    function addDays(d, n) { const c = new Date(d); c.setDate(c.getDate() + n); return c; }
    const toMin = hhmm => BookingUtils.toMinutes(hhmm);
    const toHHMM = min => pad(Math.floor(min / 60)) + ":" + pad(min % 60);
    const nowMinutes = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
    const locale = () => (state.lang === "fr" ? "fr-CH" : "en-GB");
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    function formatDateLong(s) {
        return capitalize(parseDate(s).toLocaleDateString(locale(), {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        }));
    }
    function formatDateShort(s) { const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`; }
    function formatPrice(p) { return p == null ? t("price.onRequest") : `${businessSettings.currency} ${p}`; }
    function whatsappDigits() {
        let n = String(businessSettings.whatsappNumber).replace(/\D/g, "");
        if (n.startsWith("00")) n = n.slice(2);
        return n;
    }

    /* Images with an elegant placeholder when the file is missing */
    function initials(name) {
        return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
    }
    function placeholderHTML(fb) {
        const pole = `<img class="placeholder__pole" src="${POLE_IMAGE}" alt="" aria-hidden="true">`;
        if (fb.type === "initials") {
            return `<span class="placeholder">${pole}<span class="placeholder__initials">${esc(initials(fb.text))}</span></span>`;
        }
        return `<span class="placeholder">${pole}${fb.label ? `<span class="placeholder__label">${esc(fb.label)}</span>` : ""}</span>`;
    }
    function imageHTML(src, alt, fallback) {
        if (!src) return placeholderHTML(fallback);
        return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" data-fallback="${esc(JSON.stringify(fallback))}">`;
    }
    // Any image that fails to load is swapped for its placeholder
    document.addEventListener("error", e => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
        const wrap = document.createElement("span");
        wrap.innerHTML = placeholderHTML(JSON.parse(img.dataset.fallback));
        if (img.parentElement) img.parentElement.classList.add("is-missing");
        img.replaceWith(wrap.firstElementChild);
    }, true);

    /* ======================================================================
       Language
       ====================================================================== */
    function setLanguage(lang) {
        state.lang = translations[lang] ? lang : "fr";
        try { localStorage.setItem(LANG_KEY, state.lang); } catch (e) { /* ignore */ }
        document.documentElement.lang = state.lang;
        $$(".lang__btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));

        $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
        $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
        $$("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
        $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
        updateBurgerLabel();

        renderServices();
        renderBarbers();
        renderGallery();
        renderContact();
        renderHours();
        renderStep(false);
    }

    /* ======================================================================
       Static sections
       ====================================================================== */
    function renderServices() {
        $("#servicesList").innerHTML = services.map(s => `
            <li>
                <button type="button" class="service__btn" data-book-service="${esc(s.id)}">
                    ${icon(s.icon || "scissors")}
                    <span>
                        <span class="service__line">
                            <span class="service__name">${esc(tr(s.name))}</span>
                            <span class="service__leader" aria-hidden="true"></span>
                            <span class="service__price">${esc(formatPrice(s.price))}</span>
                        </span>
                        <span class="service__desc">${esc(tr(s.description))}</span>
                        <span class="service__meta">
                            <span>${icon("clock")}${esc(t("duration.min", { n: s.duration }))}</span>
                            <span class="service__cta">${esc(t("services.book"))}</span>
                        </span>
                    </span>
                </button>
            </li>`).join("");
    }

    function renderBarbers() {
        $("#barbersList").innerHTML = barbers.map(b => `
            <article class="barber">
                <div class="frame frame--arch">${imageHTML(b.image, b.name, { type: "initials", text: b.name })}</div>
                <h3 class="barber__name">${esc(b.name)}</h3>
                <p class="barber__role">${esc(tr(b.role))}</p>
                <p class="barber__bio">${esc(tr(b.bio))}</p>
                <button type="button" class="btn btn--ghost" data-book-barber="${esc(b.id)}">${esc(t("barbers.book"))}</button>
            </article>`).join("");
    }

    function renderGallery() {
        $("#galleryGrid").innerHTML = galleryImages.map((g, i) => `
            <button type="button" class="gallery__item" data-gallery="${i}" aria-label="${esc(tr(g.alt))}">
                ${imageHTML(g.src, tr(g.alt), { type: "pole" })}
                <span class="gallery__caption">${esc(tr(g.alt))}</span>
            </button>`).join("");
    }

    function renderContact() {
        const hello = encodeURIComponent(t("wa.hello"));
        $("#contactWhatsApp").href = `https://wa.me/${whatsappDigits()}?text=${hello}`;

        const items = [];
        const phoneDigits = String(contactInfo.phone || "").replace(/\D/g, "").replace(/^00/, "");
        if (contactInfo.phone && phoneDigits === whatsappDigits()) {
            // Same number for calls and WhatsApp → one line
            items.push(`<li>${icon("phone")}<div><small>${esc(t("contact.phone"))} / WhatsApp</small><a href="tel:${esc(contactInfo.phone.replace(/[^\d+]/g, ""))}">${esc(contactInfo.phone)}</a></div></li>`);
        } else {
            items.push(`<li>${icon("whatsapp")}<div><small>WhatsApp</small><a href="https://wa.me/${whatsappDigits()}" target="_blank" rel="noopener">${esc(businessSettings.whatsappNumber)}</a></div></li>`);
            if (contactInfo.phone) {
                items.push(`<li>${icon("phone")}<div><small>${esc(t("contact.phone"))}</small><a href="tel:${esc(contactInfo.phone.replace(/[^\d+]/g, ""))}">${esc(contactInfo.phone)}</a></div></li>`);
            }
        }
        if (contactInfo.email) {
            items.push(`<li>${icon("mail")}<div><small>${esc(t("contact.email"))}</small><a href="mailto:${esc(contactInfo.email)}">${esc(contactInfo.email)}</a></div></li>`);
        }
        const address = tr(contactInfo.address);
        if (address) {
            const inner = contactInfo.mapsLink
                ? `<a href="${esc(contactInfo.mapsLink)}" target="_blank" rel="noopener">${esc(address)}</a>`
                : `<span>${esc(address)}</span>`;
            items.push(`<li>${icon("pin")}<div><small>${esc(t("contact.address"))}</small>${inner}</div></li>`);
        }
        $("#contactList").innerHTML = items.join("");

        const social = contactInfo.social || {};
        const names = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" };
        $("#contactSocial").innerHTML = Object.keys(names)
            .filter(k => social[k])
            .map(k => `<a class="icon-btn" href="${esc(social[k])}" target="_blank" rel="noopener" aria-label="${names[k]}">${icon(k)}</a>`)
            .join("");

        if (contactInfo.mapEmbedUrl && !$("#map iframe")) {
            $("#map").innerHTML = `<iframe src="${esc(contactInfo.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map"></iframe>`;
        }
    }

    function renderHours() {
        const order = [1, 2, 3, 4, 5, 6, 0];
        const todayDay = new Date().getDay();
        const open = `${businessSettings.openingTime} – ${businessSettings.closingTime}`;
        $("#hoursTable").innerHTML = "<tbody>" + order.map(d => {
            const isOpen = businessSettings.openDays.includes(d);
            const cls = [isOpen ? "" : "is-closed", d === todayDay ? "is-today" : ""].join(" ").trim();
            const tag = d === todayDay ? `<em>(${esc(t("hours.today"))})</em>` : "";
            return `<tr class="${cls}"><td>${esc(t("day." + d))}${tag}</td><td>${isOpen ? open : esc(t("hours.closed"))}</td></tr>`;
        }).join("") + "</tbody>";
        $("#heroHours").textContent = open;
    }

    /* ======================================================================
       Booking — availability
       ====================================================================== */

    // All start times of the day, e.g. [540, 570, …] (minutes since midnight)
    function allSlots() {
        const out = [];
        const start = toMin(businessSettings.openingTime);
        const last = toMin(businessSettings.lastAppointmentTime || businessSettings.closingTime);
        const step = Math.max(5, Number(businessSettings.slotInterval) || 30);
        for (let m = start; m <= last; m += step) out.push(m);
        return out;
    }

    function isToday(dateStr) { return dateStr === isoDate(today()); }

    function isTooSoon(dateStr, minutes) {
        return isToday(dateStr) && minutes < nowMinutes() + (businessSettings.minNoticeMinutes || 0);
    }

    function isDateBookable(d) {
        const t0 = today();
        if (d < t0) return false;                                           // past
        if (d > addDays(t0, businessSettings.bookingWindowDays)) return false;
        if (!businessSettings.openDays.includes(d.getDay())) return false;  // Sunday
        const s = isoDate(d);
        if ((businessSettings.closedDates || []).includes(s)) return false;
        if (isToday(s) && allSlots().every(m => isTooSoon(s, m))) return false;
        return true;
    }

    // "free" | "busy" | "past" — for the selected barber, date and service duration
    function slotStatus(minutes) {
        if (isTooSoon(state.date, minutes)) return "past";
        const duration = getService(state.serviceId).duration;
        const start = toHHMM(minutes);
        const clash = state.busy.some(b => BookingUtils.overlaps(b.time, b.duration, start, duration));
        return clash ? "busy" : "free";
    }

    /* ======================================================================
       Booking — rendering each step
       ====================================================================== */
    function renderPickBarbers() {
        $("#pickBarbers").innerHTML = barbers.map(b => {
            const sel = b.id === state.barberId;
            return `
            <button type="button" class="pick${sel ? " is-selected" : ""}" data-barber="${esc(b.id)}" aria-pressed="${sel}">
                <span class="frame frame--arch">${imageHTML(b.image, "", { type: "initials", text: b.name })}</span>
                <span class="pick__text">
                    <span><span class="pick__name">${esc(b.name)}</span><span class="pick__role">${esc(tr(b.role))}</span></span>
                    <span class="btn btn--ghost">${esc(t("barbers.book"))}</span>
                </span>
            </button>`;
        }).join("");
    }

    function renderPickServices() {
        $("#pickServices").innerHTML = services.map(s => {
            const sel = s.id === state.serviceId;
            return `
            <button type="button" class="opt${sel ? " is-selected" : ""}" data-service="${esc(s.id)}" aria-pressed="${sel}">
                ${icon(sel ? "check" : (s.icon || "scissors"))}
                <span>
                    <span class="opt__name">${esc(tr(s.name))}</span>
                    <span class="opt__desc">${esc(tr(s.description))}</span>
                </span>
                <span class="opt__side">
                    <span class="opt__price">${esc(formatPrice(s.price))}</span>
                    <span class="opt__dur">${esc(t("duration.min", { n: s.duration }))}</span>
                </span>
            </button>`;
        }).join("");
    }

    function renderCalendar() {
        const t0 = today();
        const maxDate = addDays(t0, businessSettings.bookingWindowDays);
        if (!state.calMonth) {
            const base = state.date ? parseDate(state.date) : t0;
            state.calMonth = new Date(base.getFullYear(), base.getMonth(), 1);
        }
        const m = state.calMonth;
        $("#calMonth").textContent = m.toLocaleDateString(locale(), { month: "long", year: "numeric" });

        // Weekday names, Monday first (2024-01-01 was a Monday)
        $("#calWeekdays").innerHTML = Array.from({ length: 7 }, (_, i) =>
            `<span>${esc(new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: "short" }).replace(".", ""))}</span>`
        ).join("");

        const first = new Date(m.getFullYear(), m.getMonth(), 1);
        const offset = (first.getDay() + 6) % 7;
        const daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
        let html = "";
        for (let i = 0; i < offset; i++) html += `<span class="day day--empty"></span>`;
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(m.getFullYear(), m.getMonth(), day);
            const s = isoDate(d);
            const ok = isDateBookable(d);
            const cls = ["day",
                d.getDay() === 0 ? "is-sunday" : "",
                s === isoDate(t0) ? "is-today" : "",
                s === state.date ? "is-selected" : ""].join(" ").trim();
            const label = capitalize(d.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" }));
            html += `<button type="button" class="${cls}" data-day="${s}" aria-label="${esc(label)}" ${ok ? "" : "disabled"} aria-pressed="${s === state.date}">${day}</button>`;
        }
        $("#calGrid").innerHTML = html;

        $("#calPrev").disabled = m <= new Date(t0.getFullYear(), t0.getMonth(), 1);
        $("#calNext").disabled = m >= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    }

    async function loadSlots() {
        const token = ++state.slotsToken;
        renderTimeContext();
        $("#slots").innerHTML = `<p class="slots__empty">${esc(t("time.loading"))}</p>`;
        try {
            const busy = await BookingStore.getBusySlots(state.barberId, state.date);
            if (token !== state.slotsToken) return;              // a newer request is running
            state.busy = busy;
        } catch (err) {
            console.error(err);
            if (token !== state.slotsToken) return;
            state.busy = [];
            showAlert("#timeError", t("err.generic"));
        }
        // If the chosen time was taken meanwhile, drop it
        if (state.time && slotStatus(toMin(state.time)) !== "free") state.time = null;
        renderSlots();
    }

    function renderTimeContext() {
        const barber = getBarber(state.barberId);
        const service = getService(state.serviceId);
        $("#timeContext").innerHTML =
            `${esc(t("time.for", { barber: barber.name, date: formatDateLong(state.date) }))}<br>${esc(t("time.duration", { n: service.duration }))}`;
    }

    function renderSlots() {
        renderTimeContext();
        const list = allSlots()
            .map(m => ({ m, status: slotStatus(m) }))
            .filter(s => s.status !== "past");
        const free = list.filter(s => s.status === "free").length;

        let html = free === 0 ? `<p class="slots__empty">${esc(t("time.none"))}</p>` : "";
        html += list.map(({ m, status }) => {
            const time = toHHMM(m);
            const selected = status === "free" && time === state.time;
            const label = selected ? t("time.selected") : status === "busy" ? t("time.unavailable") : t("time.available");
            return `<button type="button" class="slot${selected ? " is-selected" : ""}" data-time="${time}"
                        ${status === "busy" ? 'disabled aria-disabled="true"' : ""} aria-pressed="${selected}"
                        aria-label="${time} — ${esc(label)}">
                        <span class="slot__time">${time}</span>
                        <span class="slot__state">${esc(label)}</span>
                    </button>`;
        }).join("");
        $("#slots").innerHTML = html;
        updateNextButtons();
    }

    function fillForm() {
        $("#fName").value = state.customer.name;
        $("#fPhone").value = state.customer.phone;
        $("#fEmail").value = state.customer.email;
        $("#fNotes").value = state.customer.notes;
    }

    function summaryRows(rows) {
        return `<dl>${rows.map(r => r === "rule"
            ? `<hr class="summary__rule">`
            : `<div class="summary__row${r.big ? " summary__row--big" : ""}"><dt>${esc(r.label)}</dt><dd>${r.html || esc(r.value)}</dd></div>`
        ).join("")}</dl>`;
    }

    function renderSummary() {
        const b = getBarber(state.barberId);
        const s = getService(state.serviceId);
        const c = state.customer;
        const rows = [
            { label: t("sum.barber"), value: b.name },
            { label: t("sum.service"), value: tr(s.name) },
            { label: t("sum.date"), value: formatDateLong(state.date) },
            { label: t("sum.time"), value: state.time },
            { label: t("sum.duration"), value: t("duration.min", { n: s.duration }) },
            { label: t("sum.price"), value: formatPrice(s.price), big: true },
            "rule",
            { label: t("sum.name"), value: c.name },
            { label: t("sum.phone"), value: c.phone }
        ];
        if (c.email) rows.push({ label: t("sum.email"), value: c.email });
        if (c.notes) rows.push({ label: t("sum.notes"), value: c.notes });
        rows.push("rule", { label: t("sum.status"), html: `<span class="badge">${esc(t("status.pending"))}</span>` });
        $("#summary").innerHTML = summaryRows(rows);
    }

    function renderChips() {
        const chips = [];
        const b = getBarber(state.barberId), s = getService(state.serviceId);
        // Not needed on the summary (it shows everything) or after sending
        if (state.step === "done" || state.step === 6) { $("#chips").innerHTML = ""; return; }
        if (b && state.step > 1) chips.push([1, t("step.barber"), b.name]);
        if (s && state.step > 2) chips.push([2, t("step.service"), tr(s.name)]);
        if (state.date && state.step > 3) chips.push([3, t("step.date"), formatDateShort(state.date)]);
        if (state.time && state.step > 4) chips.push([4, t("step.time"), state.time]);
        if (state.customer.name && state.step > 5) chips.push([5, t("step.details"), state.customer.name]);
        $("#chips").innerHTML = chips.map(([n, label, value]) =>
            `<button type="button" class="chip" data-goto="${n}"><small>${esc(label)}</small>${esc(value)}</button>`).join("");
    }

    function renderProgress() {
        const done = state.step === "done";
        $("#progress").hidden = done;
        if (done) return;
        const n = state.step;
        $("#progressCount").textContent = t("booking.stepOf", { n });
        $("#progressLabel").textContent = t("step." + STEP_NAMES[n - 1]);
        $("#progressFill").style.width = (n / 6 * 100) + "%";
        $$("#progressSteps li").forEach(li => {
            const k = Number(li.dataset.step);
            li.classList.toggle("is-done", k < n);
            li.classList.toggle("is-current", k === n);
            if (k === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
        });
    }

    // Show "Continue" when the current step already has a value (e.g. after going back)
    function updateNextButtons() {
        const has = { 1: state.barberId, 2: state.serviceId, 3: state.date, 4: state.time };
        $$("[data-panel]").forEach(panel => {
            const btn = $("[data-next]", panel);
            if (btn) btn.hidden = !has[panel.dataset.panel];
        });
    }

    // entering = true when arriving on the step, false when only the language changed
    function renderStep(entering) {
        switch (state.step) {
            case 1: renderPickBarbers(); break;
            case 2: renderPickServices(); break;
            case 3: renderCalendar(); break;
            case 4: if (entering) loadSlots(); else renderSlots(); break;
            case 5: if (entering) fillForm(); break;
            case 6: renderSummary(); break;
            case "done": renderSuccess(); break;
        }
        renderProgress();
        renderChips();
        updateNextButtons();
    }

    /* ======================================================================
       Booking — navigation between steps
       ====================================================================== */
    function canOpen(step) {
        if (step >= 2 && !state.barberId) return false;
        if (step >= 3 && !state.serviceId) return false;
        if (step >= 4 && !state.date) return false;
        if (step >= 5 && !state.time) return false;
        if (step >= 6 && !(state.customer.name && state.customer.phone)) return false;
        return true;
    }

    function goToStep(step, opts = {}) {
        if (step !== "done") {
            while (step > 1 && !canOpen(step)) step--;
        }
        const previous = state.step;
        state.step = step;
        hideAlert("#timeError");
        hideAlert("#submitError");

        $$("[data-panel]").forEach(p => { p.hidden = String(p.dataset.panel) !== String(step); });
        renderStep(true);

        if (previous !== step) {
            const pole = $(".progress__pole");
            pole.classList.remove("is-turning");
            void pole.offsetWidth;
            pole.classList.add("is-turning");
        }
        if (opts.scroll !== false) scrollToBooker();
        if (opts.focus !== false) {
            const title = $(`[data-panel="${step}"] .step__title, [data-panel="${step}"] .success__title`);
            if (title) { title.setAttribute("tabindex", "-1"); title.focus({ preventScroll: true }); }
        }
    }

    function scrollToBooker() {
        const booker = $("#booker");
        const top = booker.getBoundingClientRect().top;
        const navH = $("#nav").offsetHeight;
        if (top < navH || top > window.innerHeight * 0.45) {
            window.scrollTo({ top: window.scrollY + top - navH - 16, behavior: reduceMotion ? "auto" : "smooth" });
        }
    }

    function scrollToBooking() {
        $("#booking").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }

    function selectBarber(id) {
        if (state.barberId !== id) { state.barberId = id; state.time = null; }
        goToStep(2);
    }
    function selectService(id) {
        if (state.serviceId !== id) { state.serviceId = id; state.time = null; }
        goToStep(3);
    }
    function selectDate(iso) {
        if (state.date !== iso) { state.date = iso; state.time = null; }
        goToStep(4);
    }
    function selectTime(time) {
        state.time = time;
        hideAlert("#timeError");
        renderSlots();
        setTimeout(() => { if (state.step === 4 && state.time === time) goToStep(5); }, reduceMotion ? 0 : 260);
    }

    /* ======================================================================
       Booking — customer details
       ====================================================================== */
    function setFieldError(id, message) {
        const input = $("#" + id);
        input.closest(".field").classList.toggle("has-error", !!message);
        input.setAttribute("aria-invalid", message ? "true" : "false");
        $("#" + id + "Error").textContent = message || "";
    }

    function validateDetails() {
        const name = $("#fName").value.trim().replace(/\s+/g, " ");
        const phone = $("#fPhone").value.trim();
        const email = $("#fEmail").value.trim();
        const notes = $("#fNotes").value.trim();
        const errors = {};

        if (name.length < 2) errors.fName = t("err.nameRequired");
        const digits = phone.replace(/[\s().\-/]/g, "");
        if (!phone) errors.fPhone = t("err.phoneRequired");
        else if (!/^\+?\d{9,15}$/.test(digits)) errors.fPhone = t("err.phoneInvalid");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.fEmail = t("err.emailInvalid");

        ["fName", "fPhone", "fEmail"].forEach(id => setFieldError(id, errors[id]));
        const firstError = ["fName", "fPhone", "fEmail"].find(id => errors[id]);
        if (firstError) { $("#" + firstError).focus(); return false; }

        state.customer = { name, phone, email, notes };
        return true;
    }

    /* ======================================================================
       Booking — submit, WhatsApp, success
       ====================================================================== */
    function buildWhatsAppMessage(bk) {
        const lines = [
            `*${t("wa.title")}*`,
            "",
            `${t("wa.barber")}: ${bk.barberName}`,
            `${t("wa.service")}: ${bk.serviceName}`,
            `${t("wa.date")}: ${formatDateShort(bk.date)}`,
            `${t("wa.time")}: ${bk.time}`,
            `${t("wa.duration")}: ${bk.duration} min`,
            `${t("wa.price")}: ${formatPrice(bk.price)}`,
            "",
            `${t("wa.name")}: ${bk.customer.name}`,
            `${t("wa.phone")}: ${bk.customer.phone}`
        ];
        if (bk.customer.email) lines.push(`${t("wa.email")}: ${bk.customer.email}`);
        if (bk.customer.notes) lines.push(`${t("wa.notes")}: ${bk.customer.notes}`);
        lines.push("", `${t("wa.ref")}: ${bk.id}`, `${t("wa.status")}: ${t("wa.statusValue")}`);
        return lines.join("\n");
    }

    function whatsappLink(text) {
        return `https://wa.me/${whatsappDigits()}?text=${encodeURIComponent(text)}`;
    }

    async function submitBooking() {
        if (state.submitting || !canOpen(6)) return;
        const btn = $("#submitBooking");
        const barber = getBarber(state.barberId);
        const service = getService(state.serviceId);

        const request = {
            barberId: barber.id,
            barberName: barber.name,
            serviceId: service.id,
            serviceName: tr(service.name),
            date: state.date,
            time: state.time,
            duration: service.duration,
            price: service.price,
            lang: state.lang,
            customer: { ...state.customer }
        };

        state.submitting = true;
        btn.disabled = true;
        btn.textContent = t("sum.sending");
        hideAlert("#submitError");

        try {
            // 1) Save the booking → the slot is locked for this barber (status: pending)
            const saved = await BookingStore.createBooking(request);
            state.lastBooking = saved;

            // 2) Open WhatsApp with the request already written
            state.whatsappUrl = whatsappLink(buildWhatsAppMessage(saved));
            const win = window.open(state.whatsappUrl, "_blank");
            if (win) { try { win.opener = null; } catch (e) { /* ignore */ } }

            // 3) Show the "pending confirmation" screen
            goToStep("done");
        } catch (err) {
            if (err && err.code === "SLOT_TAKEN") {
                state.time = null;
                goToStep(4);
                showAlert("#timeError", t("err.slotTaken"));
            } else {
                console.error(err);
                showAlert("#submitError", t("err.generic"));
            }
        } finally {
            state.submitting = false;
            btn.disabled = false;
            btn.textContent = t("sum.submit");
        }
    }

    function renderSuccess() {
        const bk = state.lastBooking;
        if (!bk) return;
        const barber = getBarber(bk.barberId);
        const service = getService(bk.serviceId);
        $("#successTicket").innerHTML = `<div class="summary">${summaryRows([
            { label: t("success.ref"), value: bk.id, big: true },
            { label: t("sum.barber"), value: barber ? barber.name : bk.barberName },
            { label: t("sum.service"), value: service ? tr(service.name) : bk.serviceName },
            { label: t("sum.date"), value: formatDateLong(bk.date) },
            { label: t("sum.time"), value: bk.time },
            { label: t("sum.status"), html: `<span class="badge">${esc(t("status.pending"))}</span>` }
        ])}</div>`;
        $("#successWhatsApp").href = state.whatsappUrl;
    }

    function resetBooking() {
        Object.assign(state, {
            barberId: null, serviceId: null, date: null, time: null, calMonth: null,
            customer: { name: "", phone: "", email: "", notes: "" }, busy: [], lastBooking: null
        });
        ["fName", "fPhone", "fEmail"].forEach(id => setFieldError(id, ""));
        goToStep(1, { scroll: false, focus: false });
    }

    function showAlert(sel, msg) { const el = $(sel); el.textContent = msg; el.hidden = false; }
    function hideAlert(sel) { const el = $(sel); if (el) el.hidden = true; }

    /* ======================================================================
       Booking — events
       ====================================================================== */
    function initBooking() {
        $("#booker").addEventListener("click", e => {
            const el = e.target.closest("button, [data-goto], li.is-done");
            if (!el || el.disabled) return;

            if (el.dataset.barber) return selectBarber(el.dataset.barber);
            if (el.dataset.service) return selectService(el.dataset.service);
            if (el.dataset.day) return selectDate(el.dataset.day);
            if (el.dataset.time) return selectTime(el.dataset.time);
            if (el.dataset.goto) return goToStep(Number(el.dataset.goto));
            if (el.matches("li.is-done")) return goToStep(Number(el.dataset.step));
            if (el.hasAttribute("data-back")) return goToStep(state.step - 1);
            if (el.hasAttribute("data-next")) return goToStep(state.step + 1);
        });

        $("#calPrev").addEventListener("click", () => {
            state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
            renderCalendar();
        });
        $("#calNext").addEventListener("click", () => {
            state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
            renderCalendar();
        });

        $("#detailsForm").addEventListener("submit", e => {
            e.preventDefault();
            if (validateDetails()) goToStep(6);
        });
        ["fName", "fPhone", "fEmail"].forEach(id => {
            $("#" + id).addEventListener("input", () => {
                if ($("#" + id).closest(".field").classList.contains("has-error")) setFieldError(id, "");
            });
        });

        $("#submitBooking").addEventListener("click", submitBooking);
        $("#backHome").addEventListener("click", () => resetBooking());

        // Buttons outside the booking section
        document.addEventListener("click", e => {
            const barberBtn = e.target.closest("[data-book-barber]");
            if (barberBtn) {
                state.barberId = barberBtn.dataset.bookBarber;
                state.time = null;
                goToStep(state.serviceId ? 3 : 2, { scroll: false, focus: false });
                scrollToBooking();
                return;
            }
            const serviceBtn = e.target.closest("[data-book-service]");
            if (serviceBtn) {
                state.serviceId = serviceBtn.dataset.bookService;
                state.time = null;
                // The barber is always chosen first
                goToStep(state.barberId ? 3 : 1, { scroll: false, focus: false });
                scrollToBooking();
            }
        });

        // Another customer (or tab) booked something → refresh the times
        BookingStore.onChange(() => { if (state.step === 4) loadSlots(); });
    }

    /* ======================================================================
       Navigation, gallery, animations
       ====================================================================== */
    function updateBurgerLabel() {
        const open = $("#nav").classList.contains("menu-is-open");
        $("#navBurger").setAttribute("aria-label", t(open ? "nav.closeMenu" : "nav.openMenu"));
    }

    function initNav() {
        const nav = $("#nav");
        const burger = $("#navBurger");
        const setMenu = open => {
            nav.classList.toggle("menu-is-open", open);
            document.body.classList.toggle("menu-open", open);
            burger.setAttribute("aria-expanded", String(open));
            $("use", burger).setAttribute("href", open ? "#i-close" : "#i-menu");
            updateBurgerLabel();
        };
        burger.addEventListener("click", () => setMenu(!nav.classList.contains("menu-is-open")));
        $$("#navMenu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

        const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        $$(".lang__btn").forEach(b => b.addEventListener("click", () => setLanguage(b.dataset.lang)));

        // Highlight the current section in the menu
        if ("IntersectionObserver" in window) {
            const links = $$(".nav__links a");
            const io = new IntersectionObserver(entries => {
                entries.forEach(en => {
                    if (!en.isIntersecting) return;
                    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
                });
            }, { rootMargin: "-45% 0px -50% 0px" });
            $$("main section[id]").forEach(s => io.observe(s));
        }
    }

    function initGallery() {
        const box = $("#lightbox");
        $("#galleryGrid").addEventListener("click", e => {
            const item = e.target.closest("[data-gallery]");
            if (!item || item.classList.contains("is-missing") || !box.showModal) return;
            const g = galleryImages[Number(item.dataset.gallery)];
            $("#lightboxImg").src = g.src;
            $("#lightboxImg").alt = tr(g.alt);
            box.showModal();
        });
        $("#lightboxClose").addEventListener("click", () => box.close());
        box.addEventListener("click", e => { if (e.target === box) box.close(); });
    }

    function initReveal() {
        const items = $$(".reveal");
        if (!("IntersectionObserver" in window) || reduceMotion) {
            items.forEach(el => el.classList.add("is-visible"));
            return;
        }
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        items.forEach(el => io.observe(el));
    }

    /* ======================================================================
       Start
       ====================================================================== */
    function init() {
        const about = $("#aboutImage");
        if (siteImages.about) {
            about.dataset.fallback = JSON.stringify({ type: "pole" });
            about.src = siteImages.about;
        } else {
            about.outerHTML = placeholderHTML({ type: "pole" });
        }
        $("#year").textContent = new Date().getFullYear();

        $$("[data-panel]").forEach(p => { p.hidden = p.dataset.panel !== "1"; });
        setLanguage(state.lang);
        initNav();
        initBooking();
        initGallery();
        initReveal();
    }

    init();
})();
