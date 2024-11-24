import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuthCheck = () => {
    const router = useRouter();

    useEffect(() => {
        const loginData = localStorage.getItem('Login-data');
        const currentPath = router.pathname;

        if (!loginData && (currentPath === '/' || currentPath === '/chat')) {
            router.push('/auth/login');
        }

        if (loginData && currentPath === '/auth/login') {
            router.push('/');
        }
    }, [router]);
};
