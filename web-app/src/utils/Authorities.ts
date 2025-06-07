export const getRedirectPath = (userType: string): string => {
    switch (userType) {
        case 'DOCTOR':
            return '/doctor';
        case 'STAFF':
            return '/staff';
        case 'USER':
        default:
            return '/';
    }
};