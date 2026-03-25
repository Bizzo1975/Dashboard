<#
.SYNOPSIS
  INTELLIGENT REVERT: Scans revision history to find the first version WITHOUT the 'kt-hero' garbage code.
.DESCRIPTION
  SAFE MODE REVERT:
  1. Uploads a PHP script to the container.
  2. Uses 'wp eval-file' to execute restore logic using native WordPress functions.
  3. Deletes the 'Kecktech Brand CSS' post.
  Usage: .\scripts\revert-homepage-changes.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Navigate to docker directory relative to script location
$WorkDir = Join-Path $PSScriptRoot "..\docker"
if (Test-Path $WorkDir) { Push-Location $WorkDir }

Write-Host "Attempting to revert home page changes (Safe Mode)..." -ForegroundColor Yellow

try {
    # --------------------------------------------------------------------------------
    # 1. Create PHP Revert Script (Avoids all CLI parsing errors)
    # --------------------------------------------------------------------------------
    $PhpScript = @'
<?php
// 1. Find Home Page
$front_page_id = get_option('page_on_front');
if (!$front_page_id) {
    WP_CLI::error("No 'page_on_front' option set. Cannot identify home page.");
}
WP_CLI::log("Home Page ID: " . $front_page_id);

// 2. Find Revisions
$revisions = wp_get_post_revisions($front_page_id, array(
    'posts_per_page' => 30, // Look back deep enough to skip multiple bad saves
    'orderby' => 'ID',
    'order' => 'DESC'
));

if (empty($revisions)) {
    WP_CLI::error("No revisions found to restore.");
}

$target_rev = null;
foreach ($revisions as $rev) {
    // Check if this revision contains the garbage class I injected
    if (strpos($rev->post_content, 'kt-hero') === false) {
        $target_rev = $rev;
        break;
    }
    WP_CLI::log("Skipping bad revision ID: " . $rev->ID . " (" . $rev->post_date . ")");
}

if ($target_rev) {
    WP_CLI::log("Found clean revision ID: " . $target_rev->ID . " (" . $target_rev->post_date . ")");
    wp_restore_post_revision($target_rev->ID);
    WP_CLI::success("RESTORE COMPLETE: Reverted to version from " . $target_rev->post_date);
} else {
    WP_CLI::error("Could not find a clean revision in the last 30 saves.");
}

// 4. Delete Custom CSS
$css_posts = get_posts(array('post_type' => 'custom_css', 'title' => 'Kecktech Brand CSS', 'numberposts' => -1, 'post_status' => 'any'));
foreach ($css_posts as $p) {
    wp_delete_post($p->ID, true);
    WP_CLI::success("Deleted 'Kecktech Brand CSS' (ID: " . $p->ID . ")");
}
'@

    $TempFile = Join-Path $env:TEMP "revert_job.php"
    $PhpScript | Set-Content -Path $TempFile -Encoding UTF8

    # --------------------------------------------------------------------------------
    # 2. Execute in Container
    # --------------------------------------------------------------------------------
    Write-Host "Uploading revert logic to container..."
    docker cp "$TempFile" wordpress:/tmp/revert_job.php

    Write-Host "Executing revert..."
    docker exec wordpress wp eval-file /tmp/revert_job.php --allow-root

    # --------------------------------------------------------------------------------
    # 3. Cleanup
    # --------------------------------------------------------------------------------
    docker exec wordpress rm /tmp/revert_job.php
    Remove-Item $TempFile

    Write-Host "`nDONE. Your home page should now be restored." -ForegroundColor Green
    Write-Host "Please refresh your browser (Ctrl+F5) to clear cached CSS." -ForegroundColor Cyan

} catch {
    Write-Error "An error occurred during the revert process: $_"
} finally {
    if ($WorkDir) { Pop-Location }
}