using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;

namespace planilla_backend_asp.net.Handlers
{
  public class ReportsHandler
  {
    private static SqlConnection connection;
    private string connectionRoute;
    public ReportsHandler()
    {
      var builder = WebApplication.CreateBuilder();
      connectionRoute = builder.Configuration.GetConnectionString("EmpleadorContext");
      connection = new SqlConnection(connectionRoute);
    }

    private DataTable CreateTableConsult(SqlDataAdapter tableAdapter)
    {
      DataTable consultTable = new DataTable();
      connection.Open();
      tableAdapter.Fill(consultTable);
      connection.Close();

      return consultTable;
    }

    public List<EmployeeSummaryReport> GetEmployeeReports(string employeeID)
    {
      SqlDataAdapter tableAdapter = new SqlDataAdapter("select top 10 * from Payments where EmployeeID=@employeeID ORDER BY PaymentDate DESC", connection);
      tableAdapter.SelectCommand.Parameters.AddWithValue("@employeeID", employeeID);
      DataTable consultTable = CreateTableConsult(tableAdapter);
      List<EmployeeSummaryReport> employeeReports = new List<EmployeeSummaryReport>();
      foreach (DataRow row in consultTable.Rows)
      {
        EmployeeSummaryReport employeeReport = new EmployeeSummaryReport();
        employeeReport.projectName = row["ProjectName"].ToString();
        employeeReport.employerID = row["EmployerID"].ToString();
        employeeReport.paymentDate = row["PaymentDate"].ToString();
        employeeReports.Add(employeeReport);
      }
      return employeeReports;
    }

    public EmployeeReport GetEmployeeReport(string employeeID, string employerID, string projectName, string paymentDate)
    {
      EmployeeReport report = new EmployeeReport();
      try
      {
        connection.Open();

        // Employee Fullname
        SqlCommand command = new SqlCommand("select FirstName, LastName from Users where Identification=@employeeID", connection);
        command.Parameters.AddWithValue("@employeeID", employeeID);
        report.employeeName = command.ExecuteScalar().ToString();

        // Contract Type, Net Salary and Project Name
        command = new SqlCommand("select ContractType, NetSalary, ProjectName from Contracts where EmployerID=@employerID and ProjectName=@projectName and EmployeeID=@employeeID", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@projectName", projectName);
        command.Parameters.AddWithValue("@employeeID", employeeID);
        SqlDataReader reader = command.ExecuteReader();
        var contractResult = "";
        while (reader.Read())
        {
          contractResult = reader["ContractType"].ToString();
          report.netSalary = reader["NetSalary"].ToString();
          report.projectName = reader["ProjectName"].ToString();
        }
        report.contractType = parseContractType(contractResult);

        // Payment Date
        report.paymentDate = paymentDate;

        if (command.Connection.State == ConnectionState.Open)
        {
          command.Connection.Close();
        }

        // Mandatory Deductions
        report.mandatoryDeductions = GetMandatoryDeductions(employerID, projectName, employeeID, paymentDate);

        // Voluntary Deductions
        report.optionalDeductions = GetVoluntaryDeductions(employerID, projectName, employeeID, paymentDate);

        // Gross Salary
        report.grossSalary = GetGrossSalary(report.netSalary, report.mandatoryDeductions, report.optionalDeductions).ToString();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      finally
      {
        connection.Close();
      }
      return report;
    }

    private string parseContractType(string contractType)
    {
      switch (contractType)
      {
        case "0":
          return "Full-Time Employee";

        case "1":
          return "Part-Time Employee";

        case "2":
          return "Hourly Paid Employee";

        case "3":
          return "Professional Services";

        default:
          return "Unknown";
      }
    }

    private List<MandatoryDeductionsEmployeeReport> GetMandatoryDeductions(string employerID, string projectName, string employeeID, string paymentDate)
    {
      List<MandatoryDeductionsEmployeeReport> mandatoryDeductions = new List<MandatoryDeductionsEmployeeReport>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand("select i.MandatoryDeductionName, m.[Percentage] from IncludesMandatoryDeductions i, MandatoryDeductions m where i.EmployeeID=@employeeID and i.ProjectName=@projectName and i.EmployerID=@employerID and i.PaymentDate=@paymentDate and i.MandatoryDeductionName=m.MandatoryDeductionName", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@projectName", projectName);
        command.Parameters.AddWithValue("@employeeID", employeeID);
        command.Parameters.AddWithValue("@paymentDate", paymentDate);
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          MandatoryDeductionsEmployeeReport mandatoryDeduction = new MandatoryDeductionsEmployeeReport();
          mandatoryDeduction.name = reader["MandatoryDeductionName"].ToString();
          mandatoryDeduction.percentage = reader["Percentage"].ToString();
          mandatoryDeductions.Add(mandatoryDeduction);
        }
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      finally
      {
        connection.Close();
      }
      return mandatoryDeductions;
    }

    private List<VoluntaryDeductionsEmployeeReport> GetVoluntaryDeductions(string employerID, string projectName, string employeeID, string paymentDate)
    {
      List<VoluntaryDeductionsEmployeeReport> voluntaryDeductions = new List<VoluntaryDeductionsEmployeeReport>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand("select i.VoluntaryDeductionName, s.Cost from IncludesVoluntaryDeductions i, VoluntaryDeductionsStatus s where i.EmployeeID=@employeeID and i.ProjectName=@projectName and i.EmployerID=@employerID and i.PaymentDate=@paymentDate and s.EmployeeID=i.EmployeeID and s.ProjectName=i.ProjectName and s.EmployerID=i.EmployerID and EndingDate is NULL", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@projectName", projectName);
        command.Parameters.AddWithValue("@employeeID", employeeID);
        command.Parameters.AddWithValue("@paymentDate", paymentDate);
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          VoluntaryDeductionsEmployeeReport voluntaryDeduction = new VoluntaryDeductionsEmployeeReport();
          voluntaryDeduction.name = reader["VoluntaryDeductionName"].ToString();
          voluntaryDeduction.cost = reader["Cost"].ToString();
          voluntaryDeductions.Add(voluntaryDeduction);
        }
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      finally
      {
        connection.Close();
      }
      return voluntaryDeductions;
    }

    private float GetGrossSalary(string NetSalary, List<MandatoryDeductionsEmployeeReport> mandatoryDeductions, List<VoluntaryDeductionsEmployeeReport> voluntaryDeductions)
    {
      float grossSalary = float.Parse(NetSalary);
      float originalNetSalary = float.Parse(NetSalary);
      foreach (MandatoryDeductionsEmployeeReport mandatoryDeduction in mandatoryDeductions)
      {
        grossSalary -= (originalNetSalary * float.Parse(mandatoryDeduction.percentage)) / 100;
      }
      foreach (VoluntaryDeductionsEmployeeReport voluntaryDeduction in voluntaryDeductions)
      {
        grossSalary -= float.Parse(voluntaryDeduction.cost);
      }

      return float.Parse(grossSalary.ToString("0.00"));
    }

    public List<ProjectSummaryReport> GetProjectReports(string employerID)
    {
      SqlDataAdapter tableAdapter = new SqlDataAdapter("select distinct top 10 ProjectName, PaymentDate from Payments where employerID=@employerID ORDER BY PaymentDate DESC", connection);
      tableAdapter.SelectCommand.Parameters.AddWithValue("@employerID", employerID);
      DataTable consultTable = CreateTableConsult(tableAdapter);
      List<ProjectSummaryReport> employerReports = new List<ProjectSummaryReport>();
      foreach (DataRow row in consultTable.Rows)
      {
        ProjectSummaryReport employerReport = new ProjectSummaryReport();
        employerReport.projectName = row["ProjectName"].ToString();
        employerReport.paymentDate = row["PaymentDate"].ToString();
        employerReports.Add(employerReport);
      }
      return employerReports;
    }

    public EmployerReport GetEmployerReport(string employerID, string projectName, string paymentDate)
    {
      EmployerReport report = new EmployerReport();
      try
      {
        connection.Open();

        // Contract Type, Net Salary and Project Name
        SqlCommand command = new SqlCommand("select sum(NetSalary) as S0 from Contracts where EmployerID=@employerID and ProjectName=@projectName and ContractType=0", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@projectName", projectName);
        report.netSalary0 = command.ExecuteScalar().ToString();
        if (report.netSalary0 == "")
        {
          report.netSalary0 = "0";
        }

        command = new SqlCommand("select sum(NetSalary) as S1 from Contracts where EmployerID=@employerID and ProjectName=@projectName and ContractType=1", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@projectName", projectName);
        report.netSalary1 = command.ExecuteScalar().ToString();
        if (report.netSalary1 == "")
        {
          report.netSalary1 = "0";
        }

        command = new SqlCommand("select sum(NetSalary) as S3 from Contracts where EmployerID=@employerID and ProjectName=@projectName and ContractType=3", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@projectName", projectName);
        report.netSalary3 = command.ExecuteScalar().ToString();
        if (report.netSalary3 == "")
        {
          report.netSalary3 = "0";
        }

        // Payment Date
        report.projectName = projectName;
        report.paymentDate = paymentDate;

        if (command.Connection.State == ConnectionState.Open)
        {
          command.Connection.Close();
        }

        // Mandatory Deductions
        report.mandatoryDeductions = GetEmployerMandatoryDeductions();

        report.benefits = GetEmployerBenefit(employerID, projectName);
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      finally
      {
        connection.Close();
      }
      return report;
    }

    private List<MandatoryDeductionsEmployeeReport> GetEmployerMandatoryDeductions()
    {
      List<MandatoryDeductionsEmployeeReport> mandatoryDeductions = new List<MandatoryDeductionsEmployeeReport>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand("select m.MandatoryDeductionName, m.[Percentage] from MandatoryDeductions m where m.Condition='1'", connection);
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          MandatoryDeductionsEmployeeReport mandatoryDeduction = new MandatoryDeductionsEmployeeReport();
          mandatoryDeduction.name = reader["MandatoryDeductionName"].ToString();
          mandatoryDeduction.percentage = reader["Percentage"].ToString();
          mandatoryDeductions.Add(mandatoryDeduction);
        }
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      finally
      {
        connection.Close();
      }
      return mandatoryDeductions;
    }

    private List<MandatoryDeductionsEmployeeReport> GetEmployerBenefit(string employerID, string projectName)
    {
      List<MandatoryDeductionsEmployeeReport> benefits = new List<MandatoryDeductionsEmployeeReport>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand("select bs.BenefitName, sum(b.cost) as TotalCost from benefits b join benefitsStatus bs on b.benefitName = bs.benefitName AND b.projectName = bs.projectName AND b.employerID = bs.employerID where b.projectName = @projectName AND b.employerID = @employerID AND bs.enddate is null AND b.isactive = 0 group by bs.benefitName", connection);
        command.Parameters.AddWithValue("@projectName", projectName);
        command.Parameters.AddWithValue("@employerID", employerID);
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          MandatoryDeductionsEmployeeReport benefit = new MandatoryDeductionsEmployeeReport();
          benefit.name = reader["BenefitName"].ToString();
          benefit.percentage = reader["TotalCost"].ToString();
          if (benefit.percentage == "")
          {
            benefit.percentage = "0";
          }
          benefits.Add(benefit);
        }
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      finally
      {
        connection.Close();
      }
      return benefits;
    }

    public List<EmployeePayment> GetUnfilteredEmployeePayments(string employerID)
    {
      List<EmployeePayment> employeePayments = new List<EmployeePayment>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand(@"SELECT LastName, LastName2, FirstName, Identification, Contracts.ProjectName, ContractType, PaymentDate, Contracts.NetSalary
                                              FROM Users 
                                              JOIN Contracts ON EmployeeID = Identification 
                                              JOIN Payments ON Contracts.ProjectName = Payments.ProjectName
                                              AND Contracts.EmployerID = Payments.EmployerID
                                              AND Contracts.EmployeeID = Payments.EmployeeID
                                              AND Contracts.StartDate = Payments.StartDate
                                              WHERE Payments.EmployerID = @employerID", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        SqlDataReader reader = command.ExecuteReader();

        while (reader.Read())
        {
          var fullName = "";
          if (reader["LastName"].ToString() != null && reader["LastName"].ToString() != "")
          {
            fullName = reader["LastName"].ToString();
          }
          if (reader["LastName2"].ToString() != null && reader["LastName2"].ToString() != "")
          {
            if (fullName != "")
            {
              fullName = fullName + " " + reader["LastName2"].ToString();
            }
            else
            {
              fullName = reader["LastName2"].ToString();
            }
          }
          if (reader["FirstName"].ToString() != null && reader["FirstName"].ToString() != "")
          {
            if (fullName != "")
            {
              fullName = fullName + ", " + reader["FirstName"].ToString();
            }
            else
            {
              fullName = reader["FirstName"].ToString();
            }
          }
          employeePayments.Add(new EmployeePayment
          {
            employeeName = fullName,
            employeeID = reader["Identification"].ToString(),
            projectName = reader["ProjectName"].ToString(),
            contractType = parseContractType(reader["ContractType"].ToString()),
            paymentDate = reader["PaymentDate"].ToString().Split(" ")[0],
            grossSalary = reader["NetSalary"].ToString(),
            benefitsCost = "",
            employerMandatoryDeductions = "",
            employeeMandatoryDeductions = "",
            voluntaryDeductions = "",
            totalCost = ""
          });
        }
        connection.Close();

        foreach (EmployeePayment employeePayment in employeePayments)
        {
          employeePayment.benefitsCost = GetEmployeePaymentsBenefitsCost(employerID, employeePayment.employeeID, employeePayment.projectName);
          employeePayment.employerMandatoryDeductions = GetEmployeePaymentsEmployerMandatoryDeductions(employeePayment.grossSalary);
          employeePayment.employeeMandatoryDeductions = GetEmployeePaymentsEmployeeMandatoryDeductions(employeePayment.grossSalary);
          employeePayment.voluntaryDeductions = GetEmployeePaymentsEmployeeVoluntaryDeductions(employerID, employeePayment.employeeID, employeePayment.projectName, employeePayment.paymentDate);
          employeePayment.totalCost = (float.Parse(employeePayment.grossSalary) + float.Parse(employeePayment.benefitsCost) + float.Parse(employeePayment.employerMandatoryDeductions)).ToString();
        }
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      return employeePayments;
    }

    private string GetEmployeePaymentsBenefitsCost(string employerID, string employeeID, string projectName)
    {
      string benefitsCost = "";
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand(@"SELECT SUM(Cost) AS BenefitsCost
                                              FROM Benefits WHERE BenefitName IN (
                                              SELECT BenefitName FROM BenefitsStatus
                                              WHERE ProjectName = @projectName
                                              AND EmployerID = @employerID
                                              AND EmployeeID = @employeeID
                                              AND EndDate IS NULL)
                                              AND ProjectName = @projectName
                                              AND IsActive = 0", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@employeeID", employeeID);
        command.Parameters.AddWithValue("@projectName", projectName);
        SqlDataReader reader = command.ExecuteReader();

        while (reader.Read())
        {
          benefitsCost = reader["BenefitsCost"].ToString();
        }
        connection.Close();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      if (benefitsCost == "")
      {
        benefitsCost = "0";
      }
      return benefitsCost;
    }

    private string GetEmployeePaymentsEmployerMandatoryDeductions(string grossSalary)
    {
      float deductionsEmployer = 0;
      List<float> deductions = new List<float>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand(@"SELECT Percentage FROM MandatoryDeductions WHERE Condition = '1'", connection);
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          deductions.Add(float.Parse(reader["Percentage"].ToString()));
        }

        foreach (float deduction in deductions)
        {
          deductionsEmployer += (float.Parse(grossSalary) * deduction) / 100;
        }
        connection.Close();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      return deductionsEmployer.ToString();
    }

    private string GetEmployeePaymentsEmployeeMandatoryDeductions(string grossSalary)
    {
      float deductionsEmployee = 0;
      List<float> deductions = new List<float>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand(@"SELECT Percentage FROM MandatoryDeductions WHERE Condition = '0'", connection);
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          deductions.Add(float.Parse(reader["Percentage"].ToString()));
        }

        foreach (float deduction in deductions)
        {
          deductionsEmployee += (float.Parse(grossSalary) * deduction) / 100;
        }
        connection.Close();

        connection.Open();
        command = new SqlCommand("SELECT dbo.GetRentDeductionAmount(@grossSalary)", connection);
        command.Parameters.AddWithValue("@grossSalary", grossSalary);

        deductionsEmployee += float.Parse(command.ExecuteScalar().ToString());
        connection.Close();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      return deductionsEmployee.ToString();
    }

    private string GetEmployeePaymentsEmployeeVoluntaryDeductions(string employerID, string employeeID, string projectName, string paymentDate)
    {
      float deductionsEmployee = 0;
      List<float> deductions = new List<float>();
      try
      {
        connection.Open();
        SqlCommand command = new SqlCommand(@"SELECT Cost 
                                              FROM IncludesVoluntaryDeductions i, VoluntaryDeductionsStatus s 
                                              WHERE i.EmployeeID = @employeeID
                                              AND i.ProjectName = @projectName
                                              AND i.EmployerID = @employerID
                                              AND i.PaymentDate = @paymentDate 
                                              AND s.EmployeeID = i.EmployeeID 
                                              AND s.ProjectName = i.ProjectName 
                                              AND s.EmployerID = i.EmployerID 
                                              AND EndingDate IS NULL", connection);
        command.Parameters.AddWithValue("@employerID", employerID);
        command.Parameters.AddWithValue("@employeeID", employeeID);
        command.Parameters.AddWithValue("@projectName", projectName);
        command.Parameters.AddWithValue("@paymentDate", Convert.ToDateTime(paymentDate));
        SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          deductions.Add(float.Parse(reader["Cost"].ToString()));
        }

        foreach (float deduction in deductions)
        {
          deductionsEmployee += deduction;
        }
        connection.Close();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
      }
      return deductionsEmployee.ToString();
    }
  }
}
