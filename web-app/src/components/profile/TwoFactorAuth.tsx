import React, { useState } from 'react';
import { Shield, QrCode, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { patientService } from '@/services/patientService';

interface TwoFactorAuthProps {
    onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
    userEmail?: string;
    is2FAEnabled?: boolean;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onShowToast, userEmail, is2FAEnabled = false }) => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(is2FAEnabled);
    const [qrCode, setQrCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Cập nhật trạng thái khi prop thay đổi
    React.useEffect(() => {
        setTwoFactorEnabled(is2FAEnabled);
    }, [is2FAEnabled]);

    // Kích hoạt 2FA
    const handleEnable2FA = async () => {
        if (!userEmail) {
            onShowToast('Không tìm thấy email người dùng', 'error');
            return;
        }

        try {
            console.log(userEmail)
            setLoading(true);
            console.log('Sending 2FA request with email:', userEmail);
            const response = await patientService.enable2FA(userEmail);
            console.log('2FA response:', response);

            if (response.code === 200 && response.result) {
                // response.result là base64 QR code
                console.log('QR Code data received:', response.result.substring(0, 100) + '...');

                // Kiểm tra xem base64 string đã có prefix chưa
                let qrCodeData = response.result;
                if (!qrCodeData.startsWith('data:image/')) {
                    qrCodeData = `data:image/png;base64,${qrCodeData}`;
                }

                setQrCode(qrCodeData);
                onShowToast('QR Code đã được tạo thành công!', 'success');
            } else {
                console.error('Invalid response:', response);
                onShowToast('Không thể kích hoạt xác thực 2 bước', 'error');
            }
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            onShowToast('Không thể kích hoạt xác thực 2 bước', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Xác thực 2FA
    const handleVerify2FA = async () => {
        if (verificationCode.length !== 6) {
            onShowToast('Mã xác thực phải có 6 chữ số!', 'error');
            return;
        }

        if (!userEmail) {
            onShowToast('Không tìm thấy email người dùng', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await patientService.verify2FA(userEmail, verificationCode);
            if (response.code === 200) {
                setTwoFactorEnabled(true);
                onShowToast('Kích hoạt xác thực 2 bước thành công!', 'success');
                setQrCode('');
                setVerificationCode('');
            } else {
                onShowToast('Mã xác thực không đúng!', 'error');
            }
        } catch (error) {
            console.error('Error verifying 2FA:', error);
            onShowToast('Không thể xác thực mã 2FA', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Tắt 2FA
    const handleDisable2FA = async () => {
        setTwoFactorEnabled(false);
        setQrCode('');
        setVerificationCode('');
        onShowToast('Đã tắt xác thực 2 bước!', 'info');
    };

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Xác thực hai bước</h2>

            {!twoFactorEnabled ? (
                <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Shield className="w-6 h-6 text-yellow-600 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-yellow-800">Chưa bảo mật</h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                Tài khoản của bạn chưa được bảo vệ bằng xác thực hai bước.
                                Hãy kích hoạt ngay để tăng cường bảo mật.
                            </p>
                        </div>
                    </div>

                    {!qrCode ? (
                        <button
                            onClick={handleEnable2FA}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <QrCode className="w-4 h-4 mr-2" />
                            )}
                            {loading ? 'Đang thiết lập...' : 'Bật xác thực 2 bước'}
                        </button>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="font-medium text-gray-900 mb-4">Quét mã QR bằng ứng dụng xác thực</h3>
                                <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        className="w-48 h-48"
                                        onLoad={() => console.log('QR Code image loaded successfully')}
                                        onError={(e) => console.error('QR Code image failed to load:', e)}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Sử dụng ứng dụng Google Authenticator, Authy hoặc tương tự
                                </p>
                                {/* Debug info */}
                                <div className="mt-2 text-xs text-gray-400">
                                    QR Code length: {qrCode.length} | Starts with: {qrCode.substring(0, 50)}...
                                </div>
                            </div>

                            <div className="max-w-md mx-auto">
                                <h3 className="font-medium text-gray-900 mb-3">Nhập mã xác thực</h3>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="Nhập mã 6 chữ số"
                                        maxLength={6}
                                        className="flex-1 px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                    />
                                    <button
                                        onClick={handleVerify2FA}
                                        disabled={verificationCode.length !== 6 || loading}
                                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Xác thực'
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setQrCode('');
                                        setVerificationCode('');
                                    }}
                                    className="mt-3 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    ← Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Xác thực 2 bước đã được kích hoạt</h3>
                    <p className="text-gray-600 mb-6">Tài khoản của bạn hiện được bảo vệ bằng xác thực hai bước.</p>
                    <button
                        onClick={handleDisable2FA}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {loading ? 'Đang tắt...' : 'Tắt xác thực 2 bước'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TwoFactorAuth;
