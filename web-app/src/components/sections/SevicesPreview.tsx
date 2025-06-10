'use client'
import { Clock, Heart, Users } from "lucide-react";

const ServicesPreview = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We provide comprehensive medical care with state-of-the-art facilities and experienced healthcare professionals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Heart className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cardiology</h3>
                        <p className="text-gray-600">Comprehensive heart care with advanced diagnostic and treatment options.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Medicine</h3>
                        <p className="text-gray-600">Complete healthcare for patients of all ages and medical conditions.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Care</h3>
                        <p className="text-gray-600">Round-the-clock emergency medical services for urgent health needs.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServicesPreview;