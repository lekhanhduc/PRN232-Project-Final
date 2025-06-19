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
                            Providing quality healthcare services to help you live a healthy and happy life.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Doctors</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Services</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Cardiology</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Family Medicine</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Emergency Care</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pediatrics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Contact Info</h3>
                        <div className="space-y-2 text-gray-400">
                            <p>123 Medical Center Drive</p>
                            <p>Healthcare City, HC 12345</p>
                            <p>Phone: (555) 123-4567</p>
                            <p>Email: info@medically.com</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Medically. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;