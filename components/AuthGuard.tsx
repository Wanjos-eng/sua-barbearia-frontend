"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const user = authService.getCurrentUser();
            if (!user) {
                // Try to determine user type from URL or default to root
                if (window.location.pathname.includes('/barbearia')) {
                    router.push('/login/barbearia');
                } else if (window.location.pathname.includes('/cliente')) {
                    router.push('/login/cliente');
                } else {
                    router.push('/');
                }
            } else {
                setAuthorized(true);
            }
        };
        // Use setTimeout to avoid synchronous state update warning
        const timeout = setTimeout(checkAuth, 0);
        return () => clearTimeout(timeout);
    }, [router]);

    if (!authorized) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
}
