'use client'
import { ArrowRight, Award, Heart, Play, Users } from "lucide-react"

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <p className="text-blue-500 font-medium tracking-wide">We are Here for You</p>
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Helping People Lead{' '}
                                <span className="text-blue-600">Healthy & Happy Lives</span>
                            </h1>
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Nisi molestie fusce quis eget vitae. Aliquam senectus id placerat egestas
                            sed sed venenatis nisl. Tincidunt faucibus facilisi vestibulum et ut congue
                            in eget. Augue purus hendrerit tempus consequat ut sit.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 transition-colors group">
                                <span>Make Appointment</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold py-4 px-8 rounded-full transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full transform rotate-12 scale-110"></div>

                            <div className="relative bg-white rounded-full p-8 shadow-2xl">
                                <div className="w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <Users className="w-16 h-16 text-blue-500" />
                                        </div>
                                        <p className="text-gray-600 font-medium">Professional Medical Care</p>
                                    </div>
                                </div>
                            </div>

                            {/* Play Button */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <button className="bg-white shadow-lg rounded-full p-6 hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-blue-500 ml-1" />
                                </button>
                            </div>
                        </div>

                        <div className="absolute top-10 right-10 bg-white rounded-lg shadow-lg p-4 animate-bounce">
                            <div className="flex items-center space-x-2">
                                <Heart className="w-6 h-6 text-red-500" />
                                <div>
                                    <p className="text-sm font-semibold">Health Care</p>
                                    <p className="text-xs text-gray-500">24/7 Support</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-10 bg-white rounded-lg shadow-lg p-4 animate-pulse">
                            <div className="flex items-center space-x-2">
                                <Award className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="text-sm font-semibold">Certified</p>
                                    <p className="text-xs text-gray-500">Professionals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection