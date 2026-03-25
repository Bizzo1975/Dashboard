<#
.SYNOPSIS
  Applies Kecktech 2025 Brand Identity to WordPress Home Page via WP-CLI (Windows Version - Auto Installs WP-CLI)
.DESCRIPTION
  Usage: .\scripts\apply-wordpress-branding.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Navigate to docker directory relative to script location
$WorkDir = Join-Path $PSScriptRoot "..\docker"
if (Test-Path $WorkDir) { Push-Location $WorkDir }

Write-Host "Applying Kecktech Branding to WordPress..." -ForegroundColor Cyan

# --------------------------------------------------------------------------------
# 0. Check & Install WP-CLI (Required)
# --------------------------------------------------------------------------------
Write-Host "Checking for WP-CLI in container..."
docker exec wordpress sh -c 'command -v wp > /dev/null 2>&1'
if ($LASTEXITCODE -ne 0) {
    Write-Host "WP-CLI not found. Installing..." -ForegroundColor Yellow
    # Download to host temp first to avoid shell quoting issues in container
    $TempWpCli = Join-Path $env:TEMP "wp-cli.phar"
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar" -OutFile $TempWpCli
    docker cp "$TempWpCli" wordpress:/usr/local/bin/wp
    docker exec -u root wordpress chmod +x /usr/local/bin/wp
    Remove-Item "$TempWpCli" -ErrorAction SilentlyContinue
    Write-Host "WP-CLI installed." -ForegroundColor Green
}

# --------------------------------------------------------------------------------
# 1. Define Content (CSS & HTML)
# --------------------------------------------------------------------------------

$CssContent = @"
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
"@

$HtmlContent = @'
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
<div class="kt-value"><h3>Sovereign & Private</h3><p>Your data stays in Kansas, on our servers, under your terms. We don't sell your data, scan your data, or profit from your data.</p></div>
<div class="kt-value"><h3>Solar & Circular</h3><p>100% solar-powered. Zero e-waste from our clients. Every watt comes from our 25kW rooftop array.</p></div>
<div class="kt-value"><h3>Radically Accessible</h3><p>ADA-first in everything. Both founders live with physical disabilities. Accessibility is not a checkbox — it is in the blueprint.</p></div>
<div class="kt-value"><h3>White Glove Care</h3><p>Real humans, real accountability. No automated runaround. For our senior clients especially, patience and dignity are non-negotiable.</p></div>
</div>
'@

# --------------------------------------------------------------------------------
# 2. Transfer Files to Container (Avoids CLI escaping issues)
# --------------------------------------------------------------------------------
$TempCss = Join-Path $env:TEMP "kt_brand.css"
$TempHtml = Join-Path $env:TEMP "kt_home.html"

# Save with UTF8 to avoid encoding issues
$CssContent | Set-Content -Path $TempCss -Encoding UTF8
$HtmlContent | Set-Content -Path $TempHtml -Encoding UTF8

Write-Host "Transferring content to container..."
docker cp "$TempCss" wordpress:/tmp/kt_brand.css
docker cp "$TempHtml" wordpress:/tmp/kt_home.html

# --------------------------------------------------------------------------------
# 3. Apply CSS
# --------------------------------------------------------------------------------
Write-Host "Updating Global CSS..."

# Delete existing custom CSS posts to avoid duplicates
$OldCssIds = docker exec wordpress wp post list --post_type=custom_css --format=ids --allow-root
if (-not [string]::IsNullOrWhiteSpace($OldCssIds)) {
    $Ids = $OldCssIds -split ' '
    foreach ($Id in $Ids) {
        if ([string]::IsNullOrWhiteSpace($Id)) { continue }
        docker exec wordpress wp post delete $Id --force --allow-root | Out-Null
    }
}

# Create new CSS post using PHP eval to avoid shell quoting hell
docker exec wordpress wp eval --allow-root '
  $content = file_get_contents("/tmp/kt_brand.css");
  wp_insert_post(array(
    "post_type" => "custom_css",
    "post_title" => "Kecktech Brand CSS",
    "post_status" => "publish",
    "post_content" => $content
  ));
' | Out-Null

# --------------------------------------------------------------------------------
# 4. Update Home Page
# --------------------------------------------------------------------------------
Write-Host "Updating Home Page content..."

$FrontPageId = docker exec wordpress wp option get page_on_front --allow-root
if (-not $FrontPageId -or $FrontPageId -eq 0) {
    Write-Host "Creating new Home page..."
    $FrontPageId = docker exec wordpress wp post create --post_type=page --post_title='Home' --post_status=publish --porcelain --allow-root
    docker exec wordpress wp option update page_on_front "$FrontPageId" --allow-root
    docker exec wordpress wp option update show_on_front 'page' --allow-root
}

# Trim ID (PowerShell sometimes leaves whitespace)
$FrontPageId = $FrontPageId.ToString().Trim()

# Update the page using PHP eval
docker exec wordpress wp eval --allow-root "
  `$content = file_get_contents('/tmp/kt_home.html');
  wp_update_post(array(
    'ID' => $FrontPageId,
    'post_title' => 'Home',
    'post_content' => `$content
  ));
"

# --------------------------------------------------------------------------------
# 5. Cleanup
# --------------------------------------------------------------------------------
Remove-Item $TempCss
Remove-Item $TempHtml
docker exec wordpress rm /tmp/kt_brand.css /tmp/kt_home.html

Write-Host "Success! Home page and branding updated." -ForegroundColor Green
if ($WorkDir) { Pop-Location }