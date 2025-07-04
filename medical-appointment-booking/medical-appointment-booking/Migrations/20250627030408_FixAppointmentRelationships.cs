using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace medical_appointment_booking.Migrations
{
    /// <inheritdoc />
    public partial class FixAppointmentRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Patients_patient_id",
                table: "Appointments");

            migrationBuilder.AddColumn<long>(
                name: "PatientId1",
                table: "Appointments",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientId1",
                table: "Appointments",
                column: "PatientId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Patients_PatientId1",
                table: "Appointments",
                column: "PatientId1",
                principalTable: "Patients",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Patients_patient_id",
                table: "Appointments",
                column: "patient_id",
                principalTable: "Patients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Patients_PatientId1",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Patients_patient_id",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_PatientId1",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientId1",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Patients_patient_id",
                table: "Appointments",
                column: "patient_id",
                principalTable: "Patients",
                principalColumn: "id");
        }
    }
}
