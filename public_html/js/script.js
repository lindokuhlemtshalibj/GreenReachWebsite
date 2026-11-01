/* =========================================================
   GreenReach Community Garden - script.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   Shared interface behaviour loaded on every page:
     1. Utility helpers (used by the other scripts)
     2. Mobile navigation toggle
     3. Scroll-reveal animations
     4. Animated impact counters
     5. Accordions
     6. Tabs
     7. Modal dialogs
     8. Back-to-top button
     9. Social share links
   Every feature is progressive enhancement: if JavaScript is
   switched off the content is still readable.
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------------------------------------------------------
       1. UTILITY HELPERS
       --------------------------------------------------------- */
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];
    var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    GR.util = {
        MONTHS: MONTHS,
        DAYS: DAYS,

        /* Create an element safely: el("p", {class: "x", text: "Hi"}, [child, "text"]) */
        el: function (tag, props, children) {
            var node = document.createElement(tag);
            Object.keys(props || {}).forEach(function (key) {
                var value = props[key];
                if (value === null || value === undefined || value === false) { return; }
                if (key === "class") { node.className = value; }
                else if (key === "text") { node.textContent = value; }
                else { node.setAttribute(key, value === true ? "" : value); }
            });
            (children || []).forEach(function (child) {
                if (child === null || child === undefined) { return; }
                node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
            });
            return node;
        },

        /* "2026-11-07" -> Date at local midnight */
        parseISO: function (iso) {
            var p = String(iso).split("-");
            return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        },

        /* Date -> "Saturday, 7 November 2026" */
        formatDate: function (d) {
            return DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
        },

        pad2: function (n) { return (n < 10 ? "0" : "") + n; },

        toISO: function (d) {
            return d.getFullYear() + "-" + GR.util.pad2(d.getMonth() + 1) + "-" + GR.util.pad2(d.getDate());
        },

        today: function () {
            var d = new Date();
            d.setHours(0, 0, 0, 0);
            return d;
        },

        /* 1050 -> "R1 050" */
        money: function (amount) {
            return "R" + String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },

        debounce: function (fn, wait) {
            var timer;
            return function () {
                var args = arguments, self = this;
                clearTimeout(timer);
                timer = setTimeout(function () { fn.apply(self, args); }, wait);
            };
        },

        escapeRegExp: function (text) {
            return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        },

        /* Append text to parent, wrapping every search term in <mark> */
        appendHighlighted: function (parent, text, terms) {
            var list = (terms || []).filter(Boolean).map(GR.util.escapeRegExp);
            if (!list.length) { parent.appendChild(document.createTextNode(text)); return; }
            var re = new RegExp("(" + list.join("|") + ")", "gi");
            text.split(re).forEach(function (part, i) {
                if (!part) { return; }
                if (i % 2 === 1) { parent.appendChild(GR.util.el("mark", { text: part })); }
                else { parent.appendChild(document.createTextNode(part)); }
            });
        },

        /* Read a query-string value: GR.util.param("type") */
        param: function (name) {
            try { return new URLSearchParams(window.location.search).get(name); }
            catch (e) { return null; }
        },

        reduceMotion: reduceMotion
    };

    /* ---------------------------------------------------------
       2. MOBILE NAVIGATION TOGGLE
       --------------------------------------------------------- */
    function initNav() {
        var button = document.querySelector(".nav-toggle");
        var nav = document.getElementById("main-nav");
        if (!button || !nav) { return; }

        function setOpen(open) {
            button.setAttribute("aria-expanded", open ? "true" : "false");
            button.classList.toggle("is-open", open);
            nav.classList.toggle("is-open", open);
        }

        button.addEventListener("click", function () {
            setOpen(button.getAttribute("aria-expanded") !== "true");
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                setOpen(false);
                button.focus();
            }
        });

        /* Reset the menu when the window grows to desktop width */
        var desktop = window.matchMedia("(min-width: 901px)");
        var onChange = function (e) { if (e.matches) { setOpen(false); } };
        if (desktop.addEventListener) { desktop.addEventListener("change", onChange); }
    }

    /* ---------------------------------------------------------
       3. SCROLL-REVEAL ANIMATIONS
       --------------------------------------------------------- */
    function initReveal() {
        var items = document.querySelectorAll(".reveal");
        if (!items.length || reduceMotion || !("IntersectionObserver" in window)) { return; }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        items.forEach(function (item) {
            item.classList.add("reveal-ready");
            observer.observe(item);
        });
    }

    /* ---------------------------------------------------------
       4. ANIMATED IMPACT COUNTERS
       --------------------------------------------------------- */
    function initCounters() {
        var counters = document.querySelectorAll("[data-count]");
        if (!counters.length || reduceMotion || !("IntersectionObserver" in window)) { return; }

        function format(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

        function animate(node) {
            var target = Number(node.getAttribute("data-count"));
            var suffix = node.getAttribute("data-suffix") || "";
            var duration = 1400;
            var start = null;
            function step(timestamp) {
                if (start === null) { start = timestamp; }
                var progress = Math.min((timestamp - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                node.textContent = format(Math.round(target * eased)) + suffix;
                if (progress < 1) { window.requestAnimationFrame(step); }
            }
            window.requestAnimationFrame(step);
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(function (node) {
            node.textContent = "0" + (node.getAttribute("data-suffix") || "");
            observer.observe(node);
        });
    }

    /* ---------------------------------------------------------
       5. ACCORDIONS
       Markup: <div data-accordion> with .accordion-item children,
       each holding .accordion-heading and .accordion-body.
       The script turns each heading into a real <button>.
       --------------------------------------------------------- */
    function initAccordions() {
        document.querySelectorAll("[data-accordion]").forEach(function (accordion, a) {
            var items = Array.prototype.slice.call(accordion.querySelectorAll(":scope > .accordion-item"));
            var triggers = [];

            items.forEach(function (item, i) {
                var heading = item.querySelector(".accordion-heading");
                var body = item.querySelector(".accordion-body");
                if (!heading || !body) { return; }

                var base = "acc" + a + "-" + i;
                var trigger = GR.util.el("button", {
                    type: "button", "class": "accordion-trigger", id: base + "-trigger",
                    "aria-expanded": "false", "aria-controls": base + "-panel"
                });
                trigger.appendChild(GR.util.el("span", { "class": "accordion-title", text: heading.textContent }));
                trigger.appendChild(GR.util.el("span", { "class": "accordion-icon", "aria-hidden": "true" }));
                heading.textContent = "";
                heading.appendChild(trigger);

                var panel = GR.util.el("div", {
                    "class": "accordion-panel", id: base + "-panel",
                    role: "region", "aria-labelledby": base + "-trigger"
                });
                var inner = GR.util.el("div", { "class": "accordion-inner" });
                item.insertBefore(panel, body);
                inner.appendChild(body);
                panel.appendChild(inner);

                trigger.addEventListener("click", function () {
                    setItem(trigger, panel, trigger.getAttribute("aria-expanded") !== "true");
                });
                trigger.addEventListener("keydown", function (event) {
                    var index = triggers.indexOf(trigger), next = null;
                    if (event.key === "ArrowDown") { next = triggers[(index + 1) % triggers.length]; }
                    else if (event.key === "ArrowUp") { next = triggers[(index - 1 + triggers.length) % triggers.length]; }
                    else if (event.key === "Home") { next = triggers[0]; }
                    else if (event.key === "End") { next = triggers[triggers.length - 1]; }
                    if (next) { event.preventDefault(); next.focus(); }
                });

                triggers.push(trigger);
                item.classList.add("accordion-ready");
            });

            function setItem(trigger, panel, open) {
                trigger.setAttribute("aria-expanded", open ? "true" : "false");
                panel.classList.toggle("is-open", open);
                trigger.parentNode.parentNode.classList.toggle("is-open", open);
            }

            function setAll(open) {
                triggers.forEach(function (trigger) {
                    setItem(trigger, document.getElementById(trigger.getAttribute("aria-controls")), open);
                });
            }

            /* Expand all / Collapse all controls */
            if (accordion.hasAttribute("data-accordion-controls") && triggers.length > 1) {
                var bar = GR.util.el("div", { "class": "accordion-controls" });
                var expand = GR.util.el("button", { type: "button", "class": "btn small secondary", text: "Expand all" });
                var collapse = GR.util.el("button", { type: "button", "class": "btn small secondary", text: "Collapse all" });
                expand.addEventListener("click", function () { setAll(true); });
                collapse.addEventListener("click", function () { setAll(false); });
                bar.appendChild(expand);
                bar.appendChild(collapse);
                accordion.parentNode.insertBefore(bar, accordion);
            }

            if (accordion.hasAttribute("data-open-first") && triggers.length) {
                setItem(triggers[0], document.getElementById(triggers[0].getAttribute("aria-controls")), true);
            }
        });
    }

    /* ---------------------------------------------------------
       6. TABS
       Markup: <div data-tabs> with .tab-panel children that each
       carry data-tab-title. The script builds the tab buttons and
       hides every panel except the active one.
       --------------------------------------------------------- */
    function initTabs() {
        document.querySelectorAll("[data-tabs]").forEach(function (wrap, t) {
            var panels = Array.prototype.slice.call(wrap.querySelectorAll(":scope > .tab-panel"));
            if (!panels.length) { return; }

            var list = GR.util.el("div", {
                "class": "tab-list", role: "tablist",
                "aria-label": wrap.getAttribute("data-tabs-label") || "Page sections"
            });

            var tabs = panels.map(function (panel, i) {
                if (!panel.id) { panel.id = "tab-panel-" + t + "-" + i; }
                var tab = GR.util.el("button", {
                    type: "button", "class": "tab", role: "tab", id: panel.id + "-tab",
                    "aria-controls": panel.id, "aria-selected": "false", tabindex: "-1",
                    text: panel.getAttribute("data-tab-title") || "Tab " + (i + 1)
                });
                panel.setAttribute("role", "tabpanel");
                panel.setAttribute("aria-labelledby", tab.id);
                panel.setAttribute("tabindex", "0");
                tab.addEventListener("click", function () { select(i, false); });
                list.appendChild(tab);
                return tab;
            });
            wrap.insertBefore(list, panels[0]);
            wrap.classList.add("tabs-ready");

            function select(index, moveFocus, skipHash) {
                tabs.forEach(function (tab, i) {
                    var active = i === index;
                    tab.setAttribute("aria-selected", active ? "true" : "false");
                    tab.setAttribute("tabindex", active ? "0" : "-1");
                    tab.classList.toggle("is-active", active);
                    panels[i].hidden = !active;
                    if (active && moveFocus) { tab.focus(); }
                });
                if (!skipHash) {
                    try { history.replaceState(null, "", "#" + panels[index].id); } catch (e) { /* ignore */ }
                }
            }

            list.addEventListener("keydown", function (event) {
                var current = tabs.indexOf(document.activeElement);
                if (current === -1) { return; }
                var next = null;
                if (event.key === "ArrowRight") { next = (current + 1) % tabs.length; }
                else if (event.key === "ArrowLeft") { next = (current - 1 + tabs.length) % tabs.length; }
                else if (event.key === "Home") { next = 0; }
                else if (event.key === "End") { next = tabs.length - 1; }
                if (next !== null) { event.preventDefault(); select(next, true); }
            });

            function fromHash() {
                var id = window.location.hash.replace("#", "");
                var index = panels.map(function (p) { return p.id; }).indexOf(id);
                return index === -1 ? null : index;
            }
            window.addEventListener("hashchange", function () {
                var index = fromHash();
                if (index !== null) { select(index, false, true); }
            });

            var start = fromHash();
            select(start === null ? 0 : start, false, true);
        });
    }

    /* ---------------------------------------------------------
       7. MODAL DIALOGS (native <dialog> element)
       --------------------------------------------------------- */
    function openDialog(dialog) {
        if (typeof dialog.showModal === "function") { dialog.showModal(); }
        else { dialog.setAttribute("open", ""); }
        document.body.classList.add("modal-open");
    }

    GR.openDialog = openDialog;

    function initModals() {
        document.querySelectorAll("[data-modal-open]").forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                var dialog = document.getElementById(trigger.getAttribute("data-modal-open"));
                if (dialog) { openDialog(dialog); }
            });
        });

        document.querySelectorAll("dialog.modal").forEach(function (dialog) {
            /* A click on the dark backdrop targets the dialog itself */
            dialog.addEventListener("click", function (event) {
                if (event.target === dialog) { dialog.close(); }
            });
            dialog.querySelectorAll("[data-modal-close]").forEach(function (button) {
                button.addEventListener("click", function () { dialog.close(); });
            });
            dialog.addEventListener("close", function () {
                document.body.classList.remove("modal-open");
            });
        });
    }

    /* ---------------------------------------------------------
       8. BACK-TO-TOP BUTTON
       --------------------------------------------------------- */
    function initBackToTop() {
        var button = document.getElementById("back-to-top");
        if (!button) { return; }
        function update() { button.classList.toggle("is-visible", window.scrollY > 500); }
        window.addEventListener("scroll", update, { passive: true });
        update();
        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }

    /* ---------------------------------------------------------
       9. SOCIAL SHARE LINKS
       The HTML already contains working links; this updates them
       to the page the visitor is actually on.
       --------------------------------------------------------- */
    function initShare() {
        var links = document.querySelectorAll("[data-share]");
        if (!links.length || window.location.protocol === "file:") { return; }
        var url = encodeURIComponent(window.location.href.split("#")[0]);
        var title = encodeURIComponent(document.title);
        var targets = {
            facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url,
            x: "https://twitter.com/intent/tweet?url=" + url + "&text=" + title,
            whatsapp: "https://wa.me/?text=" + title + "%20" + url,
            linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + url
        };
        links.forEach(function (link) {
            var network = link.getAttribute("data-share");
            if (targets[network]) { link.setAttribute("href", targets[network]); }
        });
    }

    /* ---------------------------------------------------------
       START
       --------------------------------------------------------- */
    function init() {
        initNav();
        initTabs();
        initAccordions();
        initModals();
        initReveal();
        initCounters();
        initBackToTop();
        initShare();
    }

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }
    else { init(); }
})();
