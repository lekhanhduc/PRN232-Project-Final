'use client';

import React from 'react';
import {
    Heart,
    Users,
    Award,
    Shield,
    Stethoscope,
    Clock,
    MapPin,
    Phone,
    Mail,
    Star,
    CheckCircle,
    Target,
    Lightbulb,
    HandHeart
} from 'lucide-react';

const AboutPage: React.FC = () => {
    const stats = [
        { icon: Users, number: '50,000+', label: 'Bệnh nhân đã điều trị', color: 'text-blue-600' },
        { icon: Stethoscope, number: '200+', label: 'Bác sĩ chuyên khoa', color: 'text-blue-600' },
        { icon: Award, number: '15+', label: 'Năm kinh nghiệm', color: 'text-blue-600' },
        { icon: Heart, number: '99%', label: 'Tỷ lệ hài lòng', color: 'text-blue-600' }
    ];

    const values = [
        {
            icon: Heart,
            title: 'Tận tâm',
            description: 'Chúng tôi luôn đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu.',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: Shield,
            title: 'An toàn',
            description: 'Tuân thủ nghiêm ngặt các tiêu chuẩn y tế quốc tế và quy trình an toàn.',
            color: 'bg-gray-50 text-gray-600'
        },
        {
            icon: Award,
            title: 'Chuyên nghiệp',
            description: 'Đội ngũ y bác sĩ giàu kinh nghiệm với trình độ chuyên môn cao.',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: Clock,
            title: 'Tiện lợi',
            description: 'Hệ thống đặt lịch trực tuyến hiện đại, tiết kiệm thời gian cho bệnh nhân.',
            color: 'bg-gray-50 text-gray-600'
        }
    ];

    const team = [
        {
            name: 'TS.BS Nguyễn Văn A',
            position: 'Giám đốc Y khoa',
            specialty: 'Tim mạch',
            image: 'https://vinuni.edu.vn/wp-content/uploads/2024/08/theo-nganh-bac-si-tam-ly-hoc-truong-nao-danh-sach-cac-truong-so-1.jpg',
            experience: '20 năm kinh nghiệm'
        },
        {
            name: 'ThS.BS Trần Thị B',
            position: 'Phó Giám đốc',
            specialty: 'Nội tiết',
            image: 'https://khpt.1cdn.vn/2024/02/27/le-vi-anh.jpg',
            experience: '15 năm kinh nghiệm'
        },
        {
            name: 'BS.CKI Lê Văn C',
            position: 'Trưởng khoa Ngoại',
            specialty: 'Phẫu thuật',
            image: 'https://ttu.edu.vn/wp-content/uploads/2025/04/bac-si-da-khoa-hoc-may-nam.png',
            experience: '18 năm kinh nghiệm'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 lg:py-28">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-blue-500 bg-opacity-20 rounded-full px-4 py-2 mb-6">
                            <HandHeart className="w-5 h-5 mr-2" />
                            <span className="text-blue-100">Chăm sóc y tế chuyên nghiệp</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Về <span className="text-blue-200">MedCare</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Chăm sóc sức khỏe với tình yêu thương và sự tận tâm
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 bg-opacity-20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 bg-opacity-10 rounded-full animate-bounce"></div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
                                <Target className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="text-blue-700 font-medium">Sứ mệnh của chúng tôi</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                Cam kết mang đến dịch vụ
                                <span className="text-blue-600"> chăm sóc sức khỏe </span>
                                chất lượng cao
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                MedCare cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao,
                                với đội ngũ y bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại nhất.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Chúng tôi tin rằng mỗi bệnh nhân đều xứng đáng được chăm sóc tốt nhất,
                                với sự tận tâm và chuyên nghiệp từ đội ngũ y tế.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center group">
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">Chăm sóc y tế chất lượng cao</span>
                                </div>
                                <div className="flex items-center group">
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">Đội ngũ bác sĩ chuyên nghiệp</span>
                                </div>
                                <div className="flex items-center group">
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">Trang thiết bị hiện đại</span>
                                </div>
                                <div className="flex items-center group">
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">Dịch vụ 24/7</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="About Us"
                                    className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-lg z-20">
                                <div className="text-3xl font-bold">15+</div>
                                <div className="text-blue-100">Năm kinh nghiệm</div>
                            </div>
                            {/* Background decoration */}
                            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-50 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
                            <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">Thành tựu của chúng tôi</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Những con số ấn tượng
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Minh chứng cho chất lượng dịch vụ và sự tin tưởng của bệnh nhân
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                                            <Icon className={`w-8 h-8 ${stat.color}`} />
                                        </div>
                                        <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                                        <div className="text-gray-600 font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
                            <Star className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">Giá trị cốt lõi</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Những giá trị định hướng
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Những giá trị định hướng hoạt động và phát triển của chúng tôi
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="group">
                                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 h-full">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${value.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
                            <Users className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">Đội ngũ chuyên nghiệp</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Đội Ngũ Lãnh Đạo
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Những chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {member.name}
                                        </h3>
                                        <p className="text-blue-600 font-medium mb-2">
                                            {member.position}
                                        </p>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <Stethoscope className="w-4 h-4 mr-2" />
                                            <span>Chuyên khoa: {member.specialty}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Award className="w-4 h-4 mr-2" />
                                            <span>{member.experience}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="bg-slate-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
                            <Phone className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">Liên hệ với chúng tôi</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn
                        </h2>
                        <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                            Đừng ngần ngại liên hệ với chúng tôi bất cứ khi nào bạn cần
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-95 transition-all duration-300 hover:transform hover:-translate-y-2">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Địa chỉ</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Khu đô thị FPT Đà Nẵng<br />
                                    Hòa Hải, Ngũ Hành Sơn, Đà Nẵng
                                </p>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-95 transition-all duration-300 hover:transform hover:-translate-y-2">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Điện thoại</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Hotline: 1900 123 456<br />
                                    Cấp cứu: 028 1234 5678
                                </p>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-95 transition-all duration-300 hover:transform hover:-translate-y-2">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Email</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    info@medcare.vn<br />
                                    support@medcare.vn
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
