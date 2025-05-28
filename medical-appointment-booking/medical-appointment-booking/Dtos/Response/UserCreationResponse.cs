namespace medical_appointment_booking.Dtos.Response
{
    public class UserCreationResponse
    {
        public string Phone { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly? Dob { get; set; }
        public string UserType { get; set; }

        public UserCreationResponse() { }

        public UserCreationResponse(string Phone, string Email, string FirstName, string LastName, DateOnly Dob, string UserType)
        {
            this.Phone = Phone;
            this.Email = Email;
            this.LastName = LastName;
            this.FirstName = FirstName;
            this.Dob = Dob;
            this.UserType = UserType;
        }
    }

}
