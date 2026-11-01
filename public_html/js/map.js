/* =========================================================
   GreenReach Community Garden - map.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   Interactive map built with the Leaflet library and
   OpenStreetMap tiles.
   Features:
     - A marker and popup for each garden (directions link)
     - Buttons that fly the map to a chosen garden
     - "Find my nearest garden": uses the browser location
       (with the visitor's permission) and works out the
       distance with the haversine formula
     - Friendly fallback if the library or tiles cannot load
   ========================================================= */
(function () {
    "use strict";

    var GR = (window.GR = window.GR || {});
    var container = document.getElementById("map");
    if (!container || !GR.locations) { return; }

    var el = GR.util.el;
    var status = document.getElementById("map-status");
    function say(message) { if (status) { status.textContent = message; } }

    /* ---------- Fallback when Leaflet is unavailable ---------- */
    if (typeof window.L === "undefined") {
        container.classList.add("map-unavailable");
        container.textContent = "";
        container.appendChild(el("p", {
            text: "The interactive map could not be loaded right now. Please use the addresses listed below, or open the area in OpenStreetMap."
        }));
        container.appendChild(el("a", {
            "class": "btn secondary", target: "_blank", rel: "noopener noreferrer",
            href: "https://www.openstreetmap.org/#map=11/-26.2200/27.9800", text: "Open OpenStreetMap"
        }));
        return;
    }

    var L = window.L;
    var locations = GR.locations;
    var reduceMotion = GR.util.reduceMotion;

    /* ---------- Create the map ---------- */
    var map = L.map(container, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    }).addTo(map);

    /* Scroll-wheel zoom only after the visitor clicks the map, so the
       page can still be scrolled normally */
    map.on("focus click", function () { map.scrollWheelZoom.enable(); });
    map.on("blur", function () { map.scrollWheelZoom.disable(); });

    /* ---------- Markers with popups ---------- */
    var markers = {};
    locations.forEach(function (loc) {
        var popup = el("div", { "class": "map-popup" }, [
            el("h3", { "class": "map-popup-title", text: loc.name }),
            el("p", { text: loc.address }),
            el("p", { text: "Open: " + loc.hours }),
            el("a", {
                href: "https://www.google.com/maps/dir/?api=1&destination=" + loc.lat + "," + loc.lng,
                target: "_blank", rel: "noopener noreferrer", text: "Get directions"
            })
        ]);
        markers[loc.id] = L.marker([loc.lat, loc.lng], { title: loc.name, alt: loc.name })
            .addTo(map)
            .bindPopup(popup);
    });

    var allBounds = L.latLngBounds(locations.map(function (loc) { return [loc.lat, loc.lng]; }));
    map.fitBounds(allBounds, { padding: [50, 50] });

    /* ---------- Garden buttons ---------- */
    var focusButtons = document.querySelectorAll("[data-map-focus]");

    function setPressed(activeButton) {
        focusButtons.forEach(function (button) {
            button.setAttribute("aria-pressed", button === activeButton ? "true" : "false");
        });
    }

    function focusLocation(id) {
        if (id === "all") {
            map.fitBounds(allBounds, { padding: [50, 50] });
            map.closePopup();
            say("Showing both garden locations.");
            return;
        }
        var loc = locations.filter(function (l) { return l.id === id; })[0];
        if (!loc) { return; }
        if (reduceMotion) { map.setView([loc.lat, loc.lng], 15); }
        else { map.flyTo([loc.lat, loc.lng], 15, { duration: 1.2 }); }
        markers[id].openPopup();
        say("Showing " + loc.name + ", " + loc.address + ".");
    }

    focusButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            setPressed(button);
            focusLocation(button.getAttribute("data-map-focus"));
        });
    });

    /* ---------- Find my nearest garden ---------- */
    function toRad(degrees) { return degrees * Math.PI / 180; }

    /* Haversine formula: straight-line distance between two coordinates in km */
    function distanceKm(lat1, lng1, lat2, lng2) {
        var R = 6371;
        var dLat = toRad(lat2 - lat1);
        var dLng = toRad(lng2 - lng1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return 2 * R * Math.asin(Math.sqrt(a));
    }

    GR.distanceKm = distanceKm;

    var nearButton = document.getElementById("map-near-me");
    var youMarker = null;

    function onPosition(position) {
        if (nearButton) { nearButton.disabled = false; }
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var nearest = null;
        locations.forEach(function (loc) {
            var km = distanceKm(lat, lng, loc.lat, loc.lng);
            if (!nearest || km < nearest.km) { nearest = { loc: loc, km: km }; }
        });

        if (youMarker) { map.removeLayer(youMarker); }
        youMarker = L.circleMarker([lat, lng], {
            radius: 9, color: "#1b5e20", weight: 3, fillColor: "#ffffff", fillOpacity: 1
        }).addTo(map).bindPopup("You are here");

        map.fitBounds(L.latLngBounds([[lat, lng], [nearest.loc.lat, nearest.loc.lng]]), { padding: [60, 60] });
        markers[nearest.loc.id].openPopup();
        say("Your nearest garden is " + nearest.loc.name + ", about " + nearest.km.toFixed(1) + " km away (straight-line distance).");
    }

    function onError(error) {
        if (nearButton) { nearButton.disabled = false; }
        var messages = {
            1: "Location permission was denied. You can still choose a garden using the buttons.",
            2: "Your location could not be determined. Please choose a garden using the buttons.",
            3: "Finding your location took too long. Please try again."
        };
        say(messages[error.code] || "Your location could not be found. Please choose a garden using the buttons.");
    }

    if (nearButton) {
        nearButton.addEventListener("click", function () {
            if (!navigator.geolocation) {
                say("Your browser does not support location services. Please choose a garden using the buttons.");
                return;
            }
            say("Finding your location...");
            nearButton.disabled = true;
            navigator.geolocation.getCurrentPosition(onPosition, onError, { timeout: 10000, maximumAge: 60000 });
        });
    }

    GR.map = map;
})();
