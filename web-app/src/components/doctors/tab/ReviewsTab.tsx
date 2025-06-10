'use client'
import React from 'react';
import { Star } from 'lucide-react';

interface ReviewsTabProps {
    rating: number;
    reviews: number;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ rating, reviews }) => {
    const mockReviews = [
        {
            id: 1,
            name: 'Michael Chen',
            timeAgo: '1 week ago',
            rating: 5,
            comment: 'Exceptional care and expertise. Dr. Johnson explained my heart condition clearly and the treatment was exactly what I needed. The minimally invasive procedure went perfectly and my recovery was faster than expected.',
            avatar: 'https://randomuser.me/api/portraits/men/31.jpg'
        },
        {
            id: 2,
            name: 'Sarah Williams',
            timeAgo: '2 weeks ago',
            rating: 5,
            comment: 'Outstanding physician who truly cares about patient outcomes. Her attention to detail and follow-up care exceeded my expectations. I would highly recommend Dr. Johnson to anyone with cardiac concerns.',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
        },
        {
            id: 3,
            name: 'David Rodriguez',
            timeAgo: '1 month ago',
            rating: 5,
            comment: 'Professional, knowledgeable, and compassionate. Dr. Johnson took the time to address all my concerns and developed a comprehensive treatment plan. The results have been life-changing.',
            avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
        }
    ];

    const ratingDistribution = [
        { stars: 5, percentage: 85 },
        { stars: 4, percentage: 12 },
        { stars: 3, percentage: 2 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 0 }
    ];

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-slate-900 mb-2">{rating}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            ))}
                        </div>
                        <p className="text-slate-600">Based on {reviews} reviews</p>
                    </div>
                    <div className="space-y-3">
                        {ratingDistribution.map((item) => (
                            <div key={item.stars} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-700 w-3">{item.stars}</span>
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 rounded-full transition-all"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-8">
                                    {item.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {mockReviews.map((review) => (
                    <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <img
                                src={review.avatar}
                                alt="Patient"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                                    <span className="text-sm text-slate-500">{review.timeAgo}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};