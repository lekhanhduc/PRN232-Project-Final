import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { patientService } from '@/services/patientService';

interface ChangePasswordProps {
    onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onShowToast }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            onShowToast('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            onShowToast('Mật khẩu mới và xác nhận không khớp!', 'error');
            return;
        }
        if (newPassword.length < 8) {
            onShowToast('Mật khẩu mới phải có ít nhất 8 ký tự!', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await patientService.changePassword(currentPassword, newPassword);
            if (response.code === 200 && response.result?.success) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                onShowToast('Đổi mật khẩu thành công!');
            } else {
                onShowToast(response.message || 'Không thể đổi mật khẩu', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            onShowToast('Không thể đổi mật khẩu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>

            <div className="max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                        placeholder="Nhập mật khẩu hiện tại"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                        placeholder="Nhập mật khẩu mới"
                        disabled={loading}
                    />
                    {newPassword && newPassword.length < 8 && (
                        <p className="text-sm text-red-600 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={loading}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">Mật khẩu xác nhận không khớp</p>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleChangePassword}
                        disabled={!isFormValid || loading}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Lưu ý bảo mật:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Mật khẩu nên có ít nhất 8 ký tự</li>
                        <li>• Bao gồm chữ hoa, chữ thường và số</li>
                        <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                        <li>• Thay đổi mật khẩu định kỳ</li>
                        <li>• Không chia sẻ mật khẩu với người khác</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
