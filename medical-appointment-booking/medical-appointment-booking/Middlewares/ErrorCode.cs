using System.Net;

namespace medical_appointment_booking.Middlewares
{
    public class ErrorCode
    {
        public int Code { get; }
        public string Message { get; }
        public HttpStatusCode StatusCode { get; }

        private ErrorCode(int Code, string Message, HttpStatusCode StatusCode)
        {
            this.Code = Code;
            this.Message = Message;
            this.StatusCode = StatusCode;
        }

        public static readonly ErrorCode USER_NOT_EXISTED = new ErrorCode(404, "User not existed", HttpStatusCode.NotFound);
        public static readonly ErrorCode USER_EXISTED = new ErrorCode(404, "User existed", HttpStatusCode.NotFound);
        public static readonly ErrorCode UNAUTHORIZED = new ErrorCode(401, "Unauthorized", HttpStatusCode.Unauthorized);
        public static readonly ErrorCode ROLE_EXISTED = new ErrorCode(400, "Role existed", HttpStatusCode.BadRequest);
        public static readonly ErrorCode ROLE_NOT_EXISTED = new ErrorCode(404, "Role not existed", HttpStatusCode.NotFound);
        public static readonly ErrorCode FORBIDDEN = new ErrorCode(403, "Forbitdden", HttpStatusCode.Forbidden);
        public static readonly ErrorCode ACCOUNT_LOCKED = new ErrorCode(403, "Account locked", HttpStatusCode.Forbidden);

    }
}
