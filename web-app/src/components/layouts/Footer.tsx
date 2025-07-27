import { Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Medically</span>
                        </div>
                        <p className="text-gray-400">
                            Cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao để giúp bạn có cuộc sống khỏe mạnh và hạnh phúc.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Liên Kết Nhanh</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Giới Thiệu</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Dịch Vụ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Bác Sĩ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Liên Hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Dịch Vụ</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Tim Mạch</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Y Học Gia Đình</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cấp Cứu Khẩn Cấp</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Nhi Khoa</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Thông Tin Liên Hệ</h3>
                        <div className="space-y-2 text-gray-400">
                            <p>123 Đường Y Tế, Quận Trung Tâm</p>
                            <p>Thành phố Hồ Chí Minh, Việt Nam</p>
                            <p>Điện thoại: (028) 1234-5678</p>
                            <p>Email: info@medically.vn</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Medically. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;