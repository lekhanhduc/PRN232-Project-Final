'use client'
import { Heart, Search, ShoppingBag } from "lucide-react";

const Header = () => {
    return (
        <div>
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Medically</span>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <a href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Home</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pages</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Portfolio</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                        </nav>

                        {/* Right side icons */}
                        <div className="flex items-center space-x-4">
                            <Search className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                            <div className="relative">
                                <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;