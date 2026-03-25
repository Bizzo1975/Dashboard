#!/bin/bash

# scripts/apply-wordpress-branding.sh
# Applies Kecktech 2025 Brand Identity to WordPress Home Page via WP-CLI
# Usage: ./scripts/apply-wordpress-branding.sh

cd "$(dirname "$0")/../docker" || exit 1

echo "Applying Kecktech Branding to WordPress..."

# --------------------------------------------------------------------------------
# 1. Apply Global Custom CSS (Typography, Colors, Accessibility)
# --------------------------------------------------------------------------------
echo "Injecting Brand Guide CSS..."

CSS_CONTENT=$(cat <<EOF
/* --- Kecktech Brand Variables (2025 Guide) --- */
:root {
    --kt-navy: #1E3A5F;
    --kt-charcoal: #4A4A4A;
    --kt-steel: #4A6887;
    --kt-gold: #C07810;
    --kt-teal: #0D6E6E;
    --kt-green: #2E7D32;
    --kt-violet: #7C3AED;
    --kt-offwhite: #F4F7FB;
}

/* --- Typography & Accessibility (WCAG AAA) --- */
body {
    font-family: 'Open Sans', sans-serif;
    color: var(--kt-charcoal);
    font-size: 18px; /* Senior-friendly base */
    line-height: 1.6;
    background-color: var(--kt-offwhite);
}
h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    color: var(--kt-navy);
    font-weight: 700;
}
a {
    text-decoration: underline;
    text-underline-offset: 3px;
    color: var(--kt-navy);
}
.wp-block-button__link {
    background-color: var(--kt-gold) !important;
    color: #FFFFFF !important;
    min-height: 48px; /* Touch target */
    font-weight: bold;
    text-decoration: none !important;
}

/* --- Layout Classes --- */
.kt-hero {
    background-color: var(--kt-navy);
    color: white;
    padding: 80px 20px;
    text-align: center;
    margin-bottom: 40px;
    border-radius: 0 0 8px 8px;
}
.kt-hero h1 { color: white; font-size: 3rem; margin-bottom: 20px; }
.kt-hero p { color: #E2E8F0; font-size: 1.4rem; margin-bottom: 30px; }

.kt-section-title {
    text-align: center;
    font-size: 2.2rem;
    margin: 60px 0 40px;
    border-bottom: 4px solid var(--kt-gold);
    display: inline-block;
    padding-bottom: 10px;
    left: 50%;
    position: relative;
    transform: translateX(-50%);
}

/* Service Cards */
.kt-grid-services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}
.kt-card {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border-top: 6px solid var(--kt-navy);
    display: flex;
    flex-direction: column;
}
.kt-card h3 { margin-top: 0; min-height: 3rem; font-size: 1.3rem; }
.kt-card .price { font-size: 1.2rem; font-weight: bold; color: var(--kt-charcoal); margin: 10px 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.kt-card p { flex-grow: 1; font-size: 1rem; }

/* Service Specific Colors */
.kt-card.msp { border-color: var(--kt-teal); }
.kt-card.haas { border-color: var(--kt-green); }
.kt-card.ai { border-color: var(--kt-gold); }
.kt-card.senior { border-color: var(--kt-violet); }
.kt-card.hosting { border-color: var(--kt-steel); }

/* Why Kecktech Grid */
.kt-grid-values {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto 80px;
    padding: 0 20px;
}
EOF
)

# Clear old custom CSS and apply new
docker exec -i wordpress wp post list --post_type=custom_css --format=ids | xargs -I % docker exec wordpress wp post delete % --force 2>/dev/null
docker exec -i wordpress wp post create --post_type=custom_css --post_title='Kecktech Brand CSS' --post_status=publish --post_content="$CSS_CONTENT" >/dev/null

# --------------------------------------------------------------------------------
# 2. Update Home Page Content (HTML Structure)
# --------------------------------------------------------------------------------
echo "Updating Home Page content..."

HOME_CONTENT='
<div class="kt-hero">
<h1>IT That Works. Priced for Business.</h1>
<p>Solar-Powered. Sovereign Data. AI-Built Apps. Human-Centered.</p>
<div class="wp-block-buttons is-content-justification-center"><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/services">Explore Our Services</a></div></div>
</div>

<h2 class="kt-section-title">Our 5-Service Model</h2>
<div class="kt-grid-services">
<div class="kt-card msp"><h3>White Glove Managed IT</h3><div class="price">$199/mo</div><p>Dedicated remote IT support, SLA-backed, real humans. No offshore call centers.</p></div>
<div class="kt-card haas"><h3>Hardware-as-a-Service</h3><div class="price">$149/mo/device</div><p>Refurbished enterprise hardware on subscription. Circular economy — zero e-waste.</p></div>
<div class="kt-card ai"><h3>AI Custom App Development</h3><div class="price">$3K–$8K/build</div><p>AI-powered custom apps that replace $800+/mo SaaS stacks. Client owns the code.</p></div>
<div class="kt-card senior"><h3>Senior Technology Concierge</h3><div class="price">$79/mo</div><p>Scam-proof security, device setup, monthly check-ins. Designed for dignity.</p></div>
<div class="kt-card hosting"><h3>Sovereign Private Hosting</h3><div class="price">$49/mo</div><p>Kansas-based, solar-powered private hosting. Data never leaves the building.</p></div>
</div>

<h2 class="kt-section-title">Why Kecktech?</h2>
<div class="kt-grid-values">
<div class="kt-value"><h3>Human First</h3><p>Technology serves people, not the other way around. Every design decision starts with the human on the other end — especially the ones Big Tech ignores.</p></div>
<div class="kt-value"><h3>Sovereign & Private</h3><p>Your data stays in Kansas, on our servers, under your terms. We don t sell your data, scan your data, or profit from your data.</p></div>
<div class="kt-value"><h3>Solar & Circular</h3><p>100% solar-powered. Zero e-waste from our clients. Every watt comes from our 25kW rooftop array.</p></div>
<div class="kt-value"><h3>Radically Accessible</h3><p>ADA-first in everything. Both founders live with physical disabilities. Accessibility is not a checkbox — it is in the blueprint.</p></div>
<div class="kt-value"><h3>White Glove Care</h3><p>Real humans, real accountability. No automated runaround. For our senior clients especially, patience and dignity are non-negotiable.</p></div>
</div>'

FRONT_PAGE_ID=$(docker exec wordpress wp option get page_on_front)
if [ -z "$FRONT_PAGE_ID" ] || [ "$FRONT_PAGE_ID" -eq 0 ]; then
    FRONT_PAGE_ID=$(docker exec wordpress wp post create --post_type=page --post_title='Home' --post_status=publish --porcelain)
    docker exec wordpress wp option update page_on_front "$FRONT_PAGE_ID"
    docker exec wordpress wp option update show_on_front 'page'
fi

docker exec -i wordpress wp post update "$FRONT_PAGE_ID" --post_content="$HOME_CONTENT" --post_title="Home"

echo "Success. Home page updated to 2025 Brand Standards."