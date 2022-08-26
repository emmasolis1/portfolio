namespace planilla_backend_asp.net.Models
{
  public class EmployeeSummaryReport
  {
    public string projectName { get; set; }
    public string employerID { get; set; }
    public string paymentDate { get; set; }
  }

  public class EmployeeReport
  {
    public string projectName { get; set; }
    public string paymentDate { get; set; }
    public string employeeName { get; set; }
    public string contractType { get; set; }
    public string netSalary { get; set; }
    public string? grossSalary { get; set; } = null;
    public List<MandatoryDeductionsEmployeeReport>? mandatoryDeductions { get; set; } = new List<MandatoryDeductionsEmployeeReport>();
    public List<VoluntaryDeductionsEmployeeReport>? optionalDeductions { get; set; } = new List<VoluntaryDeductionsEmployeeReport>();
  }

  public class MandatoryDeductionsEmployeeReport
  {
    public string name { get; set; }
    public string percentage { get; set; }
  }

  public class VoluntaryDeductionsEmployeeReport
  {
    public string name { get; set; }
    public string cost { get; set; }
  }

  public class EmployerReport
  {
    public string projectName { get; set; }
    public string paymentDate { get; set; }
    public string netSalary0 { get; set; }
    public string netSalary1 { get; set; }
    public string netSalary3 { get; set; }
    public List<MandatoryDeductionsEmployeeReport>? mandatoryDeductions { get; set; } = new List<MandatoryDeductionsEmployeeReport>();
    public List<MandatoryDeductionsEmployeeReport>? benefits { get; set; } = new List<MandatoryDeductionsEmployeeReport>();
  }

  public class ProjectSummaryReport
  {
    public string projectName { get; set; }
    public string paymentDate { get; set; }
  }

  public class EmployeePayment
  {
    public string employeeName { get; set; }
    public string employeeID { get; set; }
    public string projectName { get; set; }
    public string contractType { get; set; }
    public string paymentDate { get; set; }
    public string grossSalary { get; set; }
    public string benefitsCost { get; set; }
    public string employerMandatoryDeductions { get; set; }
    public string employeeMandatoryDeductions { get; set; }
    public string voluntaryDeductions { get; set; }
    public string totalCost { get; set; }
  }
}
