/* ==========================================================================
   TRANSLATIONS — French (default) and English
   Every text on the website lives here. Edit the wording freely,
   but keep the keys (the part before the colon) unchanged.
   {name}, {n}, {date} … are replaced automatically.
   ========================================================================== */

const translations = {
    fr: {
        /* Navigation */
        "nav.home": "Accueil",
        "nav.about": "À propos",
        "nav.services": "Services",
        "nav.barbers": "Nos barbiers",
        "nav.gallery": "Galerie",
        "nav.book": "Réserver",
        "nav.contact": "Contact",
        "nav.openMenu": "Ouvrir le menu",
        "nav.closeMenu": "Fermer le menu",
        "nav.language": "Langue",

        /* Hero */
        "hero.title": "Votre style.<br>Notre savoir-faire.",
        "hero.subtitle": "Coupes, dégradés et barbe par trois barbiers passionnés. Réservez en ligne, nous confirmons par WhatsApp.",
        "hero.ctaBook": "Prendre rendez-vous",
        "hero.ctaServices": "Découvrir nos services",
        "hero.factHours": "Du lundi au samedi",
        "hero.factBarbers": "Trois barbiers",
        "hero.factBarbersValue": "Choisissez le vôtre",
        "hero.factConfirm": "Confirmation",
        "hero.factConfirmValue": "Par WhatsApp",

        /* About */
        "about.title": "À propos",
        "about.lead": "Un salon de barbier où l'on prend le temps de bien faire.",
        "about.p1": "Chez Rapi Coiffure, chaque rendez-vous commence par une vraie discussion : ce que vous aimez, ce que vous voulez changer, le temps que vous avez chaque matin. Ensuite, on coupe.",
        "about.p2": "Coupes classiques, dégradés modernes, barbe taillée au rasoir et serviette chaude : nos barbiers travaillent avec précision et adaptent chaque coupe à votre visage et à votre style de vie.",
        "about.point1": "Coupes & dégradés",
        "about.point1Text": "Des classiques intemporels aux skin fades les plus nets.",
        "about.point2": "Barbe au rasoir",
        "about.point2Text": "Tracé, contours et serviette chaude.",
        "about.point3": "Service personnalisé",
        "about.point3Text": "Votre barbier, votre créneau, votre style.",

        /* Services */
        "services.title": "Services & tarifs",
        "services.intro": "Prix indicatifs, confirmés lors de la validation de votre rendez-vous.",
        "services.book": "Réserver ce service",
        "price.onRequest": "Sur demande",
        "duration.min": "{n} min",

        /* Barbers */
        "barbers.title": "Nos barbiers",
        "barbers.intro": "Trois styles, une même exigence. Choisissez le barbier qui vous correspond.",
        "barbers.book": "Réserver avec ce barbier",

        /* Booking */
        "booking.title": "Réserver",
        "booking.intro": "Six étapes, environ une minute. Votre rendez-vous est confirmé ensuite par notre équipe via WhatsApp.",
        "booking.stepOf": "Étape {n} sur 6",
        "step.barber": "Barbier",
        "step.service": "Service",
        "step.date": "Date",
        "step.time": "Heure",
        "step.details": "Coordonnées",
        "step.summary": "Récapitulatif",
        "booking.h.barber": "Choisissez votre barbier",
        "booking.h.service": "Choisissez un service",
        "booking.h.date": "Choisissez une date",
        "booking.h.time": "Choisissez une heure",
        "booking.h.details": "Vos coordonnées",
        "booking.h.summary": "Vérifiez votre demande",
        "booking.back": "Retour",
        "booking.continue": "Continuer",
        "booking.with": "avec {name}",

        /* Calendar */
        "cal.prev": "Mois précédent",
        "cal.next": "Mois suivant",
        "cal.note": "Ouvert du lundi au samedi. Fermé le dimanche.",

        /* Time slots */
        "time.available": "Disponible",
        "time.unavailable": "Indisponible",
        "time.selected": "Sélectionné",
        "time.for": "{barber}, {date}",
        "time.duration": "Durée du service : {n} min",
        "time.none": "Plus aucun créneau libre ce jour-là pour ce barbier. Choisissez une autre date ou un autre barbier.",
        "time.loading": "Chargement des disponibilités…",

        /* Form */
        "form.name": "Nom complet",
        "form.phone": "Téléphone",
        "form.email": "E-mail",
        "form.notes": "Remarques",
        "form.optional": "facultatif",
        "form.namePh": "Prénom et nom",
        "form.phonePh": "+41 76 123 45 67",
        "form.emailPh": "vous@exemple.ch",
        "form.notesPh": "Longueur souhaitée, photo de référence, demande particulière…",
        "err.nameRequired": "Indiquez votre nom complet.",
        "err.phoneRequired": "Indiquez votre numéro de téléphone.",
        "err.phoneInvalid": "Numéro invalide. Exemple : +41 76 123 45 67.",
        "err.emailInvalid": "Adresse e-mail invalide. Exemple : nom@exemple.ch.",
        "err.slotTaken": "Ce créneau vient d'être réservé par un autre client. Choisissez une autre heure.",
        "err.generic": "La demande n'a pas pu être enregistrée. Réessayez, ou écrivez-nous directement sur WhatsApp.",

        /* Summary */
        "sum.barber": "Barbier",
        "sum.service": "Service",
        "sum.date": "Date",
        "sum.time": "Heure",
        "sum.duration": "Durée",
        "sum.price": "Prix",
        "sum.name": "Nom",
        "sum.phone": "Téléphone",
        "sum.email": "E-mail",
        "sum.notes": "Remarques",
        "sum.status": "Statut",
        "status.pending": "En attente de confirmation",
        "status.confirmed": "Confirmé",
        "status.cancelled": "Annulé",
        "sum.notice": "Ce rendez-vous n'est pas encore confirmé. Après l'envoi, WhatsApp s'ouvre avec votre demande déjà rédigée : appuyez simplement sur Envoyer. Notre équipe vous confirmera le rendez-vous par WhatsApp.",
        "sum.submit": "Confirmer la demande de rendez-vous",
        "sum.sending": "Envoi en cours…",

        /* Success */
        "success.title": "Demande envoyée !",
        "success.text": "Votre demande de rendez-vous a été envoyée avec succès. Veuillez attendre la confirmation de notre équipe via WhatsApp.",
        "success.pending": "Votre demande de rendez-vous a été envoyée. Votre rendez-vous sera confirmé après validation.",
        "success.ref": "Référence",
        "success.whatsappHint": "WhatsApp ne s'est pas ouvert ? Envoyez votre demande ici :",
        "success.whatsappBtn": "Envoyer via WhatsApp",
        "success.home": "Retour à l'accueil",

        /* Gallery */
        "gallery.title": "Galerie",
        "gallery.close": "Fermer",

        /* Contact */
        "contact.title": "Contact",
        "contact.intro": "Une question, un changement de rendez-vous ? Écrivez-nous sur WhatsApp, c'est le plus rapide.",
        "contact.whatsapp": "Écrire sur WhatsApp",
        "contact.phone": "Téléphone",
        "contact.email": "E-mail",
        "contact.address": "Adresse",
        "contact.hours": "Horaires",
        "contact.follow": "Suivez-nous",
        "contact.map": "Plan d'accès bientôt disponible",
        "hours.closed": "Fermé",
        "hours.today": "aujourd'hui",
        "day.0": "Dimanche", "day.1": "Lundi", "day.2": "Mardi", "day.3": "Mercredi",
        "day.4": "Jeudi", "day.5": "Vendredi", "day.6": "Samedi",

        /* Footer */
        "footer.rights": "Tous droits réservés.",

        /* WhatsApp message */
        "wa.title": "RAPI COIFFURE — NOUVELLE DEMANDE DE RENDEZ-VOUS",
        "wa.barber": "Barbier",
        "wa.service": "Service",
        "wa.date": "Date",
        "wa.time": "Heure",
        "wa.duration": "Durée",
        "wa.price": "Prix",
        "wa.name": "Nom du client",
        "wa.phone": "Téléphone",
        "wa.email": "E-mail",
        "wa.notes": "Remarques",
        "wa.ref": "Référence",
        "wa.status": "Statut",
        "wa.statusValue": "EN ATTENTE DE CONFIRMATION",
        "wa.hello": "Bonjour Rapi Coiffure, "
    },

    en: {
        /* Navigation */
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.barbers": "Our Barbers",
        "nav.gallery": "Gallery",
        "nav.book": "Book",
        "nav.contact": "Contact",
        "nav.openMenu": "Open menu",
        "nav.closeMenu": "Close menu",
        "nav.language": "Language",

        /* Hero */
        "hero.title": "Your style.<br>Our craft.",
        "hero.subtitle": "Haircuts, fades and beard work by three dedicated barbers. Book online, we confirm on WhatsApp.",
        "hero.ctaBook": "Book an appointment",
        "hero.ctaServices": "Discover our services",
        "hero.factHours": "Monday to Saturday",
        "hero.factBarbers": "Three barbers",
        "hero.factBarbersValue": "Choose yours",
        "hero.factConfirm": "Confirmation",
        "hero.factConfirmValue": "Via WhatsApp",

        /* About */
        "about.title": "About us",
        "about.lead": "A barbershop that takes the time to get it right.",
        "about.p1": "At Rapi Coiffure, every appointment starts with a real conversation: what you like, what you want to change, how much time you have in the morning. Then we cut.",
        "about.p2": "Classic cuts, modern fades, straight-razor beard work and hot towels: our barbers work with precision and fit every cut to your face and your lifestyle.",
        "about.point1": "Cuts & fades",
        "about.point1Text": "From timeless classics to the sharpest skin fades.",
        "about.point2": "Straight-razor beards",
        "about.point2Text": "Shaping, line-ups and hot towel.",
        "about.point3": "Personal service",
        "about.point3Text": "Your barber, your time, your style.",

        /* Services */
        "services.title": "Services & prices",
        "services.intro": "Guide prices, confirmed when your appointment is approved.",
        "services.book": "Book this service",
        "price.onRequest": "On request",
        "duration.min": "{n} min",

        /* Barbers */
        "barbers.title": "Our barbers",
        "barbers.intro": "Three styles, one standard. Choose the barber who suits you.",
        "barbers.book": "Book with this barber",

        /* Booking */
        "booking.title": "Book an appointment",
        "booking.intro": "Six steps, about a minute. Our team then confirms your appointment on WhatsApp.",
        "booking.stepOf": "Step {n} of 6",
        "step.barber": "Barber",
        "step.service": "Service",
        "step.date": "Date",
        "step.time": "Time",
        "step.details": "Details",
        "step.summary": "Summary",
        "booking.h.barber": "Choose your barber",
        "booking.h.service": "Choose a service",
        "booking.h.date": "Choose a date",
        "booking.h.time": "Choose a time",
        "booking.h.details": "Your details",
        "booking.h.summary": "Review your request",
        "booking.back": "Back",
        "booking.continue": "Continue",
        "booking.with": "with {name}",

        /* Calendar */
        "cal.prev": "Previous month",
        "cal.next": "Next month",
        "cal.note": "Open Monday to Saturday. Closed on Sundays.",

        /* Time slots */
        "time.available": "Available",
        "time.unavailable": "Unavailable",
        "time.selected": "Selected",
        "time.for": "{barber}, {date}",
        "time.duration": "Service duration: {n} min",
        "time.none": "No free times left that day for this barber. Choose another date or another barber.",
        "time.loading": "Loading availability…",

        /* Form */
        "form.name": "Full name",
        "form.phone": "Phone number",
        "form.email": "Email",
        "form.notes": "Notes",
        "form.optional": "optional",
        "form.namePh": "First and last name",
        "form.phonePh": "+41 76 123 45 67",
        "form.emailPh": "you@example.com",
        "form.notesPh": "Preferred length, reference photo, special request…",
        "err.nameRequired": "Enter your full name.",
        "err.phoneRequired": "Enter your phone number.",
        "err.phoneInvalid": "Invalid number. Example: +41 76 123 45 67.",
        "err.emailInvalid": "Invalid email address. Example: name@example.com.",
        "err.slotTaken": "This time was just booked by another customer. Choose another time.",
        "err.generic": "The request could not be saved. Try again, or message us directly on WhatsApp.",

        /* Summary */
        "sum.barber": "Barber",
        "sum.service": "Service",
        "sum.date": "Date",
        "sum.time": "Time",
        "sum.duration": "Duration",
        "sum.price": "Price",
        "sum.name": "Name",
        "sum.phone": "Phone",
        "sum.email": "Email",
        "sum.notes": "Notes",
        "sum.status": "Status",
        "status.pending": "Pending confirmation",
        "status.confirmed": "Confirmed",
        "status.cancelled": "Cancelled",
        "sum.notice": "This appointment is not confirmed yet. After you send it, WhatsApp opens with your request already written: just tap Send. Our team will confirm your appointment on WhatsApp.",
        "sum.submit": "Confirm Appointment Request",
        "sum.sending": "Sending…",

        /* Success */
        "success.title": "Request Sent!",
        "success.text": "Your appointment request has been sent successfully. Please wait for confirmation from our team via WhatsApp.",
        "success.pending": "Your appointment request has been sent. Your appointment will be confirmed after approval.",
        "success.ref": "Reference",
        "success.whatsappHint": "WhatsApp didn't open? Send your request here:",
        "success.whatsappBtn": "Send via WhatsApp",
        "success.home": "Back to Home",

        /* Gallery */
        "gallery.title": "Gallery",
        "gallery.close": "Close",

        /* Contact */
        "contact.title": "Contact",
        "contact.intro": "A question, or need to move an appointment? Message us on WhatsApp — it's the fastest way.",
        "contact.whatsapp": "Message us on WhatsApp",
        "contact.phone": "Phone",
        "contact.email": "Email",
        "contact.address": "Address",
        "contact.hours": "Opening hours",
        "contact.follow": "Follow us",
        "contact.map": "Map coming soon",
        "hours.closed": "Closed",
        "hours.today": "today",
        "day.0": "Sunday", "day.1": "Monday", "day.2": "Tuesday", "day.3": "Wednesday",
        "day.4": "Thursday", "day.5": "Friday", "day.6": "Saturday",

        /* Footer */
        "footer.rights": "All rights reserved.",

        /* WhatsApp message */
        "wa.title": "RAPI COIFFURE — NEW APPOINTMENT REQUEST",
        "wa.barber": "Barber",
        "wa.service": "Service",
        "wa.date": "Date",
        "wa.time": "Time",
        "wa.duration": "Duration",
        "wa.price": "Price",
        "wa.name": "Customer name",
        "wa.phone": "Phone",
        "wa.email": "Email",
        "wa.notes": "Notes",
        "wa.ref": "Reference",
        "wa.status": "Status",
        "wa.statusValue": "PENDING CONFIRMATION",
        "wa.hello": "Hello Rapi Coiffure, "
    }
};
