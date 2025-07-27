import { useState, useEffect } from 'react';

interface Location {
    lat: number;
    lng: number;
}

interface UseLocationReturn {
    userLocation: Location | null;
    distance: string;
    estimatedTime: string;
    locationStatus: 'idle' | 'loading' | 'success' | 'error';
    getCurrentLocation: () => void;
}

const HOSPITAL_LOCATION: Location = {
    lat: 15.9752694,
    lng: 108.2506103
};

// Calculate distance using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers

    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const useLocation = (): UseLocationReturn => {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [distance, setDistance] = useState<string>('');
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [estimatedTime, setEstimatedTime] = useState<string>('');

    const getCurrentLocation = () => {
        setLocationStatus('loading');

        if (!navigator.geolocation) {
            setLocationStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                console.log('=== THÔNG TIN VỊ TRÍ ===');
                console.log('📍 Vị trí của bạn:', { lat: userLat, lng: userLng });
                console.log('🎯 Độ chính xác GPS:', accuracy, 'mét');
                console.log('🏢 Khu đô thị FPT City:', HOSPITAL_LOCATION);
                console.log('📏 Khoảng cách thực:', Math.abs(userLat - HOSPITAL_LOCATION.lat), 'độ lat');
                console.log('📏 Khoảng cách thực:', Math.abs(userLng - HOSPITAL_LOCATION.lng), 'độ lng');

                setUserLocation({ lat: userLat, lng: userLng });

                const dist = calculateDistance(userLat, userLng, HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng);
                console.log('Khoảng cách tính được:', dist.toFixed(3), 'km');

                setDistance(dist.toFixed(2));
                setEstimatedTime(Math.round((dist / 25) * 60).toString());
                setLocationStatus('success');
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationStatus('error');
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return {
        userLocation,
        distance,
        estimatedTime,
        locationStatus,
        getCurrentLocation
    };
};

export { HOSPITAL_LOCATION };
