export const getRedirectPath = (userType: string): string => {
    switch (userType) {
        case 'DOCTOR':
            return '/doctor';
        case 'RECEPTIONIST':
            return '/receptionist';
        case 'ADMIN':
            return '/manager';
        case 'USER':
        default:
            return '/';
    }
};