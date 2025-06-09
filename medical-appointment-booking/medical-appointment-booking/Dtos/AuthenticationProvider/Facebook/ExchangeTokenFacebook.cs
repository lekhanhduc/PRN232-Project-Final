using System.Text.Json.Serialization;

namespace medical_appointment_booking.Dtos.AuthenticationProvider.Facebook
{
    public class ExchangeTokenFacebook
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }

        [JsonPropertyName("id_token")]
        public string? IdToken { get; set; }

        [JsonPropertyName("expires_in")]
        public long ExpiresIn { get; set; }
    }

}
