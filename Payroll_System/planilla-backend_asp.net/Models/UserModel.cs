namespace planilla_backend_asp.net.Models
{
    public  class UserModel
    {
        public string Identification { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? LastName2 { get; set; } = null;
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Country { get; set; } = null;
        public string? State { get; set; } = null;
        public string? City { get; set; } = null;
        public string? ZipCode { get; set; } = null;
        public string? Address { get; set; } = null;
        public string Phone { get; set; }
    }

    public class UserModelSummarized
    {
        public string FullName { get; set; }
        public string Identification { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }

    public class UserEmployeeInfoToModify
    {
        public string Identification { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
    }

    public class ReciberModel
    {
        public string id { get; set; }
    }
}
