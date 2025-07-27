### Manager Screens

### 32. `/manager/dashboard` - Dashboard quản lý

- Thống kê tổng quan (MAN001)
- Biểu đồ doanh thu
- Top bác sĩ
- Xu hướng lịch hẹn
- Cảnh báo hệ thống

### 33. `/manager/doctors` - Quản lý bác sĩ

- Danh sách tất cả bác sĩ (MAN002)
- Tìm kiếm và lọc
- Thêm bác sĩ mới (MAN004)
- Sửa thông tin bác sĩ (MAN005)
- Xóa tài khoản bác sĩ (MAN006)

### 34. `/manager/doctors/create` - Tạo tài khoản bác sĩ

- Form tạo tài khoản bác sĩ (MAN004)
- Chọn chuyên khoa
- Thiết lập phí khám
- Thông tin chuyên môn

### 35. `/manager/doctors/{doctorId}` - Chi tiết bác sĩ

- Thông tin chi tiết bác sĩ
- Chỉnh sửa thông tin (MAN005)
- Lịch làm việc
- Thống kê hiệu suất
- Quản lý trạng thái

### 36. `/manager/doctors/{doctorId}/schedule` - Quản lý lịch bác sĩ

- Tạo lịch làm việc (MAN003)
- Chỉnh sửa lịch hàng loạt (MAN015)
- Xóa lịch làm việc (MAN016)
- Calendar view
- Quản lý slot thời gian

### 37. `/manager/receptionists` - Quản lý lễ tân

- Danh sách lễ tân (MAN010)
- Tạo tài khoản mới (MAN007)
- Chỉnh sửa thông tin (MAN008)
- Xóa tài khoản (MAN009)
- Quản lý quyền hạn

### 38. `/manager/receptionists/create` - Tạo tài khoản lễ tân

- Form tạo tài khoản lễ tân (MAN007)
- Thiết lập quyền truy cập
- Thông tin cá nhân
- Mật khẩu tạm thời

### 39. `/manager/specialties` - Quản lý chuyên khoa

- Danh sách chuyên khoa (MAN011)
- Thêm chuyên khoa mới
- Chỉnh sửa chuyên khoa
- Xóa chuyên khoa
- Quản lý trạng thái

### 40. `/manager/packages` - Quản lý gói dịch vụ

- Danh sách gói dịch vụ (MAN012)
- Tạo gói mới
- Chỉnh sửa gói
- Xóa gói dịch vụ
- Thiết lập giá

### 41. `/manager/appointments` - Quản lý lịch hẹn

- Tất cả lịch hẹn trong hệ thống
- Tìm kiếm và lọc nâng cao
- Hủy lịch hẹn cưỡng bức (MAN013)
- Thống kê lịch hẹn
- Export dữ liệu

### 42. `/manager/patients` - Quản lý bệnh nhân

- Danh sách tất cả bệnh nhân
- Tìm kiếm và lọc
- Vô hiệu hóa tài khoản (MAN014)
- Xem lịch sử khám
- Thống kê bệnh nhân

### 43. `/manager/reports` - Báo cáo thống kê

- Báo cáo doanh thu (MAN017)
- Báo cáo hiệu suất bác sĩ
- Báo cáo lịch hẹn
- Xuất báo cáo Excel/PDF
- Biểu đồ và dashboard

### 44. `/manager/reports/revenue` - Báo cáo doanh thu

- Thống kê doanh thu theo thời gian
- Phân tích theo bác sĩ/chuyên khoa
- So sánh theo kỳ
- Biểu đồ trực quan
- Export dữ liệu

### 45. `/manager/reports/doctors` - Báo cáo bác sĩ

- Hiệu suất làm việc
- Số lượng bệnh nhân
- Đánh giá từ bệnh nhân
- So sánh bác sĩ
- Xu hướng phát triển

### 46. `/manager/reports/appointments` - Báo cáo lịch hẹn

- Thống kê lịch hẹn theo thời gian
- Tỷ lệ hủy/hoàn thành
- Phân tích theo chuyên khoa
- Thời gian peak
- Dự báo xu hướng

### 47. `/manager/settings` - Cài đặt hệ thống

- Cấu hình chung
- Quản lý thông báo
- Cài đặt bảo mật
- Backup & restore
- Log hệ thống

### 48. `/manager/settings/notifications` - Cài đặt thông báo

- Template thông báo
- Cấu hình email/SMS
- Quy tắc gửi thông báo
- Lịch sử gửi thông báo
- Test thông báo

### 49. `/manager/users` - Quản lý người dùng

- Tất cả người dùng trong hệ thống
- Phân quyền theo role
- Kích hoạt/vô hiệu hóa
- Lịch sử đăng nhập
- Reset mật khẩu

### 50. `/manager/profile` - Thông tin cá nhân quản lý

- Cập nhật thông tin cá nhân
- Đổi mật khẩu
- Cài đặt bảo mật 2FA
- Lịch sử hoạt động
- Sao lưu dữ liệu cá nhân