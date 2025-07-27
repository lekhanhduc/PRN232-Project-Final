export const getRedirectPath = (userType: string): string => {
    switch (userType) {
        case 'DOCTOR':
            return '/dashboard';
        case 'STAFF':
            return '/staff';
        case 'USER':
        default:
            return '/';
    }
};