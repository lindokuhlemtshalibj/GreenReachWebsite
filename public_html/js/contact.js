/* =========================================================
   GreenReach Community Garden - contact.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   General contact form.
     1. JavaScript validation (validation.js) including a
        rule that links two fields: if the visitor wants a
        phone reply, a phone number becomes required.
     2. Once the form is valid the details are compiled into
        an email addressed to the recipient set in data.js.
     3. The email is opened in the visitor's email app, and
        a panel shows the full email with extra options:
        open in Gmail, copy the text, or go back and edit.
   A static website has no mail server, so the email is sent
   from the visitor's own email account. This keeps their
   details private and means no passwords are stored in the
   public code.
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    var form = document.getElementById("contact-form");
    if (!form || !GR.validate || !GR.util || !GR.config) { return; }

    var el = GR.util.el;
    var checks = GR.validate.checks;

    var formWrap = document.getElementById("contact-form-wrap");
    var readyBox = document.getElementById("email-ready");
    var statusBox = document.getElementById("contact-status");

    var TYPE_LABELS = {
        general: "General question",
        event: "Question about an event",
        feedback: "Feedback or compliment",
        partnership: "Partnership or media",
        problem: "Report a problem"
    };

    /* ---------- Validation rules ---------- */
    var fields = [
        { name: "contactName", checks: [
            checks.required("Please enter your full name."),
            checks.minLength(2, "Your name must be at least 2 characters."),
            checks.personName("Use letters, spaces, hyphens or apostrophes only (maximum 60 characters).")
        ] },
        { name: "contactEmail", checks: [
            checks.required("Please enter your email address."),
            checks.email("Enter a valid email address, for example name@example.com.")
        ] },
        { name: "contactPhone", checks: [
            checks.phoneZA("Enter a valid South African number, for example 082 123 4567 or +27 82 123 4567."),
            /* Linked rule: a phone reply needs a phone number */
            function (value) {
                var wantsPhone = form.elements.replyMethod.value === "phone";
                return wantsPhone && String(value).trim() === ""
                    ? "Please enter a phone number, or choose email as your reply method."
                    : "";
            }
        ] },
        { name: "replyMethod", checks: [ checks.required("Please choose how you would like us to reply.") ] },
        { name: "messageType", checks: [ checks.required("Please choose the type of message.") ] },
        { name: "contactSubject", checks: [
            checks.required("Please enter a subject."),
            checks.minLength(5, "The subject must be at least 5 characters."),
            checks.maxLength(80, "The subject must be 80 characters or fewer.")
        ] },
        { name: "contactMessage", checks: [
            checks.required("Please type your message."),
            checks.minLength(20, "Please write at least 20 characters so we can help you properly."),
            checks.maxLength(800, "Your message must be 800 characters or fewer.")
        ] },
        { name: "contactConsent", checks: [ checks.required("Please tick the box to confirm you agree before sending.") ] }
    ];

    var validator = GR.validate.attach(form, {
        fields: fields,
        summary: document.getElementById("contact-summary"),
        onValid: handleValid
    });

    /* When the reply method changes the phone rule changes too */
    Array.prototype.forEach.call(form.elements.replyMethod, function (radio) {
        radio.addEventListener("change", function () { validator.checkField(fields[2]); });
    });

    /* ---------- Pre-fill from links (events page: ?topic=event&subject=...) ---------- */
    var topic = GR.util.param("topic");
    var subject = GR.util.param("subject");
    if (topic && TYPE_LABELS[topic]) { form.elements.messageType.value = topic; }
    if (subject) { form.elements.contactSubject.value = subject.slice(0, 80); }

    /* ---------- Compile the email ---------- */
    function compileEmail(values) {
        var typeLabel = TYPE_LABELS[values.messageType] || "General question";
        var subjectLine = "[" + typeLabel + "] " + values.contactSubject;
        var lines = [
            "Hello GreenReach team,",
            "",
            values.contactMessage,
            "",
            "----------------------------------------",
            "Name: " + values.contactName,
            "Email: " + values.contactEmail,
            "Phone: " + (values.contactPhone || "not provided"),
            "Preferred reply: " + (values.replyMethod === "phone" ? "Phone" : "Email"),
            "Message type: " + typeLabel,
            "Sent from the GreenReach website contact form on " + GR.util.formatDate(new Date()),
            "----------------------------------------"
        ];
        return { to: GR.config.recipientEmail, subject: subjectLine, body: lines.join("\r\n") };
    }

    function mailtoUrl(email) {
        return "mailto:" + email.to + "?subject=" + encodeURIComponent(email.subject) + "&body=" + encodeURIComponent(email.body);
    }

    function gmailUrl(email) {
        return "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email.to) +
            "&su=" + encodeURIComponent(email.subject) + "&body=" + encodeURIComponent(email.body);
    }

    /* Copy text to the clipboard, with a fallback for older browsers */
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var area = el("textarea", { "aria-hidden": "true", tabindex: "-1" });
            area.value = text;
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            var ok = false;
            try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
            document.body.removeChild(area);
            if (ok) { resolve(); } else { reject(new Error("copy failed")); }
        });
    }

    /* ---------- Show the compiled email ---------- */
    function showEmail(email) {
        readyBox.textContent = "";

        var heading = el("h2", { id: "email-ready-title", tabindex: "-1", text: "Your email is ready to send" });
        var intro = el("p", { "class": "lede",
            text: "We have tried to open your email app with this message already written. If nothing opened, use one of the buttons below." });

        var details = el("dl", { "class": "result-list" }, [
            el("dt", { text: "To" }), el("dd", { text: email.to }),
            el("dt", { text: "Subject" }), el("dd", { text: email.subject })
        ]);
        var preview = el("pre", { "class": "email-preview", "aria-label": "Email message", text: email.body.replace(/\r\n/g, "\n") });

        var mailLink = el("a", { "class": "btn", id: "mailto-link", href: mailtoUrl(email), text: "Open in my email app" });
        var gmailLink = el("a", { "class": "btn secondary", id: "gmail-link", href: gmailUrl(email),
            target: "_blank", rel: "noopener noreferrer", text: "Open in Gmail" });
        var copyButton = el("button", { type: "button", "class": "btn secondary", text: "Copy email text" });
        var editButton = el("button", { type: "button", "class": "btn secondary", text: "Edit my message" });
        var copyStatus = el("p", { "class": "copy-status", role: "status" });

        copyButton.addEventListener("click", function () {
            var full = "To: " + email.to + "\nSubject: " + email.subject + "\n\n" + email.body.replace(/\r\n/g, "\n");
            copyText(full).then(function () {
                copyStatus.textContent = "Email text copied. You can paste it into any email program.";
            }).catch(function () {
                copyStatus.textContent = "Copying was blocked by your browser. Please select the text above and copy it manually.";
            });
        });

        editButton.addEventListener("click", function () {
            readyBox.hidden = true;
            formWrap.hidden = false;
            statusBox.textContent = "";
            form.elements.contactMessage.focus();
        });

        readyBox.appendChild(heading);
        readyBox.appendChild(intro);
        readyBox.appendChild(details);
        readyBox.appendChild(preview);
        readyBox.appendChild(el("div", { "class": "cta-row" }, [mailLink, gmailLink, copyButton, editButton]));
        readyBox.appendChild(copyStatus);

        formWrap.hidden = true;
        readyBox.hidden = false;
        heading.focus();

        /* Open the visitor's email app straight away (this runs inside the
           submit click, so the browser treats it as a user action) */
        mailLink.click();
    }

    function handleValid(values) {
        var email = compileEmail(values);
        statusBox.textContent = "Your message was checked and the email has been prepared.";
        showEmail(email);
    }

    GR.contact = { compileEmail: compileEmail, mailtoUrl: mailtoUrl };
})();
