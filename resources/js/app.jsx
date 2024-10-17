import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { PurchaseProvider } from './Context/PurchaseContext';
import { SharedProvider } from './Context/SharedContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import { InertiaProgress } from '@inertiajs/progress';

import NProgress from 'nprogress'
import { router } from '@inertiajs/react'
import { Inertia } from '@inertiajs/inertia'

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />


let timeout = null

router.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
  if (NProgress.isStarted() && event.detail.progress.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9)
  }
})

router.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  } else if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <PurchaseProvider>
                <SharedProvider>
                    <App {...props} />
                </SharedProvider>
            </PurchaseProvider>
        );
    },
    progress: {
        color: '#4B5563',
        delay: 250,
        includeCSS: true,
        showSpinner: true,
    },
});
