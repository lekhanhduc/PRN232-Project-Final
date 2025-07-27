'use client';

import React, { useState } from 'react';
import {
    Heart,
    Brain,
    Eye,
    Bone,
    Baby,
    Users,
    Stethoscope,
    Clock,
    Shield,
    Award,
    CheckCircle,
    Star,
    ChevronRight,
    Phone,
    Calendar
} from 'lucide-react';

const ServicesPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const serviceCategories = [
        { id: 'all', name: 'Tất cả dịch vụ', icon: Stethoscope },
        { id: 'cardiology', name: 'Tim mạch', icon: Heart },
        { id: 'neurology', name: 'Thần kinh', icon: Brain },
        { id: 'orthopedics', name: 'Xương khớp', icon: Bone },
        { id: 'pediatrics', name: 'Nhi khoa', icon: Baby },
        { id: 'ophthalmology', name: 'Mắt', icon: Eye }
    ];

    const services = [
        {
            id: 1,
            category: 'cardiology',
            name: 'Khám Tim Mạch Tổng Quát',
            description: 'Khám và tư vấn các bệnh lý tim mạch, đo điện tâm đồ, siêu âm tim.',
            price: '500.000đ - 800.000đ',
            duration: '45 phút',
            icon: Heart,
            features: ['Khám tổng quát', 'Điện tâm đồ', 'Siêu âm tim', 'Tư vấn điều trị'],
            image: 'https://phongkhamminhhoang.com/img/fontend/slide3.jpg'
        },
        {
            id: 2,
            category: 'neurology',
            name: 'Khám Thần Kinh',
            description: 'Chẩn đoán và điều trị các bệnh lý về thần kinh, đau đầu, đột quỵ.',
            price: '600.000đ - 1.000.000đ',
            duration: '60 phút',
            icon: Brain,
            features: ['Khám lâm sàng', 'Đánh giá chức năng', 'Chụp CT/MRI', 'Điều trị'],
            image: 'https://tamanhhospital.vn/wp-content/uploads/2020/12/banner-noi-than-kinh-mobile.jpg'
        },
        {
            id: 3,
            category: 'orthopedics',
            name: 'Khám Xương Khớp',
            description: 'Điều trị các bệnh lý về xương khớp, cột sống, chấn thương thể thao.',
            price: '400.000đ - 700.000đ',
            duration: '30 phút',
            icon: Bone,
            features: ['Khám xương khớp', 'Chụp X-quang', 'Vật lý trị liệu', 'Phẫu thuật'],
            image: 'https://phongkhamykhoasaigon.com/wp-content/uploads/2024/01/1011_chuyen_khoa_co_xuong_khop.jpg'
        },
        {
            id: 4,
            category: 'pediatrics',
            name: 'Khám Nhi Khoa',
            description: 'Chăm sóc sức khỏe toàn diện cho trẻ em từ sơ sinh đến 18 tuổi.',
            price: '300.000đ - 500.000đ',
            duration: '30 phút',
            icon: Baby,
            features: ['Khám tổng quát', 'Tiêm chủng', 'Tăng trưởng', 'Dinh dưỡng'],
            image: 'https://www.bowtie.com.vn/blog/wp-content/uploads/2023/06/top-10-benh-vien-kham-nhi-tot-nhat-o-tp-hcm-ma-bo-me-nen-luu-lai.jpg'
        },
        {
            id: 5,
            category: 'ophthalmology',
            name: 'Khám Mắt',
            description: 'Khám và điều trị các bệnh lý về mắt, đo thị lực, phẫu thuật mắt.',
            price: '350.000đ - 600.000đ',
            duration: '40 phút',
            icon: Eye,
            features: ['Đo thị lực', 'Khám đáy mắt', 'Đo nhãn áp', 'Phẫu thuật'],
            image: 'https://ykhoahopnhan.vn/wp-content/uploads/2019/05/examen-vista-1-1600x800.jpg'
        },
        {
            id: 6,
            category: 'cardiology',
            name: 'Phẫu Thuật Tim',
            description: 'Phẫu thuật tim hở, can thiệp mạch vành với công nghệ tiên tiến.',
            price: '50.000.000đ - 200.000.000đ',
            duration: '3-6 giờ',
            icon: Heart,
            features: ['Phẫu thuật tim hở', 'Can thiệp mạch vành', 'Đặt máy tạo nhịp', 'Hồi sức'],
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiciExd5kW1pd5dcGtOgas2ggOVnfSh1Y_tPUXFMd4caEyyW_683Tr2-Gw8cIs8YAvKF4&usqp=CAU'
        }
    ];

    const specialFeatures = [
        {
            icon: Clock,
            title: 'Đặt lịch nhanh chóng',
            description: 'Hệ thống đặt lịch trực tuyến 24/7, xác nhận ngay lập tức'
        },
        {
            icon: Shield,
            title: 'An toàn tuyệt đối',
            description: 'Tuân thủ nghiêm ngặt các quy trình an toàn y tế quốc tế'
        },
        {
            icon: Award,
            title: 'Chất lượng cao',
            description: 'Đội ngũ bác sĩ chuyên khoa I, II với nhiều năm kinh nghiệm'
        },
        {
            icon: Users,
            title: 'Chăm sóc tận tâm',
            description: 'Dịch vụ chăm sóc cá nhân hóa, theo dõi sức khỏe liên tục'
        }
    ];

    const filteredServices = activeCategory === 'all'
        ? services
        : services.filter(service => service.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Dịch Vụ Y Tế
                        </h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
                            Chăm sóc sức khỏe toàn diện với đội ngũ chuyên gia hàng đầu
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Đặt lịch ngay
                            </button>
                            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-300 flex items-center justify-center">
                                <Phone className="w-5 h-5 mr-2" />
                                Tư vấn miễn phí
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Features */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Tại Sao Chọn Chúng Tôi?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Những ưu điểm vượt trội trong dịch vụ chăm sóc sức khỏe
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {specialFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors duration-300">
                                        <Icon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Dịch Vụ Của Chúng Tôi
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Đa dạng các dịch vụ y tế chuyên khoa với chất lượng cao
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {serviceCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === category.id
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service) => {
                            const Icon = service.icon;
                            return (
                                <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                                    <div className="relative">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-white rounded-full p-3 shadow-lg">
                                                <Icon className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {service.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm text-gray-500">
                                                <Clock className="w-4 h-4 inline mr-1" />
                                                {service.duration}
                                            </div>
                                            <div className="text-green-600 font-semibold">
                                                {service.price}
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            {service.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center group">
                                            Đặt lịch khám
                                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Emergency Section */}
            <section className="bg-red-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Cấp Cứu 24/7</h2>
                    <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                        Dịch vụ cấp cứu hoạt động 24/7 với đội ngũ y bác sĩ chuyên nghiệp,
                        sẵn sàng xử lý mọi tình huống khẩn cấp
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:115" className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300">
                            Gọi cấp cứu: 115
                        </a>
                        <a href="tel:02812345678" className="border border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition-colors duration-300">
                            Hotline: 028 1234 5678
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Chăm Sóc Sức Khỏe?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Đặt lịch khám ngay hôm nay để được tư vấn và chăm sóc tốt nhất từ đội ngũ chuyên gia
                    </p>
                    <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-300 inline-flex items-center">
                        <Calendar className="w-6 h-6 mr-3" />
                        Đặt lịch khám ngay
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
