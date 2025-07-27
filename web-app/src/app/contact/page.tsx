'use client';

import React from 'react';
import {
    Car,
    Bus,
    Navigation,
    Heart,
    Shield,
    Stethoscope,
    Users,
    Phone,
    Mail
} from 'lucide-react';
import ContactForm from '../../components/contact/ContactForm';
import LocationInfo from '../../components/contact/LocationInfo';
import { CONTACT_INFO, DEPARTMENTS, TRANSPORT_OPTIONS } from '../../constants/contactData';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Liên Hệ Với Chúng Tôi
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Chúng tôi luôn sẵn sàng hỗ trợ và chăm sóc sức khỏe của bạn
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Users, number: '24/7', text: 'Hỗ trợ khẩn cấp', color: 'blue' },
                            { icon: Stethoscope, number: '200+', text: 'Bác sĩ chuyên khoa', color: 'green' },
                            { icon: Heart, number: '50K+', text: 'Bệnh nhân hài lòng', color: 'red' },
                            { icon: Shield, number: '15+', text: 'Năm kinh nghiệm', color: 'purple' }
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-${stat.color}-100 rounded-full mb-4`}>
                                        <Icon className={`w-8 h-8 text-${stat.color}-600`} />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-gray-600">{stat.text}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Thông Tin Liên Hệ
                            </h2>
                            <div className="space-y-6">
                                {CONTACT_INFO.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                            <div className="flex items-start">
                                                <div className={`inline-flex items-center justify-center w-12 h-12 ${info.bgColor} rounded-lg mr-4 flex-shrink-0`}>
                                                    <Icon className={`w-6 h-6 ${info.color}`} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {info.title}
                                                    </h3>
                                                    {info.details.map((detail, idx) => (
                                                        <p key={idx} className="text-gray-600 mb-1">
                                                            {detail}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <ContactForm />
                    </div>
                </div>
            </section>

            {/* Departments */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Liên Hệ Trực Tiếp Các Khoa
                        </h2>
                        <p className="text-lg text-gray-600">
                            Liên hệ trực tiếp với khoa phòng để được tư vấn nhanh chóng
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DEPARTMENTS.map((dept, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                                        <p className="text-gray-600 flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {dept.phone}
                                        </p>
                                    </div>
                                    <Stethoscope className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transportation */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Hướng Dẫn Đi Lại
                        </h2>
                        <p className="text-lg text-gray-600">
                            Các phương tiện di chuyển đến bệnh viện
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TRANSPORT_OPTIONS.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                        <Icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {option.title}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        {option.description}
                                    </p>
                                    <p className="text-sm text-blue-600 font-medium">
                                        {option.details}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Vị Trí Bệnh Viện
                        </h2>
                        <p className="text-lg text-gray-600">
                            Tìm đường đến bệnh viện dễ dàng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Map */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0234!2d108.2506103!3d15.9752694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219b3d52b4e85%3A0x123456789!2sKhu%20%C4%91%C3%B4%20th%E1%BB%8B%20FPT%20City%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1svi!2svn!4v1704171234567!5m2!1svi!2svn"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Vị trí Khu đô thị FPT City Đà Nẵng"
                                    className="w-full h-96 rounded-lg"
                                />
                            </div>
                        </div>

                        <LocationInfo />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Car, title: 'Đỗ xe miễn phí', desc: 'Khu vực đỗ xe rộng rãi', detail: '200+ chỗ đỗ xe', color: 'blue' },
                            { icon: Bus, title: 'Giao thông công cộng', desc: 'Nhiều tuyến xe buýt', detail: 'Tuyến 01, 25, 53', color: 'green' },
                            { icon: Navigation, title: 'Dịch vụ cấp cứu', desc: 'Xe cứu thương 24/7', detail: 'Hotline: 1900 911 911', color: 'red' }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-100 rounded-full mb-4`}>
                                        <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {feature.desc}
                                    </p>
                                    <p className={`text-${feature.color}-600 font-medium text-sm`}>
                                        {feature.detail}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Emergency Contact */}
            <section className="bg-red-600 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">
                            Cần Hỗ Trợ Khẩn Cấp?
                        </h2>
                        <p className="text-red-100 mb-6">
                            Chúng tôi sẵn sàng hỗ trợ bạn 24/7
                        </p>
                        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
                            <a
                                href="tel:19001234567"
                                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-300 flex items-center"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Gọi Cấp Cứu: 1900 123 456
                            </a>
                            <a
                                href="mailto:emergency@medcare.vn"
                                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-300 flex items-center"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                Email Khẩn Cấp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
