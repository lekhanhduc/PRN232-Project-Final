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

### MAN007: Create Receptionist Account

- **Endpoint:** `POST /api/manager/receptionists`

```json
// Request DTO
{
  "username": "letanA",
  "email": "letan@hospital.com",
  "password": "TempPassword123",
  "fullName": "Nguyễn Thị Lễ Tân",
  "phone": "0901234568"
}

// Response DTO
{
  "success": true,
  "message": "Tạo tài khoản lễ tân thành công"
}

```

### MAN008: Update Receptionist Information

- **Endpoint:** `PUT /api/manager/receptionists/{userId}`

```json
// Request DTO
{
  "fullName": "Nguyễn Thị Lễ Tân A",
  "phone": "0901234569",
  "isActive": true
}

// Response DTO
{
  "success": true,
  "message": "Cập nhật thông tin lễ tân thành công"
}

```

### MAN009: Delete Receptionist Account

- **Endpoint:** `DELETE /api/manager/receptionists/{userId}`

```json
// Response DTO
{
  "success": true,
  "message": "Đã xóa tài khoản lễ tân"
}

```

### MAN010: Get All Receptionists

- **Endpoint:** `GET /api/manager/receptionists`

```json
// Response DTO
{
  "success": true,
  "data": [
    {
      "userId": 10,
      "fullName": "Nguyễn Thị Lễ Tân",
      "email": "letan@hospital.com",
      "phone": "0901234568",
      "isActive": true,
      "createdAt": "2024-06-01T08:00:00"
    }
  ]
}

```

### M