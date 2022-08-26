using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;

namespace planilla_backend_asp.net.Handlers
{
  public class DashboardHandler
  {
    private static SqlConnection connection;
    private string rutaConexion;
    public DashboardHandler()
    {
      var builder = WebApplication.CreateBuilder();
      rutaConexion = builder.Configuration.GetConnectionString("EmpleadorContext");
      connection = new SqlConnection(rutaConexion);
    }

    private DataTable CreateTableConsult(SqlDataAdapter tableAdapter)
    {
      DataTable consultTable = new DataTable();
      connection.Open();
      tableAdapter.Fill(consultTable);
      connection.Close();

      return consultTable;
    }

    public DashboardEmployerModel GetDashboard(string employerID)
    {
      DashboardEmployerModel dashboard = new DashboardEmployerModel();
      try
      {
        connection.Open();
        // Total employees hired by this employer.
        SqlCommand cmd = new SqlCommand("select distinct count(EmployeeID) as TotalEmployees from Contracts where EmployerID=@employerID", connection);
        cmd.Parameters.AddWithValue("@employerID", employerID);
        dashboard.totalEmployees = cmd.ExecuteScalar().ToString();

        // Total projects that this employer has.
        cmd = new SqlCommand("select count(ProjectName) as TotalProjects from Projects where EmployerID=@employerID", connection);
        cmd.Parameters.AddWithValue("@employerID", employerID);
        dashboard.totalProjects = cmd.ExecuteScalar().ToString();

        if (cmd.Connection.State == ConnectionState.Open)
        {
          cmd.Connection.Close();
        }

        // Employee types by project
        dashboard.totalEmployeesByProject = GetEmployeeTypesByProject(employerID);

        // Next Payments
        dashboard.nextPayments = GetNextPayments(employerID);

        // Last Payments
        dashboard.latestPayments = GetProjectsLastPayments(employerID);

        // Total Projects Cost
        dashboard.totalProjectCost = GetProjectCosts(employerID);
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
        return null;
      }
      finally
      {
        connection.Close();
      }
      return dashboard;
    }

    private List<TotalEmployeesByProject> GetEmployeeTypesByProject(string employerID)
    {
      List<TotalEmployeesByProject> employeeTypes = new List<TotalEmployeesByProject>();
      var consult = @"select p.ProjectName, 
              (select count(c.EmployeeID) from Contracts c where c.EmployerID=@employerID and ContractType=0 and ProjectName = p.ProjectName) as FullTime,
              (select count(c.EmployeeID) from Contracts c where c.EmployerID=@employerID and ContractType=1 and ProjectName = p.ProjectName) as PartTime,
              (select count(c.EmployeeID) from Contracts c where c.EmployerID=@employerID and ContractType=2 and ProjectName = p.ProjectName) as Hourly,
              (select count(c.EmployeeID) from Contracts c where c.EmployerID=@employerID and ContractType=3 and ProjectName = p.ProjectName) as ProfServices
        from Projects p
        where EmployerID=@employerID";
      var queryCommand = new SqlCommand(consult, connection);

      // Uses user's email and the name of the active project to get only related benefits
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        employeeTypes.Add(new TotalEmployeesByProject
        {
          projectName = Convert.ToString(columna["ProjectName"]),
          totalFullTime = Convert.ToString(columna["FullTime"]),
          totalPartTime = Convert.ToString(columna["PartTime"]),
          totalHourly = Convert.ToString(columna["Hourly"]),
          totalProfessionalServices = Convert.ToString(columna["ProfServices"])
        });
      }

      return employeeTypes;
    }

    private List<NextPayments> GetNextPayments(string employerID)
    {
      List<NextPayments> nextPayments = new List<NextPayments>();
      var consult = @"select distinct p.ProjectName,
            p.PaymentMethod,
            (select top 1 paid.PaymentDate from Payments paid where EmployerID=@employerID and paid.ProjectName=p.ProjectName) as LastPayment
        from Projects p
        where EmployerID=@employerID";
      var queryCommand = new SqlCommand(consult, connection);

      // Uses user's email and the name of the active project to get only related benefits
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        string nextPaymentDate = Convert.ToString(columna["LastPayment"]);
        switch (Convert.ToString(columna["PaymentMethod"]))
        {
          case "NULL":
            {
              nextPaymentDate = "-1";
              break;
            }
          case "Weekly":
            {
              nextPaymentDate = AddDaysToDate(nextPaymentDate, 7);
              break;
            }
          case "Biweekly":
            {
              nextPaymentDate = AddDaysToDate(nextPaymentDate, 14);
              break;
            }
          case "Monthly":
            {
              nextPaymentDate = AddDaysToDate(nextPaymentDate, 30);
              break;
            }
          default:
            {
              nextPaymentDate = "-1";
              break;
            }
        }
        nextPayments.Add(
          new NextPayments
          {
            projectName = Convert.ToString(columna["ProjectName"]),
            paymentFrequency = Convert.ToString(columna["PaymentMethod"]),
            nextPayment = nextPaymentDate,
          }
        );

      }

      return nextPayments;
    }

    private string AddDaysToDate(string date01, int numberDays)
    {
      string dateString = "";
      if (date01 != "")
      {
        try
        {
          DateTime date = Convert.ToDateTime(date01);
          DateTime newDate = date.AddDays(numberDays);
          dateString = newDate.ToString("dd-MM-yyyy");
        }
        catch (Exception e)
        {
          Console.WriteLine(e);
          dateString = "-1";
        }
      }
      else
      {
        dateString = "-1";
      }
      return dateString;
    }

    private List<LatestPayments> GetProjectsLastPayments(string employerID)
    {
      List<LatestPayments> employeeTypes = new List<LatestPayments>();
      var consult = @"select distinct p.ProjectName,
            p.PaymentDate as DatePaid,
            (select sum(paid.NetSalary) from Payments paid where paid.EmployerID=@employerID and paid.PaymentDate=p.PaymentDate) as TotalPaid
        from Payments p
        where p.EmployerID=@employerID
        order by DatePaid desc";
      var queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        employeeTypes.Add(new LatestPayments
        {
          projectName = Convert.ToString(columna["ProjectName"]),
          lastPaidDate = Convert.ToString(columna["DatePaid"]),
          lastPaidAmount = Convert.ToString(columna["TotalPaid"])
        });
      }

      return employeeTypes;
    }

    private List<TotalProjectCost> GetProjectCosts(string employerID)
    {
      List<TotalProjectCost> employeeTypes = new List<TotalProjectCost>();
      var consult = @"select p.ProjectName, p.Budget from Projects p where EmployerID=@employerID";
      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        employeeTypes.Add(new TotalProjectCost
        {
          projectName = Convert.ToString(columna["ProjectName"]),
          totalCost = Convert.ToString(columna["Budget"])
        });
      }

      return employeeTypes;
    }

    public DashboardEmployeeModel GetDashboardEmployee(string employeeID)
    {
      DashboardEmployeeModel dashboard = new DashboardEmployeeModel();
      try
      {
        connection.Open();
        // Total projects that this employee works on.
        SqlCommand cmd = new SqlCommand("select count(Projects.ProjectName) as TotalWorkingProjects FROM Projects JOIN Contracts ON Projects.ProjectName = Contracts.ProjectName WHERE EmployeeID = @employeeID AND RealEndedDate IS NULL AND IsActive = 0", connection);
        cmd.Parameters.AddWithValue("@employeeID", employeeID);
        dashboard.totalWorkingProjects = cmd.ExecuteScalar().ToString();

        if (cmd.Connection.State == ConnectionState.Open)
        {
          cmd.Connection.Close();
        }

        // Total Projects Income
        dashboard.totalProjectsIncome = GetProjectsIncome(employeeID);
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
        return null;
      }
      finally
      {
        connection.Close();
      }
      return dashboard;
    }

    private List<TotalProjectsIncome> GetProjectsIncome(string employeeID)
    {
      List<TotalProjectsIncome> employeeIncomes = new List<TotalProjectsIncome>();
      var consult = "select Projects.ProjectName, Contracts.NetSalary FROM Projects JOIN Contracts ON Projects.ProjectName = Contracts.ProjectName WHERE EmployeeID = @employeeID AND RealEndedDate IS NULL AND IsActive = 0";
      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@employeeID", employeeID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        employeeIncomes.Add(new TotalProjectsIncome
        {
          projectName = Convert.ToString(columna["ProjectName"]),
          totalIncome = Convert.ToString(columna["NetSalary"])
        });
      }

      return employeeIncomes;
    }
  }
}
