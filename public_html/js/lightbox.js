/* =========================================================
   GreenReach Community Garden - lightbox.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   Image gallery lightbox.
   Markup: <ul data-lightbox> containing links to the large
   images, each wrapping a thumbnail <img>.
   Features: opens on click, previous / next buttons, keyboard
   arrows, Escape to close, swipe on touch screens, caption and
   image counter, preloading of neighbouring images, focus
   returns to the thumbnail that was clicked.
   Without JavaScript the thumbnails are plain links to the
   large images, so nothing breaks.
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    var galleries = document.querySelectorAll("[data-lightbox]");
    if (!galleries.length || !GR.util) { return; }

    /* Collect every gallery link into one list */
    var items = [];
    galleries.forEach(function (gallery) {
        gallery.querySelectorAll("a[href]").forEach(function (link) {
            var thumb = link.querySelector("img");
            items.push({
                href: link.getAttribute("href"),
                alt: thumb ? thumb.getAttribute("alt") : "",
                caption: link.getAttribute("data-caption") || (thumb ? thumb.getAttribute("alt") : ""),
                trigger: link
            });
        });
    });
    if (!items.length) { return; }

    var el = GR.util.el;
    var current = 0;
    var lastTrigger = null;
    var dialog, inner, figure, image, caption, count, closeBtn, prevBtn, nextBtn;

    /* ---------- Build the viewer the first time it is needed ---------- */
    function build() {
        if (dialog) { return; }

        closeBtn = el("button", { type: "button", "class": "lightbox-btn lightbox-close", "aria-label": "Close image viewer" });
        prevBtn = el("button", { type: "button", "class": "lightbox-btn lightbox-prev", "aria-label": "Previous image" });
        nextBtn = el("button", { type: "button", "class": "lightbox-btn lightbox-next", "aria-label": "Next image" });
        image = el("img", { "class": "lightbox-img", alt: "" });
        caption = el("figcaption", { "class": "lightbox-caption" });
        figure = el("figure", { "class": "lightbox-figure" }, [image, caption]);
        count = el("p", { "class": "lightbox-count", "aria-live": "polite" });
        inner = el("div", { "class": "lightbox-inner" }, [closeBtn, prevBtn, figure, nextBtn, count]);
        dialog = el("dialog", { "class": "lightbox", "aria-label": "Image viewer" }, [inner]);
        document.body.appendChild(dialog);

        closeBtn.addEventListener("click", close);
        prevBtn.addEventListener("click", function () { show(current - 1); });
        nextBtn.addEventListener("click", function () { show(current + 1); });

        dialog.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
            else if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
        });

        /* Click on the empty dark area closes the viewer */
        dialog.addEventListener("click", function (event) {
            if (event.target === dialog || event.target === inner || event.target === figure) { close(); }
        });

        dialog.addEventListener("close", function () {
            document.body.classList.remove("modal-open");
            if (lastTrigger) { lastTrigger.focus(); }
        });

        /* Swipe left / right on touch screens */
        var startX = null;
        inner.addEventListener("touchstart", function (event) {
            startX = event.changedTouches[0].clientX;
        }, { passive: true });
        inner.addEventListener("touchend", function (event) {
            if (startX === null) { return; }
            var delta = event.changedTouches[0].clientX - startX;
            startX = null;
            if (Math.abs(delta) > 50) { show(delta < 0 ? current + 1 : current - 1); }
        }, { passive: true });
    }

    /* ---------- Show one image ---------- */
    function show(index) {
        current = (index + items.length) % items.length;
        var item = items[current];

        figure.classList.add("is-loading");
        image.onload = function () { figure.classList.remove("is-loading"); };
        image.onerror = function () {
            figure.classList.remove("is-loading");
            caption.textContent = "Sorry, this image could not be loaded.";
        };
        image.setAttribute("src", item.href);
        image.setAttribute("alt", item.alt);
        if (image.complete && image.naturalWidth) { figure.classList.remove("is-loading"); }

        caption.textContent = item.caption;
        count.textContent = "Image " + (current + 1) + " of " + items.length;

        /* Preload the neighbours so next / previous feel instant */
        [current + 1, current - 1].forEach(function (i) {
            var neighbour = items[(i + items.length) % items.length];
            var preload = new Image();
            preload.src = neighbour.href;
        });
    }

    function open(index, trigger) {
        build();
        lastTrigger = trigger || null;
        show(index);
        GR.openDialog(dialog);
        closeBtn.focus();
    }

    function close() { if (dialog && dialog.open) { dialog.close(); } }

    /* ---------- Open from each thumbnail ---------- */
    items.forEach(function (item, index) {
        item.trigger.addEventListener("click", function (event) {
            event.preventDefault();
            open(index, item.trigger);
        });
    });
})();
