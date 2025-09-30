<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- App Icon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('' . \App\Models\Setting::where('meta_key', 'app_icon')->value('meta_value') ?? 'infoshop-icon.png') }}">

        <title inertia>{{ config('app.name', 'InfoShop') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Dark mode preflight -->
        <script>
            (function() {
                try {
                    const stored = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia &&
                        window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (stored === 'dark' || (!stored && prefersDark)) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {
                    // fail silently
                }
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <link rel="stylesheet" href="{{ asset('css/custom.css') }}">
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Global scripts -->
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/numeral.js/1.0.3/numeral.min.js"></script>
    </body>
</html>
