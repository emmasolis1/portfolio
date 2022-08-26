using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;

namespace planilla_backend_asp.net.Handlers
{
  public class PaymentHandler
  {
    private static SqlConnection connection;
    private string connectionRoute;
    public PaymentHandler()
    {
      var builder = WebApplication.CreateBuilder();
      connectionRoute = builder.Configuration.GetConnectionString("EmpleadorContext");
      connection = new SqlConnection(connectionRoute);
    }

    public List<PaymentModel> PayProjectToday(string projectName, string employerId)
    {
      List<PaymentModel> employees = GetEmployeesWorkingOnProject(projectName, employerId);
      foreach (PaymentModel employee in employees)
      {
        if (employee.contractType == "2")
        {
          employee.payment = GetHourlyEmployeePayment(employee);
          CreatePayment(employee);
        }
        else
        {
          CreatePayment(employee);
          double voluntaryDeductions = GetDeductionFromVoluntaryDeductions(projectName, employerId, employee.employeeId, employee.contractStartDate, employee.paymentDate);
          double mandatoryDeductions = GetDeductionFromMandatoryDeductions(employee.netSalary, projectName, employerId, employee.employeeId, employee.contractStartDate, employee.paymentDate);
          employee.payment = employee.netSalary - voluntaryDeductions - mandatoryDeductions;
        }
      }
      return employees;
    }

    private DataTable CreateTableConsult(SqlCommand queryCommand)
    {
      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableFormatQuery = new DataTable();
      connection.Open();
      tableAdapter.Fill(tableFormatQuery);
      connection.Close();
      return tableFormatQuery;
    }

    private bool ExecuteCommand(SqlCommand command)
    {
      connection.Open();
      bool result = command.ExecuteNonQuery() >= 1;
      connection.Close();
      return result;
    }

    //This method is assuming that Cost is the amount of money that has to be deducted
    private double GetDeductionFromVoluntaryDeductions(string projectName, string employerId, string employeeId, string dateStartContract, string paymentDate)
    {
      var consult = "EXECUTE GetEmployeeVoluntaryDeductionsToDate @project_name, @employer_id, @employee_id, @date";
      var queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@project_name", projectName);
      queryCommand.Parameters.AddWithValue("@employer_id", employerId);
      queryCommand.Parameters.AddWithValue("@employee_id", employeeId);
      queryCommand.Parameters.AddWithValue("@date", paymentDate);
      DataTable resultTable = CreateTableConsult(queryCommand);
      double totalDeduction = 0;
      foreach (DataRow column in resultTable.Rows)
      {
        consult = @"INSERT INTO IncludesVoluntaryDeductions ([VoluntaryDeductionName], [ProjectName], [EmployerID], [EmployeeID], [StartDate], [ContractDate], [PaymentDate])
                            VALUES (@deduction_name, @project_name, @employer_id, @employee_id, @start_date, @contract_date, @payment_date)";
        queryCommand = new SqlCommand(consult, connection);
        queryCommand.Parameters.AddWithValue("@deduction_name", Convert.ToString(column["VoluntaryDeductionName"]));
        queryCommand.Parameters.AddWithValue("@project_name", projectName);
        queryCommand.Parameters.AddWithValue("@employer_id", employerId);
        queryCommand.Parameters.AddWithValue("@employee_id", employeeId);
        queryCommand.Parameters.AddWithValue("@start_date", Convert.ToString(column["StartDate"]));
        queryCommand.Parameters.AddWithValue("@contract_date", dateStartContract);
        queryCommand.Parameters.AddWithValue("@payment_date", paymentDate);
        ExecuteCommand(queryCommand);
        double deduction = Convert.ToDouble(column["Cost"]);
        totalDeduction = totalDeduction + deduction;
      }
      return totalDeduction;
    }

    private double GetHourlyEmployeePayment(PaymentModel employee)
    {
      var consult = "EXECUTE GetLatestPayment @employee_id, @employer_id, @project_name, @date";
      var queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@project_name", employee.projectName);
      queryCommand.Parameters.AddWithValue("@employer_id", employee.employerId);
      queryCommand.Parameters.AddWithValue("@employee_id", employee.employeeId);
      queryCommand.Parameters.AddWithValue("@date", employee.paymentDate);
      DataTable resultTable = CreateTableConsult(queryCommand);
      string latestPaymentDay = null;
      foreach (DataRow column in resultTable.Rows)
      {
        latestPaymentDay = Convert.ToString(column["PaymentDate"]);
      }
      if (latestPaymentDay == null)
      {
        latestPaymentDay = employee.contractStartDate;
      }

      double hoursWorked = GetEmployeeRegisteredHours(employee, latestPaymentDay, employee.paymentDate);
      return hoursWorked * employee.netSalary;
    }

    private double GetEmployeeRegisteredHours(PaymentModel employee, string startDate, string endDate)
    {
      var consult = "EXECUTE GetEmployeeHourRegistryInRange @project_name, @employer_id, @employee_id, @start_date, @end_date";
      var queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@project_name", employee.projectName);
      queryCommand.Parameters.AddWithValue("@employer_id", employee.employerId);
      queryCommand.Parameters.AddWithValue("@employee_id", employee.employeeId);
      queryCommand.Parameters.AddWithValue("@start_date", startDate);
      queryCommand.Parameters.AddWithValue("@end_date", endDate);
      DataTable resultTable = CreateTableConsult(queryCommand);
      double totalHours = 0;
      foreach (DataRow column in resultTable.Rows)
      {
        double hours = Convert.ToDouble(column["NumberOfHours"]);
        totalHours = totalHours + hours;
      }
      return totalHours;
    }

    private List<PaymentModel> GetEmployeesWorkingOnProject(string nameOfProject, string idOfEmployer, string dateOfPayment = "null")
    {
      SqlCommand queryCommand = null;
      if (dateOfPayment == "null")
      {
        var consult = "EXECUTE GetEmployeesWorkingOnProjectToDate @project_name, @employer_id, " + dateOfPayment;
        queryCommand = new SqlCommand(consult, connection);
        queryCommand.Parameters.AddWithValue("@project_name", nameOfProject);
        queryCommand.Parameters.AddWithValue("@employer_id", idOfEmployer);
      }
      else
      {
        var consult = "EXECUTE GetEmployeesWorkingOnProjectToDate @project_name, @employer_id, @date";
        queryCommand = new SqlCommand(consult, connection);
        queryCommand.Parameters.AddWithValue("@project_name", nameOfProject);
        queryCommand.Parameters.AddWithValue("@employer_id", idOfEmployer);
        queryCommand.Parameters.AddWithValue("@date", dateOfPayment);
      }
      DataTable resultTable = CreateTableConsult(queryCommand);
      List<PaymentModel> employees = new List<PaymentModel>();
      foreach (DataRow column in resultTable.Rows)
      {
        employees.Add(new PaymentModel
        {
          projectName = nameOfProject,
          employerId = idOfEmployer,
          employeeId = Convert.ToString(column["EmployeeID"]),
          paymentDate = Convert.ToString(column["PaymentDate"]),
          netSalary = Convert.ToDouble(column["NetSalary"]),
          contractType = Convert.ToString(column["ContractType"]),
          contractStartDate = Convert.ToString(column["StartDate"])
        });
      }
      return employees;
    }

    private double GetDeductionFromMandatoryDeductions(double salary, string projectName, string employerId, string employeeId, string dateStartContract, string paymentDate)
    {
      var consult = "EXECUTE GetBasicMandatoryDeductions @salary";
      var queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@salary", salary);
      DataTable resultTable = CreateTableConsult(queryCommand);
      double totalDeduction = 0;
      foreach (DataRow column in resultTable.Rows)
      {
        consult = @"INSERT INTO IncludesMandatoryDeductions ([MandatoryDeductionName], [ProjectName], [EmployerID], [EmployeeID], [ContractDate], [PaymentDate])
                            VALUES (@deduction_name, @project_name, @employer_id, @employee_id, @contract_date, @payment_date)";
                queryCommand = new SqlCommand(consult, connection);
                queryCommand.Parameters.AddWithValue("@deduction_name", Convert.ToString(column["MandatoryDeductionName"]));
                queryCommand.Parameters.AddWithValue("@project_name", projectName);
                queryCommand.Parameters.AddWithValue("@employer_id", employerId);
                queryCommand.Parameters.AddWithValue("@employee_id", employeeId);
                queryCommand.Parameters.AddWithValue("@contract_date", dateStartContract);
                queryCommand.Parameters.AddWithValue("@payment_date", paymentDate);
                ExecuteCommand(queryCommand);
                string condition = Convert.ToString(column["Condition"]);
                if (condition == "0" && condition == "0") {
                    double percentage = Convert.ToDouble(column["Percentage"]);
                    totalDeduction = totalDeduction + (salary * percentage / 100);
                } else if (condition != "0") {
                    double amount = Convert.ToDouble(column["IncomeDeductionAmount"]);
                    totalDeduction = totalDeduction + amount;
                }
            }
            return totalDeduction;
        }

    private bool CreatePayment(PaymentModel employee)
    {
      var command = @"INSERT INTO Payments ([ProjectName], [EmployerID], [EmployeeID], [StartDate], [PaymentDate], [NetSalary])
                            VALUES (@project_name, @employer_id, @employee_id, @start_date, @payment_date, @net_salary)";
      SqlCommand queryCommand = new SqlCommand(command, connection);
      queryCommand.Parameters.AddWithValue("@project_name", employee.projectName);
      queryCommand.Parameters.AddWithValue("@employer_id", employee.employerId);
      queryCommand.Parameters.AddWithValue("@employee_id", employee.employeeId);
      queryCommand.Parameters.AddWithValue("@start_date", employee.contractStartDate);
      queryCommand.Parameters.AddWithValue("@payment_date", employee.paymentDate);
      queryCommand.Parameters.AddWithValue("@net_salary", employee.payment);
      return ExecuteCommand(queryCommand);
    }

    public List<PaymentModel> GetUserPayments(string projectName, string userID)
    {
      // Basic query preparation
      string consult = @"select p.ProjectName, p.EmployerID, p.EmployeeID, p.StartDate, p.PaymentDate, p.NetSalary as GrossSalary, c.NetSalary, c.ContractType from Payments p, Contracts c where p.ProjectName = @projectName and p.EmployeeID = @UserID and c.ProjectName = @projectName and c.EmployeeID = @UserID";
      var queryCommand = new SqlCommand(consult, connection);

      // Adding the parameters
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@UserID", userID);

      // Table adapter
      SqlDataAdapter adapter = new SqlDataAdapter(queryCommand);
      DataTable tableConsult = new DataTable();

      // Connection
      connection.Open();
      adapter.Fill(tableConsult);
      connection.Close();

      // Parsing data
      List<PaymentModel> payments = new List<PaymentModel>();
      foreach (DataRow row in tableConsult.Rows)
      {
        payments.Add(new PaymentModel
        {
          projectName = Convert.ToString(row["ProjectName"]),
          employerId = Convert.ToString(row["EmployerID"]),
          employeeId = Convert.ToString(row["EmployeeID"]),
          contractStartDate = Convert.ToString(row["StartDate"]),
          paymentDate = Convert.ToString(row["PaymentDate"]),
          netSalary = Convert.ToDouble(row["GrossSalary"]),
          contractType = Convert.ToString(row["ContractType"]),
          payment = Convert.ToDouble(row["NetSalary"])
        });
      }

      return payments;
    }
  }
}
