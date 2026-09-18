# GreenReach Community Garden Website

## Project Title
GreenReach Community Garden — Non-Profit Website (WEDE5020 Portfolio of Evidence)

## Student
- **Name:** Lindokuhle Mtshali
- **Student Number:** ST10233093
- **GitHub Link:** github.com/lindokuhlemtshalibj@gmail.com/GreenReachWebsite  
- **Module:** WEDE5020 (Web Development Introduction)


## Project Overview
GreenReach Community Garden is a Johannesburg-based non-profit initiative promoting urban agriculture, food security, and community wellness. This repository contains the front-end website built for GreenReach as part of the WEDE5020 Portfolio of Evidence (POE). The site gives the organisation an online presence to recruit volunteers, collect donations, and share knowledge with the community.

## Website Goals and Objectives
- Increase volunteer sign-ups through a dedicated volunteer form
- Grow donations via an online giving page with clear donation tiers
- Share blog content such as gardening tips and success stories
- Showcase upcoming community events and workshops
- Provide clear contact information and locations for two garden sites

**Key Performance Indicators (KPIs):** volunteer applications per month, total monthly donations, unique blog visitors, and event sign-ups via the site.

## Key Features and Functionality
- Responsive 8-page website: Home, About Us, Projects, Blog, Volunteer, Donate, Events, Contact
- External stylesheet (`css/style.css`) linked consistently across every page
- CSS custom properties (variables) for a consistent colour scheme and typography scale
- Flexbox-based layout system: hero sections, card grids, two-column layouts, and image galleries all built with `display: flex`, `flex-wrap`, `justify-content`, and `align-items`
- Decorative styling: colour, background-colour, border, and box-shadow on cards, with `:hover`, `:focus`, and `:active` states on all links, buttons, and form fields
- Responsive design with two breakpoints (tablet ≤1024px, mobile ≤600px) adjusting layout, typography scale, navigation (stacks vertically on mobile), and images
- Responsive images using the `<picture>` element with `<source media>` on the homepage hero, and `srcset`/`sizes` attributes on the Projects gallery, serving three resolutions (480w / 800w / 1200w) per image
- Real embedded map with two garden locations (Johannesburg CBD and Soweto) on the Contact page
- Volunteer sign-up form, donation tiers, and enquiry form with client-side required-field validation

## Timeline and Milestones
| Milestone | Duration | Date Estimate |
|---|---|---|
| Proposal approval & kickoff | 1 week | Week 1 |
| Sitemap & wireframes | 1 week | Week 2 |
| HTML skeleton & content integration | 2 weeks | Weeks 3–4 |
| CSS & responsive styling | 1.5 weeks | Week 5 |
| JavaScript & interactivity | 1 week | Week 6 |
| Testing & debugging | 0.5 week | Week 7 |
| Final tweaks & deployment | 0.5 week | Week 8 |

## Part 1 Details
Part 1 delivered the approved project proposal, researched content, the initial sitemap, and the first working set of HTML/CSS/JS files pushed to this repository with a `css/`, `js/`, and `images/` folder structure.

## Part 2 Details
Part 2 focused on CSS styling for the desktop solution and responsive design for tablet and mobile. This included building a full external stylesheet (reset, colour scheme, typography scale, layout system), applying decorative styling with interactive pseudo-classes, and implementing responsive layout, typography, navigation, and image adjustments across two breakpoints. Part 3 will add JavaScript interactivity, further testing, and final refinements.

## Sitemap
```
Home
├── About Us
│   ├── History
│   ├── Mission & Vision
│   └── Team
├── Projects
│   ├── Community Garden
│   ├── Workshops
│   └── Nutrition Programs
├── Blog / News
│   ├── Articles
│   └── Success Stories
├── Get Involved
│   ├── Volunteer Form
│   └── Donation Page
├── Events
│   └── Calendar / Event Sign-ups
└── Contact
    ├── Locations Map (2 sites)
    └── Contact Form
```

## Screenshot Evidence: Responsive Testing
Screenshots below confirm the layout adjusts correctly across desktop, tablet, and mobile screen sizes. Captured from the live pages using browser responsive testing tools.

| Page | Desktop (browser window) | Tablet (630px viewport) | Mobile (375px viewport) |
|---|---|---|---|
| Homepage | `screenshots/homepage-desktop.png` | `screenshots/homepage-tablet-630px.png` | `screenshots/homepage-mobile-375px.png` |
| Projects (image gallery) | `screenshots/projects-desktop.png` | `screenshots/projects-tablet-630px.png` | `screenshots/projects-mobile-375px.png` |

Observed behaviour:
- **Desktop:** hero section and card rows display side-by-side in multiple columns; navigation is a horizontal bar.
- **Tablet:** hero stacks into a single column; card rows reflow to two columns.
- **Mobile:** navigation stacks vertically; all cards, images, and buttons go full-width single column; heading sizes reduce for readability.

## Changelog
- **v0.1 (Part 1):** Initial sitemap and content research completed; first working HTML/CSS/JS pages pushed with semantic structure, navigation, and a two-location contact map.
- **v0.2 (Part 1 feedback fixes, actioned in Part 2):**
  - Added the two missing low-fidelity wireframes (homepage and volunteer/donate form) to the Part 1 proposal document.
  - Redrew both sitemap diagrams to fix an overlapping-label rendering bug in the original images.
  - Restructured the `public_html` folder into `css/`, `js/`, and `images/` subfolders on every page for a consistent, well-organised file structure.
  - Replaced the "map placeholder" text on the Contact page with a real embedded map showing two garden locations, as required by the original brief.
- **v0.3 (Part 2):**
  - Built the full external stylesheet (`css/style.css`): CSS reset, CSS custom properties for the colour scheme, a rem-based typography scale, and a Flexbox-based layout system (hero, card grids, two-column sections, image gallery).
  - Added decorative styling (colour, background-colour, border, box-shadow) to all cards and buttons, with `:hover`, `:focus`, and `:active` states on every interactive element for accessibility and usability.
  - Implemented two responsive breakpoints (tablet ≤1024px, mobile ≤600px) adjusting layout, typography, and navigation.
  - Added responsive images: a `<picture>` element with multiple `<source media>` breakpoints on the homepage hero, and `srcset`/`sizes` attributes serving three resolutions on the Projects gallery.
  - Sourced and added new site imagery: two raised-bed garden photos and a garden courtyard photo, all free of identifiable people to avoid using real individuals' photos without consent on a public-facing NPO site.
  - Fixed a broken stylesheet/script path inconsistency between pages (`donate.html` and `volunteer.html` previously pointed to `css/style.css` while other pages used a flat path).
  - Expanded thin pages (`donate.html` previously had almost no content) with donation tiers and additional copy.

## References
- Nielsen, J. (2020) *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group. Available at: https://www.nngroup.com/articles/ten-usability-heuristics/ (Accessed: 26 July 2025).
- Interaction Design Foundation (2023) *The Basics of User Experience (UX) Design*. Available at: https://www.interaction-design.org/literature/topics/ux-design (Accessed: 26 July 2025).
- Creative Commons (2023) *Free-to-use images and icons*. Available at: https://creativecommons.org (Accessed: 26 July 2025).
- MDN Web Docs (2024) *CSS Flexible Box Layout*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout (Accessed: 15 September 2026).
- MDN Web Docs (2024) *Responsive images*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images (Accessed: 15 September 2026).
- W3Schools (2024) *CSS Media Queries*. Available at: https://www.w3schools.com/css/css_rwd_mediaqueries.asp (Accessed: 15 September 2026).
