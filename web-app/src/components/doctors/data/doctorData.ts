export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    experience: string;
    location: string;
    availability: string;
    image: string;
}

export const doctors: Doctor[] = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        rating: 4.9,
        reviews: 124,
        experience: '15 years',
        location: 'Manhattan Medical Center',
        availability: 'Available Today',
        image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurologist',
        rating: 4.8,
        reviews: 98,
        experience: '12 years',
        location: 'Central Hospital',
        availability: 'Available Tomorrow',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrician',
        rating: 4.7,
        reviews: 156,
        experience: '10 years',
        location: "Children's Medical Center",
        availability: 'Available Today',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    {
        id: 4,
        name: 'Dr. James Wilson',
        specialty: 'Dermatologist',
        rating: 4.6,
        reviews: 87,
        experience: '8 years',
        location: 'Skin & Beauty Clinic',
        availability: 'Available in 2 days',
        image: 'https://randomuser.me/api/portraits/men/52.jpg',
    },
    {
        id: 5,
        name: 'Dr. Sophia Patel',
        specialty: 'Gynecologist',
        rating: 4.9,
        reviews: 215,
        experience: '14 years',
        location: "Women's Health Center",
        availability: 'Available Today',
        image: 'https://randomuser.me/api/portraits/women/67.jpg',
    },
    {
        id: 6,
        name: 'Dr. Robert Kim',
        specialty: 'Orthopedic Surgeon',
        rating: 4.8,
        reviews: 178,
        experience: '16 years',
        location: 'Orthopedic Specialists',
        availability: 'Available Tomorrow',
        image: 'https://randomuser.me/api/portraits/men/64.jpg',
    },
];

export const specialties: string[] = [
    'All',
    'Cardiologist',
    'Neurologist',
    'Pediatrician',
    'Dermatologist',
    'Gynecologist',
    'Orthopedic Surgeon',
];