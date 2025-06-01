using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace medical_appointment_booking.Migrations
{
    /// <inheritdoc />
    public partial class InitialDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ServicePackages",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    package_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "ntext", nullable: true),
                    fee = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    duration_minutes = table.Column<int>(type: "int", nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicePackages", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Specialties",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    specialty_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialties", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    user_status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    role_id = table.Column<int>(type: "int", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.id);
                    table.ForeignKey(
                        name: "FK_Users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    specialty_id = table.Column<int>(type: "int", nullable: true),
                    license_number = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    degree = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    consultation_fee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    is_available = table.Column<bool>(type: "bit", nullable: false),
                    gender = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    years_of_experience = table.Column<int>(type: "int", nullable: false),
                    bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.id);
                    table.ForeignKey(
                        name: "FK_Doctors_Specialties_specialty_id",
                        column: x => x.specialty_id,
                        principalTable: "Specialties",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Doctors_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    recipient_id = table.Column<long>(name: "recipient_id ", type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    notification_type = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_read = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_recipient_id ",
                        column: x => x.recipient_id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    first_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    last_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dob = table.Column<DateOnly>(type: "date", nullable: false),
                    gender = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.id);
                    table.ForeignKey(
                        name: "FK_Patients_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorLeaves",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    doctor_id = table.Column<long>(type: "bigint", nullable: false),
                    leave_date = table.Column<DateOnly>(type: "date", nullable: false),
                    reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorLeaves", x => x.id);
                    table.ForeignKey(
                        name: "FK_DoctorLeaves_Doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "Doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkSchedules",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    doctor_id = table.Column<long>(type: "bigint", nullable: false),
                    work_date = table.Column<DateOnly>(type: "date", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    max_patients = table.Column<int>(type: "int", nullable: false),
                    is_available = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkSchedules", x => x.id);
                    table.ForeignKey(
                        name: "FK_WorkSchedules_Doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "Doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimeSlots",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    schedule_id = table.Column<int>(type: "int", nullable: false),
                    slot_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    is_available = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSlots", x => x.id);
                    table.ForeignKey(
                        name: "FK_TimeSlots_WorkSchedules_schedule_id",
                        column: x => x.schedule_id,
                        principalTable: "WorkSchedules",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    doctor_id = table.Column<long>(type: "bigint", nullable: false),
                    slot_id = table.Column<int>(type: "int", nullable: false),
                    appointment_date = table.Column<DateOnly>(type: "date", nullable: false),
                    appointment_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    reason_for_visit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    consultation_fee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    total_fee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: true),
                    cancelled_by = table.Column<long>(type: "bigint", nullable: true),
                    cancel_reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ServicePackageId = table.Column<int>(type: "int", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.id);
                    table.ForeignKey(
                        name: "FK_Appointments_Doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "Doctors",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Appointments_Patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "Patients",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Appointments_ServicePackages_ServicePackageId",
                        column: x => x.ServicePackageId,
                        principalTable: "ServicePackages",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Appointments_TimeSlots_slot_id",
                        column: x => x.slot_id,
                        principalTable: "TimeSlots",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Users_cancelled_by",
                        column: x => x.cancelled_by,
                        principalTable: "Users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Appointments_Users_created_by",
                        column: x => x.created_by,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "AppointmentHistories",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appointment_id = table.Column<long>(type: "bigint", nullable: false),
                    old_doctor_id = table.Column<long>(type: "bigint", nullable: true),
                    old_slot_id = table.Column<int>(type: "int", nullable: true),
                    old_appointment_date = table.Column<DateTime>(type: "date", nullable: true),
                    old_appointment_time = table.Column<TimeSpan>(type: "time", nullable: true),
                    action_type = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    changed_by = table.Column<long>(type: "bigint", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    create_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    update_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentHistories", x => x.id);
                    table.ForeignKey(
                        name: "FK_AppointmentHistories_Appointments_appointment_id",
                        column: x => x.appointment_id,
                        principalTable: "Appointments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentHistories_Users_changed_by",
                        column: x => x.changed_by,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentHistories_appointment_id",
                table: "AppointmentHistories",
                column: "appointment_id");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentHistories_changed_by",
                table: "AppointmentHistories",
                column: "changed_by");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_cancelled_by",
                table: "Appointments",
                column: "cancelled_by");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_created_by",
                table: "Appointments",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_doctor_id",
                table: "Appointments",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_patient_id",
                table: "Appointments",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ServicePackageId",
                table: "Appointments",
                column: "ServicePackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_slot_id",
                table: "Appointments",
                column: "slot_id");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorLeaves_doctor_id",
                table: "DoctorLeaves",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_specialty_id",
                table: "Doctors",
                column: "specialty_id");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_user_id",
                table: "Doctors",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_recipient_id ",
                table: "Notifications",
                column: "recipient_id ");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_user_id",
                table: "Patients",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_TimeSlots_schedule_id",
                table: "TimeSlots",
                column: "schedule_id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_role_id",
                table: "Users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_WorkSchedules_doctor_id",
                table: "WorkSchedules",
                column: "doctor_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentHistories");

            migrationBuilder.DropTable(
                name: "DoctorLeaves");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "ServicePackages");

            migrationBuilder.DropTable(
                name: "TimeSlots");

            migrationBuilder.DropTable(
                name: "WorkSchedules");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Specialties");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "roles");
        }
    }
}
