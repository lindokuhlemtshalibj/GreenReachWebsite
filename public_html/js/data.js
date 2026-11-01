/* =========================================================
   GreenReach Community Garden - data.js
   Student: ST10233093 | Module: WEDE5020 | Part 3
   ---------------------------------------------------------
   All content used by the dynamic features lives here:
   events, blog posts, sponsorship tiers, volunteer options,
   garden locations and fallback availability numbers.
   Keeping content separate from logic means the text can be
   changed without touching the JavaScript that displays it.
   ========================================================= */
window.GR = window.GR || {};

/* ---------- Site settings ---------- */
GR.config = {
    siteName: "GreenReach Community Garden",
    siteUrl: "https://greenreach-garden-jhb.netlify.app",
    /* The contact form builds an email addressed to this recipient.
       example.org is a reserved demo domain, so no real inbox is used. */
    recipientEmail: "info@greenreach.example.org",
    phone: "+27 11 555 1234"
};

/* ---------- Garden locations (used by the map) ---------- */
GR.locations = [
    {
        id: "main",
        name: "Main Community Garden",
        area: "Johannesburg CBD",
        address: "142 Bree Street, Johannesburg, 2001",
        lat: -26.2041,
        lng: 28.0473,
        hours: "Monday to Saturday, 08:00 - 17:00"
    },
    {
        id: "soweto",
        name: "Soweto Satellite Garden",
        area: "Orlando West, Soweto",
        address: "58 Vilakazi Street, Orlando West, Soweto, 1804",
        lat: -26.2379,
        lng: 27.9073,
        hours: "Tuesday to Saturday, 08:00 - 16:00"
    }
];

/* ---------- Events (date format: YYYY-MM-DD) ---------- */
GR.events = [
    { id: "e1", title: "Urban Farming Workshop", date: "2026-11-07", start: "10:00", end: "12:00",
      location: "main", category: "Workshop", capacity: 25, booked: 17, cost: "Free",
      description: "Learn how to plan, plant and care for vegetables in small urban spaces." },
    { id: "e2", title: "Volunteer Induction Morning", date: "2026-11-07", start: "09:00", end: "10:00",
      location: "main", category: "Volunteer", capacity: 15, booked: 9, cost: "Free",
      description: "A friendly welcome session for new volunteers: safety, tools and how we work." },
    { id: "e3", title: "Composting Class", date: "2026-11-14", start: "14:00", end: "16:00",
      location: "main", category: "Workshop", capacity: 20, booked: 20, cost: "Free",
      description: "Build a compost heap step by step and take home a starter bucket of finished compost." },
    { id: "e4", title: "Community Harvest Day", date: "2026-11-21", start: "09:00", end: "13:00",
      location: "soweto", category: "Community", capacity: 60, booked: 34, cost: "Free",
      description: "Harvest, wash and share fresh vegetables with neighbours, followed by a shared lunch." },
    { id: "e5", title: "Healthy Meals from the Garden", date: "2026-11-28", start: "11:00", end: "13:00",
      location: "soweto", category: "Nutrition", capacity: 24, booked: 12, cost: "Free",
      description: "A cooking demonstration showing affordable, balanced meals made with garden vegetables." },
    { id: "e6", title: "Seedling Swap", date: "2026-12-05", start: "10:00", end: "12:00",
      location: "main", category: "Community", capacity: 50, booked: 21, cost: "Free",
      description: "Bring spare seedlings, seeds or cuttings and swap them with other local gardeners." },
    { id: "e7", title: "Summer Planting Day", date: "2026-12-12", start: "08:00", end: "12:00",
      location: "soweto", category: "Volunteer", capacity: 30, booked: 26, cost: "Free",
      description: "Help us plant the summer crop of beans, maize and pumpkins in the new raised beds." },
    { id: "e8", title: "Year-End Garden Picnic", date: "2026-12-19", start: "12:00", end: "15:00",
      location: "main", category: "Community", capacity: 80, booked: 40, cost: "R50 per family",
      description: "Celebrate the year with music, food stalls and garden tours. Proceeds support seed purchases." },
    { id: "e9", title: "Kids Garden Club", date: "2027-01-16", start: "09:00", end: "11:00",
      location: "soweto", category: "Workshop", capacity: 20, booked: 8, cost: "Free",
      description: "A school-holiday session where children plant, water and decorate their own seed pots." },
    { id: "e10", title: "Water-Wise Gardening Workshop", date: "2027-01-23", start: "10:00", end: "12:00",
      location: "main", category: "Workshop", capacity: 25, booked: 5, cost: "Free",
      description: "Mulching, drip irrigation and rainwater harvesting for gardens that use less water." }
];

/* ---------- Blog posts ---------- */
GR.posts = [
    {
        id: "post1",
        title: "5 Easy Vegetables to Grow at Home",
        date: "2026-10-12",
        category: "Gardening tips",
        image: "tomato-trellis-raised-beds-garden",
        imageHeight: 326,
        imageAlt: "Tall tomato plants growing on trellises in raised garden beds",
        excerpt: "Short on space? These five vegetables thrive in containers and small beds across the Highveld.",
        body: [
            "You do not need a big yard to grow your own food. Spinach (Swiss chard), cherry tomatoes, spring onions, radishes and herbs such as parsley all do well in pots, old buckets or a single raised bed. Choose a spot that gets at least six hours of sun and fill your containers with a mix of garden soil and compost.",
            "On the Highveld, plant tomatoes once the last frost has passed, usually from September, and sow spinach and radishes in the cooler months. Water early in the morning, mulch the soil with dry leaves or grass clippings, and harvest little and often so the plants keep producing."
        ]
    },
    {
        id: "post2",
        title: "Composting 101: Reduce Waste and Feed Your Garden",
        date: "2026-10-05",
        category: "Composting",
        image: "raised-bed-lettuce-heads-garden",
        imageHeight: 293,
        imageAlt: "Healthy lettuce heads growing in a raised bed filled with dark compost-rich soil",
        excerpt: "Turn kitchen scraps and garden waste into dark, crumbly compost with a simple home routine.",
        body: [
            "Good compost needs a balance of greens and browns. Greens are fruit and vegetable scraps, tea leaves and fresh grass; browns are dry leaves, cardboard and paper. Aim for roughly two parts brown to one part green, keep the heap as damp as a wrung-out sponge, and avoid meat, dairy and cooked food that can attract pests.",
            "Turn the pile every two weeks to add air. In warm weather you can have finished compost in two to three months. Spread it around your plants as a thick layer, or mix it into the soil before planting, to hold moisture and feed beneficial soil life."
        ]
    },
    {
        id: "post3",
        title: "Volunteer Spotlight: Meet Sarah, Our Garden Mentor",
        date: "2026-09-28",
        category: "Community stories",
        image: "citrus-trees-community-garden",
        imageHeight: 333,
        imageAlt: "Citrus trees heavy with orange fruit beside a shaded garden path",
        excerpt: "Sarah has volunteered with GreenReach for two years, teaching sustainable gardening to neighbours of every age.",
        body: [
            "Sarah first joined a Saturday workshop to learn how to grow herbs on her balcony. Two years later she mentors new volunteers, runs the seedling table at our Community Harvest Days and leads the children's garden club during school holidays.",
            "Her advice for new volunteers is simple: start small, ask questions and share what you grow. If you would like to follow in her footsteps, our volunteer induction takes place on the first Saturday of every month."
        ]
    },
    {
        id: "post4",
        title: "Water-Wise Gardening in the Dry Season",
        date: "2026-09-14",
        category: "Gardening tips",
        image: "drip-irrigated-pepper-lettuce-beds",
        imageHeight: 326,
        imageAlt: "Raised beds of peppers and lettuce watered by a black drip irrigation line",
        excerpt: "Simple ways to keep plants healthy while using less water, from mulching to drip irrigation.",
        body: [
            "Water is precious in Gauteng, so every drop should count. Mulch your beds with a thick layer of straw, dry leaves or wood chips to slow evaporation, and group thirsty plants together so you can water them in one go.",
            "Drip irrigation delivers water straight to the roots and wastes far less than a sprinkler. If you can, collect rainwater from your roof in a tank or buckets and use it in the early morning or evening when less water is lost to the heat."
        ]
    },
    {
        id: "post5",
        title: "From Garden to Plate: Three Simple Meals",
        date: "2026-09-02",
        category: "Nutrition",
        image: "raised-bed-tomatoes-peppers-garden",
        imageHeight: 326,
        imageAlt: "Ripe red tomatoes and peppers growing in a raised vegetable bed",
        excerpt: "Easy, affordable recipes that make the most of fresh garden vegetables and leafy greens.",
        body: [
            "Fresh produce does not need fancy cooking. Try a pot of vegetable soup with carrots, onions and spinach; a quick stir-fry of leafy greens with garlic and tomato served with pap; or a tray of roasted peppers, courgettes and onions with a little oil.",
            "Our nutrition classes show families how to plan balanced meals on a budget, store vegetables so they stay fresh for longer and use every part of the harvest, from stalks to leaves."
        ]
    },
    {
        id: "post6",
        title: "How Our Soweto Satellite Garden Started",
        date: "2026-08-18",
        category: "Community stories",
        image: "garden-stone-path-fresh-produce",
        imageHeight: 320,
        imageAlt: "Stone stepping path through a garden beside baskets of fresh oranges and vegetables",
        excerpt: "What began as one donated plot in Orlando West is now a second GreenReach garden feeding local families.",
        body: [
            "In 2024 a neighbour offered us an unused plot in Orlando West. With donated tools, a rainwater tank and a team of volunteers, we cleared the land, built eight raised beds and planted our first crop of spinach and beans.",
            "Today the Soweto Satellite Garden hosts weekly workshops, a seedling swap and a community kitchen day. It shows what a small group of committed neighbours can achieve when they share land, skills and time."
        ]
    }
];

/* ---------- Sponsorship tiers ---------- */
GR.tiers = [
    { id: "seed", name: "Seed Sponsor", price: 100, unit: "month",
      blurb: "Buys seeds and seedlings for one raised bed each month." },
    { id: "bed", name: "Garden Bed Sponsor", price: 350, unit: "month",
      blurb: "Covers compost, tools and water for one community bed each month." },
    { id: "workshop", name: "Workshop Sponsor", price: 750, unit: "workshop",
      blurb: "Funds one full urban farming workshop for up to 15 residents." }
];

/* ---------- Volunteer options ---------- */
GR.volunteerAreas = {
    "garden-care": "Garden care (planting, watering and harvesting)",
    "teaching": "Workshops and teaching",
    "events": "Events and fundraising",
    "admin": "Administration and social media"
};

GR.timeSlots = {
    "saturday-morning": "Saturday morning (08:00 - 12:00)",
    "saturday-afternoon": "Saturday afternoon (13:00 - 16:00)",
    "weekday-afternoon": "Weekday afternoon (14:00 - 17:00)",
    "flexible": "Flexible / as needed"
};

/* ---------- Fallback availability ----------
   The enquiry page normally loads data/availability.json with fetch().
   If that request is not possible (for example when the page is opened
   straight from a folder), these identical numbers are used instead. */
GR.defaultAvailability = {
    volunteerSlots: {
        "garden-care": { "saturday-morning": 0, "saturday-afternoon": 5, "weekday-afternoon": 7, "flexible": 10 },
        "teaching":    { "saturday-morning": 3, "saturday-afternoon": 2, "weekday-afternoon": 4, "flexible": 6 },
        "events":      { "saturday-morning": 4, "saturday-afternoon": 6, "weekday-afternoon": 2, "flexible": 8 },
        "admin":       { "saturday-morning": 1, "saturday-afternoon": 3, "weekday-afternoon": 5, "flexible": 9 }
    },
    sponsorSlots: {
        "seed":     { "capacity": 50, "taken": 41 },
        "bed":      { "capacity": 20, "taken": 17 },
        "workshop": { "capacity": 12, "taken": 9 }
    }
};
