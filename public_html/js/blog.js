/* =========================================================
   GreenReach Community Garden - blog.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   Dynamic blog.
     - Builds the article cards from GR.posts
     - Live search across titles, summaries and article text
     - Category filter buttons and newest / oldest sorting
     - "Read full article" expands the text in place
     - Deep links such as blog.html#post3 open that article
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    var list = document.getElementById("blog-list");
    if (!list || !GR.posts || !GR.util) { return; }

    var el = GR.util.el;
    var searchInput = document.getElementById("blog-search");
    var sortSelect = document.getElementById("blog-sort");
    var chipBox = document.getElementById("blog-categories");
    var countBox = document.getElementById("blog-count");
    var clearButton = document.getElementById("blog-clear");

    var state = { query: "", category: "all", sort: "newest" };

    /* ---------- Helpers ---------- */
    function readingMinutes(post) {
        var words = post.body.join(" ").split(/\s+/).length;
        return Math.max(1, Math.round(words / 200));
    }

    function termsFromQuery() { return state.query.toLowerCase().split(/\s+/).filter(Boolean); }

    function matches(post, terms) {
        if (state.category !== "all" && post.category !== state.category) { return false; }
        if (!terms.length) { return true; }
        var haystack = [post.title, post.excerpt, post.category, post.body.join(" ")].join(" ").toLowerCase();
        return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
    }

    /* ---------- Category buttons ---------- */
    var categories = ["all"];
    GR.posts.forEach(function (p) { if (categories.indexOf(p.category) === -1) { categories.push(p.category); } });

    categories.forEach(function (category) {
        var button = el("button", {
            type: "button", "class": "chip", "data-category": category,
            "aria-pressed": category === "all" ? "true" : "false",
            text: category === "all" ? "All posts" : category
        });
        button.addEventListener("click", function () {
            state.category = category;
            chipBox.querySelectorAll(".chip").forEach(function (chip) {
                chip.setAttribute("aria-pressed", chip === button ? "true" : "false");
            });
            render();
        });
        chipBox.appendChild(button);
    });

    /* ---------- Build one article card ---------- */
    function buildCard(post, terms) {
        var date = GR.util.parseISO(post.date);

        var thumb = el("img", {
            "class": "card-thumb", src: "images/" + post.image + "-thumb.jpg", alt: post.imageAlt,
            width: "480", height: String(post.imageHeight || 326), loading: "lazy"
        });

        var meta = el("p", { "class": "blog-meta" }, [
            el("time", { datetime: post.date, text: date.getDate() + " " + GR.util.MONTHS[date.getMonth()] + " " + date.getFullYear() }),
            " | " + post.category + " | " + readingMinutes(post) + " min read"
        ]);

        var title = el("h2", { "class": "blog-title" });
        GR.util.appendHighlighted(title, post.title, terms);

        var excerpt = el("p", { "class": "blog-excerpt" });
        GR.util.appendHighlighted(excerpt, post.excerpt, terms);

        var full = el("div", { "class": "blog-full", id: post.id + "-full", hidden: true });
        post.body.forEach(function (paragraph) {
            var p = el("p");
            GR.util.appendHighlighted(p, paragraph, terms);
            full.appendChild(p);
        });

        var toggle = el("button", {
            type: "button", "class": "btn small secondary blog-toggle",
            "aria-expanded": "false", "aria-controls": post.id + "-full", text: "Read full article"
        });
        toggle.addEventListener("click", function () { setOpen(card, toggle, full, full.hidden); });

        var body = el("div", { "class": "blog-body" }, [meta, title, excerpt, full, toggle]);
        var card = el("article", { "class": "card blog-card", id: post.id }, [thumb, body]);

        return card;
    }

    function setOpen(card, toggle, full, open) {
        full.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.textContent = open ? "Show less" : "Read full article";
        card.classList.toggle("is-open", open);
    }

    function openCard(card) {
        var toggle = card.querySelector(".blog-toggle");
        var full = card.querySelector(".blog-full");
        if (toggle && full) { setOpen(card, toggle, full, true); }
    }

    /* ---------- Render ---------- */
    function render() {
        var terms = termsFromQuery();
        var results = GR.posts.filter(function (p) { return matches(p, terms); });
        results.sort(function (a, b) {
            return state.sort === "oldest" ? (a.date < b.date ? -1 : 1) : (a.date < b.date ? 1 : -1);
        });

        list.textContent = "";
        results.forEach(function (post) {
            var card = buildCard(post, terms);
            list.appendChild(card);
            /* Open the article automatically when the match is inside its full text */
            if (terms.length) {
                var inVisible = (post.title + " " + post.excerpt).toLowerCase();
                var onlyInBody = terms.some(function (t) { return inVisible.indexOf(t) === -1; });
                if (onlyInBody) { openCard(card); }
            }
        });

        if (!results.length) {
            list.appendChild(el("div", { "class": "empty-state" }, [
                el("h2", { "class": "empty-title", text: "No articles match your search" }),
                el("p", { text: "Try a different word or choose another category." })
            ]));
        }

        countBox.textContent = results.length + (results.length === 1 ? " article" : " articles") +
            (state.query || state.category !== "all" ? " found" : " in total");
        clearButton.hidden = !(state.query || state.category !== "all" || state.sort !== "newest");
    }

    searchInput.addEventListener("input", GR.util.debounce(function () {
        state.query = searchInput.value.trim();
        render();
    }, 150));
    sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; render(); });

    clearButton.addEventListener("click", function () {
        state = { query: "", category: "all", sort: "newest" };
        searchInput.value = "";
        sortSelect.value = "newest";
        chipBox.querySelectorAll(".chip").forEach(function (chip) {
            chip.setAttribute("aria-pressed", chip.getAttribute("data-category") === "all" ? "true" : "false");
        });
        render();
        searchInput.focus();
    });

    /* ---------- Deep links: blog.html#post3 ---------- */
    function goToHash() {
        var id = window.location.hash.replace("#", "");
        if (!id) { return; }
        var card = document.getElementById(id);
        if (card && card.classList.contains("blog-card")) {
            openCard(card);
            card.classList.add("is-target");
            card.scrollIntoView({ behavior: GR.util.reduceMotion ? "auto" : "smooth", block: "start" });
        }
    }
    window.addEventListener("hashchange", goToHash);

    var presetQuery = GR.util.param("q");
    if (presetQuery) { searchInput.value = presetQuery; state.query = presetQuery.trim(); }

    render();
    goToHash();
})();
