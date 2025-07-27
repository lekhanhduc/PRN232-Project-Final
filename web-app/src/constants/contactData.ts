import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Car,
    Bus,
    Navigation
} from 'lucide-react';

export const CONTACT_INFO = [
    {
        icon: MapPin,
        title: 'Địa chỉ',
        details: [
            'Khu đô thị FPT',
            'Ngũ Hành Sơn, Đà Nẵng, Việt Nam'
        ],
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
    },
    {
        icon: Phone,
        title: 'Điện thoại',
        details: [
            'Hotline: 1900 123 456',
            'Cấp cứu: 028 1234 5678',
            'Tư vấn: 028 8765 4321'
        ],
        color: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    {
        icon: Mail,
        title: 'Email',
        details: [
            'info@medcare.vn',
            'support@medcare.vn',
            'emergency@medcare.vn'
        ],
        color: 'text-red-600',
        bgColor: 'bg-red-100'
    },
    {
        icon: Clock,
        title: 'Giờ làm việc',
        details: [
            'Thứ 2 - Thứ 6: 7:00 - 19:00',
            'Thứ 7 - Chủ nhật: 8:00 - 17:00',
            'Cấp cứu: 24/7'
        ],
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
    }
];

export const DEPARTMENTS = [
    { name: 'Khoa Tim mạch', phone: '028 1111 1111' },
    { name: 'Khoa Nội tổng hợp', phone: '028 2222 2222' },
    { name: 'Khoa Ngoại tổng hợp', phone: '028 3333 3333' },
    { name: 'Khoa Sản phụ khoa', phone: '028 4444 4444' },
    { name: 'Khoa Nhi', phone: '028 5555 5555' },
    { name: 'Khoa Cấp cứu', phone: '028 6666 6666' }
];

export const TRANSPORT_OPTIONS = [
    {
        icon: Car,
        title: 'Ô tô cá nhân',
        description: 'Bãi đỗ xe miễn phí cho bệnh nhân',
        details: '200 chỗ đỗ xe'
    },
    {
        icon: Bus,
        title: 'Xe buýt',
        description: 'Tuyến xe buýt đi qua bệnh viện',
        details: 'Tuyến 01, 25, 53, 126'
    },
    {
        icon: Navigation,
        title: 'Xe cứu thương',
        description: 'Dịch vụ đưa đón bệnh nhân',
        details: 'Hotline: 1900 911 911'
    }
];
