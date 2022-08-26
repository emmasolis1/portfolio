namespace planilla_backend_asp.net.Models
{
  public class VoluntaryDeductionsModel
  {
    public string voluntaryDeductionName { get; set; }
    public string projectName { get; set; }
    public string employerID { get; set; }
    public string description { get; set; }
    public string cost { get; set; }
  }

  public class VoluntaryDeductionsEmployeeModel
  {
    public string voluntaryDeductionName { get; set; }
    public string projectName { get; set; }
    public string employerID { get; set; }
    public string employeeID { get; set; }
    public string description { get; set; }
    public string cost { get; set; }
    public string startDate { get; set; }
    public string endingDate { get; set; }
  }

  public class MandatoryDeductionsModel
  {   
    public string Name { get; set; }
    public double Percentage { get; set; }
    public string Description { get; set; }
  }
}
