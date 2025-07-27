import React, { useState } from 'react';
import {
    Send,
    User,
    Mail,
    Phone,
    MessageCircle,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    appointmentType: string;
    preferredDate: string;
    urgency: string;
}

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        appointmentType: '',
        preferredDate: '',
        urgency: 'normal'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                appointmentType: '',
                preferredDate: '',
                urgency: 'normal'
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Gửi Tin Nhắn
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm.
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Có lỗi xảy ra. Vui lòng thử lại sau.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Họ và tên *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập email"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại dịch vụ
                            </label>
                            <select
                                name="appointmentType"
                                value={formData.appointmentType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn dịch vụ</option>
                                <option value="consultation">Tư vấn khám bệnh</option>
                                <option value="appointment">Đặt lịch hẹn</option>
                                <option value="emergency">Cấp cứu</option>
                                <option value="general">Thông tin chung</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chủ đề *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập chủ đề tin nhắn"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tin nhắn *
                        </label>
                        <div className="relative">
                            <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows={5}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Nhập nội dung tin nhắn..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mức độ ưu tiên
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="urgency"
                                    value="normal"
                                    checked={formData.urgency === 'normal'}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className="text-green-600">Bình thường</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="urgency"
                                    value="urgent"
                                    checked={formData.urgency === 'urgent'}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className="text-yellow-600">Khẩn cấp</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="urgency"
                                    value="emergency"
                                    checked={formData.urgency === 'emergency'}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className="text-red-600">Cấp cứu</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Send className="w-5 h-5 mr-2" />
                        )}
                        {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
