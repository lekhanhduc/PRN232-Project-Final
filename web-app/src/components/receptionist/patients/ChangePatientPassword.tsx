import React, { useState } from 'react';
import { receptionistService } from '@/services/receptionistService';
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ChangeReceptionistPassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation states
    const [validations, setValidations] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        passwordMatch: false
    });

    // Validate password strength
    const validatePassword = (password: string) => {
        const newValidations = {
            minLength: password.length >= 6,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            passwordMatch: password === confirmPassword && password.length > 0
        };
        setValidations(newValidations);
        return newValidations;
    };

    const handleNewPasswordChange = (password: string) => {
        setNewPassword(password);
        validatePassword(password);
    };

    const handleConfirmPasswordChange = (password: string) => {
        setConfirmPassword(password);
        setValidations(prev => ({
            ...prev,
            passwordMatch: password === newPassword && password.length > 0
        }));
    };

    const isFormValid = () => {
        return currentPassword.length > 0 &&
            validations.minLength &&
            validations.passwordMatch;
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            toast.error('Vui lòng kiểm tra lại thông tin!', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Đang đổi mật khẩu...', {
            position: 'top-right',
        });

        try {
            const response = await receptionistService.changePassword(currentPassword, newPassword);

            if (response.code === 200) {
                toast.dismiss(loadingToast);
                toast.success('Đổi mật khẩu thành công!', {
                    duration: 3000,
                    position: 'top-right',
                    style: { background: '#059669', color: '#fff' },
                    iconTheme: { primary: '#fff', secondary: '#059669' },
                });

                // Reset form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setValidations({
                    minLength: false,
                    hasUpperCase: false,
                    hasLowerCase: false,
                    hasNumber: false,
                    passwordMatch: false
                });
            } else {
                throw new Error(response.message || 'Đổi mật khẩu thất bại');
            }
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!', {
                duration: 5000,
                position: 'top-right',
                style: { background: '#DC2626', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#DC2626' },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Đổi mật khẩu</h2>
                    <p className="text-gray-600">Cập nhật mật khẩu bảo mật cho tài khoản của bạn</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleChangePassword} className="p-8 space-y-6">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu hiện tại
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Nhập mật khẩu hiện tại"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Nhập mật khẩu mới"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>

                            {newPassword && (
                                <div className="mt-3">
                                    <div className="flex items-center space-x-2 text-sm">
                                        {validations.minLength ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                        )}
                                        <span className={validations.minLength ? 'text-green-600' : 'text-orange-600'}>
                                            Ít nhất 6 ký tự
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Nhập lại mật khẩu mới"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>

                            {confirmPassword && (
                                <div className="mt-3 flex items-center space-x-2 text-sm">
                                    {validations.passwordMatch ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                    )}
                                    <span className={validations.passwordMatch ? 'text-green-600' : 'text-orange-600'}>
                                        {validations.passwordMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-blue-800 text-sm font-medium">Lưu ý bảo mật</p>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Mật khẩu mới sẽ được áp dụng ngay lập tức. Hãy đảm bảo ghi nhớ mật khẩu mới.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !isFormValid()}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang cập nhật...</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        <span>Cập nhật mật khẩu</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Mật khẩu của bạn sẽ được mã hóa và bảo mật tuyệt đối
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangeReceptionistPassword; 