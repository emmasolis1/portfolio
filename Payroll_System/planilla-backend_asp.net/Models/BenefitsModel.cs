namespace planilla_backend_asp.net.Models
{
  public class BenefitsModel
  {
    public string benefitName { get; set; }
    public string projectName { get; set; }
    public string employerID { get; set; }
    public string description { get; set; }
    public string cost { get; set; }
  }

  public class BenefitEmployeeModel
  {
    public string benefitName { get; set; }
    public string projectName { get; set; }
    public string employerID { get; set; }
    public string employeeID { get; set; }
    public string description { get; set; }
    public string cost { get; set; }
    public string startDate { get; set; }
    public string endDate { get; set; }
  }
}
