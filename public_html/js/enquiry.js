/* =========================================================
   GreenReach Community Garden - enquiry.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   Enquiry form (volunteer OR sponsor).
     1. The form changes depending on the enquiry type
     2. A live cost estimate updates for sponsors
     3. JavaScript validation (validation.js) with clear errors
     4. On a valid submit the enquiry is processed
        asynchronously: availability is loaded with fetch()
        (AJAX) and a personalised response is shown with the
        cost, availability and next steps - without reloading
        the page.
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    var form = document.getElementById("enquiry-form");
    if (!form || !GR.validate || !GR.util) { return; }

    var el = GR.util.el;
    var checks = GR.validate.checks;

    var volunteerSection = document.getElementById("volunteer-fields");
    var sponsorSection = document.getElementById("sponsor-fields");
    var formWrap = document.getElementById("enquiry-form-wrap");
    var resultBox = document.getElementById("enquiry-result");
    var statusBox = document.getElementById("enquiry-status");
    var estimateBox = document.getElementById("cost-estimate");
    var quantityLabel = document.getElementById("quantity-label");
    var quantityHint = document.getElementById("quantity-hint");
    var submitButton = document.getElementById("enquiry-submit");

    /* ---------- Date limits for the start-date field ---------- */
    var startInput = form.elements.volStart;
    var today = GR.util.today();
    var latest = new Date(today.getTime());
    latest.setDate(latest.getDate() + 365);
    startInput.min = GR.util.toISO(today);
    startInput.max = GR.util.toISO(latest);

    /* ---------- Validation rules ---------- */
    var fields = [
        { name: "fullName", checks: [
            checks.required("Please enter your full name."),
            checks.minLength(2, "Your name must be at least 2 characters."),
            checks.personName("Use letters, spaces, hyphens or apostrophes only (maximum 60 characters).")
        ] },
        { name: "email", checks: [
            checks.required("Please enter your email address."),
            checks.email("Enter a valid email address, for example name@example.com.")
        ] },
        { name: "phone", checks: [
            checks.phoneZA("Enter a valid South African number, for example 082 123 4567 or +27 82 123 4567.")
        ] },
        { name: "enquiryType", checks: [ checks.required("Please choose whether you want to volunteer or sponsor.") ] },

        /* Volunteer-only fields */
        { name: "volArea", checks: [ checks.required("Please choose an area you would like to help in.") ] },
        { name: "volSlot", checks: [ checks.required("Please choose when you are available.") ] },
        { name: "volStart", checks: [
            checks.required("Please choose a start date."),
            checks.futureDate(365, {
                format: "Enter a valid date.",
                past: "The start date cannot be in the past.",
                future: "Please choose a date within the next 12 months."
            })
        ] },
        { name: "volHours", checks: [
            checks.required("Please enter how many hours per week you can give."),
            checks.integerBetween(1, 20, "Enter a whole number of hours between 1 and 20.")
        ] },

        /* Sponsor-only fields */
        { name: "tier", checks: [ checks.required("Please choose a sponsorship tier.") ] },
        { name: "quantity", checks: [
            checks.required("Please enter how many months or workshops you want to sponsor."),
            checks.integerBetween(1, 12, "Enter a whole number between 1 and 12.")
        ] },
        { name: "payMethod", checks: [ checks.required("Please choose a preferred payment method.") ] },

        { name: "message", checks: [
            checks.maxLength(500, "Your message must be 500 characters or fewer.")
        ] },
        { name: "consent", checks: [ checks.required("Please tick the box to confirm you agree before sending.") ] }
    ];

    var validator = GR.validate.attach(form, {
        fields: fields,
        summary: document.getElementById("enquiry-summary"),
        onValid: handleValid
    });

    /* ---------- 1. Show the fields that match the enquiry type ---------- */
    function clearErrors(section) {
        section.querySelectorAll(".field-error").forEach(function (box) { box.textContent = ""; });
        section.querySelectorAll("[aria-invalid]").forEach(function (c) { c.removeAttribute("aria-invalid"); });
        section.querySelectorAll(".has-error, .is-valid").forEach(function (w) { w.classList.remove("has-error", "is-valid"); });
    }

    function setSection(section, visible) {
        section.hidden = !visible;
        section.disabled = !visible;
        if (!visible) { clearErrors(section); }
    }

    function applyType() {
        var type = form.elements.enquiryType.value;
        setSection(volunteerSection, type === "volunteer");
        setSection(sponsorSection, type === "sponsor");
        updateEstimate();
    }

    Array.prototype.forEach.call(form.elements.enquiryType, function (radio) {
        radio.addEventListener("change", applyType);
    });

    /* ---------- 2. Live sponsor cost estimate ---------- */
    function currentTier() {
        var id = form.elements.tier.value;
        return GR.tiers.filter(function (t) { return t.id === id; })[0] || null;
    }

    function updateEstimate() {
        var tier = currentTier();
        if (tier) {
            var perMonth = tier.unit === "month";
            quantityLabel.firstChild.nodeValue = perMonth ? "Number of months " : "Number of workshops ";
            quantityHint.textContent = perMonth
                ? "How many months would you like to sponsor (1 to 12)?"
                : "How many workshops would you like to fund (1 to 12)?";
        }
        var qty = Number(form.elements.quantity.value);
        if (tier && /^\d+$/.test(form.elements.quantity.value) && qty >= 1 && qty <= 12) {
            estimateBox.textContent = "Estimated cost: " + GR.util.money(tier.price * qty) +
                " (" + qty + " x " + GR.util.money(tier.price) + " per " + tier.unit + ")";
        } else if (tier) {
            estimateBox.textContent = "Estimated cost: " + GR.util.money(tier.price) + " per " + tier.unit + ".";
        } else {
            estimateBox.textContent = "Choose a tier to see an estimated cost.";
        }
    }

    Array.prototype.forEach.call(form.elements.tier, function (radio) {
        radio.addEventListener("change", updateEstimate);
    });
    form.elements.quantity.addEventListener("input", updateEstimate);

    /* ---------- 3. Pre-select options from a link ----------
       e.g. enquiry.html?type=sponsor&tier=bed (used by the donate page) */
    function preselect() {
        var type = GR.util.param("type");
        var tier = GR.util.param("tier");
        Array.prototype.forEach.call(form.elements.enquiryType, function (radio) {
            if (radio.value === type) { radio.checked = true; }
        });
        Array.prototype.forEach.call(form.elements.tier, function (radio) {
            if (radio.value === tier) { radio.checked = true; }
        });
        if (tier && !type) {
            form.elements.enquiryType.value = "sponsor";
        }
        applyType();
    }

    /* ---------- 4. Asynchronous processing (AJAX) ---------- */
    async function loadAvailability() {
        /* Browsers do not allow fetch() for pages opened straight from a folder */
        if (window.location.protocol === "file:") {
            return { data: GR.defaultAvailability, live: false };
        }
        try {
            var response = await fetch("data/availability.json", { cache: "no-cache" });
            if (!response.ok) { throw new Error("HTTP " + response.status); }
            return { data: await response.json(), live: true };
        } catch (error) {
            /* Opened from a folder or offline: use the built-in copy */
            return { data: GR.defaultAvailability, live: false };
        }
    }

    /* The first Saturday of a month at or after the chosen start date */
    function nextInduction(startDate) {
        for (var offset = 0; offset < 4; offset++) {
            var first = new Date(startDate.getFullYear(), startDate.getMonth() + offset, 1);
            var shift = (6 - first.getDay() + 7) % 7;
            var saturday = new Date(first.getFullYear(), first.getMonth(), 1 + shift);
            if (saturday >= startDate) { return saturday; }
        }
        return startDate;
    }

    function makeReference() {
        var digits = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
        return "GR-" + new Date().getFullYear() + "-" + digits;
    }

    async function processEnquiry(values) {
        var availability = await loadAvailability();
        var firstName = values.fullName.split(/\s+/)[0];
        var result = {
            reference: makeReference(),
            firstName: firstName,
            type: values.enquiryType,
            rows: [],
            notice: null,
            steps: [],
            live: availability.live
        };

        if (values.enquiryType === "sponsor") {
            var tier = GR.tiers.filter(function (t) { return t.id === values.tier; })[0];
            var qty = Number(values.quantity);
            var slot = availability.data.sponsorSlots[tier.id];
            var remaining = Math.max(slot.capacity - slot.taken, 0);
            var unitWord = tier.unit === "month" ? (qty === 1 ? "month" : "months") : (qty === 1 ? "workshop" : "workshops");

            result.title = "Thank you, " + firstName + "! Your sponsorship enquiry is received.";
            result.rows = [
                ["Tier", tier.name + " - " + tier.blurb],
                ["Commitment", qty + " " + unitWord],
                ["Cost", GR.util.money(tier.price) + " per " + tier.unit],
                ["Total", GR.util.money(tier.price * qty)],
                ["Availability", remaining > 0
                    ? remaining + " of " + slot.capacity + " " + tier.name + " places are still available"
                    : "All " + slot.capacity + " " + tier.name + " places are currently taken"],
                ["Preferred payment", values.payMethod]
            ];
            if (remaining === 0) {
                result.notice = { level: "warn", text: "This tier is full at the moment, so you have been added to the waiting list. A cheaper tier may still have space - we will mention the options in our reply." };
            } else if (remaining <= 3) {
                result.notice = { level: "warn", text: "Only " + remaining + (remaining === 1 ? " place is" : " places are") + " left in this tier. We will hold one for you for 7 days." };
            } else {
                result.notice = { level: "good", text: "Good news - there is space in this tier, so your sponsorship can start straight away." };
            }
            result.steps = [
                "We will email " + values.email + " within 2 working days with payment details for " + values.payMethod + ".",
                "Once payment is confirmed you will receive a receipt and a welcome pack.",
                "You will get a short update with photos from the garden each quarter."
            ];
        } else {
            var areaLabel = GR.volunteerAreas[values.volArea];
            var slotLabel = GR.timeSlots[values.volSlot];
            var places = availability.data.volunteerSlots[values.volArea][values.volSlot];
            var startDate = GR.util.parseISO(values.volStart);
            var induction = nextInduction(startDate);
            var hours = Number(values.volHours);

            result.title = "Thank you, " + firstName + "! Your volunteer enquiry is received.";
            result.rows = [
                ["Area", areaLabel],
                ["Time", slotLabel],
                ["Start date", GR.util.formatDate(startDate)],
                ["Cost", "Free - volunteering costs nothing"],
                ["Availability", places > 0
                    ? places + (places === 1 ? " place is" : " places are") + " open for this time"
                    : "This time is full right now"],
                ["Your commitment", hours + (hours === 1 ? " hour" : " hours") + " per week (about " + (hours * 26) + " hours over six months)"],
                ["Your induction", GR.util.formatDate(induction) + " at 09:00, Main Community Garden"]
            ];
            if (places === 0) {
                var best = null;
                Object.keys(availability.data.volunteerSlots[values.volArea]).forEach(function (key) {
                    var count = availability.data.volunteerSlots[values.volArea][key];
                    if (key !== values.volSlot && (!best || count > best.count)) { best = { key: key, count: count }; }
                });
                result.notice = { level: "warn", text: "That time is full, so you are on the waiting list. " +
                    (best && best.count > 0 ? "We suggest " + GR.timeSlots[best.key] + ", which has " + best.count + " places open." : "We will contact you when a place opens.") };
            } else {
                result.notice = { level: "good", text: "Good news - there is space for you in this team." };
            }
            result.steps = [
                "Come to the induction on " + GR.util.formatDate(induction) + ". Wear closed shoes and bring a hat and a bottle of water.",
                "Our volunteer coordinator will contact you at " + values.email + " within 2 working days to confirm your team.",
                "Your first shift is on or after " + GR.util.formatDate(startDate) + "."
            ];
        }
        return result;
    }

    /* ---------- Show the response ---------- */
    function renderResult(result) {
        resultBox.textContent = "";

        var list = el("dl", { "class": "result-list" });
        result.rows.forEach(function (row) {
            list.appendChild(el("dt", { text: row[0] }));
            list.appendChild(el("dd", { text: row[1] }));
        });

        var steps = el("ol", { "class": "result-steps" });
        result.steps.forEach(function (step) { steps.appendChild(el("li", { text: step })); });

        var heading = el("h2", { "class": "result-title", id: "result-title", tabindex: "-1", text: result.title });
        var print = el("button", { type: "button", "class": "btn secondary", text: "Print or save this summary" });
        print.addEventListener("click", function () { window.print(); });
        var again = el("button", { type: "button", "class": "btn", text: "Make another enquiry" });
        again.addEventListener("click", function () {
            resultBox.hidden = true;
            formWrap.hidden = false;
            form.reset();
            applyType();
            statusBox.textContent = "";
            form.elements.fullName.focus();
        });

        resultBox.appendChild(heading);
        resultBox.appendChild(el("p", { "class": "result-ref", text: "Reference number: " + result.reference }));
        if (result.notice) {
            resultBox.appendChild(el("p", { "class": "result-notice is-" + result.notice.level, role: "status", text: result.notice.text }));
        }
        resultBox.appendChild(list);
        resultBox.appendChild(el("h3", { text: "What happens next" }));
        resultBox.appendChild(steps);
        resultBox.appendChild(el("p", { "class": "result-source", text: result.live
            ? "Availability shown is live from our latest figures."
            : "Availability shown is from our latest saved figures." }));
        resultBox.appendChild(el("div", { "class": "cta-row" }, [print, again]));

        formWrap.hidden = true;
        resultBox.hidden = false;
        heading.focus();
        resultBox.scrollIntoView({ behavior: GR.util.reduceMotion ? "auto" : "smooth", block: "start" });
    }

    function handleValid(values) {
        submitButton.disabled = true;
        submitButton.textContent = "Checking availability...";
        statusBox.textContent = "Checking availability and preparing your response...";
        processEnquiry(values).then(renderResult).catch(function () {
            statusBox.textContent = "Sorry, something went wrong while processing your enquiry. Please try again or use the contact page.";
        }).then(function () {
            submitButton.disabled = false;
            submitButton.textContent = "Send enquiry";
        });
    }

    form.addEventListener("reset", function () { window.setTimeout(applyType, 0); });

    /* Expose pure helpers so they can be tested */
    GR.enquiry = { nextInduction: nextInduction };

    preselect();
})();
