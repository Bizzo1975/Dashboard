<header id="header" component="header-mobile-toggle" class="site-header print-hidden">
    <div class="header-inner">
        @include('layouts.parts.header-logo')

        <nav class="main-nav hide-under-l" aria-label="Primary navigation">
            @include('layouts.parts.header-links')
        </nav>

        <a href="https://www.kecktech.net/contact" class="btn-login hide-under-l">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Customer Login
        </a>

        <button type="button"
                refs="header-mobile-toggle@toggle"
                title="{{ trans('common.header_menu_expand') }}"
                aria-expanded="false"
                class="hamburger hide-over-l"
                aria-label="Open navigation menu">
            <span></span><span></span><span></span>
        </button>
    </div>

    <div refs="header-mobile-toggle@menu" class="mobile-nav hide-over-l" aria-hidden="true">
        <div class="mobile-nav-links">
            @include('layouts.parts.header-links')
        </div>
        <a href="https://www.kecktech.net/contact" class="mobile-nav-link mobile-login">Customer Login</a>
        @if(auth()->check())
            <a href="{{ url('/logout') }}" class="mobile-nav-link">BookStack Logout</a>
        @else
            <a href="{{ url('/login') }}" class="mobile-nav-link">BookStack Login</a>
        @endif
    </div>
</header>
