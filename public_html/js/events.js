/* =========================================================
   GreenReach Community Garden - events.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   Dynamic events content.
     - events.html : builds the event cards from GR.events and
       adds live search, category + location filters, sorting,
       a "show past events" switch and a "show more" button.
     - index.html  : shows the next three upcoming events.
   All content is created with DOM methods (createElement and
   textContent) rather than innerHTML, so it is safe by design.
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    if (!GR.events || !GR.util) { return; }

    var el = GR.util.el;
    var PAGE_SIZE = 6;

    /* ---------- Small helpers ---------- */
    function locationName(id) {
        var found = GR.locations.filter(function (l) { return l.id === id; })[0];
        return found ? found.name : "";
    }
    function isPast(event) { return GR.util.parseISO(event.date) < GR.util.today(); }
    function placesLeft(event) { return Math.max(event.capacity - event.booked, 0); }

    /* ---------- Build one event card ---------- */
    function buildCard(event, terms, compact) {
        var date = GR.util.parseISO(event.date);
        var past = isPast(event);
        var left = placesLeft(event);

        var dateBox = el("div", { "class": "event-date", "aria-hidden": "true" }, [
            el("span", { "class": "event-day", text: GR.util.pad2(date.getDate()) }),
            el("span", { "class": "event-month", text: GR.util.MONTHS[date.getMonth()].slice(0, 3) })
        ]);

        /* Full event list sits directly under the page h1, so its titles are h2;
           the home-page preview sits under an h2, so its titles are h3 */
        var title = el(compact ? "h3" : "h2", { "class": "event-title" });
        GR.util.appendHighlighted(title, event.title, terms);

        var when = el("p", { "class": "event-meta" }, [
            el("time", { datetime: event.date, text: GR.util.formatDate(date) }),
            " | " + event.start + " - " + event.end
        ]);
        var where = el("p", { "class": "event-meta", text: locationName(event.location) });

        var tags = el("div", { "class": "event-tags" }, [
            el("span", { "class": "tag", text: event.category }),
            el("span", { "class": "tag tag-cost", text: event.cost })
        ]);
        if (past) { tags.appendChild(el("span", { "class": "tag tag-past", text: "Past event" })); }

        var body = el("div", { "class": "event-body" }, [title, when, where]);

        if (!compact) {
            var description = el("p", { "class": "event-desc" });
            GR.util.appendHighlighted(description, event.description, terms);
            body.appendChild(description);
        }
        body.appendChild(tags);

        if (!compact && !past) {
            var percent = Math.round((event.booked / event.capacity) * 100);
            var fill = el("span", { "class": "meter-fill" });
            fill.style.width = percent + "%";
            var meter = el("div", {
                "class": "meter", role: "img",
                "aria-label": event.booked + " of " + event.capacity + " places booked"
            }, [fill]);
            var stateClass = left === 0 ? " is-full" : (left <= 5 ? " is-low" : "");
            var label = el("p", {
                "class": "availability" + stateClass,
                text: left === 0 ? "Fully booked - join the waiting list" : left + " of " + event.capacity + " places left"
            });
            body.appendChild(meter);
            body.appendChild(label);
        }

        if (!past) {
            var subject = (left === 0 ? "Waiting list: " : "Question about: ") + event.title + " (" + event.date + ")";
            body.appendChild(el("a", {
                "class": "btn small secondary",
                href: "contact.html?topic=event&subject=" + encodeURIComponent(subject),
                text: left === 0 ? "Join the waiting list" : (compact ? "Ask about this event" : "Ask about or book this event")
            }));
        }

        return el("article", { "class": "card event-card" + (past ? " is-past" : ""), id: event.id }, [dateBox, body]);
    }

    /* =========================================================
       HOME PAGE PREVIEW: the next three upcoming events
       ========================================================= */
    var preview = document.getElementById("home-events");
    if (preview) {
        var upcoming = GR.events
            .filter(function (e) { return !isPast(e); })
            .sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : (a.start < b.start ? -1 : 1)); })
            .slice(0, 3);
        preview.textContent = "";
        if (!upcoming.length) {
            preview.appendChild(el("p", { text: "There are no upcoming events right now. Please check back soon." }));
        } else {
            upcoming.forEach(function (e) { preview.appendChild(buildCard(e, [], true)); });
        }
    }

    /* =========================================================
       EVENTS PAGE: search, filter, sort, load more
       ========================================================= */
    var list = document.getElementById("events-list");
    if (!list) { return; }

    var searchInput = document.getElementById("events-search");
    var categorySelect = document.getElementById("events-category");
    var locationSelect = document.getElementById("events-location");
    var sortSelect = document.getElementById("events-sort");
    var pastCheckbox = document.getElementById("events-past");
    var clearButton = document.getElementById("events-clear");
    var countBox = document.getElementById("events-count");
    var moreButton = document.getElementById("events-more");

    var state = { query: "", category: "all", location: "all", sort: "date-asc", includePast: false, visible: PAGE_SIZE };

    /* Fill the filter drop-downs from the data */
    var categories = [];
    GR.events.forEach(function (e) { if (categories.indexOf(e.category) === -1) { categories.push(e.category); } });
    categories.sort().forEach(function (c) { categorySelect.appendChild(el("option", { value: c, text: c })); });
    GR.locations.forEach(function (l) { locationSelect.appendChild(el("option", { value: l.id, text: l.name })); });

    function termsFromQuery() {
        return state.query.toLowerCase().split(/\s+/).filter(Boolean);
    }

    function matches(event, terms) {
        if (!state.includePast && isPast(event)) { return false; }
        if (state.category !== "all" && event.category !== state.category) { return false; }
        if (state.location !== "all" && event.location !== state.location) { return false; }
        if (!terms.length) { return true; }
        var date = GR.util.parseISO(event.date);
        var haystack = [event.title, event.description, event.category, locationName(event.location),
                        GR.util.MONTHS[date.getMonth()], GR.util.DAYS[date.getDay()], event.cost].join(" ").toLowerCase();
        return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
    }

    function compare(a, b) {
        if (state.sort === "date-desc") { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); }
        if (state.sort === "name") { return a.title.localeCompare(b.title); }
        if (state.sort === "places") { return placesLeft(b) - placesLeft(a); }
        return a.date < b.date ? -1 : (a.date > b.date ? 1 : (a.start < b.start ? -1 : (a.start > b.start ? 1 : 0)));
    }

    function render() {
        var terms = termsFromQuery();
        var results = GR.events.filter(function (e) { return matches(e, terms); }).sort(compare);
        var shown = results.slice(0, state.visible);

        list.textContent = "";
        shown.forEach(function (e) { list.appendChild(buildCard(e, terms, false)); });

        if (!results.length) {
            var empty = el("div", { "class": "empty-state" }, [
                el("h3", { text: "No events match your search" }),
                el("p", { text: "Try a different word, choose another category or location, or clear the filters." })
            ]);
            list.appendChild(empty);
        }

        var total = GR.events.filter(function (e) { return state.includePast || !isPast(e); }).length;
        countBox.textContent = results.length === total && !terms.length && state.category === "all" && state.location === "all"
            ? "Showing " + shown.length + " of " + results.length + " events"
            : results.length + (results.length === 1 ? " event found" : " events found") + (shown.length < results.length ? " (showing " + shown.length + ")" : "");

        var remaining = results.length - shown.length;
        moreButton.hidden = remaining <= 0;
        moreButton.textContent = "Show more events (" + remaining + " more)";

        var filtersActive = Boolean(terms.length) || state.category !== "all" || state.location !== "all" ||
                            state.sort !== "date-asc" || state.includePast;
        clearButton.hidden = !filtersActive;
    }

    function update() { state.visible = PAGE_SIZE; render(); }

    searchInput.addEventListener("input", GR.util.debounce(function () {
        state.query = searchInput.value.trim();
        update();
    }, 150));
    categorySelect.addEventListener("change", function () { state.category = categorySelect.value; update(); });
    locationSelect.addEventListener("change", function () { state.location = locationSelect.value; update(); });
    sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; update(); });
    pastCheckbox.addEventListener("change", function () { state.includePast = pastCheckbox.checked; update(); });
    moreButton.addEventListener("click", function () { state.visible += PAGE_SIZE; render(); });

    clearButton.addEventListener("click", function () {
        state = { query: "", category: "all", location: "all", sort: "date-asc", includePast: false, visible: PAGE_SIZE };
        searchInput.value = "";
        categorySelect.value = "all";
        locationSelect.value = "all";
        sortSelect.value = "date-asc";
        pastCheckbox.checked = false;
        render();
        searchInput.focus();
    });

    /* Allow links such as events.html?q=workshop to pre-fill the search */
    var presetQuery = GR.util.param("q");
    if (presetQuery) { searchInput.value = presetQuery; state.query = presetQuery.trim(); }

    render();
})();
