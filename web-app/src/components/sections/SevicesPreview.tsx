'use client'
import { Clock, Heart, Users } from "lucide-react";

const ServicesPreview = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch Vụ Y Tế Của Chúng Tôi</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi cung cấp dịch vụ chăm sóc y tế toàn diện với cơ sở vật chất hiện đại và đội ngũ chuyên gia y tế giàu kinh nghiệm.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Heart className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tim Mạch</h3>
                        <p className="text-gray-600">Chăm sóc tim mạch toàn diện với các phương pháp chẩn đoán và điều trị tiên tiến.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Y Học Gia Đình</h3>
                        <p className="text-gray-600">Chăm sóc sức khỏe toàn diện cho bệnh nhân ở mọi lứa tuổi và tình trạng bệnh lý.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cấp Cứu Khẩn Cấp</h3>
                        <p className="text-gray-600">Dịch vụ y tế cấp cứu 24/7 cho các trường hợp khẩn cấp về sức khỏe.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServicesPreview;