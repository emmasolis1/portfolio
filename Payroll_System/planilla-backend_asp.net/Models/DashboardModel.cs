namespace planilla_backend_asp.net.Models
{
  public class DashboardEmployerModel
  {
    public string totalEmployees { get; set; }
    public string totalProjects { get; set; }
    public List<TotalEmployeesByProject>? totalEmployeesByProject { get; set; } = new List<TotalEmployeesByProject>();
    public List<NextPayments>? nextPayments { get; set; } = new List<NextPayments>();
    public List<LatestPayments>? latestPayments { get; set; } = new List<LatestPayments>();
    public List<TotalProjectCost>? totalProjectCost { get; set; } = new List<TotalProjectCost>();
  }

  public class TotalEmployeesByProject
  {
    public string projectName { get; set; }
    public string totalFullTime { get; set; }
    public string totalPartTime { get; set; }
    public string totalHourly { get; set; }
    public string totalProfessionalServices { get; set; }
  }

  public class NextPayments
  {
    public string projectName { get; set; }
    public string paymentFrequency { get; set; }
    public string nextPayment { get; set; }
  }

  public class LatestPayments
  {
    public string projectName { get; set; }
    public string lastPaidDate { get; set; }
    public string lastPaidAmount { get; set; }
  }

  public class TotalProjectCost
  {
    public string projectName { get; set; }
    public string totalCost { get; set; }
  }

  public class DashboardEmployeeModel
  {
    public string totalWorkingProjects { get; set; }
    public List<TotalProjectsIncome>? totalProjectsIncome { get; set; } = new List<TotalProjectsIncome>();
  }

  public class TotalProjectsIncome
  {
    public string projectName { get; set; }
    public string totalIncome { get; set; }
  }

}
