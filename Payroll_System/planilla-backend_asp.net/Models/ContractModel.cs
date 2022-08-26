namespace planilla_backend_asp.net.Models
{
  public class ContractModel
  {
    public string projectName { get; set; }
    public string employerID { get; set; }
    public string employeeID { get; set; }
    public string startDate { get; set; }
    public string expectedEndingDate { get; set; }
    public string realEndedDate { get; set; }
    public string position { get; set; }
    public string schedule { get; set; }
    public string netSalary { get; set; }
    public string contractType { get; set; }
  }
}
