namespace planilla_backend_asp.net.Models
{
    public class PaymentModel
    {
        public string projectName { get; set; }
        public string employerId { get; set; }
        public string employeeId { get; set; }
        public string contractStartDate { get; set; }
        public string paymentDate { get; set; }
        public double netSalary { get; set; }
        public string contractType { get; set; }
        public double payment { get; set; } = 0;
    }

    public class PaymentModelSummarized
    {
        public string projectName { get; set; }
        public string employeeId { get; set; }
        public string paymentDate { get; set; }
        public string contractType { get; set; }
        public double payment { get; set; } = 0;
    }
}
