import Checkbox from '@mui/material/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import infomaxlogo from '@/Infomax-logo.png';
import infoshopLogo from '@/infoshop.png';

export default function Login({ status, canResetPassword, version }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                    <div className="flex justify-center mb-6 space-x-4">
                        {/* <img src={infomaxlogo} alt="Infomax" className="h-12 object-contain" /> */}
                        <img src={infoshopLogo} alt="achapishop" className="h-12 object-contain" />
                    </div>

                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                        Welcome Back
                    </h2>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-2 rounded-md text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email or Username
                            </label>
                            <input
                                id="email"
                                type="text"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                                autoComplete="username"
                                autoFocus
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                                autoComplete="current-password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    sx={{ padding: '0 6px 0 0' }}
                                />
                                <span className="ml-1 text-sm text-gray-600">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3"
                            disabled={processing}
                        >
                            Log in
                        </PrimaryButton>
                    </form>

                    <div className="mt-8 text-center text-xs text-gray-400">
                         Developed by Mbongwe Brandon Egbe
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
