import React from 'react';
import {
    Locate,
    RefreshCw,
    Route,
    MapPin,
    Clock,
    Phone,
    Mail,
    Navigation
} from 'lucide-react';
import { useLocation, HOSPITAL_LOCATION } from '../../hooks/useLocation';

const LocationInfo: React.FC = () => {
    const { userLocation, distance, estimatedTime, locationStatus, getCurrentLocation } = useLocation();

    return (
        <div className="lg:col-span-1 space-y-6">
            {/* User Location & Distance */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-start">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                        <Locate className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Vị trí của bạn
                            </h3>
                            <button
                                onClick={getCurrentLocation}
                                disabled={locationStatus === 'loading'}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Cập nhật vị trí"
                            >
                                <RefreshCw className={`w-4 h-4 ${locationStatus === 'loading' ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {locationStatus === 'loading' && (
                            <div className="flex items-center text-gray-500 text-sm">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                Đang xác định vị trí...
                            </div>
                        )}

                        {locationStatus === 'success' && userLocation && (
                            <div className="space-y-2">
                                <div className="flex items-center text-green-600 font-medium">
                                    <Route className="w-4 h-4 mr-2" />
                                    Khoảng cách: {distance} km
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Thời gian di chuyển: ~{estimatedTime} phút (bằng xe)
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    <div>📍 Vị trí của bạn: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</div>
                                    <div>🏢 Khu đô thị FPT City: {HOSPITAL_LOCATION.lat}, {HOSPITAL_LOCATION.lng}</div>
                                </div>
                            </div>
                        )}

                        {locationStatus === 'error' && (
                            <div className="text-red-600 text-sm">
                                Không thể xác định vị trí.
                                <button
                                    onClick={getCurrentLocation}
                                    className="text-blue-600 hover:underline ml-1"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {locationStatus === 'idle' && (
                            <button
                                onClick={getCurrentLocation}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Xác định vị trí của bạn
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hospital Address */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-start">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Địa chỉ bệnh viện
                        </h3>
                        <p className="text-gray-600 mb-1">Khu đô thị FPT City</p>
                        <p className="text-gray-600 mb-1">Ngũ Hành Sơn, Đà Nẵng</p>
                    </div>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-start">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Giờ mở cửa
                        </h3>
                        <p className="text-gray-600 mb-1">Thứ 2 - Thứ 6: 7:00 - 19:00</p>
                        <p className="text-gray-600 mb-1">Thứ 7 - CN: 8:00 - 17:00</p>
                        <p className="text-red-600 font-medium">Cấp cứu: 24/7</p>
                    </div>
                </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Liên hệ nhanh
                </h3>
                <div className="space-y-3">
                    <a
                        href="tel:19001234567"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium">Hotline</div>
                            <div className="text-sm">1900 123 456</div>
                        </div>
                    </a>

                    <a
                        href="mailto:info@medcare.vn"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium">Email</div>
                            <div className="text-sm">info@medcare.vn</div>
                        </div>
                    </a>

                    <a
                        href={
                            userLocation
                                ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${HOSPITAL_LOCATION.lat},${HOSPITAL_LOCATION.lng}`
                                : "https://maps.google.com/?q=FPT+University+Danang"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Navigation className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium">
                                {userLocation ? "Chỉ đường từ vị trí của bạn" : "Chỉ đường"}
                            </div>
                            <div className="text-sm">
                                {userLocation ? `Khoảng ${distance} km` : "Mở Google Maps"}
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LocationInfo;
