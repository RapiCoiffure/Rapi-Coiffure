/* ==========================================================================
   RAPI COIFFURE — SETTINGS
   --------------------------------------------------------------------------
   This is the ONLY file you normally need to edit.
   Everything the website shows (barbers, services, prices, hours,
   WhatsApp number, gallery, contact details) comes from here.

   Texts that exist in two languages are written as:  { fr: "...", en: "..." }
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. BUSINESS SETTINGS
   -------------------------------------------------------------------------- */
const businessSettings = {
    businessName: "Rapi Coiffure",

    // WhatsApp number that receives every appointment request.
    // Write it with the country code. Spaces and "+" are allowed.
    whatsappNumber: "+41766972428",

    // Opening hours used by the booking system (24h format, "HH:MM").
    openingTime: "09:00",
    closingTime: "19:00",

    // The last time a customer can START an appointment.
    // "19:00" = the list of times goes 09:00 … 19:00 (as requested).
    // Change to "18:30" if everyone should be finished by closing time.
    lastAppointmentTime: "19:00",

    // Minutes between two time slots (30 = 09:00, 09:30, 10:00 …).
    slotInterval: 30,

    // Days the shop is open. 0 = Sunday, 1 = Monday … 6 = Saturday.
    openDays: [1, 2, 3, 4, 5, 6],

    // Extra closed dates (holidays, vacations). Format "YYYY-MM-DD".
    // Example: ["2026-12-25", "2026-12-26", "2027-01-01"]
    closedDates: [],

    // How many days ahead customers can book.
    bookingWindowDays: 60,

    // Customers cannot book a time starting sooner than this (minutes).
    minNoticeMinutes: 30,

    // Currency shown next to prices.
    currency: "CHF",

    // Language used when someone visits for the first time: "fr" or "en".
    defaultLanguage: "fr"
};


/* --------------------------------------------------------------------------
   2. CONTACT / LOCATION / SOCIAL MEDIA
   Leave a value empty ("") to hide it on the website.
   -------------------------------------------------------------------------- */
const contactInfo = {
    phone: "+41 76 697 24 28",
    email: "",                                   // e.g. "contact@rapicoiffure.ch"
    address: {
        fr: "Adresse du salon — à compléter",
        en: "Shop address — to be completed"
    },
    // Link opened when clicking the address (Google Maps share link).
    mapsLink: "",
    // Google Maps "Embed a map" URL (only the src="..." part). Empty = placeholder.
    mapEmbedUrl: "",

    social: {
        instagram: "#",                          // e.g. "https://instagram.com/rapicoiffure"
        facebook: "#",
        tiktok: "#"
    }
};


/* --------------------------------------------------------------------------
   3. BARBERS  ✂  change names and photos here
   Put the photos in the "images" folder (portrait photos work best, 4:5).
   If a photo is missing, an elegant placeholder is shown instead.
   -------------------------------------------------------------------------- */
const barbers = [
    {
        name: "BARBER NAME 1",
        image: "images/barber1.jpg",
        id: "barber-1",                          // internal id, do not change after bookings exist
        role: { fr: "Fondateur & maître barbier", en: "Founder & master barber" },
        bio: {
            fr: "Coupes classiques, dégradés précis et taille de barbe au rasoir.",
            en: "Classic cuts, precise fades and straight-razor beard work."
        }
    },
    {
        name: "BARBER NAME 2",
        image: "images/barber2.jpg",
        id: "barber-2",
        role: { fr: "Barbier", en: "Barber" },
        bio: {
            fr: "Spécialiste des skin fades et des coupes modernes texturées.",
            en: "Skin fade specialist with a sharp eye for modern textured cuts."
        }
    },
    {
        name: "BARBER NAME 3",
        image: "images/barber3.jpg",
        id: "barber-3",
        role: { fr: "Barbier", en: "Barber" },
        bio: {
            fr: "Barbe, contours et coiffage — le souci du détail avant tout.",
            en: "Beards, line-ups and styling — detail comes first."
        }
    }
];


/* --------------------------------------------------------------------------
   4. SERVICES & PRICES
   price:    a number (e.g. 35) — or null to show "On request"
   duration: minutes. Longer services automatically block the following
             time slots for that barber (e.g. 60 min = two 30-min slots).
   icon:     scissors | clipper | razor | beard | comb | drop | child | sparkle | plus
   -------------------------------------------------------------------------- */
const services = [
    {
        id: "haircut",
        icon: "scissors",
        price: 35,                               // PLACEHOLDER PRICE — change me
        duration: 30,
        name: { fr: "Coupe", en: "Haircut" },
        description: {
            fr: "Coupe aux ciseaux et à la tondeuse, finition et coiffage.",
            en: "Scissor and clipper cut, finished and styled."
        }
    },
    {
        id: "haircut-beard",
        icon: "beard",
        price: 50,                               // PLACEHOLDER PRICE
        duration: 60,
        name: { fr: "Coupe + Barbe", en: "Haircut + Beard" },
        description: {
            fr: "La coupe complète avec taille et contours de barbe.",
            en: "The full haircut with beard trim and line-up."
        }
    },
    {
        id: "beard-trim",
        icon: "razor",
        price: 20,                               // PLACEHOLDER PRICE
        duration: 30,
        name: { fr: "Taille de barbe", en: "Beard Trim" },
        description: {
            fr: "Mise à longueur, contours nets et huile à barbe.",
            en: "Trimmed to length, clean lines and beard oil."
        }
    },
    {
        id: "skin-fade",
        icon: "clipper",
        price: 40,                               // PLACEHOLDER PRICE
        duration: 45,
        name: { fr: "Skin fade (dégradé à blanc)", en: "Skin Fade" },
        description: {
            fr: "Dégradé jusqu'à la peau, transitions invisibles.",
            en: "Faded down to the skin with seamless transitions."
        }
    },
    {
        id: "haircut-shampoo",
        icon: "drop",
        price: 40,                               // PLACEHOLDER PRICE
        duration: 45,
        name: { fr: "Coupe + Shampoing", en: "Haircut + Shampoo" },
        description: {
            fr: "Shampoing et massage du cuir chevelu, puis la coupe.",
            en: "Shampoo and scalp massage, followed by the cut."
        }
    },
    {
        id: "kids-haircut",
        icon: "child",
        price: 25,                               // PLACEHOLDER PRICE
        duration: 30,
        name: { fr: "Coupe enfant", en: "Kids Haircut" },
        description: {
            fr: "Pour les enfants jusqu'à 12 ans.",
            en: "For children up to 12 years old."
        }
    },
    {
        id: "full-service",
        icon: "sparkle",
        price: 60,                               // PLACEHOLDER PRICE
        duration: 75,
        name: { fr: "Coupe + Barbe + Shampoing", en: "Haircut + Beard + Shampoo" },
        description: {
            fr: "Le soin complet : shampoing, coupe, barbe et serviette chaude.",
            en: "The full treatment: shampoo, cut, beard and hot towel."
        }
    },
    {
        id: "styling",
        icon: "comb",
        price: 20,                               // PLACEHOLDER PRICE
        duration: 30,
        name: { fr: "Coiffage", en: "Hair Styling" },
        description: {
            fr: "Brushing et coiffage pour un événement ou une soirée.",
            en: "Blow-dry and styling for an event or a night out."
        }
    },
    {
        id: "beard-shaping",
        icon: "razor",
        price: 25,                               // PLACEHOLDER PRICE
        duration: 30,
        name: { fr: "Contour de barbe", en: "Beard Shaping" },
        description: {
            fr: "Tracé au rasoir et serviette chaude pour une barbe sculptée.",
            en: "Straight-razor shaping and hot towel for a sculpted beard."
        }
    },
    {
        id: "custom",
        icon: "plus",
        price: null,                             // null = "On request"
        duration: 30,
        name: { fr: "Autre / service sur mesure", en: "Other / Custom Service" },
        description: {
            fr: "Décrivez votre demande dans les remarques, nous vous répondrons.",
            en: "Describe what you need in the notes and we'll get back to you."
        }
    }
];


/* --------------------------------------------------------------------------
   5. GALLERY — replace the files in the "images" folder
   -------------------------------------------------------------------------- */
const galleryImages = [
    { src: "images/gallery1.jpg", alt: { fr: "Dégradé net", en: "Clean fade" } },
    { src: "images/gallery2.jpg", alt: { fr: "Taille de barbe", en: "Beard trim" } },
    { src: "images/gallery3.jpg", alt: { fr: "Le salon", en: "The shop" } },
    { src: "images/gallery4.jpg", alt: { fr: "Coupe classique", en: "Classic cut" } },
    { src: "images/gallery5.jpg", alt: { fr: "Rasage à la serviette chaude", en: "Hot towel shave" } },
    { src: "images/gallery6.jpg", alt: { fr: "Finitions", en: "Finishing touches" } }
];


/* --------------------------------------------------------------------------
   6. OTHER IMAGES
   -------------------------------------------------------------------------- */
const siteImages = {
    logo: "assets/img/logo-full.png",
    logoWordmark: "assets/img/logo-wordmark.png",
    about: "images/about.jpg"                   // photo in the "About" section
};
