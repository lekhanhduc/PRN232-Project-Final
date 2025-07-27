'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Calendar,
    User,
    Clock,
    Eye,
    Tag,
    ChevronLeft,
    Share2,
    Bookmark,
    Heart,
    MessageCircle,
    Facebook,
    Twitter,
    Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

const BlogDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const blogId = params.id as string;

    // Sample blog data - in real app this would come from API
    const allPosts = [
        {
            id: '1',
            title: '10 Cách Tăng Cường Hệ Miễn Dịch Tự Nhiên',
            excerpt: 'Khám phá những phương pháp đơn giản nhưng hiệu quả để tăng cường hệ miễn dịch và bảo vệ sức khỏe.',
            image: 'https://vitadairy.vn/s/images/post/tam-quan-trong-cua-he-mien-dich-doi-voi-co-the.jpg',
            category: 'health-tips',
            author: 'BS. Nguyễn Văn A',
            date: '2024-01-15',
            readTime: '5 phút',
            views: 1250,
            tags: ['miễn dịch', 'sức khỏe', 'dinh dưỡng'],
            content: `
                <p>Hệ miễn dịch là tuyến phòng thủ đầu tiên của cơ thể chống lại các tác nhân gây bệnh. Việc tăng cường hệ miễn dịch tự nhiên không chỉ giúp bạn khỏe mạnh mà còn nâng cao chất lượng cuộc sống.</p>

                <h2>1. Ăn uống đầy đủ dinh dưỡng</h2>
                <p>Chế độ ăn uống cân bằng với đầy đủ vitamin, khoáng chất là nền tảng cho hệ miễn dịch khỏe mạnh. Bao gồm nhiều trái cây, rau xanh, ngũ cốc nguyên hạt và protein chất lượng cao trong khẩu phần ăn hàng ngày.</p>

                <h2>2. Ngủ đủ giấc</h2>
                <p>Giấc ngủ chất lượng giúp cơ thể phục hồi và tái tạo các tế bào miễn dịch. Người trưởng thành nên ngủ 7-9 tiếng mỗi đêm để duy trì hệ miễn dịch hoạt động tối ưu.</p>

                <h2>3. Tập thể dục thường xuyên</h2>
                <p>Hoạt động thể chất vừa phải giúp tăng cường tuần hoàn máu, cải thiện chức năng tim mạch và kích thích sản xuất các tế bào miễn dịch.</p>

                <h2>4. Quản lý stress</h2>
                <p>Stress kéo dài có thể làm suy yếu hệ miễn dịch. Thực hành các kỹ thuật thư giãn như yoga, thiền hoặc hít thở sâu để giảm căng thẳng.</p>

                <h2>5. Uống đủ nước</h2>
                <p>Nước giúp vận chuyển các chất dinh dưỡng trong cơ thể và hỗ trợ các chức năng miễn dịch. Uống ít nhất 8 ly nước mỗi ngày.</p>
            `
        },
        {
            id: '2',
            title: 'Chế Độ Ăn Lành Mạnh Cho Tim Mạch',
            excerpt: 'Hướng dẫn chi tiết về chế độ dinh dưỡng giúp bảo vệ tim mạch và phòng ngừa bệnh lý tim mạch.',
            image: 'https://www.vinmec.com/static/uploads/20210714_031227_865269_benh_tim_nen_an_gi_max_1800x1800_jpg_96a2b34b00.jpg?fbclid=IwY2xjawLywHxleHRuA2FlbQIxMABicmlkETEyVURkN1k5M0w0S2U5NUNqAR7_TapzBUfYLyn-Oece-turbtla7Xq9YBEoMAENcz2-T97l5_PXPD-G-Sp4AA_aem_vjFvDKPEa1mmrheWQMG3CA',
            category: 'nutrition',
            author: 'TS.BS Trần Thị B',
            date: '2024-01-12',
            readTime: '7 phút',
            views: 2180,
            tags: ['tim mạch', 'dinh dưỡng', 'phòng bệnh'],
            content: `
                <p>Tim mạch khỏe mạnh là nền tảng cho một cuộc sống chất lượng. Chế độ ăn uống đóng vai trò quan trọng trong việc bảo vệ và duy trì sức khỏe tim mạch.</p>

                <h2>Nguyên tắc dinh dưỡng cho tim mạch</h2>
                <p>Một chế độ ăn tốt cho tim mạch nên giàu chất xơ, ít chất béo bão hòa và trans, ít natri và đường tinh luyện.</p>

                <h2>Thực phẩm nên ăn</h2>
                <ul>
                    <li>Cá béo như cá hồi, cá thu chứa omega-3</li>
                    <li>Các loại hạt như hạnh nhân, óc chó</li>
                    <li>Rau xanh đậm màu</li>
                    <li>Trái cây tươi</li>
                    <li>Ngũ cốc nguyên hạt</li>
                </ul>

                <h2>Thực phẩm nên tránh</h2>
                <ul>
                    <li>Thức ăn nhanh và đồ chiên rán</li>
                    <li>Thực phẩm chế biến sẵn</li>
                    <li>Đồ uống có đường</li>
                    <li>Muối quá nhiều</li>
                </ul>
            `
        },
        {
            id: '3',
            title: 'Tầm Quan Trọng Của Việc Khám Sức Khỏe Định Kỳ',
            excerpt: 'Tại sao việc khám sức khỏe định kỳ lại quan trọng và nên thực hiện như thế nào?',
            image: 'https://medlatec.vn/media/5507/content/20220713_loi-ich-kham-suc-khoe-dinh-ky-1.jpg?fbclid=IwY2xjawLywPBleHRuA2FlbQIxMABicmlkETEyVURkN1k5M0w0S2U5NUNqAR7A_kcH_kuR6yiHGnYZZDYWxhx9GT2hqwWSozc2qp_oW3Ik1j79GOgcQkX7hw_aem_6XMWvcrS8I9uRqOjNpoWDw',
            category: 'disease-prevention',
            author: 'BS. Lê Văn C',
            date: '2024-01-10',
            readTime: '4 phút',
            views: 890,
            tags: ['khám định kỳ', 'phòng bệnh', 'sức khỏe'],
            content: `
                <p>Khám sức khỏe định kỳ là một trong những biện pháp quan trọng nhất để duy trì sức khỏe và phát hiện sớm các vấn đề sức khỏe tiềm ẩn.</p>

                <h2>Lợi ích của khám sức khỏe định kỳ</h2>
                <p>Khám định kỳ giúp phát hiện sớm các bệnh lý, theo dõi tình trạng sức khỏe tổng quát và đưa ra lời khuyên phù hợp cho từng độ tuổi.</p>

                <h2>Tần suất khám định kỳ</h2>
                <ul>
                    <li>Dưới 40 tuổi: 1-2 năm/lần</li>
                    <li>40-65 tuổi: 1 năm/lần</li>
                    <li>Trên 65 tuổi: 6 tháng/lần</li>
                </ul>

                <h2>Các xét nghiệm cơ bản</h2>
                <p>Khám tổng quát, xét nghiệm máu, đo huyết áp, kiểm tra tim mạch, và các xét nghiệm chuyên khoa theo độ tuổi.</p>
            `
        },
        {
            id: '4',
            title: 'Yoga và Thiền: Bí Quyết Giảm Stress Hiệu Quả',
            excerpt: 'Khám phá lợi ích của yoga và thiền trong việc cải thiện sức khỏe tinh thần và giảm căng thẳng.',
            image: 'https://cafebiz.cafebizcdn.vn/2019/5/30/photo-1-15592113252051491895382.jpg',
            category: 'mental-health',
            author: 'ThS. Phạm Thị D',
            date: '2024-01-08',
            readTime: '6 phút',
            views: 1540,
            tags: ['yoga', 'thiền', 'giảm stress'],
            content: `
                <p>Trong cuộc sống hiện đại đầy căng thẳng, yoga và thiền trở thành những công cụ hữu hiệu để cân bằng cơ thể và tâm trí.</p>

                <h2>Lợi ích của Yoga</h2>
                <p>Yoga không chỉ giúp tăng cường sức mạnh và độ linh hoạt mà còn cải thiện sức khỏe tinh thần, giảm lo âu và stress.</p>

                <h2>Các tư thế Yoga cơ bản</h2>
                <ul>
                    <li>Tư thế trẻ em (Child's Pose)</li>
                    <li>Tư thế con mèo-con bò (Cat-Cow)</li>
                    <li>Tư thế chó nhìn xuống (Downward Dog)</li>
                    <li>Tư thế chiến binh (Warrior Pose)</li>
                </ul>

                <h2>Thiền chánh niệm</h2>
                <p>Thiền giúp tập trung tâm trí, giảm lo âu và tăng cường khả năng tự nhận thức. Bắt đầu với 5-10 phút mỗi ngày.</p>

                <h2>Kết hợp Yoga và Thiền</h2>
                <p>Kết hợp cả hai phương pháp sẽ mang lại hiệu quả tối ưu trong việc cải thiện sức khỏe thể chất và tinh thần.</p>
            `
        },
        {
            id: '5',
            title: 'Cách Chăm Sóc Mắt Trong Thời Đại Công Nghệ',
            excerpt: 'Hướng dẫn bảo vệ đôi mắt khỏi tác hại của ánh sáng xanh và các thiết bị điện tử.',
            image: 'https://www.phucanh.vn/media/news/0410_nhung-cong-nghe-man-hinh-may-tinh-bao-ve-mat-tot-nhat-hien-nay-7.jpg',
            category: 'health-tips',
            author: 'BS. Hoàng Văn E',
            date: '2024-01-06',
            readTime: '5 phút',
            views: 2250,
            tags: ['mắt', 'công nghệ', 'bảo vệ'],
            content: `
                <p>Trong thời đại số hóa, chúng ta dành nhiều thời gian trước màn hình điện tử. Điều này có thể gây ra nhiều vấn đề về mắt nếu không được chăm sóc đúng cách.</p>

                <h2>Tác hại của ánh sáng xanh</h2>
                <p>Ánh sáng xanh từ màn hình có thể gây mỏi mắt, khô mắt, và ảnh hưởng đến giấc ngủ. Việc tiếp xúc lâu dài có thể dẫn đến các vấn đề nghiêm trọng hơn.</p>

                <h2>Quy tắc 20-20-20</h2>
                <p>Cứ sau 20 phút nhìn màn hình, hãy nhìn vật cách 20 feet (6 mét) trong 20 giây để mắt được nghỉ ngơi.</p>

                <h2>Các biện pháp bảo vệ mắt</h2>
                <ul>
                    <li>Điều chỉnh độ sáng màn hình phù hợp</li>
                    <li>Sử dụng kính lọc ánh sáng xanh</li>
                    <li>Duy trì khoảng cách an toàn với màn hình</li>
                    <li>Chớp mắt thường xuyên</li>
                    <li>Sử dụng nước nhỏ mắt khi cần</li>
                </ul>

                <h2>Dinh dưỡng cho mắt</h2>
                <p>Bổ sung các vitamin A, C, E và omega-3 để duy trì sức khỏe mắt. Ăn nhiều rau xanh đậm màu và cá béo.</p>
            `
        },
        {
            id: '6',
            title: 'Tập Thể Dục Đúng Cách Cho Người Trung Niên',
            excerpt: 'Những bài tập phù hợp và an toàn cho độ tuổi trung niên để duy trì sức khỏe.',
            image: 'https://www.thethaodaiviet.vn/data/article/phu-nu-tuoi-trung-nien-chay-bo-the-nao-la--2640.jpg',
            category: 'exercise',
            author: 'BS. Ngô Thị F',
            date: '2024-01-04',
            readTime: '8 phút',
            views: 1680,
            tags: ['tập luyện', 'trung niên', 'an toàn'],
            content: `
                <p>Ở độ tuổi trung niên, việc duy trì hoạt động thể chất đều đặn trở nên quan trọng hơn bao giờ hết để duy trì sức khỏe và chất lượng cuộc sống.</p>

                <h2>Lợi ích của tập thể dục ở tuổi trung niên</h2>
                <p>Tập thể dục giúp duy trì khối lượng cơ, tăng cường xương khớp, cải thiện sức khỏe tim mạch và giảm nguy cơ mắc các bệnh mãn tính.</p>

                <h2>Các bài tập phù hợp</h2>
                <h3>1. Bài tập aerobic</h3>
                <ul>
                    <li>Đi bộ nhanh</li>
                    <li>Bơi lội</li>
                    <li>Đạp xe</li>
                    <li>Khiêu vũ</li>
                </ul>

                <h3>2. Bài tập sức mạnh</h3>
                <ul>
                    <li>Nâng tạ nhẹ</li>
                    <li>Sử dụng dây kháng lực</li>
                    <li>Bài tập với trọng lượng cơ thể</li>
                </ul>

                <h3>3. Bài tập độ linh hoạt</h3>
                <ul>
                    <li>Yoga</li>
                    <li>Thái cực quyền</li>
                    <li>Stretching</li>
                </ul>

                <h2>Lưu ý an toàn</h2>
                <p>Bắt đầu từ từ, khởi động kỹ trước khi tập, và lắng nghe cơ thể. Tham khảo ý kiến bác sĩ trước khi bắt đầu chương trình tập luyện mới.</p>
            `
        }
    ];

    const currentPost = allPosts.find(post => post.id === blogId);

    if (!currentPost) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
                    <Link href="/blog" className="text-teal-600 hover:text-teal-700">
                        Quay lại trang blog
                    </Link>
                </div>
            </div>
        );
    }

    const relatedPosts = allPosts.filter(post => post.id !== blogId).slice(0, 3);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getCategoryName = (categoryId: string) => {
        const categories: { [key: string]: string } = {
            'health-tips': 'Mẹo sức khỏe',
            'nutrition': 'Dinh dưỡng',
            'disease-prevention': 'Phòng bệnh',
            'exercise': 'Tập luyện',
            'mental-health': 'Sức khỏe tinh thần'
        };
        return categories[categoryId] || categoryId;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 py-8">
                {/* Article Header */}
                <header className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-xs font-medium">
                            {getCategoryName(currentPost.category)}
                        </span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(currentPost.date)}
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        {currentPost.readTime}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {currentPost.title}
                    </h1>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{currentPost.author}</p>
                                <p className="text-sm text-gray-500">Chuyên gia y tế</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                                <Eye className="w-4 h-4 mr-1" />
                                <span className="text-sm">{currentPost.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <img
                            src={currentPost.image}
                            alt={currentPost.title}
                            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                        />
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        {currentPost.excerpt}
                    </p>
                </header>

                {/* Article Content */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentPost.content }}
                        style={{
                            lineHeight: '1.8',
                            fontSize: '16px'
                        }}
                    />

                    {/* Tags */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <Tag className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Tags:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentPost.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chia sẻ bài viết</h3>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                        </button>
                        <button className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                        </button>
                        <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Copy Link
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center mb-6">
                        <MessageCircle className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Bình luận</h3>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                            rows={4}
                        />
                        <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                            Gửi bình luận
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-500 text-center">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                    </div>
                </div>

                {/* Related Posts */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Bài viết liên quan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.id}`}>
                                <article className="group cursor-pointer">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-32 object-cover rounded-lg mb-3 group-hover:opacity-80 transition-opacity"
                                    />
                                    <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatDate(post.date)}
                                        <span className="mx-2">•</span>
                                        <Eye className="w-3 h-3 mr-1" />
                                        {post.views}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetailPage;
