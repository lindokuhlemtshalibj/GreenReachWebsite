/* =========================================================
   GreenReach Community Garden - validation.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   A small, reusable form-validation engine shared by the
   enquiry form and the contact form.

   What it does
     - Runs a list of check functions on every field
     - Shows a clear message under the field (aria-invalid +
       aria-describedby for screen readers)
     - Validates a field as the user leaves it, then keeps
       re-checking while they correct it
     - Builds an error summary with links to each problem
     - Skips fields that are hidden or disabled
     - Updates live character counters
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});

    /* ---------------------------------------------------------
       CHECK FUNCTIONS
       Each factory returns a function(value) that gives back an
       error message, or an empty string when the value is fine.
       Optional fields pass when empty (only "required" objects).
       --------------------------------------------------------- */
    var checks = {
        required: function (message) {
            return function (value) { return String(value).trim() === "" ? message : ""; };
        },

        minLength: function (min, message) {
            return function (value) {
                var v = String(value).trim();
                return v !== "" && v.length < min ? message : "";
            };
        },

        maxLength: function (max, message) {
            return function (value) { return String(value).trim().length > max ? message : ""; };
        },

        pattern: function (regex, message) {
            return function (value) {
                var v = String(value).trim();
                return v !== "" && !regex.test(v) ? message : "";
            };
        },

        /* Letters (any language), spaces, apostrophes, hyphens and full stops */
        personName: function (message) {
            var re = /^[\p{L}][\p{L} '.\-]{1,59}$/u;
            return function (value) {
                var v = String(value).trim();
                return v !== "" && !re.test(v) ? message : "";
            };
        },

        email: function (message) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            return function (value) {
                var v = String(value).trim();
                return v !== "" && (!re.test(v) || v.length > 254) ? message : "";
            };
        },

        /* South African numbers: 0821234567, 082 123 4567, +27 82 123 4567 */
        phoneZA: function (message) {
            var re = /^(\+27|0027|0)[1-9][0-9]{8}$/;
            return function (value) {
                var digits = String(value).replace(/[\s\-()]/g, "");
                return digits !== "" && !re.test(digits) ? message : "";
            };
        },

        /* A real calendar date from today up to maxDaysAhead days away */
        futureDate: function (maxDaysAhead, messages) {
            return function (value) {
                if (value === "") { return ""; }
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) { return messages.format; }
                var date = GR.util.parseISO(value);
                if (GR.util.toISO(date) !== value) { return messages.format; }
                var today = GR.util.today();
                if (date < today) { return messages.past; }
                var latest = new Date(today.getTime());
                latest.setDate(latest.getDate() + maxDaysAhead);
                if (date > latest) { return messages.future; }
                return "";
            };
        },

        /* Whole number between min and max (inclusive) */
        integerBetween: function (min, max, message) {
            return function (value) {
                var v = String(value).trim();
                if (v === "") { return ""; }
                if (!/^\d+$/.test(v)) { return message; }
                var n = Number(v);
                return n < min || n > max ? message : "";
            };
        }
    };

    /* ---------------------------------------------------------
       HELPERS
       --------------------------------------------------------- */
    function controlsFor(form, name) {
        var found = form.elements[name];
        if (!found) { return []; }
        if (found.tagName) { return [found]; }            /* single control */
        return Array.prototype.slice.call(found);          /* radio group */
    }

    function valueOf(controls) {
        if (!controls.length) { return ""; }
        var first = controls[0];
        if (first.type === "radio") {
            var chosen = controls.filter(function (c) { return c.checked; })[0];
            return chosen ? chosen.value : "";
        }
        if (first.type === "checkbox") { return first.checked ? (first.value || "on") : ""; }
        return first.value;
    }

    /* A field is skipped when it sits in a hidden section or is disabled */
    function isActive(controls) {
        if (!controls.length) { return false; }
        if (controls[0].closest("[hidden]")) { return false; }
        return !controls[0].matches(":disabled");
    }

    /* ---------------------------------------------------------
       ATTACH: connect a schema to a form
       options: { fields: [{name, label, checks: [fn, ...]}],
                  summary: element, onValid: function(values) }
       --------------------------------------------------------- */
    function attach(form, options) {
        var fields = options.fields;
        var touched = {};

        function showError(field, controls, message) {
            var wrapper = controls[0].closest("[data-field]");
            var errorBox = document.getElementById(field.name + "-error");
            controls.forEach(function (control) {
                if (message) { control.setAttribute("aria-invalid", "true"); }
                else { control.removeAttribute("aria-invalid"); }
            });
            if (wrapper) {
                wrapper.classList.toggle("has-error", Boolean(message));
                wrapper.classList.toggle("is-valid", !message && Boolean(touched[field.name]) && valueOf(controls) !== "");
            }
            if (errorBox) { errorBox.textContent = message || ""; }
        }

        /* Returns the first error message for one field ("" if valid) */
        function checkField(field) {
            var controls = controlsFor(form, field.name);
            if (!controls.length) { return ""; }
            if (!isActive(controls)) { showError(field, controls, ""); return ""; }
            var value = valueOf(controls);
            var message = "";
            for (var i = 0; i < field.checks.length && !message; i++) {
                message = field.checks[i](value);
            }
            showError(field, controls, message);
            return message;
        }

        function renderSummary(problems) {
            var box = options.summary;
            if (!box) { return; }
            box.textContent = "";
            if (!problems.length) { box.hidden = true; return; }
            box.appendChild(GR.util.el("h2", {
                "class": "error-summary-title",
                text: "Please fix " + problems.length + (problems.length === 1 ? " problem" : " problems") + " before continuing:"
            }));
            var list = GR.util.el("ul");
            problems.forEach(function (problem) {
                var link = GR.util.el("a", { href: "#" + problem.id, text: problem.message });
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                    problem.control.focus();
                });
                list.appendChild(GR.util.el("li", {}, [link]));
            });
            box.appendChild(list);
            box.hidden = false;
        }

        function validateAll() {
            var problems = [];
            var values = {};
            fields.forEach(function (field) {
                touched[field.name] = true;
                var controls = controlsFor(form, field.name);
                var message = checkField(field);
                if (isActive(controls)) { values[field.name] = String(valueOf(controls)).trim(); }
                if (message) {
                    problems.push({ id: controls[0].id, message: message, control: controls[0] });
                }
            });
            renderSummary(problems);
            return { valid: problems.length === 0, values: values, problems: problems };
        }

        /* While a mouse button or finger is down, validation messages are held
           back. Otherwise an error message appearing on blur would push the
           "Send" button down between mouse-down and mouse-up, and the click
           would be lost. The held-back checks run just after the click. */
        var pointerDown = false;
        var deferred = [];
        function releasePointer() {
            pointerDown = false;
            if (!deferred.length) { return; }
            var waiting = deferred;
            deferred = [];
            window.setTimeout(function () {
                waiting.forEach(function (field) { checkField(field); });
            }, 0);
        }
        document.addEventListener("pointerdown", function () { pointerDown = true; }, true);
        document.addEventListener("pointerup", releasePointer, true);
        document.addEventListener("pointercancel", releasePointer, true);

        /* Live feedback: validate when the user leaves a field, then keep
           re-checking as they type so the message disappears when fixed */
        fields.forEach(function (field) {
            controlsFor(form, field.name).forEach(function (control) {
                control.addEventListener("blur", function () {
                    touched[field.name] = true;
                    if (pointerDown) { deferred.push(field); return; }
                    checkField(field);
                });
                var recheck = function () {
                    var wrapper = control.closest("[data-field]");
                    if (touched[field.name] || (wrapper && wrapper.classList.contains("has-error"))) { checkField(field); }
                };
                control.addEventListener("input", recheck);
                control.addEventListener("change", function () {
                    /* Radios, checkboxes and drop-downs report their change on the
                       click itself. Text boxes report it when they lose focus, which
                       is the moment a pointer may be pressing the Send button. */
                    var immediate = control.type === "radio" || control.type === "checkbox" || control.tagName === "SELECT";
                    if (immediate) { touched[field.name] = true; }
                    if (pointerDown && !immediate) { deferred.push(field); return; }
                    checkField(field);
                });
            });
        });

        /* Live character counters: <span data-counter-for="message" data-max="800"> */
        form.querySelectorAll("[data-counter-for]").forEach(function (counter) {
            var control = form.elements[counter.getAttribute("data-counter-for")];
            var max = Number(counter.getAttribute("data-max"));
            if (!control) { return; }
            function update() {
                var length = control.value.length;
                counter.textContent = length + " / " + max + " characters";
                counter.classList.toggle("is-near-limit", length > max * 0.9);
            }
            control.addEventListener("input", update);
            counter.updateCounter = update;
            update();
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var result = validateAll();
            if (!result.valid) {
                if (options.summary) { options.summary.focus(); }
                return;
            }
            options.onValid(result.values, form);
        });

        form.addEventListener("reset", function () {
            touched = {};
            window.setTimeout(function () {
                fields.forEach(function (field) {
                    var controls = controlsFor(form, field.name);
                    if (controls.length) { showError(field, controls, ""); }
                });
                renderSummary([]);
                form.querySelectorAll("[data-counter-for]").forEach(function (c) { if (c.updateCounter) { c.updateCounter(); } });
                form.querySelectorAll(".is-valid").forEach(function (w) { w.classList.remove("is-valid"); });
            }, 0);
        });

        return { validateAll: validateAll, checkField: checkField };
    }

    GR.validate = { checks: checks, attach: attach, controlsFor: controlsFor, valueOf: valueOf };
})();
