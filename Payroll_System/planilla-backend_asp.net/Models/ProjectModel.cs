namespace planilla_backend_asp.net.Models
{
    public  class ProjectModel
    {
        public string projectName { get; set; }
        public string employerID { get; set; }
        public string budget { get; set; }
        public string paymentMethod { get; set; }
        public string description { get; set; }
        public string maxNumberOfBenefits { get; set; }
        public string maxBudgetForBenefits { get; set; }
    }
}
