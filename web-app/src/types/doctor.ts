export interface Doctor {
    id: string;
    name: string;
    department: string;
    schedule: {
        weekdays: string;
        saturday?: string;
        sunday?: string;
    };
    status: 'available' | 'busy' | 'off';
    avatar?: string;
}