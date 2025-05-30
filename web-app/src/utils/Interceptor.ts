import { API_URL } from './BaseUrl';
import { tokenStorage } from './tokenStorage';
import { redirect } from 'next/navigation';

interface CustomRequestInit extends RequestInit {
    skipAuth?: boolean;
}

let refreshingPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) return false;

    try {
        const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Refresh failed');

        const data = await response.json();
        tokenStorage.setAccessToken(data.data.accessToken);
        return true;
    } catch (error) {
        return false;
    } finally {
        refreshingPromise = null;
    }
}

export const fetchInterceptor = async (url: string, options: CustomRequestInit = {}): Promise<Response> => {
    const requestOptions: CustomRequestInit = {
        ...options,
        credentials: 'include'
    };

    requestOptions.headers = {
        'Content-Type': 'application/json',
        ...requestOptions.headers,
    };

    if (!requestOptions.skipAuth) {
        const token = tokenStorage.getAccessToken();
        if (token) {
            requestOptions.headers = {
                ...requestOptions.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    try {
        let response = await fetch(url, requestOptions);

        if (response.status === 401 && !requestOptions.skipAuth) {
            if (!refreshingPromise) {
                refreshingPromise = refreshAccessToken();
            }
            try {
                await refreshingPromise;

                requestOptions.headers = {
                    ...requestOptions.headers,
                    Authorization: `Bearer ${tokenStorage.getAccessToken()}`,
                };

                response = await fetch(url, requestOptions);
            } catch (error) {
                console.log('Token refresh failed:', error);
                redirect('/login');
            }
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
        }

        return new Response(JSON.stringify(responseData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error occurred');
    }
};