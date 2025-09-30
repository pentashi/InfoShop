import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { PurchaseProvider } from './Context/PurchaseContext';
import { SharedProvider } from './Context/SharedContext';
import { ThemeProvider } from './Context/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'InfoShop';

import { InertiaProgress } from '@inertiajs/progress';

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />

InertiaProgress.init({
  color:'#0a0a0a',
  includeCSS: true,
  showSpinner: true,
})

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <PurchaseProvider>
                    <SharedProvider>
                        <App {...props} />
                    </SharedProvider>
                </PurchaseProvider>
            </ThemeProvider>
        );
    },
    progress: false,
});
