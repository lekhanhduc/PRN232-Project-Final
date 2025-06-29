# Lịch sử cuộc hẹn - Patient Module

## Tổng quan

Module này cung cấp giao diện để bệnh nhân xem và quản lý lịch sử cuộc hẹn của mình. Bao gồm các tính năng:

- Xem danh sách tất cả cuộc hẹn
- Lọc cuộc hẹn theo trạng thái (sắp tới, đã hoàn thành, đã hủy)
- Tìm kiếm cuộc hẹn
- Hủy cuộc hẹn
- Đổi lịch cuộc hẹn
- Thông báo toast

## Cấu trúc thư mục

```
src/
├── components/
│   └── patient/
│       └── AppointmentHistory/
│           ├── AppointmentHistory.tsx      # Component chính
│           ├── AppointmentCard.tsx         # Card hiển thị cuộc hẹn
│           ├── AppointmentFilters.tsx      # Bộ lọc và tìm kiếm
│           ├── CancelAppointmentModal.tsx  # Modal hủy cuộc hẹn
│           ├── RescheduleAppointmentModal.tsx # Modal đổi lịch
│           └── index.ts                    # Export các component
├── hooks/
│   ├── useAppointments.ts                  # Hook quản lý appointments
│   └── useToast.ts                         # Hook quản lý toast
├── services/
│   └── appointmentService.ts               # Service gọi API
├── types/
│   └── appointment.ts                      # Type definitions
└── app/
    └── (page)/
        └── (patient)/
            └── appointments/
                └── page.tsx                # Trang appointments
```

## API Endpoints

### 1. Lấy danh sách cuộc hẹn
```
GET /api/v1/appointments
Authorization: Bearer {token}
```

Response:
```json
{
  "code": 200,
  "result": [
    {
      "appointmentId": 1,
      "appointmentNumber": "APT001",
      "doctor": {
        "doctorId": 1,
        "fullName": "BS. Nguyễn Văn A",
        "specialty": "Nội khoa",
        "licenseNumber": "12345",
        "degree": "Bác sĩ",
        "yearsOfExperience": 10,
        "consultationFee": 200000,
        "bio": "...",
        "gender": "Nam",
        "isAvailable": true
      },
      "appointmentDate": "2025-01-15",
      "appointmentTime": "09:00",
      "status": "confirmed",
      "totalFee": 200000,
      "reasonForVisit": "Đau đầu, chóng mặt",
      "canCancel": true,
      "canReschedule": true
    }
  ]
}
```

### 2. Hủy cuộc hẹn
```
PUT /api/v1/appointments/{appointmentId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "cancelReason": "Lý do hủy"
}
```

Response:
```json
{
  "code": 200,
  "message": "Hủy lịch hẹn thành công"
}
```

### 3. Đổi lịch cuộc hẹn
```
PUT /api/v1/appointments/{appointmentId}/reschedule
Authorization: Bearer {token}
Content-Type: application/json

{
  "newSlotId": 123,
  "newAppointmentDate": "2025-01-20",
  "reason": "Lý do đổi lịch"
}
```

Response:
```json
{
  "code": 200,
  "message": "Thay đổi lịch hẹn thành công",
  "result": {
    "appointmentId": 1,
    "newAppointmentDate": "2025-01-20",
    "newAppointmentTime": "10:00"
  }
}
```

## Cách sử dụng

### 1. Import và sử dụng component chính

```tsx
import AppointmentHistory from '@/components/patient/AppointmentHistory/AppointmentHistory';

const AppointmentsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppointmentHistory />
      </div>
    </div>
  );
};
```

### 2. Sử dụng hook useAppointments

```tsx
import { useAppointments } from '@/hooks/useAppointments';

const MyComponent = () => {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    cancelAppointment,
    rescheduleAppointment,
    getUpcomingAppointments,
    getCompletedAppointments,
    getCancelledAppointments,
  } = useAppointments();

  // Sử dụng các function
};
```

### 3. Sử dụng hook useToast

```tsx
import { useToast } from '@/hooks/useToast';

const MyComponent = () => {
  const { showSuccess, showError, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Thao tác thành công!');
  };

  const handleError = () => {
    showError('Có lỗi xảy ra!');
  };
};
```

## Tính năng

### 1. Lọc cuộc hẹn
- **Tất cả**: Hiển thị tất cả cuộc hẹn
- **Sắp tới**: Chỉ hiển thị cuộc hẹn trong tương lai
- **Đã hoàn thành**: Chỉ hiển thị cuộc hẹn đã hoàn thành
- **Đã hủy**: Chỉ hiển thị cuộc hẹn đã hủy

### 2. Tìm kiếm
- Tìm theo tên bác sĩ
- Tìm theo mã cuộc hẹn
- Tìm theo lý do khám

### 3. Hủy cuộc hẹn
- Chỉ cho phép hủy cuộc hẹn chưa hoàn thành
- Yêu cầu nhập lý do hủy
- Hiển thị thông báo xác nhận

### 4. Đổi lịch hẹn
- Chọn ngày và giờ mới
- Yêu cầu nhập lý do đổi lịch
- Validate thời gian mới phải trong tương lai

### 5. Thông báo
- Toast notifications cho các thao tác thành công/lỗi
- Loading states cho các thao tác bất đồng bộ
- Error handling cho các trường hợp lỗi

## Styling

Module sử dụng Tailwind CSS với các class chính:

- **Layout**: `flex`, `grid`, `space-y-6`, `gap-4`
- **Colors**: `bg-white`, `text-gray-900`, `border-gray-200`
- **Status colors**: 
  - Confirmed: `bg-green-100 text-green-800`
  - Pending: `bg-yellow-100 text-yellow-800`
  - Completed: `bg-blue-100 text-blue-800`
  - Cancelled: `bg-red-100 text-red-800`
- **Interactive**: `hover:bg-blue-50`, `focus:ring-2`, `transition-colors`

## Responsive Design

- Mobile-first approach
- Responsive grid layout
- Collapsible filters trên mobile
- Touch-friendly buttons và inputs

## Error Handling

- Network errors
- API errors
- Validation errors
- Loading states
- Empty states

## Performance

- Lazy loading components
- Optimized re-renders với React hooks
- Debounced search
- Efficient filtering và sorting 