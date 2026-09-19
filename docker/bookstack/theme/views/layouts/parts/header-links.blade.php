@php
    $path = request()->path();
    $isHelp = $path === '/' || str_starts_with($path, 'books') || str_starts_with($path, 'shelves') || str_starts_with($path, 'chapters') || str_starts_with($path, 'pages') || str_starts_with($path, 'search');
@endphp

<a href="https://www.kecktech.net/" class="nav-link keck-home-link" title="Back to Kecktech.net" aria-label="Back to Kecktech website">
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.2 2.8 11H5v9.8h5.6v-6.2h2.8v6.2H19V11h2.2L12 3.2z"></path>
    </svg>
    <span>Home</span>
</a>
<a href="https://www.kecktech.net/about" class="nav-link">About</a>
<a href="https://www.kecktech.net/services" class="nav-link">Services</a>
<a href="https://www.kecktech.net/pricing" class="nav-link">Pricing</a>
<a href="https://help.kecktech.net" class="nav-link{{ $isHelp ? ' active' : '' }}">Help</a>
<a href="https://www.kecktech.net/contact" class="nav-link">Contact</a>
