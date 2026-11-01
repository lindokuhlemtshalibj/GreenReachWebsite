# GreenReach Community Garden

## Project Title
GreenReach Community Garden - Non-Profit Website (WEDE5020 Portfolio of Evidence, Final POE: Part 3)

## Student Information
- **Name:** Lindo
- **Student Number:** ST10233093
- **Module:** WEDE5020 (Web Development Introduction)
- **Institution:** IIE (Rosebank College)

## Live Website and Repository
- **Live website (deployed on Netlify):** https://greenreach-garden-jhb.netlify.app/
- **GitHub repository:** https://github.com/lindokuhlemtshalibj/GreenReachWebsite

GreenReach is a fictional organisation created for a college project. The addresses, phone number, email address and banking details are for demonstration only, and the site says so in its footer.

## Project Overview
GreenReach Community Garden is a Johannesburg-based non-profit initiative promoting urban agriculture, food security and community wellness. This repository contains the front-end website built for GreenReach as part of the WEDE5020 Portfolio of Evidence. The site gives the organisation an online presence to recruit volunteers, collect sponsorships, share gardening knowledge and promote community events at two garden sites (Johannesburg CBD and Soweto).

## Website Goals and Objectives
- Increase volunteer sign-ups through a clear volunteer page and a smart enquiry form
- Grow donations and sponsorships with transparent tiers and instant cost feedback
- Share gardening tips and community stories through a searchable blog
- Promote workshops and events with a searchable, filterable events calendar
- Help visitors find the nearest garden with an interactive map
- Be found online through on-page SEO, structured data and local search signals

**Key Performance Indicators (KPIs):** volunteer enquiries per month, sponsorship enquiries and total pledged, unique blog visitors, event enquiries, and organic search visits.

## Key Features and Functionality (Part 3)
| Brief requirement | Where it is | How it works |
|---|---|---|
| Interactive elements: tabs | about.html | Four tabs (story, mission, vision, team) built in JavaScript with arrow-key support and deep links such as about.html#team |
| Interactive elements: accordions | volunteer.html | Volunteer roles and an FAQ, with Expand all and Collapse all buttons and arrow-key navigation |
| Interactive elements: modal | donate.html | Native dialog element showing EFT details; closes with Escape, the Close button or a click outside |
| Animations and transitions | all pages | Scroll-reveal fade-ins (IntersectionObserver), animated impact counters, accordion and tab transitions, hover and focus effects. All are switched off for visitors who prefer reduced motion |
| Interactive map | contact.html | Leaflet and OpenStreetMap map with a marker and popup for each garden, buttons that fly to each garden, and a Find my nearest garden button that uses the browser location and the haversine formula |
| Gallery lightbox | projects.html | Six photos open in a full-screen viewer with next and previous buttons, keyboard arrows, swipe, captions, image counter, preloading and focus returned on close |
| Dynamic content | events.html, blog.html, index.html | Event cards, blog articles and the home page event preview are created by JavaScript from data in js/data.js |
| Search, filter and sort | events.html, blog.html | Live search with highlighted matches, category and location filters, sorting, a show-past-events switch, load-more and clear-filters |
| Enquiry form | enquiry.html | Volunteer or sponsor form that changes with the choice, a live cost estimate, validation, and an instant response with cost, availability and next steps |
| Contact form | contact.html | Validated form that compiles an email to the recipient set in js/data.js and opens it in the visitor's email app (also Gmail, copy and edit options) |
| Form validation and error handling | enquiry.html, contact.html | Shared validation engine (js/validation.js): inline messages, error summary with links, aria attributes, live correction |
| AJAX | enquiry.html | The enquiry is processed asynchronously: availability is loaded with fetch() from data/availability.json and the response appears without reloading the page |
| SEO | all pages | See the SEO section below |
| Deployment | Netlify | See the Deployment section below |

## Part 3 Details
Part 3 added JavaScript interactivity, search engine optimisation, two validated forms, an interactive map, a gallery lightbox, dynamic searchable content and deployment, and worked through feedback from Part 2 (see the Changelog).

### JavaScript files
| File | Purpose |
|---|---|
| js/data.js | All content used by the dynamic features: events, blog posts, sponsorship tiers, locations and fallback availability |
| js/script.js | Shared behaviour: mobile menu, tabs, accordions, modals, scroll-reveal, counters, back-to-top, share links, utility helpers |
| js/validation.js | Reusable form validation engine and check functions |
| js/enquiry.js | Enquiry form logic, live cost estimate, asynchronous processing and response |
| js/contact.js | Contact form logic and email compilation |
| js/events.js | Events page and home page preview: render, search, filter, sort |
| js/blog.js | Blog page: render, search, category filter, sort, expand |
| js/lightbox.js | Gallery lightbox |
| js/map.js | Leaflet map, markers, garden buttons and nearest-garden finder |
| vendor/leaflet/ | Leaflet 1.9.4 library (BSD-2 licence included), stored locally so the map does not depend on a third-party CDN |

Vanilla JavaScript was chosen instead of jQuery or a framework because the site only needs a few well-defined components, and avoiding a library keeps the pages fast (a Google ranking factor) and the code easy to read.

### Form validation rules
| Field | Rules |
|---|---|
| Full name | Required, 2 to 60 characters, letters, spaces, apostrophes, hyphens and full stops only |
| Email | Required, valid format, maximum 254 characters |
| Phone (optional) | South African format: 0821234567, 082 123 4567 or +27 82 123 4567 |
| Enquiry type | Required choice: volunteer or sponsor (changes the fields shown) |
| Volunteer area and time | Required drop-downs (volunteer enquiries only) |
| Start date | Required, a real date, not in the past, within 12 months |
| Hours per week | Required whole number from 1 to 20 |
| Sponsorship tier | Required choice of three tiers (sponsor enquiries only) |
| Months or workshops | Required whole number from 1 to 12 |
| Payment method | Required drop-down |
| Message (enquiry, optional) | Maximum 500 characters with a live counter |
| Contact: reply method | Required; choosing phone makes the phone number required (linked rule) |
| Contact: type of message | Required drop-down |
| Contact: subject | Required, 5 to 80 characters |
| Contact: message | Required, 20 to 800 characters with a live counter |
| Consent checkbox | Required on both forms (POPIA-style consent wording) |

Fields that are hidden (for example sponsor fields on a volunteer enquiry) are skipped by validation. Messages appear under each field with the prefix "Error:" so they do not rely on colour alone, and an error summary lists every problem with links that jump to the field.

### How the contact email works
A static website has no mail server, so the contact form builds the email in JavaScript and opens it in the visitor's own email app with the recipient, subject and body already filled in (a mailto link, RFC 6068). A panel also shows the complete email and offers Open in Gmail, Copy email text and Edit my message. This sends the email from the visitor's own account, so no passwords or private keys are stored in public code. The recipient is set in one place, GR.config.recipientEmail in js/data.js.

### How the enquiry response works
After validation, the enquiry form calls fetch() to load data/availability.json (volunteer places per team and time, and sponsorship places per tier). If the file cannot be fetched, for example when the page is opened straight from a folder, identical built-in figures are used. The response then shows a reference number, the cost or commitment, how many places remain, a waiting-list notice when a team or tier is full (with a suggested alternative), the next induction date (the first Saturday of the month on or after the start date) and the next steps.

## SEO (Search Engine Optimisation)
### On-page SEO
| Page | Title tag (characters) | Meta description (characters) | Meta keywords |
|---|---|---|---|
| index.html | GreenReach Community Garden | Urban Gardening Johannesburg (58) | 145 | community garden Johannesburg, urban farming, food security, composting workshops, volunteer Johannesburg, non-profit garden, GreenReach |
| about.html | About Us | GreenReach Community Garden Johannesburg (51) | 144 | about GreenReach, community garden history, mission and vision, Johannesburg non-profit, urban agriculture team |
| projects.html | Projects and Workshops | GreenReach Community Garden (52) | 152 | urban farming workshops, composting Johannesburg, nutrition classes, community garden plots, garden gallery, raised bed vegetables |
| blog.html | Gardening Tips and Stories | GreenReach Blog (44) | 121 | gardening tips Johannesburg, composting guide, water-wise gardening, grow vegetables at home, community garden stories, healthy recipes |
| volunteer.html | Volunteer in Johannesburg | GreenReach Community Garden (55) | 148 | volunteer Johannesburg, community garden volunteer, volunteer opportunities Gauteng, gardening volunteer, help local garden |
| donate.html | Donate and Sponsor a Garden | GreenReach Community Garden (57) | 125 | donate community garden, sponsor a garden, Johannesburg charity donation, support food security, garden sponsorship |
| events.html | Gardening Workshops and Events | GreenReach Johannesburg (56) | 124 | gardening workshops Johannesburg, community events Soweto, composting class, harvest day, seedling swap, school holiday garden club |
| enquiry.html | Volunteer or Sponsor Enquiry | GreenReach Community Garden (58) | 129 | volunteer enquiry, sponsor a garden, sponsorship tiers, volunteer induction Johannesburg, community garden enquiry |
| contact.html | Contact and Garden Locations | GreenReach Johannesburg (54) | 136 | contact GreenReach, community garden Johannesburg address, Soweto garden location, garden map, email GreenReach |
| 404.html | Page Not Found | GreenReach Community Garden (44) | 143 | page not found, GreenReach Community Garden |

- **Keyword research:** keywords were chosen around what a local visitor would type (community garden Johannesburg, volunteer Johannesburg, composting workshops, sponsor a garden) and used naturally in titles, headings, first paragraphs, link text, image names and alt text.
- **Title tags:** unique per page, about 60 characters, with the main keyword first and the brand last.
- **Meta descriptions:** unique per page, 120 to 160 characters, written as a short invitation to click.
- **Meta keywords:** included for every page as required by the brief. Google no longer uses this tag for ranking, so the real SEO value comes from the content, headings and structured data.
- **Header tags:** exactly one h1 per page, followed by h2 and h3 in a logical order. The site name in the header is a link, not a heading, so the h1 describes the page.
- **Image optimisation:** descriptive hyphenated file names (for example tomato-trellis-raised-beds-garden-large.jpg), meaningful alt text on every image, width and height attributes to avoid layout shift, lazy loading below the fold, a mobile-sized image through the picture element, and images compressed from 3.0 MB to 1.3 MB overall (the home page hero image went from 272 KB to 99 KB).
- **URL structure:** short, lowercase, descriptive file names (about.html, events.html, enquiry.html) with no spaces or special characters, plus a canonical link on every page.
- **Internal linking:** body text links related pages together (for example blog to projects, events to volunteer, donate to enquiry with the tier pre-selected).
- **Mobile-friendliness:** responsive layout, viewport tag, a menu button on small screens, touch-sized buttons and a readable type scale.
- **Language and region:** lang="en-ZA" and geo meta tags for Gauteng, South Africa.
- **Structured data:** JSON-LD (schema.org NGO) on the home page and contact page with the organisation, contact point and both garden locations with coordinates.
- **Social sharing tags:** Open Graph and Twitter card tags with a 1200 x 630 share image on every page.

### Additional technical SEO
- **robots.txt:** allows crawling, blocks /data/ and the 404 page, and points to the sitemap.
- **sitemap.xml:** lists all nine public pages with last-modified dates and priorities.
- **Page speed:** system fonts (no font downloads), compressed images, deferred scripts, small CSS and JavaScript, and only the pages that need the map load the map library.
- **Security:** see the Security section.
- **Custom 404 page:** helps visitors and crawlers recover from broken links.

### Off-page SEO plan
The brief asks for strategies as well as code, and these are the planned actions that happen outside the website itself.
- **Backlinks (planned):** ask local schools, clinics, churches and community forums to link to the workshops page; submit GreenReach to Johannesburg non-profit and volunteer directories; offer gardening tips to local news sites in exchange for a link.
- **Social media (implemented and planned):** every page has share buttons for Facebook, X, WhatsApp and LinkedIn, and rich previews through Open Graph tags. Planned: Facebook and Instagram accounts that post each blog article and event and link back to the site.
- **Local SEO (implemented and planned):** implemented through the en-ZA language, geo tags, local keywords, the two addresses in the footer and contact page, and NGO structured data with coordinates. Planned: a free Google Business Profile for each garden and consistent name, address and phone details on directory listings.

## Security Measures
- **Security headers (_headers file, applied by Netlify):** Content-Security-Policy (only scripts, styles and images from this site, plus OpenStreetMap map tiles), X-Content-Type-Options, X-Frame-Options (no framing), Referrer-Policy and Permissions-Policy (location allowed only for this site; camera, microphone and payments off).
- **HTTPS:** provided automatically by Netlify.
- **Safe rendering:** dynamic content is created with DOM methods and textContent, never with innerHTML, so text from data or from a search box cannot inject HTML.
- **Safe external links:** links that open a new tab use rel="noopener noreferrer".
- **Input validation:** every form field is validated before use, with length limits.
- **No secrets and no stored personal data:** the demonstration site stores no personal information; form details stay in the browser or in the email the visitor sends.
- **Privacy wording:** consent checkbox and a short privacy note on both forms.

## Accessibility
Skip-to-content link, visible focus outlines, keyboard support for the menu, tabs, accordions, dialogs and lightbox, ARIA attributes (aria-expanded, aria-selected, aria-invalid, aria-live, aria-current), labels on every control, error messages that do not rely on colour, and reduced-motion support.

## Sitemap
```
Home (index.html)
+-- About Us (about.html)
|     +-- Our story | Mission | Vision | Our team (tabs)
+-- Projects (projects.html)
|     +-- Urban farming workshops | Composting | Nutrition classes | Volunteer plots
|     +-- Garden gallery (lightbox)
+-- Blog (blog.html)
|     +-- 6 searchable articles in 4 categories
+-- Volunteer (volunteer.html)
|     +-- Volunteer roles and FAQ (accordions)
+-- Donate (donate.html)
|     +-- Sponsorship tiers | EFT details (modal)
+-- Events (events.html)
|     +-- Searchable, filterable event calendar
+-- Enquiry (enquiry.html)
|     +-- Volunteer or sponsor enquiry with instant response
+-- Contact (contact.html)
|     +-- Interactive map (2 locations) | Contact form
+-- Page not found (404.html)
```

## File and Folder Structure
```
README.md
netlify.toml
screenshots/                 (responsive testing evidence from Part 2)
public_html/
  index.html  about.html  projects.html  blog.html  volunteer.html
  donate.html  events.html  enquiry.html  contact.html  404.html
  robots.txt  sitemap.xml  _headers
  css/style.css
  js/    data.js  script.js  validation.js  enquiry.js  contact.js
         events.js  blog.js  lightbox.js  map.js
  data/availability.json
  images/                    (descriptive file names, thumb and large versions)
  vendor/leaflet/            (Leaflet 1.9.4 map library and images)
```

## Deployment
- **Platform:** Netlify (free plan), chosen because it deploys a static site in seconds, provides HTTPS automatically and reads the _headers file for security headers.
- **Method:** the public_html folder was deployed with Netlify's drag-and-drop publisher. The repository also contains netlify.toml (publish directory: public_html) so the site can be connected to GitHub for automatic deploys.
- **Live address:** https://greenreach-garden-jhb.netlify.app/
- **Checks after deployment:** every page opened on the live address, the map tiles, lightbox, search, both forms, robots.txt, sitemap.xml and the 404 page were checked.

### Running locally
Open public_html/index.html in a browser. Everything works from a folder, except that fetch() is not available for local files, so the enquiry form uses its built-in availability figures, and map tiles need an internet connection.

## Testing
| Test | Result |
|---|---|
| Automated browser tests (Playwright, Chromium): navigation, tabs, accordions, modal, lightbox, search and filters, blog, counters, enquiry and contact forms, map and location features | 30 of 30 passed |
| Crawl of all 10 pages at 1280 px, 630 px and 375 px widths: console errors, failed requests, broken images, missing alt text, horizontal scrolling, one h1, title and description lengths | No problems found |
| HTML validation (html-validate) on all pages | 0 errors |
| Lighthouse (local server with compression, simulated mobile): home | Performance 99, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse: about, events | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse: contact | Performance 99, Accessibility 100, Best Practices 96, SEO 100 (the lower score was caused by map tiles being unavailable on the offline test machine) |

Browsers: automated tests ran in Chromium (the engine used by Chrome and Edge). Features used (native dialog, CSS Grid and Flexbox, IntersectionObserver, fetch) are supported by current versions of Firefox and Safari according to MDN, but this project was not tested in them.

### Known limitations
- Availability figures and events are fixed demonstration data, not a live database.
- The contact email is sent from the visitor's own email app, so it needs an email program or webmail to be set up.
- The map needs an internet connection to load map tiles.
- Events are dated November 2026 to January 2027; past events are hidden automatically and can be shown with the Include past events switch.

## Timeline and Milestones
| Milestone | Duration | Date Estimate |
|---|---|---|
| Proposal approval and kickoff | 1 week | Week 1 |
| Sitemap and wireframes | 1 week | Week 2 |
| HTML skeleton and content integration | 2 weeks | Weeks 3-4 |
| CSS and responsive styling | 1.5 weeks | Week 5 |
| JavaScript, forms and interactivity | 1 week | Week 6 |
| SEO, testing and debugging | 0.5 week | Week 7 |
| Final tweaks and deployment | 0.5 week | Week 8 |

## Part 1 and Part 2 Details
- **Part 1:** the approved proposal, researched content, sitemap, wireframes and the first set of HTML pages pushed to this repository.
- **Part 2:** the external stylesheet (reset, colour scheme, typography scale, Flexbox layout), decorative styling with hover, focus and active states, and responsive design for tablet and mobile with responsive images. Responsive testing evidence is in the screenshots folder.

| Page | Desktop (browser window) | Tablet (630px viewport) | Mobile (375px viewport) |
|---|---|---|---|
| Homepage | screenshots/homepage-desktop.png | screenshots/homepage-tablet-630px.png | screenshots/homepage-mobile-375px.png |
| Projects | screenshots/projects-desktop.png | screenshots/projects-tablet-630px.png | screenshots/projects-mobile-375px.png |

## Changelog
- **v0.1 (Part 1):** Initial sitemap and content research completed; first working HTML pages pushed with semantic structure and navigation.
- **v0.2 (Part 1 feedback, actioned in Part 2):**
  - Added the two missing low-fidelity wireframes to the proposal document.
  - Redrew both sitemap diagrams to fix overlapping labels.
  - Restructured public_html into css and images folders.
  - Replaced the map placeholder on the contact page with an embedded map of two locations.
- **v0.3 (Part 2):**
  - Built the external stylesheet with a CSS reset, colour variables, a rem-based type scale and a Flexbox layout system.
  - Added hover, focus and active states to every interactive element.
  - Added tablet (1024px) and mobile (600px) breakpoints for layout, typography, navigation and images.
  - Added responsive images with the picture element and srcset.
  - Replaced images showing identifiable people with people-free photos.
- **v0.4 (Part 3 - final POE):**
  - **Feedback for Part 2:** marks and feedback for Part 2 had not been released on the ARC portal when this version was completed, so a self-review of the Part 2 site against the Part 2 rubric and the Part 3 brief was carried out. Every problem found was fixed:
    - The srcset on the Projects page listed 800w and 1200w files that were identical copies of the 736px originals, so the declared widths were wrong. Replaced with true 480w thumbnails and full-size images, and removed the duplicate files (images folder reduced from 3.0 MB to 1.3 MB).
    - The site had no enquiry.html even though the Part 1 brief requires one. Added it as a full volunteer or sponsor enquiry page.
    - Every page used the site name as an h1 in the header, so each page had two h1 headings. The header name is now a link and each page has a single descriptive h1.
    - The stacked mobile menu filled half of the screen. It now collapses into a menu button.
    - The font stack named Open Sans and Merriweather but never loaded them. Replaced with a system font stack that loads instantly.
    - An undefined CSS variable (--colour-accent-dark) was used in the h3 rule. Replaced with a defined colour.
    - Every section was styled as a card. Card styling is now applied with a dedicated panel class.
    - The Contact page used Google Maps iframes with inline style attributes. Replaced with an interactive Leaflet map.
    - Event dates were in the past (October 2025). Replaced with upcoming events and added automatic hiding of past events.
    - The footer copyright year was 2025. Updated to 2026 and added a clear notice that the organisation is fictional.
    - The logo was shown at 48px from a 600px file. Added a correctly sized logo, plus favicon and apple-touch-icon.
    - Images had no width and height attributes. Added them to prevent layout shift, and added lazy loading.
    - Added a skip-to-content link, stronger focus outlines, footer contrast improvements and reduced-motion support.
  - **Interactive elements:** added tabs (about page), accordions (volunteer page), a modal dialog (donate page), scroll-reveal animations, animated counters, a mobile menu button and a back-to-top button.
  - **Interactive map:** added a Leaflet and OpenStreetMap map with two markers, popups, garden buttons and a nearest-garden finder using the visitor's location.
  - **Gallery lightbox:** added a six-photo gallery with a keyboard, touch and screen-reader friendly lightbox.
  - **Dynamic content and search:** added JavaScript-generated events (with search, category and location filters, sorting, show past events and load more) and blog articles (with search, category filters, sorting and expand), plus a live event preview on the home page.
  - **Forms:** added the enquiry form (volunteer or sponsor, conditional fields, live cost estimate, asynchronous response with cost, availability and next steps) and rebuilt the contact form (linked validation rules, email compilation, mail app, Gmail, copy and edit options). Both use the shared validation engine.
  - **Bug found and fixed during testing:** an error message appearing on blur could move the Send button between mouse-down and mouse-up and swallow the first click. Validation messages are now held back while a pointer is pressed.
  - **SEO:** unique title tag, meta description and meta keywords on every page; one h1 per page; descriptive image file names and alt text; canonical links; Open Graph and Twitter tags; JSON-LD structured data; robots.txt; sitemap.xml; custom 404 page; geo and language tags; share buttons.
  - **Security:** added security headers and a Content-Security-Policy, safe DOM rendering and noopener links.
  - **Performance:** compressed and resized images, deferred scripts and system fonts; Lighthouse performance 99 to 100 on tested pages.
  - **Deployment:** deployed to Netlify; added netlify.toml and the _headers file.
  - **README:** updated with Part 3 features, SEO documentation and off-page plan, security, testing, deployment, this changelog and references.

## References
- Google (2026) *SEO Starter Guide*. Google Search Central. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 1 November 2026).
- Google (2026) *Introduction to robots.txt*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 1 November 2026).
- Google (2026) *Build and submit a sitemap*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (Accessed: 1 November 2026).
- Google (2026) *Influencing your title links in search results*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/title-link (Accessed: 1 November 2026).
- Google (2026) *Control your snippets in search results*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/snippet (Accessed: 1 November 2026).
- Google (2026) *Google Image SEO best practices*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/google-images (Accessed: 1 November 2026).
- Google (2026) *Intro to how structured data markup works*. Google Search Central. Available at: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data (Accessed: 1 November 2026).
- Schema.org (2026) *NGO*. Available at: https://schema.org/NGO (Accessed: 1 November 2026).
- Chrome for Developers (2026) *Lighthouse overview*. Google. Available at: https://developer.chrome.com/docs/lighthouse/overview (Accessed: 1 November 2026).
- Agafonkin, V. (2023) *Leaflet: an open-source JavaScript library for interactive maps*, version 1.9.4. Available at: https://leafletjs.com/ (Accessed: 1 November 2026).
- OpenStreetMap contributors (2026) *Copyright and licence*. OpenStreetMap Foundation. Available at: https://www.openstreetmap.org/copyright (Accessed: 1 November 2026).
- MDN Web Docs (2026) *HTMLDialogElement: showModal() method*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal (Accessed: 1 November 2026).
- MDN Web Docs (2026) *Intersection Observer API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 1 November 2026).
- MDN Web Docs (2026) *Fetch API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 1 November 2026).
- MDN Web Docs (2026) *Geolocation API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API (Accessed: 1 November 2026).
- W3C Web Accessibility Initiative (2026) *Tabs pattern*. WAI-ARIA Authoring Practices Guide. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ (Accessed: 1 November 2026).
- W3C Web Accessibility Initiative (2026) *Accordion pattern*. WAI-ARIA Authoring Practices Guide. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ (Accessed: 1 November 2026).
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 1 November 2026).
- Duerst, M., Masinter, L. and Zawinski, J. (2010) *RFC 6068: The mailto URI scheme*. IETF. Available at: https://www.rfc-editor.org/rfc/rfc6068 (Accessed: 1 November 2026).
- Netlify (2026) *Custom headers*. Netlify Docs. Available at: https://docs.netlify.com/manage/routing/headers/ (Accessed: 1 November 2026).
- Netlify (2026) *Add new project*. Netlify Docs. Available at: https://docs.netlify.com/manage/projects/add-new-project/ (Accessed: 1 November 2026).
- Information Regulator (South Africa) (2026) *Protection of Personal Information Act (POPIA)*. Available at: https://inforegulator.org.za/ (Accessed: 1 November 2026).
- MDN Web Docs (2024) *CSS Flexible Box Layout*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout (Accessed: 15 September 2026).
- MDN Web Docs (2024) *Responsive images*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images (Accessed: 15 September 2026).
- Nielsen, J. (2020) *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group. Available at: https://www.nngroup.com/articles/ten-usability-heuristics/ (Accessed: 26 July 2025).
- Interaction Design Foundation (2023) *The Basics of User Experience (UX) Design*. Available at: https://www.interaction-design.org/literature/topics/ux-design (Accessed: 26 July 2025).
- Creative Commons (2023) *Free-to-use images and icons*. Available at: https://creativecommons.org (Accessed: 26 July 2025).
