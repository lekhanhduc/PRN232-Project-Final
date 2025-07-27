'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Calendar,
    User,
    Clock,
    Heart,
    Eye,
    Tag,
    ChevronRight,
    TrendingUp,
    BookOpen,
    Share2,
    Bookmark,
    Filter
} from 'lucide-react';

const BlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Tất cả', count: 24 },
        { id: 'health-tips', name: 'Mẹo sức khỏe', count: 8 },
        { id: 'disease-prevention', name: 'Phòng bệnh', count: 6 },
        { id: 'nutrition', name: 'Dinh dưỡng', count: 5 },
        { id: 'exercise', name: 'Tập luyện', count: 3 },
        { id: 'mental-health', name: 'Sức khỏe tinh thần', count: 2 }
    ];

    const featuredPosts = [
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
            featured: true
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
            featured: true
        }
    ];

    const blogPosts = [
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
            tags: ['khám định kỳ', 'phòng bệnh', 'sức khỏe']
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
            tags: ['yoga', 'thiền', 'giảm stress']
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
            tags: ['mắt', 'công nghệ', 'bảo vệ']
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
            tags: ['tập luyện', 'trung niên', 'an toàn']
        }
    ];

    const popularTags = [
        'sức khỏe', 'dinh dưỡng', 'tập luyện', 'phòng bệnh', 'tim mạch',
        'tiểu đường', 'huyết áp', 'cholesterol', 'vitamin', 'khoáng chất'
    ];

    const trendingTopics = [
        { title: 'COVID-19 và biến chủng mới', views: 15420 },
        { title: 'Vaccine phòng ngừa cúm mùa', views: 8760 },
        { title: 'Chăm sóc sức khỏe người cao tuổi', views: 6540 },
        { title: 'Sức khỏe tâm thần sau đại dịch', views: 5280 }
    ];

    const allPosts = [...featuredPosts, ...blogPosts];

    const filteredPosts = allPosts.filter(post => {
        const matchesSearch = searchTerm === '' || (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ((post as any).tags && (post as any).tags.some((tag: string) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Blog Sức Khỏe
                        </h1>
                        <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto mb-8">
                            Cập nhật những thông tin y tế mới nhất và mẹo chăm sóc sức khỏe
                        </p>

                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết, tác giả, chủ đề..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 pl-14 pr-12 rounded-xl text-gray-900 text-lg bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {searchTerm && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 z-10">
                                    <p className="text-sm text-gray-600">
                                        Tìm thấy <span className="font-semibold text-teal-600">{filteredPosts.length}</span> kết quả cho "{searchTerm}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3">
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Danh mục</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                                            }`}
                                    >
                                        {category.name} ({category.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(searchTerm !== '' || selectedCategory !== 'all') ? (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {searchTerm !== ''
                                        ? `Kết quả tìm kiếm cho "${searchTerm}" (${filteredPosts.length} bài viết)`
                                        : `Bài viết về ${getCategoryName(selectedCategory)} (${filteredPosts.length} bài viết)`
                                    }
                                </h2>
                                <div className="space-y-16">
                                    {filteredPosts.length > 0 ? (
                                        filteredPosts.map((post) => (
                                            <Link key={post.id} href={`/blog/${post.id}`}>
                                                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer mb-8">
                                                    <div className="md:flex">
                                                        <div className="md:w-1/3">
                                                            <img
                                                                src={post.image}
                                                                alt={post.title}
                                                                className="w-full h-48 md:h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="md:w-2/3 p-6">
                                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                    {getCategoryName(post.category)}
                                                                </span>
                                                                <span className="mx-2">•</span>
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                {formatDate(post.date)}
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-teal-600">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-gray-600 mb-4">
                                                                {post.excerpt}
                                                            </p>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <User className="w-4 h-4 mr-1" />
                                                                    {post.author}
                                                                    <Clock className="w-4 h-4 ml-3 mr-1" />
                                                                    {post.readTime}
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    {post.views.toLocaleString()}
                                                                </div>
                                                            </div>
                                                            {(post as any).tags && (
                                                                <div className="flex flex-wrap gap-2 mb-4">
                                                                    {(post as any).tags.map((tag: string, index: number) => (
                                                                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                            #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between">
                                                                <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
                                                                    Đọc thêm
                                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                                </button>
                                                                <div className="flex space-x-2">
                                                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                                                        <Bookmark className="w-4 h-4" />
                                                                    </button>
                                                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                                                        <Share2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-500 mb-2">Không tìm thấy bài viết</h3>
                                            <p className="text-gray-400">
                                                {searchTerm !== ''
                                                    ? `Không có bài viết nào phù hợp với từ khóa "${searchTerm}"`
                                                    : `Không có bài viết nào trong danh mục "${getCategoryName(selectedCategory)}"`
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết nổi bật</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {featuredPosts.map((post) => (
                                            <Link key={post.id} href={`/blog/${post.id}`}>
                                                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                                                    <div className="relative">
                                                        <img
                                                            src={post.image}
                                                            alt={post.title}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                                Nổi bật
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                {getCategoryName(post.category)}
                                                            </span>
                                                            <span className="mx-2">•</span>
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(post.date)}
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-teal-600">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                                            {post.excerpt}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <User className="w-4 h-4 mr-1" />
                                                                {post.author}
                                                                <Clock className="w-4 h-4 ml-3 mr-1" />
                                                                {post.readTime}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                {post.views.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* All Posts */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Tất cả bài viết</h2>
                                    <div className="space-y-16">
                                        {blogPosts.map((post) => (
                                            <Link key={post.id} href={`/blog/${post.id}`}>
                                                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer mb-6">
                                                    <div className="md:flex">
                                                        <div className="md:w-1/3">
                                                            <img
                                                                src={post.image}
                                                                alt={post.title}
                                                                className="w-full h-48 md:h-full object-cover"
                                                            /></div>
                                                        <div className="md:w-2/3 p-6">
                                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                    {getCategoryName(post.category)}
                                                                </span>
                                                                <span className="mx-2">•</span>
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                {formatDate(post.date)}
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-teal-600">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-gray-600 mb-4">
                                                                {post.excerpt}
                                                            </p>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <User className="w-4 h-4 mr-1" />
                                                                    {post.author}
                                                                    <Clock className="w-4 h-4 ml-3 mr-1" />
                                                                    {post.readTime}
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    {post.views.toLocaleString()}
                                                                </div>
                                                            </div>
                                                            {(post as any).tags && (
                                                                <div className="flex flex-wrap gap-2 mb-4">
                                                                    {(post as any).tags.map((tag: string, index: number) => (
                                                                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                            #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between">
                                                                <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
                                                                    Đọc thêm
                                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                                </button>
                                                                <div className="flex space-x-2">
                                                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                                                        <Bookmark className="w-4 h-4" />
                                                                    </button>
                                                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                                                        <Share2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="space-y-8">
                            {/* Trending Topics */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Chủ đề hot</h3>
                                </div>
                                <div className="space-y-3">
                                    {trendingTopics.map((topic, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                            <span className="text-gray-700 text-sm">{topic.title}</span>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Eye className="w-3 h-3 mr-1" />
                                                {topic.views.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <Tag className="w-5 h-5 text-blue-500 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Tags phổ biến</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter Signup */}
                            <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                                <div className="flex items-center mb-4">
                                    <BookOpen className="w-6 h-6 mr-2" />
                                    <h3 className="text-xl font-semibold">Đăng ký nhận tin</h3>
                                </div>
                                <p className="text-teal-100 mb-4">
                                    Nhận những bài viết mới nhất về sức khỏe qua email của bạn
                                </p>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Email của bạn"
                                        className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <button className="w-full bg-white text-teal-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                                        Đăng ký ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
