<?php
/**
 * Plugin Name: Kecktech Umami Analytics
 * Description: Injects Umami tracking script into all public pages.
 */
add_action('wp_head', function () {
    echo '<script defer src="https://stats.kecktech.net/script.js" data-website-id="d2427fe3-ce4b-4b9a-8e41-a8a3e9f2cd6d"></script>' . "\n";
});
