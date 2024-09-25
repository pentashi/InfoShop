import * as React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';


 export default function Product({products}) {
    const auth = usePage().props.auth.user
    return (
        <AuthenticatedLayout>
            <Head title="Product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!{products}</div>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}