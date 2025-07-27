'use client';

import React, { useState } from 'react';
import {
    Award,
    Users,
    Heart,
    TrendingUp,
    Calendar,
    MapPin,
    Clock,
    Star,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Download,
    Play
} from 'lucide-react';

const PortfolioPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('achievements');
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const achievements = [
        {
            year: '2023',
            title: 'Bệnh viện số 1 về chất lượng dịch vụ',
            description: 'Được Bộ Y tế công nhận là bệnh viện có chất lượng dịch vụ tốt nhất khu vực miền Nam.',
            image: 'https://bqn.1cdn.vn/2025/06/21/baodanang.vn-dataimages-202506-original-_images1782034_5______bv3.png',
            category: 'Giải thưởng'
        },
        {
            year: '2022',
            title: 'Chứng nhận ISO 9001:2015',
            description: 'Đạt tiêu chuẩn quốc tế về hệ thống quản lý chất lượng trong y tế.',
            image: 'https://knacert.com.vn/storage/mau-chung-nhan-isso-9001-2015-12345.jpg',
            category: 'Chứng nhận'
        },
        {
            year: '2022',
            title: 'Ca phẫu thuật tim phức tạp thành công',
            description: 'Thực hiện thành công ca phẫu thuật tim bẩm sinh phức tạp cho bệnh nhi 6 tháng tuổi.',
            image: 'https://cdn-images.vtv.vn/thumb_w/640/66349b6076cb4dee98746cf1/2024/09/14/tim-73374754874607788878851.png',
            category: 'Y khoa'
        },
        {
            year: '2021',
            title: 'Trung tâm đào tạo y khoa hàng đầu',
            description: 'Trở thành trung tâm đào tạo bác sĩ chuyên khoa được công nhận bởi Bộ Giáo dục.',
            image: 'https://aromaedu.vn/wp-content/uploads/2024/09/DSC00370-2048x1365-2-1024x683.jpg',
            category: 'Giáo dục'
        }
    ];

    const caseStudies = [
        {
            id: 1,
            title: 'Điều trị thành công bệnh nhân COVID-19 nặng',
            patient: 'Bệnh nhân nam, 65 tuổi',
            condition: 'COVID-19 biến chứng viêm phổi nặng',
            treatment: 'ECMO, thở máy, điều trị kháng virus',
            outcome: 'Xuất viện sau 45 ngày điều trị',
            image: '/api/placeholder/500/300',
            doctor: 'TS.BS Nguyễn Văn A',
            date: '03/2023'
        },
        {
            id: 2,
            title: 'Phẫu thuật não thành công',
            patient: 'Bệnh nhân nữ, 42 tuổi',
            condition: 'U não ác tính vùng thùy trán',
            treatment: 'Phẫu thuật cắt u với hỗ trợ navigation',
            outcome: 'Phục hồi hoàn toàn chức năng vận động',
            image: '/api/placeholder/500/300',
            doctor: 'PGS.TS Trần Thị B',
            date: '01/2023'
        },
        {
            id: 3,
            title: 'Ca sinh đôi dính liền được tách thành công',
            patient: 'Trẻ sinh đôi, 8 tháng tuổi',
            condition: 'Sinh đôi dính liền vùng bụng',
            treatment: 'Phẫu thuật tách với ekip 15 bác sĩ',
            outcome: 'Cả hai bé đều khỏe mạnh và phát triển bình thường',
            image: '/api/placeholder/500/300',
            doctor: 'Ekip phẫu thuật đa chuyên khoa',
            date: '11/2022'
        }
    ];

    const testimonials = [
        {
            name: 'Chị Nguyễn Thị Mai',
            age: '45 tuổi',
            condition: 'Phẫu thuật tim',
            content: 'Tôi rất biết ơn đội ngũ bác sĩ tại đây. Sau ca phẫu thuật tim, tôi đã hoàn toàn khỏe mạnh và có thể sinh hoạt bình thường. Dịch vụ chăm sóc rất tận tâm.',
            rating: 5,
            image: 'https://tanvoishop.com/wp-content/uploads/2025/06/avatar-gai-xinh-11.jpg',
            date: 'Tháng 3, 2023'
        },
        {
            name: 'Anh Trần Văn Nam',
            age: '38 tuổi',
            condition: 'Điều trị ung thư',
            content: 'Quá trình điều trị ung thư tại đây rất chuyên nghiệp. Các bác sĩ luôn theo dõi sát sao và động viên tinh thần. Giờ tôi đã khỏe lại.',
            rating: 5,
            image: 'https://watermark.lovepik.com/photo/20211203/large/lovepik-smiling-mature-man-picture_501470650.jpg',
            date: 'Tháng 2, 2023'
        },
        {
            name: 'Bà Lê Thị Hoa',
            age: '62 tuổi',
            condition: 'Thay khớp gối',
            content: 'Sau phẫu thuật thay khớp gối, tôi có thể đi lại bình thường. Đội ngũ y tá và bác sĩ rất chu đáo, luôn quan tâm đến tình trạng của bệnh nhân.',
            rating: 5,
            image: 'https://tanvoishop.com/wp-content/uploads/2025/06/avatar-gai-xinh-14.jpg',
            date: 'Tháng 1, 2023'
        }
    ];

    const stats = [
        { number: '50,000+', label: 'Bệnh nhân đã điều trị', icon: Users },
        { number: '98%', label: 'Tỷ lệ thành công', icon: TrendingUp },
        { number: '200+', label: 'Bác sĩ chuyên khoa', icon: Heart },
        { number: '15+', label: 'Năm kinh nghiệm', icon: Award }
    ];

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Thành Tựu & Dự Án
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Những thành tựu y khoa và dự án chăm sóc sức khỏe nổi bật
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                        <Icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="py-8 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'achievements'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-blue-50'
                                }`}
                        >
                            Thành tựu & Giải thưởng
                        </button>
                        <button
                            onClick={() => setActiveTab('cases')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'cases'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-blue-50'
                                }`}
                        >
                            Ca bệnh tiêu biểu
                        </button>
                        <button
                            onClick={() => setActiveTab('testimonials')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'testimonials'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-blue-50'
                                }`}
                        >
                            Cảm nhận bệnh nhân
                        </button>
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            {activeTab === 'achievements' && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Thành Tựu & Giải Thưởng
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Những cột mốc quan trọng trong hành trình phát triển của chúng tôi
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <img
                                        src={achievement.image}
                                        alt={achievement.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                                {achievement.category}
                                            </span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {achievement.year}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Case Studies Section */}
            {activeTab === 'cases' && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Ca Bệnh Tiêu Biểu
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Những ca điều trị thành công đáng chú ý của chúng tôi
                            </p>
                        </div>
                        <div className="space-y-8">
                            {caseStudies.map((caseStudy, index) => (
                                <div key={caseStudy.id} className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                    }`}>
                                    <div className="lg:flex">
                                        <div className="lg:w-1/2">
                                            <img
                                                src={caseStudy.image}
                                                alt={caseStudy.title}
                                                className="w-full h-64 lg:h-full object-cover"
                                            />
                                        </div>
                                        <div className="lg:w-1/2 p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                                                    Thành công
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {caseStudy.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                                {caseStudy.title}
                                            </h3>
                                            <div className="space-y-3 mb-6">
                                                <div>
                                                    <span className="font-medium text-gray-700">Bệnh nhân: </span>
                                                    <span className="text-gray-600">{caseStudy.patient}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Tình trạng: </span>
                                                    <span className="text-gray-600">{caseStudy.condition}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Điều trị: </span>
                                                    <span className="text-gray-600">{caseStudy.treatment}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Kết quả: </span>
                                                    <span className="text-green-600 font-medium">{caseStudy.outcome}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Bác sĩ phụ trách: </span>
                                                    <span className="text-gray-600">{caseStudy.doctor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {activeTab === 'testimonials' && (
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Cảm Nhận Bệnh Nhân
                            </h2>
                            <p className="text-lg text-gray-600">
                                Những chia sẻ chân thành từ bệnh nhân đã được chúng tôi chăm sóc
                            </p>
                        </div>
                        <div className="relative">
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <div className="flex items-center mb-6">
                                    <img
                                        src={testimonials[currentTestimonial].image}
                                        alt={testimonials[currentTestimonial].name}
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {testimonials[currentTestimonial].name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {testimonials[currentTestimonial].age} • {testimonials[currentTestimonial].condition}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <blockquote className="text-lg text-gray-700 italic mb-4">
                                    "{testimonials[currentTestimonial].content}"
                                </blockquote>
                                <p className="text-sm text-gray-500">
                                    {testimonials[currentTestimonial].date}
                                </p>
                            </div>

                            {/* Navigation buttons */}
                            <button
                                onClick={prevTestimonial}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <button
                                onClick={nextTestimonial}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Dots indicator */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Trở Thành Câu Chuyện Thành Công Tiếp Theo</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Hãy để chúng tôi đồng hành cùng bạn trên hành trình chăm sóc sức khỏe
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300">
                        Đặt lịch tư vấn ngay
                    </button>
                </div>
            </section>

            {/* Location & Map Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Vị Trí Bệnh Viện
                        </h2>
                        <p className="text-lg text-gray-600">
                            Dễ dàng tìm đường đến với chúng tôi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Location Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="flex items-start">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Địa chỉ
                                        </h3>
                                        <p className="text-gray-600 mb-1">
                                            Khu đô thị FPT Đà Nẵng
                                        </p>
                                        <p className="text-gray-600 mb-1">
                                            Hòa Hải, Ngũ Hành Sơn, Đà Nẵng
                                        </p>
                                        <p className="text-gray-600">
                                            Mã bưu điện: 550000
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="flex items-start">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Giờ làm việc
                                        </h3>
                                        <p className="text-gray-600 mb-1">
                                            Thứ 2 - Thứ 6: 7:00 - 19:00
                                        </p>
                                        <p className="text-gray-600 mb-1">
                                            Thứ 7 - Chủ nhật: 8:00 - 17:00
                                        </p>
                                        <p className="text-red-600 font-medium">
                                            Cấp cứu: 24/7
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Liên hệ nhanh
                                </h3>
                                <div className="space-y-3">
                                    <a
                                        href="tel:19001234567"
                                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            📞
                                        </div>
                                        Hotline: 1900 123 456
                                    </a>
                                    <a
                                        href="mailto:info@medcare.vn"
                                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            ✉️
                                        </div>
                                        info@medcare.vn
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-gray-300 h-96 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium text-lg mb-2">
                                            Bản đồ Google Maps
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Đại học FPT Đà Nẵng, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <a
                                                href="https://maps.google.com/?q=123+Đường+2/9,+Hòa+Cường+Nam,+Ngũ+Hành+Sơn,+Đà+Nẵng"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Xem trên Google Maps
                                            </a>
                                            <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                                                <Download className="w-4 h-4 mr-2" />
                                                Tải về điện thoại
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transportation Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                🚗
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Ô tô cá nhân
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                                Bãi đỗ xe miễn phí
                            </p>
                            <p className="text-blue-600 font-medium text-sm">
                                200 chỗ đỗ xe
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                🚌
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Xe buýt
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                                Tuyến xe buýt đi qua
                            </p>
                            <p className="text-green-600 font-medium text-sm">
                                Tuyến 01, 25, 53
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                🚑
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Xe cứu thương
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                                Dịch vụ đưa đón 24/7
                            </p>
                            <p className="text-red-600 font-medium text-sm">
                                Hotline: 1900 911 911
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PortfolioPage;
