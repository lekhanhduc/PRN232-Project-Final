import React, { useState } from 'react';
import { receptionistService } from '@/services/receptionistService';
import { usePatients } from '@/hooks/usePatients';
import { Loader2, Lock } from 'lucide-react';

const ChangePatientPassword: React.FC = () => {
    const { patients, loading: loadingPatients } = usePatients();
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChangePassword = async () => {
        setMessage(null);
        if (!selectedPatientId) {
            setMessage({ type: 'error', text: 'Vui lòng chọn bệnh nhân!' });
            return;
        }
        if (!newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ mật khẩu mới!' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
            return;
        }
        try {
            setLoading(true);
            const res = await receptionistService.changePatientPassword(selectedPatientId, newPassword);
            if (res.code === 200 && res.result?.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: res.message || 'Không thể đổi mật khẩu' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Không thể đổi mật khẩu' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" /> Đổi mật khẩu cho bệnh nhân
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn bệnh nhân</label>
                    <select
                        className="w-full border rounded p-2"
                        value={selectedPatientId || ''}
                        onChange={e => setSelectedPatientId(Number(e.target.value) || null)}
                        disabled={loadingPatients}
                    >
                        <option value="">-- Chọn bệnh nhân --</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.firstName} - {p.email || p.phone}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                    <input
                        type="password"
                        className="w-full border rounded p-2"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        className="w-full border rounded p-2"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={loading}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">Mật khẩu xác nhận không khớp</p>
                    )}
                </div>
                {message && (
                    <div className={`p-3 rounded text-sm mt-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
                <div className="pt-2">
                    <button
                        onClick={handleChangePassword}
                        disabled={loading || !selectedPatientId || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                        {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePatientPassword; 