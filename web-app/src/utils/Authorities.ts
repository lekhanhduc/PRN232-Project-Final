export const getRedirectPath = (userType: string): string => {
    switch (userType) {
        case 'DOCTOR':
            return '/doctor';
        case 'STAFF':
            return '/staff';
        case 'ADMIN':
            return '/manager';
        case 'USER':
        default:
            return '/';
    }
};