import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="flex w-full items-center justify-center p-8 md:w-1/3">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href="/" className="relative z-20 flex items-center justify-center md:hidden">
                        <AppLogoIcon className="h-6 w-6 text-black sm:h-7 sm:w-7" />
                    </Link>

                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>

            <div className="animate-fade-in hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 md:block md:w-2/3">
                <div className="flex h-full items-center justify-center p-8">
                    <Card className="animate-scale-in flex items-center border border-white/30 bg-white/25 p-8 text-center backdrop-blur-lg backdrop-saturate-150 md:p-12">
                        <CardHeader className="max-w-2xl text-3xl font-bold text-white drop-shadow-md md:text-5xl">
                            <CardTitle>Pemerintah Kabupaten Bandung</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="max-w-lg text-lg text-white md:text-xl">
                                An intelligent platform for data visualization and interaction through natural conversation.
                            </p>
                        </CardContent>

                        <div className="h-1 w-full max-w-md rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />

                        <CardFooter className="text-gray grid w-full grid-cols-1 gap-6 pt-4 md:grid-cols-3">
                            <Card className="animate-float flex flex-col items-center rounded-xl border border-white/30 bg-white/25 p-4 backdrop-blur-lg backdrop-saturate-150">
                                <CardTitle className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-teal-600"
                                    >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </CardTitle>
                                <CardFooter className="font-medium">Natural Chat</CardFooter>
                            </Card>

                            <Card className="animate-float flex flex-col items-center rounded-xl border border-white/30 bg-white/25 p-4 backdrop-blur-lg backdrop-saturate-150">
                                <CardTitle className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-teal-600"
                                    >
                                        <path d="M3 3v18h18" />
                                        <path d="M18 17V9" />
                                        <path d="M13 17V5" />
                                        <path d="M8 17v-3" />
                                    </svg>
                                </CardTitle>
                                <CardFooter className="font-medium">Data Insights</CardFooter>
                            </Card>

                            <Card className="animate-float flex flex-col items-center rounded-xl border border-white/30 bg-white/25 p-4 backdrop-blur-lg backdrop-saturate-150">
                                <CardTitle className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-teal-600"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                        <path d="M12 17h.01" />
                                    </svg>
                                </CardTitle>
                                <CardFooter className="font-medium">Smart Assistance</CardFooter>
                            </Card>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
